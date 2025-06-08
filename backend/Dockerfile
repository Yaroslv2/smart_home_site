FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Экспонируем порт
EXPOSE 5000

# Запускаем приложение
CMD ["npm", "start"]