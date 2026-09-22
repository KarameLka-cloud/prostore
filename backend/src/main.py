import uvicorn
from fastapi import FastAPI
from .app.configs import settings

app = FastAPI(root_path="/api")


@app.get("/health")
def health_check():
    return {"status": "ok"}


def main():
    uvicorn.run("src.main:app", host=settings.hostname, port=settings.port, reload=True)
