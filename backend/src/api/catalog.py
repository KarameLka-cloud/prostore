from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.configs.database import get_db
from src.configs.settings import settings
from src.core.session import require_session
from src.models import Brand, Category, Product, ProductImage
from src.schemas import (
    BrandCreate,
    BrandResponse,
    CategoryCreate,
    CategoryResponse,
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)

router = APIRouter(
    prefix="/api/admin/catalog",
    tags=["admin catalog"],
    dependencies=[Depends(require_session)],
)

MAX_IMAGE_SIZE = 5 * 1024 * 1024
MAX_IMAGES_PER_UPLOAD = 10
IMAGE_FORMATS = {
    "image/jpeg": (".jpg", lambda data: data.startswith(b"\xff\xd8\xff")),
    "image/png": (".png", lambda data: data.startswith(b"\x89PNG\r\n\x1a\n")),
    "image/webp": (
        ".webp",
        lambda data: data.startswith(b"RIFF") and data[8:12] == b"WEBP",
    ),
}


async def save_image(file: UploadFile) -> Path:
    format_info = IMAGE_FORMATS.get(file.content_type or "")
    if format_info is None:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Поддерживаются только JPEG, PNG и WebP",
        )

    content = await file.read(MAX_IMAGE_SIZE + 1)
    if len(content) > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Размер изображения не должен превышать 5 МБ",
        )

    extension, is_valid = format_info
    if not is_valid(content):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Содержимое файла не является допустимым изображением",
        )

    settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    destination = settings.UPLOAD_DIR / f"{uuid4().hex}{extension}"
    destination.write_bytes(content)
    return destination


async def ensure_name_available(
    db: AsyncSession,
    model: type[Category] | type[Brand],
    name: str,
    current_id: int | None = None,
) -> None:
    existing = await db.scalar(select(model).where(model.name == name))
    if existing is not None and existing.id != current_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Запись с таким названием уже существует",
        )


async def ensure_slug_available(
    db: AsyncSession,
    model: type[Category] | type[Brand],
    slug: str,
    current_id: int | None = None,
) -> None:
    existing = await db.scalar(select(model).where(model.slug == slug))
    if existing is not None and existing.id != current_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Запись с таким тегом уже существует",
        )


async def get_product(db: AsyncSession, product_id: int) -> Product:
    product = await db.scalar(
        select(Product)
        .options(
            selectinload(Product.category),
            selectinload(Product.brand),
            selectinload(Product.images),
        )
        .where(Product.id == product_id)
        .execution_options(populate_existing=True)
    )
    if product is None:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return product


async def ensure_product_relations(
    db: AsyncSession,
    category_id: int,
    brand_id: int,
) -> None:
    if await db.get(Category, category_id) is None:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    if await db.get(Brand, brand_id) is None:
        raise HTTPException(status_code=404, detail="Бренд не найден")


@router.get("/categories", response_model=list[CategoryResponse])
async def list_categories(db: AsyncSession = Depends(get_db)) -> list[Category]:
    return list((await db.scalars(select(Category).order_by(Category.name))).all())


