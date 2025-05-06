FROM node:20.14-alpine3.20

WORKDIR /app

# Cài đặt dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install --legacy-peer-deps

# Sao chép source code
COPY . .

# Cấu hình môi trường
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build ứng dụng
RUN pnpm run build

# Mở cổng 3001 (Next.js mặc định chạy trên 3000)
EXPOSE 3001

# Khởi động ứng dụng
CMD ["pnpm", "start", "--", "-p", "3001"]
