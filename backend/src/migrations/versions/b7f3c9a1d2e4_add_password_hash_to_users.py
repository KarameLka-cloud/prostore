"""add_password_hash_to_users

Revision ID: b7f3c9a1d2e4
Revises: 44e1161e2469
Create Date: 2026-11-10 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7f3c9a1d2e4'
down_revision: Union[str, Sequence[str], None] = '44e1161e2469'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'users',
        sa.Column(
            'password_hash',
            sa.String(length=255),
            nullable=False,
            server_default='',
        ),
    )
    op.alter_column('users', 'password_hash', server_default=None)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'password_hash')
