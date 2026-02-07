import axios from 'axios'
import { useUtilStore } from '../stores/util-store'

const api = axios.create({
    // Detecta automáticamente si estás en local o producción
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v3',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// ── Request interceptor: adjunta el token en cada petición ──
api.interceptors.request.use(
    (config) => {
        // Si ya hay un header Authorization (puesto por _set_session), lo usamos
        // Si no, verificamos si el store tiene el token
        if (!config.headers.Authorization) {
            const token = api.defaults.headers.common['Authorization']
            if (token) {
                config.headers.Authorization = token
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

// ── Response interceptor: manejo de errores y auto-refresh en 401 ──
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error)
        } else {
            resolve(token)
        }
    })
    failedQueue = []
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const util_store = useUtilStore()

        // Si hay un error de conexión (servidor caído)
        if (!error.response) {
            util_store.set_message('Error de conexión con el servidor', 'error')
            return Promise.reject(error)
        }

        const originalRequest = error.config

        // Si el error es 401 y no es el propio endpoint de refresh
        if (error.response.status === 401 && !originalRequest._retry) {
            // Evitar bucle infinito con la petición de refresh
            if (originalRequest.url?.includes('/auth/refresh')) {
                return Promise.reject(error)
            }

            // Si ya estamos refrescando, encolar la petición
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return api(originalRequest)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            const refresh_token = localStorage.getItem('refresh_token')

            if (!refresh_token) {
                isRefreshing = false
                processQueue(error)
                return Promise.reject(error)
            }

            try {
                const response = await axios.post(
                    `${api.defaults.baseURL}/auth/refresh`,
                    { refresh_token },
                    { headers: { 'Content-Type': 'application/json' } }
                )

                const { access_token, refresh_token: new_refresh_token } = response.data.data

                // Actualizar token en axios
                api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

                // Actualizar refresh token si viene uno nuevo
                if (new_refresh_token) {
                    localStorage.setItem('refresh_token', new_refresh_token)
                }

                // Procesar cola de peticiones pendientes
                processQueue(null, access_token)

                // Reintentar la petición original
                originalRequest.headers.Authorization = `Bearer ${access_token}`
                return api(originalRequest)

            } catch (refreshError) {
                processQueue(refreshError)

                // Limpiar sesión
                delete api.defaults.headers.common['Authorization']
                localStorage.removeItem('refresh_token')

                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export { api }
