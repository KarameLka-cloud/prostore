# Prostore backend

## Запуск

Настройки загружаются из `backend/.env` (шаблон — `backend/.env.example`); на
сервере их также можно передать через переменные окружения.
Для каталога сначала примените миграции. Загрузки по умолчанию сохраняются в
`backend/uploads` — в корне папки backend. Путь можно переопределить через
`UPLOAD_DIR` (относительный путь считается от корня backend); в production этому
каталогу нужно постоянное хранилище.
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

### Swagger и OpenAPI

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

В Swagger методы сгруппированы по аутентификации, публичному каталогу и
административным разделам каталога. Для защищённых методов используйте кнопку
**Authorize** и Bearer-токен сессии frontend. `POST /api/auth/login` проверяет
учётные данные, но не возвращает токен: сессию формирует frontend, а backend
проверяет её подпись с помощью общего `AUTH_SECRET`.

- `POST /api/auth/login` — проверка логина и пароля. Тело запроса:

  ```json
  { "login": "your-login", "password": "your-password" }
  ```

- `GET /health` — проверка доступности сервиса.
