import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'

const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

export const useCommonStore = defineStore('common', () => {
    const util_store = useUtilStore()

    // State
    const posts = ref([])
    const products = ref([])
    const videos = ref([])
    const last_fetched = ref(null)

    /**
     * Obtener datos para la página Home.
     * No hace fetch si los datos tienen menos de 5 minutos (cache en memoria).
     */
    const get_common = async (force = false) => {
        const cache_valid = last_fetched.value && (Date.now() - last_fetched.value < CACHE_TTL)
        if (!force && cache_valid) return

        try {
            util_store.set_loading(true)
            const response = await api.get('/common/home')

            posts.value = response.data.data.posts || []
            products.value = response.data.data.products || []
            videos.value = response.data.data.videos || []
            last_fetched.value = Date.now()

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
        get_common
    }
})