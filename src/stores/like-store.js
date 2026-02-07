import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'

export const useLikeStore = defineStore('like', () => {
    const util_store = useUtilStore()
    const liked_by_user = ref(false)
    const like_count = ref(0)

    const toggle_like = async (item_type, item_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/like', { item_type, item_id })
            util_store.set_message(response.data.message, 'success')
            return response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al procesar like'
            util_store.set_message(msg, 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    const get_likes_count = async (item_id) => {
        try {
            const response = await api.get(`/like/${item_id}`)
            like_count.value = response.data.data?.count || 0
            liked_by_user.value = response.data.data?.liked_by_user || false
            return response.data.data
        } catch (err) {
            console.error('Error al obtener likes:', err)
            return null
        }
    }

    return {
        liked_by_user,
        like_count,
        toggle_like,
        get_likes_count
    }
})
