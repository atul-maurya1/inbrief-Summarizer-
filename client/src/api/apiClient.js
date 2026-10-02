import axios from "axios"

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 300000, // 5 minutes default timeout
})

// ── Request interceptor ────────────────────────────────────────────────────────
apiClient.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
)

// ── Response interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status

        // Auto-redirect on auth failure (avoid redirect loops on /auth page)
        if (status === 401 && !window.location.pathname.includes("/auth")) {
            window.location.href = "/auth"
        }

        return Promise.reject(error)
    }
)

export default apiClient