"""add category and brand slugs

Revision ID: 3c4d5e6f7a8b
Revises: 2b3c4d5e6f7a
Create Date: 2026-11-10
"""

import re
import unicodedata
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "3c4d5e6f7a8b"
down_revision: Union[str, Sequence[str], None] = "2b3c4d5e6f7a"
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


def make_slug(name: str, record_id: int) -> str:
    normalized = unicodedata.normalize("NFKD", name.lower().translate(TRANSLITERATION))
    slug = re.sub(r"[^a-z0-9]+", "-", normalized).strip("-")
    return (slug or "item")[:100].rstrip("-") + f"-{record_id}"


def backfill_slugs(table_name: str) -> None:
    connection = op.get_bind()
    table = sa.table(
        table_name,
        sa.column("id", sa.Integer),
        sa.column("name", sa.String),
        sa.column("slug", sa.String),
    )
    records = connection.execute(sa.select(table.c.id, table.c.name)).all()
    used_slugs: set[str] = set()
    for record_id, name in records:
        slug = make_slug(name, record_id)
        if slug in used_slugs:
            slug = f"{slug}-{record_id}"
        used_slugs.add(slug)
        connection.execute(
            table.update().where(table.c.id == record_id).values(slug=slug)
        )


def upgrade() -> None:
    op.add_column(
        "categories",
        sa.Column("slug", sa.String(length=120), nullable=True),
    )
    op.add_column(
        "brands",
        sa.Column("slug", sa.String(length=120), nullable=True),
    )
    backfill_slugs("categories")
    backfill_slugs("brands")
    with op.batch_alter_table("categories") as batch_op:
        batch_op.alter_column(
            "slug",
            existing_type=sa.String(length=120),
            nullable=False,
        )
        batch_op.create_unique_constraint("uq_categories_slug", ["slug"])
    with op.batch_alter_table("brands") as batch_op:
        batch_op.alter_column(
            "slug",
            existing_type=sa.String(length=120),
            nullable=False,
        )
        batch_op.create_unique_constraint("uq_brands_slug", ["slug"])


def downgrade() -> None:
    with op.batch_alter_table("brands") as batch_op:
        batch_op.drop_constraint("uq_brands_slug", type_="unique")
        batch_op.drop_column("slug")
    with op.batch_alter_table("categories") as batch_op:
        batch_op.drop_constraint("uq_categories_slug", type_="unique")
        batch_op.drop_column("slug")
