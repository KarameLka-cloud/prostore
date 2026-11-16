from pydantic import BaseModel, ConfigDict, Field, field_validator


class LoginRequest(BaseModel):
    login: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=1, max_length=255)

    @field_validator("login")
    @classmethod
    def normalize_login(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Логин не может быть пустым")
        return normalized


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    login: str
    name: str
    email: str
