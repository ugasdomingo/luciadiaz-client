import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const util_store = useUtilStore()
    const router = useRouter()

    // State
    const user_data = ref(null)
    const token = ref(null)

    // Campos temporales para formularios
    const email = ref('')

    // ================= ACCIONES DE AUTENTICACIÓN =================

    /**
     * Paso 1: Login inicial con credenciales
     * Backend devuelve:
     * - 200: Email verificado -> pide token 2FA
     * - 201: Email NO verificado -> pide verificar email
     */
    const login = async (credentials) => {
        try {
            util_store.set_loading(true)
            // Guardamos el email temporalmente para el paso 2 (2FA)
            email.value = credentials.email

            const response = await api.post('/auth/login', credentials)

            util_store.set_message(response.data.message, response.status)

            if (response.status === 200) {
                // Caso: Usuario verificado, requiere 2FA
                router.push('/verify-login')
            } else if (response.status === 201) {
                // Caso: Usuario no verificado
                router.push('/go-to-email')
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al iniciar sesión'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    /**
     * Registro de nuevo usuario
     */
    const register = async (userData) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/auth/register', userData)

            // Backend devuelve 201 Created
            util_store.set_message(response.data.message, response.data.status || 'success')
            router.push('/go-to-email')

        } catch (error) {
            const msg = error.response?.data?.message || 'Error en el registro'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    /**
     * Paso 2: Verificar Login (2FA)
     */
    const verify_login = async (login_token) => {
        try {
            util_store.set_loading(true)

            // El backend espera { login_token, email }
            const payload = {
                login_token,
                email: email.value // Usamos el email guardado en el paso 1
            }

            const response = await api.post('/auth/verify-login', payload)

            _set_session(response.data.data)
            util_store.set_message(response.data.message, 'success')

            // Redirección inteligente
            const target = util_store.last_page && util_store.last_page !== '/acceso'
                ? util_store.last_page
                : '/mi-espacio'

            router.push(target)

        } catch (error) {
            const msg = error.response?.data?.message || 'Código incorrecto o expirado'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    /**
     * Verificar Email (Desde enlace o código)
     */
    const verify_email = async (login_token, email_param) => {
        try {
            util_store.set_loading(true)

            const payload = {
                login_token,
                email: email_param
            }

            const response = await api.post('/auth/verify-email', payload)

            _set_session(response.data.data)
            util_store.set_message(response.data.message, 'success')

            router.push('/mi-espacio')

        } catch (error) {
            const msg = error.response?.data?.message || 'Error al verificar email'
            util_store.set_message(msg, 'error')
            router.push('/acceso')
        } finally {
            util_store.set_loading(false)
        }
    }

    /**
     * Refrescar Token (Silencioso)
     */
    const refresh = async () => {
        const refresh_token = localStorage.getItem('refresh_token')
        if (!refresh_token) return false

        try {
            // No activamos loading global para no interrumpir la UX
            const response = await api.post('/auth/refresh', { refresh_token })

            _set_session(response.data.data)
            return true

        } catch (error) {
            console.warn('Sesión expirada', error)
            logout()
            return false
        }
    }

    /**
     * Cerrar Sesión
     */
    const logout = () => {
        user_data.value = null
        token.value = null
        email.value = ''
        localStorage.removeItem('refresh_token')
        util_store.set_message('Hasta luego', 'success')
        router.push('/')
    }

    // ================= GESTIÓN DE CONTRASEÑAS =================

    const forgot_password = async (email_val) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/auth/forgot-password', { email: email_val })
            util_store.set_message(response.data.message, 'success')
        } catch (error) {
            // Por seguridad, a veces no queremos decir si el email existe o no, 
            // pero si tu backend manda error, lo mostramos.
            const msg = error.response?.data?.message || 'Error al solicitar recuperación'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const reset_password = async (reset_password_token, email_val, password) => {
        try {
            util_store.set_loading(true)
            const payload = { reset_password_token, email: email_val, password }

            const response = await api.post('/auth/reset-password', payload)

            _set_session(response.data.data)
            util_store.set_message(response.data.message, 'success')
            router.push('/mi-espacio')

        } catch (error) {
            const msg = error.response?.data?.message || 'Error al restablecer contraseña'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const change_password = async (password, new_password) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/auth/change-password', { password, new_password })
            util_store.set_message(response.data.message, 'success')
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al cambiar contraseña'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    // ================= HELPERS INTERNOS =================

    /**
     * Guarda la sesión en el estado y localStorage
     * data = { user_data, token, refresh_token }
     */
    const _set_session = (data) => {
        if (!data) return

        user_data.value = data.user_data // Ahora coincide con lo que manda backend
        token.value = data.token

        // Configuramos el header de Authorization para futuras peticiones
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

        if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token) // Nombre más explícito que 'login'
        }
    }

    return {
        // State
        user_data,
        token,
        email,

        // Actions
        login,
        register,
        verify_login,
        verify_email,
        refresh,
        logout,
        forgot_password,
        reset_password,
        change_password
    }
})