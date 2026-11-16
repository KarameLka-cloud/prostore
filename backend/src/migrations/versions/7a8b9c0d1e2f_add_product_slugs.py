"""add product slugs

Revision ID: 7a8b9c0d1e2f
Revises: 6f7a8b9c0d1e
Create Date: 2026-11-16
"""

import re
import unicodedata
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "7a8b9c0d1e2f"
down_revision: Union[str, Sequence[str], None] = "6f7a8b9c0d1e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

TRANSLITERATION = str.maketrans(
    {
        "а": "a", "б": "b", "в": "v", "г": "g", "д": "d",
        "е": "e", "ё": "yo", "ж": "zh", "з": "z", "и": "i",
        "й": "y", "к": "k", "л": "l", "м": "m", "н": "n",
        "о": "o", "п": "p", "р": "r", "с": "s", "т": "t",
        "у": "u", "ф": "f", "х": "h", "ц": "ts", "ч": "ch",
        "ш": "sh", "щ": "shch", "ъ": "", "ы": "y", "ь": "",
        "э": "e", "ю": "yu", "я": "ya",
    }
)


def make_slug(name: str) -> str:
    normalized = unicodedata.normalize("NFKD", name.lower().translate(TRANSLITERATION))
    slug = re.sub(r"[^a-z0-9]+", "-", normalized).strip("-")
    return (slug or "item")[:120].rstrip("-") or "item"


def upgrade() -> None:
    op.add_column(
        "products",
        sa.Column("slug", sa.String(length=120), nullable=True),
    )
    connection = op.get_bind()
    products = sa.table(
        "products",
        sa.column("id", sa.Integer),
        sa.column("name", sa.String),
        sa.column("slug", sa.String),
    )
    records = connection.execute(
        sa.select(products.c.id, products.c.name).order_by(products.c.id)
    ).all()
    used_slugs: set[str] = set()

    for product_id, name in records:
        base_slug = make_slug(name)
        slug = base_slug
        suffix = 2
        while slug in used_slugs:
            suffix_text = f"-{suffix}"
            slug = f"{base_slug[:120 - len(suffix_text)].rstrip('-')}{suffix_text}"
            suffix += 1
        used_slugs.add(slug)
        connection.execute(
            products.update()
            .where(products.c.id == product_id)
            .values(slug=slug)
        )

    with op.batch_alter_table("products") as batch_op:
        batch_op.alter_column(
            "slug",
            existing_type=sa.String(length=120),
            nullable=False,
        )
        batch_op.create_unique_constraint("uq_products_slug", ["slug"])


def downgrade() -> None:
    with op.batch_alter_table("products") as batch_op:
        batch_op.drop_constraint("uq_products_slug", type_="unique")
        batch_op.drop_column("slug")
