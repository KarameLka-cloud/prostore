from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.configs.database import get_db
from src.core.security import verify_password
from src.models import User
from src.schemas import LoginRequest, UserResponse

router = APIRouter(
    prefix="/api/auth",
    tags=["Аутентификация"],
    responses={401: {"description": "Неверный логин или пароль"}},
)


@router.post(
    "/login",
    response_model=UserResponse,
    summary="Проверить логин и пароль",
    description=(
        "Проверяет учетные данные и возвращает общедоступные данные пользователя. "
        "Токен сессии формируется frontend и этим методом не возвращается."
    ),
)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)) -> User:
    user = await db.scalar(select(User).where(User.login == payload.login))

    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
        )

    return user
