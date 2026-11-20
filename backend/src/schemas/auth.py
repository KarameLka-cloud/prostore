from pydantic import BaseModel, ConfigDict, Field, field_validator


class LoginRequest(BaseModel):
    login: str = Field(
        min_length=1,
        max_length=255,
        description="Логин пользователя.",
    )
    password: str = Field(
        min_length=1,
        max_length=255,
        description="Пароль пользователя.",
    )

    @field_validator("login")
    @classmethod
    def normalize_login(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Логин не может быть пустым")
        return normalized


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(description="Уникальный ID пользователя.")
    login: str = Field(description="Логин пользователя.")
    name: str = Field(description="Имя пользователя.")
    email: str = Field(description="Электронная почта пользователя.")


class UserUpdate(BaseModel):
    login: str = Field(min_length=1, max_length=255, description="Логин пользователя.")
    name: str = Field(min_length=1, max_length=255, description="Имя пользователя.")
    email: str = Field(
        min_length=1,
        max_length=255,
        description="Электронная почта пользователя.",
    )
    password: str | None = Field(
        default=None,
        min_length=8,
        max_length=255,
        description="Новый пароль. Если не передан, пароль не меняется.",
    )

    @field_validator("login", "name", "email")
    @classmethod
    def normalize_identity_fields(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Поле не может быть пустым")
        return normalized


class UserCreate(UserUpdate):
    password: str = Field(
        min_length=8,
        max_length=255,
        description="Пароль пользователя.",
    )
