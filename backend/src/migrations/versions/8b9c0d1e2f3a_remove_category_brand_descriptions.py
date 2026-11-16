"""remove category and brand descriptions

Revision ID: 8b9c0d1e2f3a
Revises: 7a8b9c0d1e2f
Create Date: 2026-11-16
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "8b9c0d1e2f3a"
down_revision: Union[str, Sequence[str], None] = "7a8b9c0d1e2f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("categories", "description")
    op.drop_column("brands", "description")


def downgrade() -> None:
    op.add_column(
        "brands",
        sa.Column("description", sa.Text(), nullable=True),
    )
    op.add_column(
        "categories",
        sa.Column("description", sa.Text(), nullable=True),
    )
