from fastapi import APIRouter

from src.app.api.v1 import categories_router

router = APIRouter(prefix="/api")

router.include_router(categories_router, prefix="/v1")
