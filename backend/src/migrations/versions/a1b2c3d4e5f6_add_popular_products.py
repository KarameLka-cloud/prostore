"""add popular products

Revision ID: a1b2c3d4e5f6
Revises: 9c0d1e2f3a4b
Create Date: 2026-11-16
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "9c0d1e2f3a4b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "products",
        sa.Column("popular_position", sa.Integer(), nullable=True),
    )
    with op.batch_alter_table("products") as batch_op:
        batch_op.create_unique_constraint(
            "uq_products_popular_position",
            ["popular_position"],
        )


def downgrade() -> None:
    with op.batch_alter_table("products") as batch_op:
        batch_op.drop_constraint("uq_products_popular_position", type_="unique")
        batch_op.drop_column("popular_position")
