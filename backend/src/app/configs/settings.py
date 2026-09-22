from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True)

    database_url: str = "postgresql+asyncpg://postgres:root@localhost:5432/prostore"
    pool_size: int = 20
    max_overflow: int = 10
    pool_recycle: int = 3600


settings = Settings()
