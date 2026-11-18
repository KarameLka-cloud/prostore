from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    DATABASE_URL: str
    CORS_ORIGINS: list[str]
    AUTH_SECRET: str
    UPLOAD_DIR: Path


settings = Settings()  # type: ignore
