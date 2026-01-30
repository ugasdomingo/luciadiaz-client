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

// Interceptor de respuesta para manejo global de errores
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const util_store = useUtilStore()

        // Si hay un error de conexión (servidor caído)
        if (!error.response) {
            util_store.set_message('Error de conexión con el servidor', 'error')
            return Promise.reject(error)
        }

        return Promise.reject(error)
    }
)

export { api }