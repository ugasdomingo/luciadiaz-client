import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../service/axios'
import { useAuthStore } from './auth-store'

const LIKE_EMAIL_KEY = 'like_email'

export const useLikeStore = defineStore('like', () => {
    // Cache local: { 'Post:abc123': { count: 5, is_liked: true } }
    const counts = ref({})

    // Email en memoria para la sesión — reactive, compartido entre todos los LikeButton
    // Se inicializa con lo que haya en localStorage (sesiones anteriores)
    const session_email = ref(localStorage.getItem(LIKE_EMAIL_KEY) || null)

    const get_key = (item_type, item_id) => `${item_type}:${item_id}`

    const get_saved_email = () => session_email.value

    const save_email = (email) => {
        session_email.value = email          // memoria → reactivo inmediatamente
        localStorage.setItem(LIKE_EMAIL_KEY, email)  // persistencia entre sesiones
    }

    /** Fetch count + is_liked para un item */
    const fetch_count = async (item_type, item_id) => {
        const key = get_key(item_type, item_id)
        try {
            const email = get_saved_email()
            const q = email ? `?email=${encodeURIComponent(email)}` : ''
            const res = await api.get(`/like/count/${item_type}/${item_id}${q}`)
            counts.value[key] = res.data.data
        } catch {
            counts.value[key] = { count: 0, is_liked: false }
        }
    }

    /**
     * Toggle like.
     * Si el usuario no está logueado, lanza 'EMAIL_REQUIRED' si no hay email disponible.
     * El componente debe capturar eso y mostrar el popup.
     */
    const toggle = async (item_type, item_id, email = null) => {
        const auth_store = useAuthStore()
        const key = get_key(item_type, item_id)

        const body = { item_type, item_id: String(item_id) }

        if (!auth_store.token) {
            const resolved = email || get_saved_email()
            if (!resolved) throw new Error('EMAIL_REQUIRED')
            body.email = resolved
            save_email(resolved)
        }

        const res = await api.post('/like/toggle', body)
        counts.value[key] = { count: res.data.data.count, is_liked: res.data.data.liked }
        return res.data.data
    }

    /** Unirse a waitlist de un producto */
    const join_waitlist = async (product_slug, email) => {
        const res = await api.post('/like/waitlist', { product_slug, email })
        return res.data
    }

    const get_count = (item_type, item_id) =>
        counts.value[get_key(item_type, item_id)] || { count: 0, is_liked: false }

    /** Admin: obtener resumen de likes + leads */
    const fetch_admin_summary = async () => {
        const res = await api.get('/like/admin/summary')
        return res.data.data
    }

    return { counts, session_email, fetch_count, toggle, join_waitlist, get_count, get_saved_email, save_email, fetch_admin_summary }
})
