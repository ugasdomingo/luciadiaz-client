import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useRequest } from '../composables/useRequest.js'
import { useAuthStore } from './auth-store'

export const usePostStore = defineStore('post', () => {
    const { with_request } = useRequest()
    const auth_store = useAuthStore()
    const posts = ref([])
    const post = ref(null)

    const get_all_posts = async () => {
        await with_request(async () => {
            const response = await api.get('/post')
            posts.value = response.data.data
        })
    }

    const get_post_by_id = async (post_id) => {
        await with_request(async () => {
            const response = await api.get(`/post/${post_id}`)
            post.value = response.data.data
        })
    }

    const create_post = async (post_data) => {
        return await with_request(async () => {
            const response = await api.post('/post', post_data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            return response.data.data
        }, 'Post creado correctamente')
    }

    const update_post = async (post_id, post_data) => {
        return await with_request(async () => {
            const response = await api.put(`/post/${post_id}`, post_data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            return response.data.data
        }, 'Post actualizado correctamente')
    }

    const delete_post = async (post_id) => {
        return await with_request(async () => {
            await api.delete(`/post/${post_id}`)
            posts.value = posts.value.filter(p => p._id !== post_id)
            return true
        }, 'Post eliminado correctamente')
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
