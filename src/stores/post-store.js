import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'
import { useAuthStore } from './auth-store'

export const usePostStore = defineStore('post', () => {
    const util_store = useUtilStore()
    const auth_store = useAuthStore()
    const posts = ref([])
    const post = ref(null)

    const get_all_posts = async () => {
        try {
            util_store.set_loading(true)
            const response = await api.get('/post')
            posts.value = response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al cargar posts'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const get_post_by_id = async (post_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.get(`/post/${post_id}`)
            post.value = response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Post no encontrado'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const create_post = async (post_data) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/post', post_data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            util_store.set_message(response.data.message, 'success')
            return response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al crear post'
            util_store.set_message(msg, 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    const update_post = async (post_id, post_data) => {
        try {
            util_store.set_loading(true)
            const response = await api.put(`/post/${post_id}`, post_data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            util_store.set_message(response.data.message, 'success')
            return response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al actualizar post'
            util_store.set_message(msg, 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    const delete_post = async (post_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.delete(`/post/${post_id}`)
            util_store.set_message(response.data.message, 'success')
            posts.value = posts.value.filter(p => p._id !== post_id)
            return true
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al eliminar post'
            util_store.set_message(msg, 'error')
            return false
        } finally {
            util_store.set_loading(false)
        }
    }

    return {
        posts,
        post,
        get_all_posts,
        get_post_by_id,
        create_post,
        update_post,
        delete_post
    }
})
