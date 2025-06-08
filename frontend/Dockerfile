FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Экспонируем порт
EXPOSE 3000

# Запускаем приложение в режиме разработки
CMD ["npm", "start"]