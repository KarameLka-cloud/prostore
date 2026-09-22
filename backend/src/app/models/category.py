from . import Base
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True)

    def __repr__(self) -> str:
        return f"<Category id={self.id} name={self.name} prefix={self.slug}>"
