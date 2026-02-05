import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'
import { useAuthStore } from './auth-store'

export const useTaskStore = defineStore('task', () => {
    const util_store = useUtilStore()
    const auth_store = useAuthStore()

    const create_task = async (task, user_id, observations = 'No hay observaciones') => {
        try {
            util_store.set_loading(true)

            const response = await api({
                method: 'post',
                url: '/task/user',
                headers: {
                    'Authorization': `Bearer ${auth_store.token}`
                },
                data: {
                    task,
                    user_id,
                    observations
                }
            })
            util_store.set_message(response.data.message, response.data.status)
        } catch (err) {
            console.log(err)
        } finally {
            util_store.set_loading(false)
        }
    }

    const update_task = async (task_id, task) => {
        try {
            util_store.set_loading(true)
            const response = await api({
                method: 'put',
                url: `/task/${task_id}`,
                headers: {
                    'Authorization': `Bearer ${auth_store.token}`
                },
                data: task
            })
            util_store.set_message(response.data.message, response.data.status)
        } catch (err) {
            console.log(err)
        } finally {
            util_store.set_loading(false)
        }
    }

    const delete_task = async (task_id) => {
        try {
            util_store.set_loading(true)
            const response = await api({
                method: 'delete',
                url: `/task/${task_id}`,
                headers: {
                    'Authorization': `Bearer ${auth_store.token}`
                }
            })
            util_store.set_message(response.data.message, response.data.status)
        } catch (err) {
            console.log(err)
        } finally {
            util_store.set_loading(false)
        }
    }

    const complete_task = async (task_id) => {
        try {
            util_store.set_loading(true)
            const response = await api({
                method: 'put',
                url: `/task/complete/${task_id}`,
                headers: {
                    'Authorization': `Bearer ${auth_store.token}`
                }
            })
            util_store.set_message(response.data.message, response.data.status)
        } catch (err) {
            console.log(err)
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
