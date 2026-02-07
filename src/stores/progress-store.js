import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'
import { useAuthStore } from './auth-store'

export const useProgressStore = defineStore('progress', () => {
    const util_store = useUtilStore()
    const auth_store = useAuthStore()

    // State
    const current_progress = ref(null)

    const get_progress = async (product_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.get(`/progress/${product_id}`)
            current_progress.value = response.data.data
            return response.data.data
        } catch (error) {
            console.error(error)
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    const register_access = async (product_id) => {
        try {
            await api.post(`/progress/access/${product_id}`)
            if (current_progress.value && current_progress.value.product_id === product_id) {
                current_progress.value.last_accessed = new Date()
            }
        } catch (error) {
            console.error('Error registrando acceso', error)
        }
    }

    const mark_as_completed = async (product_id, lesson_id) => {
        try {
            const response = await api.put(`/progress/video/${product_id}`, { lesson_id })

            // Actualizamos el estado local con la respuesta del servidor (nuevo porcentaje)
            current_progress.value = response.data.data

            // También actualizamos el auth_store para que la lista de cursos refleje el cambio
            if (auth_store.user_data && auth_store.user_data.progress) {
                const idx = auth_store.user_data.progress.findIndex(p =>
                    (p.product_id._id || p.product_id) === product_id
                )
                if (idx !== -1) {
                    auth_store.user_data.progress[idx] = response.data.data
                }
            }

            return true
        } catch (error) {
            util_store.set_message('Error al guardar progreso', 'error')
            return false
        }
    }

    return {
        current_progress,
        get_progress,
        register_access,
        mark_as_completed
    }
})