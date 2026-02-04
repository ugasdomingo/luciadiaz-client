import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref, computed } from 'vue'
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

    // ================= COMPUTED =================

    /**
     * Usuario actual (datos básicos)
     */
    const current_user = computed(() => user_data.value?.user || null)

    /**
     * Verificar si el usuario es admin
     */
    const is_admin = computed(() => current_user.value?.role === 'admin')

    /**
     * Verificar si el usuario es paciente
     */
    const is_patient = computed(() => current_user.value?.role === 'patient')

    /**
     * Progreso de cursos del usuario
     */
    const user_progress = computed(() => user_data.value?.progress || [])

    /**
     * ✨ NUEVO: Historial de compras del usuario
     * Formato: [{ product_id, title, type, payment_status, order_date }]
     */
    const purchases = computed(() => user_data.value?.purchases || [])

    /**
     * ✨ NUEVO: Solo compras completadas
     */
    const completed_purchases = computed(() =>
        purchases.value.filter(p => p.payment_status === 'completed')
    )

    /**
     * ✨ NUEVO: Solo órdenes pendientes
     */
    const pending_purchases = computed(() =>
        purchases.value.filter(p => p.payment_status === 'pending')
    )

    /**
     * ✨ NUEVO: Helper para verificar si compró un producto específico
     */
    const has_purchased = (product_id) => {
        return completed_purchases.value.some(p => p.product_id === product_id)
    }

    /**
     * ✨ NUEVO: Helper para verificar si tiene orden pendiente de un producto
     */
    const has_pending_order = (product_id) => {
        return pending_purchases.value.some(p => p.product_id === product_id)
    }

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
            email.value = credentials.email

            const response = await api.post('/auth/login', credentials)

            util_store.set_message(response.data.message, response.status)

            if (response.status === 200) {
                router.push('/verify-login')
            } else if (response.status === 201) {
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

            const payload = {
                login_token,
                email: email.value
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
            const msg = error.response?.data?.message || 'Código inválido'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    /**
     * Verificar email (primer registro)
     */
    const verify_email = async (verification_token) => {
        try {
            util_store.set_loading(true)

            const payload = {
                verification_token,
                email: email.value
            }

            const response = await api.post('/auth/verify-email', payload)

            _set_session(response.data.data)
            util_store.set_message(response.data.message, 'success')
            router.push('/mi-espacio')

        } catch (error) {
            const msg = error.response?.data?.message || 'Código inválido'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    /**
     * ✨ OPTIMIZADO: Renovar token usando refresh_token
     * Ahora incluye purchases en user_data
     */
    const refresh = async () => {
        try {
            const refresh_token = localStorage.getItem('refresh_token')

            if (!refresh_token) {
                return false
            }

            const response = await api.post('/auth/refresh', { refresh_token })

            _set_session(response.data.data)
            return true

        } catch (error) {
            console.error('Error al renovar sesión:', error)
            logout()
            return false
        }
    }

    /**
     * Cerrar sesión
     */
    const logout = () => {
        user_data.value = null
        token.value = null
        email.value = ''

        delete api.defaults.headers.common['Authorization']
        localStorage.removeItem('refresh_token')

        router.push('/')
    }

    /**
     * Solicitar recuperación de contraseña
     */
    const forgot_password = async (email_val) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/auth/forgot-password', { email: email_val })

            util_store.set_message(response.data.message, 'success')
            email.value = email_val
            router.push('/reset-password')

        } catch (error) {
            const msg = error.response?.data?.message || 'Error al solicitar recuperación'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    /**
     * Restablecer contraseña
     */
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

    /**
     * Cambiar contraseña (usuario autenticado)
     */
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
     * ✨ OPTIMIZADO: Guarda la sesión en el estado y localStorage
     * data = { user_data, token, refresh_token }
     * 
     * user_data ahora contiene:
     * - user: { name, email, role, ... }
     * - progress: [{ product_id, completed_lessons, percentage }]
     * - purchases: [{ product_id, title, type, payment_status, order_date }] ← NUEVO
     * - patient_histories, therapy_notes, tasks, test_results, likes
     */
    const _set_session = (data) => {
        if (!data) return

        user_data.value = data.user_data
        token.value = data.token

        // Configurar Authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

        if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token)
        }
    }

    return {
        // State
        user_data,
        token,
        email,

        // Computed
        current_user,
        is_admin,
        is_patient,
        user_progress,
        purchases,
        completed_purchases,
        pending_purchases,

        // Helpers
        has_purchased,
        has_pending_order,

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