import axios, { type InternalAxiosRequestConfig } from "axios"

// Tạo biến để theo dõi trạng thái đang refresh token
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000, // Set timeout to 10 seconds
})

// Add a request interceptor to handle errors
axiosClient.interceptors.request.use(
  (config) => {
    // Reset error message on new request
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a request interceptor for authentication
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only try to get token if we're in a browser environment
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response.data // Return the data directly
  },
  async (error) => {
    const originalRequest = error.config

    // Chỉ thực hiện refresh token khi ở môi trường browser và lỗi 401
    if (typeof window !== "undefined" && error.response?.status === 401 && !originalRequest._retry) {
      // Đánh dấu request này đã được thử refresh token
      originalRequest._retry = true

      // Nếu đang trong quá trình refresh token, thêm request vào hàng đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return axiosClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        const response = await axios.post(
          "http://localhost:3000/api/auth/refresh-token",
          { refreshToken },
          { headers: { "Content-Type": "application/json" } },
        )

        const { accessToken } = response.data
        localStorage.setItem("accessToken", accessToken)

        // Cập nhật token cho request hiện tại và các request trong hàng đợi
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        processQueue(null, accessToken)

        isRefreshing = false
        return axiosClient(originalRequest)
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")

        // Thông báo cho các request đang đợi rằng refresh token đã thất bại
        processQueue(refreshError, null)
        isRefreshing = false

        // Nếu refresh token thất bại và không đang trong quá trình kiểm tra đăng nhập, chuyển hướng
        if (!window.location.pathname.startsWith("/auth/")) {
          setTimeout(() => {
            window.location.href = "/auth/login"
          }, 100)
        }

        return Promise.reject(refreshError)
      }
    }

    let errorMessage = "Có lỗi xảy ra, vui lòng thử lại"

    if (!error.response) {
      errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn."
    } else if (error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }

    console.error("API Error:", errorMessage)
    return Promise.reject(errorMessage)
  },
)

export default axiosClient
