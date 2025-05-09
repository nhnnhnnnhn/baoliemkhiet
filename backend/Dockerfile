FROM node:20.14-alpine3.20

WORKDIR /app

# Cài đặt các công cụ build cần thiết cho bcrypt
RUN apk add --no-cache python3 make g++ gcc

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --legacy-peer-deps

# Sao chép tất cả các file còn lại
COPY . .

# Tạo Prisma client
RUN npx prisma generate && npx prisma db push

# Mở cổng 3000
EXPOSE 3000

# Khởi động ứng dụng
CMD ["npm", "start"]
