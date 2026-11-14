import os
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=os.getenv("ENV_FILE", ".env.local"),
        extra="ignore",
    )

    DATABASE_URL: str = Field(default="mysql+aiomysql://root:@localhost:3306/prostore")
    CORS_ORIGINS: list[str] = Field(default=["http://localhost:3000"])
    AUTH_SECRET: str = Field(default="prostore-development-secret-change-me")
    UPLOAD_DIR: Path = Field(
        default_factory=lambda: Path(__file__).resolve().parents[2] / "uploads"
    )


settings = Settings()
