from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CategoryCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=120,
        description="Название категории; пробелы по краям удаляются.",
    )

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Название не может быть пустым")
        return normalized


class CategoryResponse(CategoryCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(description="Уникальный ID категории.")
    slug: str = Field(description="URL-идентификатор категории.")
    image_path: str | None = Field(
        description="Путь к изображению или null, если изображение не загружено."
    )


class BrandCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=120,
        description="Название бренда; пробелы по краям удаляются.",
    )

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Название не может быть пустым")
        return normalized


class BrandResponse(BrandCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(description="Уникальный ID бренда.")
    slug: str = Field(description="URL-идентификатор бренда.")
    image_path: str | None = Field(
        description="Путь к изображению или null, если изображение не загружено."
    )


class ProductCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=255,
        description="Название товара; пробелы по краям удаляются.",
    )
    description: str | None = Field(
        default=None,
        description="Описание товара.",
    )
    price: Decimal = Field(
        ge=0,
        max_digits=12,
        decimal_places=2,
        description="Цена в валюте магазина, неотрицательное число до двух знаков после запятой.",
    )
    old_price: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
        description="Старая цена товара для отображения скидки.",
    )
    category_id: int = Field(description="ID существующей категории.")
    brand_id: int = Field(description="ID существующего бренда.")

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Название не может быть пустым")
        return normalized


class ProductUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
        description="Новое название товара; пробелы по краям удаляются.",
    )
    description: str | None = Field(default=None, description="Новое описание товара.")
    price: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
        description="Новая цена в валюте магазина, неотрицательное число до двух знаков после запятой.",
    )
    old_price: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
        description="Старая цена товара для отображения скидки.",
    )
    category_id: int | None = Field(
        default=None,
        description="ID существующей категории.",
    )
    brand_id: int | None = Field(
        default=None,
        description="ID существующего бренда.",
    )

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
    product_ids: list[int] = Field(
        max_length=8,
        description=(
            "ID товаров в порядке показа на главной странице. "
            "Допускается не более восьми уникальных положительных ID."
        ),
    )

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

    id: int = Field(description="Уникальный ID изображения.")
    path: str = Field(description="Публичный путь к файлу изображения.")


class ProductResponse(ProductCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(description="Уникальный ID товара.")
    slug: str = Field(description="URL-идентификатор товара.")
    category: CategoryResponse = Field(description="Категория товара.")
    brand: BrandResponse = Field(description="Бренд товара.")
    images: list[ProductImageResponse] = Field(
        description="Изображения товара в порядке добавления."
    )
