import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'

export const useCommonStore = defineStore('common', () => {
    const util_store = useUtilStore()

    // State
    const posts = ref([])
    const products = ref([]) // ✨ CAMBIO: Antes era 'formations'
    const videos = ref([])

    /**
     * Obtener datos para la página Home
     * Backend devuelve: { posts, videos, products }
     */
    const getCommon = async () => {
        try {
            util_store.set_loading(true)
            const response = await api.get('/common/home')

            posts.value = response.data.data.posts || []
            products.value = response.data.data.products || []
            videos.value = response.data.data.videos || []

            return response.data.data
        } catch (error) {
            console.error('Error al obtener datos comunes:', error)
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    return {
        posts,
        products,
        videos,
        getCommon
    }
})