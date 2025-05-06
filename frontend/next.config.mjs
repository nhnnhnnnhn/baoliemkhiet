let userConfig = undefined
try {
  // File v0-user-next.config.mjs có thể không tồn tại, nên chúng ta bỏ qua lỗi
  try {
    userConfig = await import('./v0-user-next.config.mjs')
  } catch (e) {
    // Bỏ qua lỗi import
    console.log('No user ESM config found, using default config')
  }
} catch (e) {
  // Bỏ qua lỗi
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'vercel.app'],
  },
  // Sửa đổi để sử dụng thư mục mặc định của Next.js
  //distDir: '.next',
  // Disable experimental features to avoid issues
  experimental: {
    //webpackBuildWorker: false,
  },
  // Đảm bảo output ổn định
  trailingSlash: false,
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  // Kiểm tra config tồn tại trước khi tiếp tục
  if (config) {
    for (const key in config) {
      if (
        typeof nextConfig[key] === 'object' &&
        !Array.isArray(nextConfig[key])
      ) {
        nextConfig[key] = {
          ...nextConfig[key],
          ...config[key],
        }
      } else {
        nextConfig[key] = config[key]
      }
    }
  }
}

export default nextConfig
