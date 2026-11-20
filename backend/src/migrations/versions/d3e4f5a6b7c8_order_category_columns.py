"""order category columns

Revision ID: d3e4f5a6b7c8
Revises: c2d3e4f5a6b7
Create Date: 2026-11-16
"""

from typing import Sequence, Union

from alembic import op


revision: str = "d3e4f5a6b7c8"
down_revision: Union[str, Sequence[str], None] = "c2d3e4f5a6b7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE categories "
        "MODIFY COLUMN image_path VARCHAR(255) NULL AFTER slug"
    )


def downgrade() -> None:
    op.execute(
        "ALTER TABLE categories "
        "MODIFY COLUMN image_path VARCHAR(255) NULL AFTER name"
    )
