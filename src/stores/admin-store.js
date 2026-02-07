import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useAuthStore } from './auth-store'
import { useUtilStore } from './util-store'

export const useAdminStore = defineStore('admin', () => {
    const auth_store = useAuthStore()
    const util_store = useUtilStore()

    const users = ref(null)
    const user = ref(null)
    const pagination = ref(null)

    const get_all_users = async (page = 1, limit = 50) => {
        try {
            util_store.set_loading(true)
            const response = await api.get(`/user?page=${page}&limit=${limit}`)
            users.value = response.data.data
            pagination.value = response.data.pagination || null
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al cargar usuarios'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const get_user_by_id = async (user_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.get(`/user/${user_id}`)
            user.value = response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al cargar usuario'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const update_user = async (user_id, user_data) => {
        try {
            util_store.set_loading(true)
            const response = await api.put(`/user/${user_id}`, user_data)
            user.value = response.data.data
            util_store.set_message(response.data.message, 'success')
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al actualizar usuario'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const role_to_patient = async (user_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.put(`/user/role_to_patient/${user_id}`)
            user.value = response.data.data
            util_store.set_message(response.data.message, 'success')
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al cambiar rol'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const active_anamnesis_kids = async (user_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/util/active-anamnesis-kids', { user_id })
            user.value = response.data.data
            util_store.set_message(response.data.message, 'success')
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al activar anamnesis'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    return {
        users,
        user,
        pagination,
        get_all_users,
        get_user_by_id,
        update_user,
        role_to_patient,
        active_anamnesis_kids
    }
})
