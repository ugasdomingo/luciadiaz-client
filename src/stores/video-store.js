import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'
import { useAuthStore } from './auth-store'

export const useVideoStore = defineStore('video', () => {
    const util_store = useUtilStore()
    const auth_store = useAuthStore()
    const videos = ref([])
    const video = ref(null)

    const get_all_videos = async (display) => {
        try {
            util_store.set_loading(true)
            const response = await api.get(`/video/${display}`)
            videos.value = response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al cargar videos'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const get_video_by_id = async (video_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.get(`/video/video/${video_id}`)
            video.value = response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Video no encontrado'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const create_video = async (video_data) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/video', video_data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            util_store.set_message(response.data.message, 'success')
            return response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al crear video'
            util_store.set_message(msg, 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    const update_video = async (video_id, video_data) => {
        try {
            util_store.set_loading(true)
            const response = await api.put(`/video/${video_id}`, video_data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            util_store.set_message(response.data.message, 'success')
            return response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al actualizar video'
            util_store.set_message(msg, 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    const delete_video = async (video_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.delete(`/video/${video_id}`)
            util_store.set_message(response.data.message, 'success')
            videos.value = videos.value.filter(v => v._id !== video_id)
            return true
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al eliminar video'
            util_store.set_message(msg, 'error')
            return false
        } finally {
            util_store.set_loading(false)
        }
    }

    return {
        videos,
        video,
        get_all_videos,
        get_video_by_id,
        create_video,
        update_video,
        delete_video
    }
})
