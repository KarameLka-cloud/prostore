from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.configs.database import get_db
from src.core.security import hash_password
from src.core.session import require_session
from src.models import User
from src.schemas import UserCreate, UserResponse, UserUpdate

router = APIRouter(
    prefix="/api/admin/users",
    tags=["Администрирование пользователей"],
    dependencies=[Depends(require_session)],
)

USER_IDENTITY_FIELDS = (
    ("login", "логином"),
    ("name", "именем"),
    ("email", "email"),
)


async def ensure_user_fields_available(
    db: AsyncSession,
    payload: UserCreate | UserUpdate,
    current_user_id: int | None = None,
) -> None:
    for field, label in USER_IDENTITY_FIELDS:
        value = getattr(payload, field)
        existing_id = await db.scalar(
            select(User.id).where(getattr(User, field) == value)
        )
        if existing_id is not None and existing_id != current_user_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Пользователь с таким {label} уже существует",
            )


@router.get(
    "/",
    response_model=list[UserResponse],
    summary="Получить список пользователей",
)
async def list_users(db: AsyncSession = Depends(get_db)) -> list[User]:
    result = await db.scalars(select(User).order_by(User.id))
    return list(result.all())


@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Создать пользователя",
    responses={
        409: {"description": "Логин, имя или email уже используется"},
        422: {"description": "Некорректные данные пользователя"},
    },
)
async def create_user(
    payload: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> User:
    await ensure_user_fields_available(db, payload)
    user = User(
        login=payload.login,
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)

    try:
        await db.commit()
        await db.refresh(user)
    except IntegrityError as cause:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Логин, имя или email уже используется",
        ) from cause

    return user


@router.put(
    "/{user_id}",
    response_model=UserResponse,
    summary="Изменить пользователя",
    responses={
        404: {"description": "Пользователь не найден"},
        409: {"description": "Логин, имя или email уже используется"},
        422: {"description": "Некорректные данные пользователя"},
    },
)
async def update_user(
    user_id: Annotated[int, Path(gt=0, description="ID пользователя.")],
    payload: UserUpdate,
    db: AsyncSession = Depends(get_db),
) -> User:
    user = await db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    await ensure_user_fields_available(db, payload, user_id)
    for field, _ in USER_IDENTITY_FIELDS:
        setattr(user, field, getattr(payload, field))

    if payload.password is not None:
        user.password_hash = hash_password(payload.password)

    try:
        await db.commit()
        await db.refresh(user)
    except IntegrityError as cause:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Логин, имя или email уже используется",
        ) from cause

    return user


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить пользователя",
    responses={
        404: {"description": "Пользователь не найден"},
        409: {"description": "Нельзя удалить текущего пользователя"},
    },
)
async def delete_user(
    user_id: Annotated[int, Path(gt=0, description="ID пользователя.")],
    db: AsyncSession = Depends(get_db),
    session: dict[str, object] = Depends(require_session),
) -> Response:
    if session.get("userId") == user_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Нельзя удалить пользователя, под которым выполнен вход",
        )

    user = await db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    await db.delete(user)
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
