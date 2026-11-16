from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Название не может быть пустым")
        return normalized


class CategoryResponse(CategoryCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    image_path: str | None


class BrandCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Название не может быть пустым")
        return normalized


class BrandResponse(BrandCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str


class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    price: Decimal = Field(ge=0, max_digits=12, decimal_places=2)
    category_id: int
    brand_id: int

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Название не может быть пустым")
        return normalized


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    price: Decimal | None = Field(default=None, ge=0, max_digits=12, decimal_places=2)
    category_id: int | None = None
    brand_id: int | None = None

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        if not normalized:
            raise ValueError("Название не может быть пустым")
        return normalized


class PopularProductsUpdate(BaseModel):
    product_ids: list[int] = Field(max_length=8)

    @field_validator("product_ids")
    @classmethod
    def validate_product_ids(cls, value: list[int]) -> list[int]:
        if any(product_id < 1 for product_id in value):
            raise ValueError("ID товара должен быть положительным")
        if len(set(value)) != len(value):
            raise ValueError("Список популярных товаров не должен содержать дубликаты")
        return value


class ProductImageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    path: str


class ProductResponse(ProductCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    category: CategoryResponse
    brand: BrandResponse
    images: list[ProductImageResponse]
