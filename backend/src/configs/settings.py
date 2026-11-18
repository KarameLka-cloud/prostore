from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    DATABASE_URL: str
    CORS_ORIGINS: list[str]
    AUTH_SECRET: str
    UPLOAD_DIR: Path = BASE_DIR / "uploads"

    @field_validator("UPLOAD_DIR")
    @classmethod
    def resolve_upload_dir(cls, value: Path) -> Path:
        """Относительный путь считается от корня backend."""
        if value.is_absolute():
            return value
        return (BASE_DIR / value).resolve()


settings = Settings()  # type: ignore
