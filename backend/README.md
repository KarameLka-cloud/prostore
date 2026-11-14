# Prostore backend

## Запуск

По умолчанию настройки загружаются из `backend/.env.local`. Для production
перед запуском задайте `ENV_FILE=.env.prod`; на сервере также можно передать
настройки через переменные окружения.
Для каталога сначала примените миграции. Загрузки сохраняются в `backend/uploads`
(или в каталоге `UPLOAD_DIR`); в production этому каталогу нужно постоянное хранилище.
`AUTH_SECRET` backend должен совпадать с секретом frontend, чтобы защищать запросы
управления каталогом.

```bash
# 1. Создайте базу данных (по умолчанию prostore)
mysql -uroot -e "CREATE DATABASE IF NOT EXISTS prostore"

# 2. Установите зависимости
uv sync

# 3. Примените миграции
uv run alembic upgrade head

# 4. Создайте администратора
uv run seed
```

В production задайте одинаковый случайный `AUTH_SECRET` в frontend и backend,
`API_URL` frontend на адрес backend, а `CORS_ORIGINS` backend на origin frontend.

Seed создаёт пользователя с логином `admin` и паролем `password`.
Повторный запуск обновляет пароль существующего пользователя.

## API

```bash
uv run backend
```

Сервер запускается на `http://localhost:8000`.

- `POST /api/auth/login` — проверка логина и пароля. Тело запроса:

  ```json
  { "login": "admin", "password": "password" }
  ```

- `GET /health` — проверка доступности сервиса.
