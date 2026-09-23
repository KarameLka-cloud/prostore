from fastapi import APIRouter
from src.app.schemas.category import Category, CategoryCreate, CategoryList, CategoryUpdate


categories_router = APIRouter(prefix="/categories", tags=["Категории"])


@categories_router.get("/", response_model=CategoryList, summary="Получение списка категорий")
def list_categories():
    categories = [
        {"id": 1, "name": "Category A", "slug": "category-a"},
        {"id": 2, "name": "Category B", "slug": "category-b"},
    ]
    return {
        "total": len(categories),
        "items": categories
    }


@categories_router.get("/{id}", response_model=Category, summary="Получение категории")
def get_category(id: int):
    return {
        "id": id,
        "name": "name_category",
        "slug": "slug_category"
    }


@categories_router.post("/", response_model=CategoryCreate, summary='Создание новой категории')
def create_category(category: CategoryCreate):
    return category


@categories_router.patch("/{id}", response_model=CategoryUpdate, summary="Обновление категории")
def update_category(id: int):
    return {"category_id": id}


@categories_router.delete("/{id}")
def delete_category(id: int):
    return {"category_id": id}
