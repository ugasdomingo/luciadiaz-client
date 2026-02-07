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
        const token = api.defaults.headers.common['Authorization']
        if (token && !config.headers['Authorization']) {
            config.headers['Authorization'] = token
        }
        return config
    },
    (error) => Promise.reject(error)
)

// ── Response interceptor: manejo global de errores ──
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si hay un error de conexión (servidor caído)
        if (!error.response) {
            try {
                const util_store = useUtilStore()
                util_store.set_message('Error de conexión con el servidor', 'error')
            } catch (e) {
                // Pinia puede no estar disponible aún
            }
        }

        return Promise.reject(error)
    }
)

export { api }
