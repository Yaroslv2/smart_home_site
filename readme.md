# Smart Home Application

Демонстрационное веб-приложение для управления умным домом с React.js фронтендом и Node.js бэкендом.

## Функциональность

1. **Авторизация и регистрация пользователей**
2. **Управление помещениями**
   - Создание помещений
   - Предоставление доступа другим пользователям
3. **Управление устройствами**
   - Группировка устройств
   - Добавление и управление экземплярами устройств
4. **Мониторинг событий**
   - Просмотр событий всех устройств
   - Фильтрация событий по устройству
5. **Сценарии автоматизации**
   - Создание сценариев с множественными действиями
   - Активация/деактивация сценариев

## Структура проекта

```
smart-home-app/
├── backend/                 # Node.js Express API
│   ├── routes/             # API маршруты
│   ├── server.js           # Основной файл сервера
│   ├── db.js              # Подключение к БД
│   ├── package.json       # Зависимости backend
│   └── Dockerfile         # Docker образ для backend
├── frontend/              # React.js приложение
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── api/          # API клиент
│   │   ├── context/      # React Context для авторизации
│   │   └── App.js        # Главный компонент
│   ├── package.json      # Зависимости frontend
│   └── Dockerfile        # Docker образ для frontend
├── db/
│   └── init/             # SQL скрипты инициализации БД
│       ├── 01-init.sql   # Создание таблиц
│       └── 02-insert.sql # Начальные данные
└── docker-compose.yml    # Docker Compose конфигурация
```

## Требования

- Docker и Docker Compose
- Порты 3000 (frontend), 5000 (backend) и 5432 (PostgreSQL) должны быть свободны

## Инструкция по развертыванию

### 1. Создайте структуру проекта

```bash
mkdir smart-home-app
cd smart-home-app
```

### 2. Создайте все необходимые директории

```bash
mkdir -p backend/routes frontend/src/{components/{Auth,Places,Devices,Events,Scripts},api,context} db/init
```

### 3. Скопируйте все файлы из артефактов в соответствующие директории

Структура должна выглядеть так:
- SQL файлы (01-init.sql, 02-insert.sql) → `db/init/`
- Backend файлы → `backend/`
- Frontend файлы → `frontend/`
- docker-compose.yml → корневая директория

### 4. Создайте файл frontend/public/index.html

```bash
mkdir frontend/public
cat > frontend/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Smart Home Management System" />
    <title>Smart Home</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF
```

### 5. Запустите приложение с помощью Docker Compose

```bash
docker-compose up -d
```

Docker Compose выполнит следующее:
- Запустит PostgreSQL с инициализацией базы данных
- Запустит backend сервер на порту 5000
- Запустит frontend приложение на порту 3000

### 6. Дождитесь запуска всех сервисов

Проверьте статус контейнеров:

```bash
docker-compose ps
```

Все три контейнера должны быть в статусе "Up".

### 7. Откройте приложение

Откройте браузер и перейдите по адресу: http://localhost:3000

## Использование

### Тестовые пользователи из базы данных:

1. **Иван Петров**
   - Email: ivan@example.com
   - Пароль: password123

2. **Мария Сидорова**
   - Email: maria@example.com
   - Пароль: securepass

3. **Мудров Ярослав**
   - Email: myad@example.com
   - Пароль: password345

### Первые шаги:

1. Войдите с использованием тестового аккаунта или зарегистрируйте новый
2. Просмотрите существующие помещения или создайте новое
3. Добавьте группы устройств в помещения
4. Добавьте устройства в группы
5. Просмотрите события устройств
6. Создайте сценарии автоматизации

## Полезные команды Docker

```bash
# Остановить все контейнеры
docker-compose down

# Остановить и удалить все данные
docker-compose down -v

# Просмотр логов
docker-compose logs -f

# Просмотр логов конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Перезапуск сервиса
docker-compose restart backend
```

## Разработка

Для разработки вы можете запустить сервисы локально без Docker:

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm start
```

### База данных:
Используйте Docker только для PostgreSQL:
```bash
docker-compose up -d postgres
```

## Переменные окружения

### Backend (.env):
- `PORT` - Порт сервера (по умолчанию 5000)
- `DB_HOST` - Хост базы данных
- `DB_PORT` - Порт базы данных
- `DB_USER` - Пользователь БД
- `DB_PASSWORD` - Пароль БД
- `DB_NAME` - Имя базы данных
- `JWT_SECRET` - Секретный ключ для JWT токенов

### Frontend:
- `REACT_APP_API_URL` - URL API сервера

## Примечания

- В production обязательно измените JWT_SECRET на безопасный случайный ключ
- Используйте HTTPS в production
- Настройте правильные CORS политики
- Рассмотрите использование переменных окружения для чувствительных данных