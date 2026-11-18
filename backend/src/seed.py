import asyncio

from sqlalchemy import select

from src.configs.database import AsyncSessionLocal, engine
from src.core.security import hash_password
from src.models import User

ADMIN_LOGIN = "admin"
ADMIN_NAME = "Администратор"
ADMIN_PASSWORD = "dzEUn–8{PV"
ADMIN_EMAIL = "admin@prostore.local"


async def seed() -> None:
    """Create or update the default admin user."""
    try:
        async with AsyncSessionLocal() as session:
            user = await session.scalar(select(User).where(User.login == ADMIN_LOGIN))

            if user is None:
                user = User(
                    login=ADMIN_LOGIN,
                    name=ADMIN_NAME,
                    email=ADMIN_EMAIL,
                    password_hash=hash_password(ADMIN_PASSWORD),
                )
                session.add(user)
                action = "created"
            else:
                user.email = ADMIN_EMAIL
                user.password_hash = hash_password(ADMIN_PASSWORD)
                action = "updated"

            await session.commit()
    finally:
        await engine.dispose()

    print(f"User {ADMIN_LOGIN!r} {action}. Password: {ADMIN_PASSWORD!r}")


def main() -> None:
    asyncio.run(seed())


if __name__ == "__main__":
    main()
