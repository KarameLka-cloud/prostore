from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.configs.database import get_db
from src.models import Brand, Category, Product
from src.schemas import BrandResponse, CategoryResponse, ProductResponse

router = APIRouter(prefix="/api/catalog", tags=["catalog"])


@router.get("/categories", response_model=list[CategoryResponse])
async def list_public_categories(
    db: AsyncSession = Depends(get_db),
) -> list[Category]:
    result = await db.scalars(select(Category).order_by(Category.name))
    return list(result.all())


@router.get("/popular-products", response_model=list[ProductResponse])
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
    "/categories/{category_id}/brands",
    response_model=list[BrandResponse],
)
async def list_public_category_brands(
    category_id: int,
    db: AsyncSession = Depends(get_db),
) -> list[Brand]:
    result = await db.scalars(
        select(Brand)
        .join(Product, Product.brand_id == Brand.id)
        .where(Product.category_id == category_id)
        .distinct()
        .order_by(Brand.name)
    )
    return list(result.all())


@router.get(
    "/categories/{category_id}/products",
    response_model=list[ProductResponse],
)
async def list_public_category_products(
    category_id: int,
    brand_id: int,
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


@router.get("/products/{product_slug}", response_model=ProductResponse)
async def get_public_product(
    product_slug: str,
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
