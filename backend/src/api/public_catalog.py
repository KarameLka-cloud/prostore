from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.configs.database import get_db
from src.models import Brand, Category, Product
from src.schemas import BrandResponse, CategoryResponse, ProductResponse

router = APIRouter(prefix="/api/catalog", tags=["Публичный каталог"])


@router.get(
    "/categories",
    response_model=list[CategoryResponse],
    summary="Получить категории",
    description="Возвращает категории каталога в сохранённом порядке.",
)
async def list_public_categories(
    db: AsyncSession = Depends(get_db),
) -> list[Category]:
    result = await db.scalars(select(Category).order_by(Category.position, Category.id))
    return list(result.all())


@router.get(
    "/popular-products",
    response_model=list[ProductResponse],
    summary="Получить популярные товары",
    description="Возвращает до восьми товаров в порядке их позиции на главной странице.",
)
async def list_public_popular_products(
    db: AsyncSession = Depends(get_db),
) -> list[Product]:
    result = await db.scalars(
        select(Product)
        .options(
            selectinload(Product.category),
            selectinload(Product.brand),
            selectinload(Product.images),
        )
        .where(Product.popular_position.is_not(None))
        .order_by(Product.popular_position)
        .limit(8)
    )
    return list(result.all())


@router.get(
    "/products",
    response_model=list[ProductResponse],
    summary="Получить все товары",
    description="Возвращает все товары для поиска по каталогу.",
)
async def list_public_products(
    db: AsyncSession = Depends(get_db),
) -> list[Product]:
    result = await db.scalars(
        select(Product)
        .options(
            selectinload(Product.category),
            selectinload(Product.brand),
            selectinload(Product.images),
        )
        .order_by(Product.name, Product.id)
    )
    return list(result.all())


@router.get(
    "/categories/{category_id}/brands",
    response_model=list[BrandResponse],
    summary="Получить бренды категории",
    description="Возвращает бренды, у которых есть товары в указанной категории.",
)
async def list_public_category_brands(
    category_id: Annotated[int, Path(description="ID категории.")],
    db: AsyncSession = Depends(get_db),
) -> list[Brand]:
    result = await db.scalars(
        select(Brand)
        .join(Product, Product.brand_id == Brand.id)
        .where(Product.category_id == category_id)
        .distinct()
        .order_by(Brand.position, Brand.id)
    )
    return list(result.all())


@router.get(
    "/categories/{category_id}/products",
    response_model=list[ProductResponse],
    summary="Получить товары категории и бренда",
    description="Возвращает товары, соответствующие одновременно категории и бренду.",
)
async def list_public_category_products(
    category_id: Annotated[int, Path(description="ID категории.")],
    brand_id: Annotated[
        int,
        Query(description="ID бренда; учитываются только товары из этой категории."),
    ],
    db: AsyncSession = Depends(get_db),
) -> list[Product]:
    result = await db.scalars(
        select(Product)
        .options(
            selectinload(Product.category),
            selectinload(Product.brand),
            selectinload(Product.images),
        )
        .where(
            Product.category_id == category_id,
            Product.brand_id == brand_id,
        )
        .order_by(Product.id.desc())
    )
    return list(result.all())


@router.get(
    "/products/{product_slug}",
    response_model=ProductResponse,
    summary="Получить товар",
    description=(
        "Ищет товар по slug. Для совместимости также поддерживается числовой ID."
    ),
)
async def get_public_product(
    product_slug: Annotated[
        str,
        Path(description="Slug товара или его числовой ID для совместимости."),
    ],
    db: AsyncSession = Depends(get_db),
) -> Product:
    product = await db.scalar(
        select(Product)
        .options(
            selectinload(Product.category),
            selectinload(Product.brand),
            selectinload(Product.images),
        )
        .where(Product.slug == product_slug)
    )
    if product is None and product_slug.isdecimal() and len(product_slug) <= 19:
        product = await db.scalar(
            select(Product)
            .options(
                selectinload(Product.category),
                selectinload(Product.brand),
                selectinload(Product.images),
            )
            .where(Product.id == int(product_slug))
        )
    if product is None:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return product
