"""order user columns

Revision ID: e4f5a6b7c8d9
Revises: d3e4f5a6b7c8
Create Date: 2026-11-16
"""

from typing import Sequence, Union

from alembic import op


revision: str = "e4f5a6b7c8d9"
down_revision: Union[str, Sequence[str], None] = "d3e4f5a6b7c8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE users "
        "MODIFY COLUMN password_hash VARCHAR(255) NOT NULL AFTER login"
    )


def downgrade() -> None:
    op.execute(
        "ALTER TABLE users "
        "MODIFY COLUMN password_hash VARCHAR(255) NOT NULL AFTER email"
    )
