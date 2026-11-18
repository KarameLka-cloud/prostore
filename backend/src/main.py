from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from src.api import auth_router, catalog_router, public_catalog_router, users_router
from src.configs.settings import settings

settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="Prostore API",
    summary="API интернет-магазина Prostore",
    description=(
        "API предоставляет публичный каталог товаров и защищённые операции "
        "управления каталогом. Авторизация для административных методов "
        "выполняется по Bearer-токену сессии, подписанному общим `AUTH_SECRET` "
        "frontend и backend.\n\n"
        "Изображения доступны по URL `/uploads/{filename}`."
    ),
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    openapi_tags=[
        {
            "name": "Состояние сервиса",
            "description": "Проверка доступности backend.",
        },
        {
            "name": "Аутентификация",
            "description": "Проверка учетных данных пользователя.",
        },
        {
            "name": "Публичный каталог",
            "description": "Чтение категорий и товаров без авторизации.",
        },
        {
            "name": "Каталог: категории",
            "description": "Администрирование категорий и их изображений.",
        },
        {
            "name": "Каталог: бренды",
            "description": "Администрирование брендов.",
        },
        {
            "name": "Каталог: товары",
            "description": "Создание, изменение и удаление товаров и изображений.",
        },
        {
            "name": "Каталог: популярные товары",
            "description": "Управление списком товаров на главной странице.",
        },
        {
            "name": "Администрирование пользователей",
            "description": "Просмотр и изменение учетных записей пользователей.",
        },
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(catalog_router)
app.include_router(public_catalog_router)
app.include_router(users_router)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get(
    "/health",
    tags=["Состояние сервиса"],
    summary="Проверить состояние сервиса",
    description="Возвращает `ok`, если backend отвечает на запрос.",
)
async def health() -> dict[str, str]:
    return {"status": "ok"}


def main() -> None:
    import uvicorn

    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