@router.post(
    "/categories",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_category(
    payload: CategoryCreate,
    db: AsyncSession = Depends(get_db),
) -> Category:
    name = payload.name.strip()
    await ensure_name_available(db, Category, name)
    await ensure_slug_available(db, Category, payload.slug)
    category = Category(
        name=name,
        slug=payload.slug,
        description=payload.description,
    )
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


@router.put("/categories/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    payload: CategoryCreate,
    db: AsyncSession = Depends(get_db),
) -> Category:
    category = await db.get(Category, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    name = payload.name.strip()
    await ensure_name_available(db, Category, name, category_id)
    await ensure_slug_available(db, Category, payload.slug, category_id)
    category.name = name
    category.slug = payload.slug
    category.description = payload.description
    await db.commit()
    await db.refresh(category)
    return category


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    category = await db.get(Category, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    if await db.scalar(select(Product.id).where(Product.category_id == category_id)):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Сначала переназначьте товары этой категории",
        )
    await db.delete(category)
    await db.commit()
    if category.image_path:
        (settings.UPLOAD_DIR / Path(category.image_path).name).unlink(missing_ok=True)


@router.post("/categories/{category_id}/image", response_model=CategoryResponse)
async def upload_category_image(
    category_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
) -> Category:
    category = await db.get(Category, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Категория не найдена")

    destination = await save_image(file)
    previous_path = category.image_path
    category.image_path = f"/uploads/{destination.name}"
    try:
        await db.commit()
        await db.refresh(category)
    except SQLAlchemyError:
        await db.rollback()
        destination.unlink(missing_ok=True)
        raise

    if previous_path:
        (settings.UPLOAD_DIR / Path(previous_path).name).unlink(missing_ok=True)
    return category


@router.delete(
    "/categories/{category_id}/image",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_category_image(
    category_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    category = await db.get(Category, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    if category.image_path is None:
        raise HTTPException(status_code=404, detail="У категории нет изображения")

    image_path = category.image_path
    category.image_path = None
    await db.commit()
    (settings.UPLOAD_DIR / Path(image_path).name).unlink(missing_ok=True)


@router.get("/brands", response_model=list[BrandResponse])
async def list_brands(db: AsyncSession = Depends(get_db)) -> list[Brand]:
    return list((await db.scalars(select(Brand).order_by(Brand.name))).all())


@router.post(
    "/brands",
    response_model=BrandResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_brand(
    payload: BrandCreate,
    db: AsyncSession = Depends(get_db),
) -> Brand:
    name = payload.name.strip()
    await ensure_name_available(db, Brand, name)
    await ensure_slug_available(db, Brand, payload.slug)
    brand = Brand(
        name=name,
        slug=payload.slug,
        description=payload.description,
    )
    db.add(brand)
    await db.commit()
    await db.refresh(brand)
    return brand


@router.put("/brands/{brand_id}", response_model=BrandResponse)
async def update_brand(
    brand_id: int,
    payload: BrandCreate,
    db: AsyncSession = Depends(get_db),
) -> Brand:
    brand = await db.get(Brand, brand_id)
    if brand is None:
        raise HTTPException(status_code=404, detail="Бренд не найден")
    name = payload.name.strip()
    await ensure_name_available(db, Brand, name, brand_id)
    await ensure_slug_available(db, Brand, payload.slug, brand_id)
    brand.name = name
    brand.slug = payload.slug
    brand.description = payload.description
    await db.commit()
    await db.refresh(brand)
    return brand


@router.delete("/brands/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_brand(
    brand_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    brand = await db.get(Brand, brand_id)
    if brand is None:
        raise HTTPException(status_code=404, detail="Бренд не найден")
    if await db.scalar(select(Product.id).where(Product.brand_id == brand_id)):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Сначала переназначьте товары этого бренда",
        )
    await db.delete(brand)
    await db.commit()


@router.get("/products", response_model=list[ProductResponse])
async def list_products(db: AsyncSession = Depends(get_db)) -> list[Product]:
    result = await db.scalars(
        select(Product)
        .options(
            selectinload(Product.category),
            selectinload(Product.brand),
            selectinload(Product.images),
        )
        .order_by(Product.id.desc())
    )
    return list(result.all())


@router.post(
    "/products",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_product(
    payload: ProductCreate,
    db: AsyncSession = Depends(get_db),
) -> Product:
    await ensure_product_relations(db, payload.category_id, payload.brand_id)
    product = Product(**payload.model_dump())
    db.add(product)
    await db.commit()
    return await get_product(db, product.id)


@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: AsyncSession = Depends(get_db),
) -> Product:
    product = await get_product(db, product_id)
    updates = payload.model_dump(exclude_unset=True)
    if any(
        updates.get(field) is None
        for field in ("name", "price", "category_id", "brand_id")
        if field in updates
    ):
        raise HTTPException(
            status_code=422,
            detail="Обязательные поля товара не могут быть пустыми",
        )
    if "category_id" in updates or "brand_id" in updates:
        await ensure_product_relations(
            db,
            updates.get("category_id", product.category_id),
            updates.get("brand_id", product.brand_id),
        )
    for field, value in updates.items():
        setattr(product, field, value)
    await db.commit()
    return await get_product(db, product_id)


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    product = await get_product(db, product_id)
    image_paths = [image.path for image in product.images]
    await db.delete(product)
    await db.commit()
    for image_path in image_paths:
        (settings.UPLOAD_DIR / Path(image_path).name).unlink(missing_ok=True)


@router.post(
    "/products/{product_id}/images",
    response_model=ProductResponse,
)
async def upload_product_images(
    product_id: int,
    files: list[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db),
) -> Product:
    product = await get_product(db, product_id)
    if not files or len(files) > MAX_IMAGES_PER_UPLOAD:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Можно загрузить от 1 до {MAX_IMAGES_PER_UPLOAD} изображений",
        )

    saved_files: list[Path] = []
    try:
        settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        for file in files:
            destination = await save_image(file)
            saved_files.append(destination)
            db.add(
                ProductImage(
                    product_id=product_id,
                    path=f"/uploads/{destination.name}",
                )
            )

        await db.commit()
    except (HTTPException, OSError, SQLAlchemyError):
        await db.rollback()
        for path in saved_files:
            path.unlink(missing_ok=True)
        raise

    return await get_product(db, product_id)


@router.delete(
    "/products/{product_id}/images/{image_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_product_image(
    product_id: int,
    image_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    image = await db.get(ProductImage, image_id)
    if image is None or image.product_id != product_id:
        raise HTTPException(status_code=404, detail="Изображение не найдено")
    await db.delete(image)
    await db.commit()
    (settings.UPLOAD_DIR / Path(image.path).name).unlink(missing_ok=True)
