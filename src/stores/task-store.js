import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { useUtilStore } from './util-store'
import { useAuthStore } from './auth-store'

export const useTaskStore = defineStore('task', () => {
    const util_store = useUtilStore()
    const auth_store = useAuthStore()

    const create_task = async (task, user_id, observations = 'No hay observaciones') => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/task/user', {
                task,
                user_id,
                observations,
                status: 'pending'
            })
            util_store.set_message(response.data.message, 'success')
            return response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al crear tarea'
            util_store.set_message(msg, 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    const update_task = async (task_id, task_data) => {
        try {
            util_store.set_loading(true)
            const response = await api.put(`/task/${task_id}`, task_data)
            util_store.set_message(response.data.message, 'success')
            return response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al actualizar tarea'
            util_store.set_message(msg, 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    const delete_task = async (task_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.delete(`/task/${task_id}`)
            util_store.set_message(response.data.message, 'success')
            return true
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al eliminar tarea'
            util_store.set_message(msg, 'error')
            return false
        } finally {
            util_store.set_loading(false)
        }
    }

    const complete_task = async (task_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.put(`/task/complete/${task_id}`)
            util_store.set_message(response.data.message, 'success')
            return response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al completar tarea'
            util_store.set_message(msg, 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    return {
        create_task,
        update_task,
        delete_task,
        complete_task
    }
})
