import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from './auth-store'
import { useUtilStore } from './util-store'

export const useTestStore = defineStore('test', () => {
    const util_store = useUtilStore()
    const auth_store = useAuthStore()
    const router = useRouter()

    const create_test_result = async (test_name, results) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/test_result', { test_name, results })
            util_store.set_message(response.data.message, 'success')
            await auth_store.refresh()
            router.push('/mi-espacio')
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al guardar resultado'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    return {
        create_test_result
    }
})