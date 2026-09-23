import uvicorn
from fastapi import FastAPI
from .app.configs import settings

from src.app.api import router

app = FastAPI()

app.include_router(router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


def main():
    uvicorn.run("src.main:app", host=settings.hostname,
                port=settings.port, reload=True)
