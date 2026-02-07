import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'
import { useAuthStore } from './auth-store'

export const useHistoryStore = defineStore('history', () => {
    const util_store = useUtilStore()
    const auth_store = useAuthStore()
    const history = ref([])

    const get_all_history = async () => {
        try {
            util_store.set_loading(true)
            const response = await api.get('/history')
            history.value = response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al cargar historial'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const get_user_history = async (user_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.get(`/history/user/${user_id}`)
            history.value = response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al cargar historial del usuario'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const create_history = async (title, answers) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/history', { title, answers })
            util_store.set_message(response.data.message, 'success')
            return response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al crear historial'
            util_store.set_message(msg, 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    const update_history = async (history_id, history_data) => {
        try {
            util_store.set_loading(true)
            const response = await api.put(`/history/${history_id}`, history_data)
            util_store.set_message(response.data.message, 'success')
            return response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al actualizar historial'
            util_store.set_message(msg, 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    return {
        history,
        get_all_history,
        get_user_history,
        create_history,
        update_history
    }
})
