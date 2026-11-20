"""add catalog order

Revision ID: 0f1e2d3c4b5a
Revises: f5a6b7c8d9e0
Create Date: 2026-11-18
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0f1e2d3c4b5a"
down_revision: Union[str, Sequence[str], None] = "f5a6b7c8d9e0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "categories",
        sa.Column("position", sa.Integer(), server_default="0", nullable=False),
    )
    op.add_column(
        "brands",
        sa.Column("position", sa.Integer(), server_default="0", nullable=False),
    )

    connection = op.get_bind()
    for table in ("categories", "brands"):
        rows = connection.execute(
            sa.text(f"SELECT id FROM {table} ORDER BY name, id")
        ).fetchall()
        for position, row in enumerate(rows):
            connection.execute(
                sa.text(f"UPDATE {table} SET position = :position WHERE id = :id"),
                {"position": position, "id": row.id},
            )


def downgrade() -> None:
    op.drop_column("brands", "position")
    op.drop_column("categories", "position")
