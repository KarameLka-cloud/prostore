"""add user login

Revision ID: 9c0d1e2f3a4b
Revises: 8b9c0d1e2f3a
Create Date: 2026-11-16
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "9c0d1e2f3a4b"
down_revision: Union[str, Sequence[str], None] = "8b9c0d1e2f3a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("login", sa.String(length=255), nullable=True),
    )
    op.execute(sa.text("UPDATE users SET login = name"))
    with op.batch_alter_table("users") as batch_op:
        batch_op.alter_column(
            "login",
            existing_type=sa.String(length=255),
            nullable=False,
        )
        batch_op.create_unique_constraint("uq_users_login", ["login"])


def downgrade() -> None:
    with op.batch_alter_table("users") as batch_op:
        batch_op.drop_constraint("uq_users_login", type_="unique")
        batch_op.drop_column("login")
