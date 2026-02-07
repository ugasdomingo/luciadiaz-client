import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'
import { useAuthStore } from './auth-store'

export const useNoteStore = defineStore('note', () => {
    const util_store = useUtilStore()
    const auth_store = useAuthStore()
    const notes = ref([])

    const get_all_notes = async () => {
        try {
            util_store.set_loading(true)
            const response = await api.get('/note')
            notes.value = response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al cargar notas'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const get_user_notes = async (user_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.get(`/note/user/${user_id}`)
            notes.value = response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al cargar notas del usuario'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const create_note = async (note) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/note', note)
            util_store.set_message(response.data.message, 'success')
            return response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al crear nota'
            util_store.set_message(msg, 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    const update_note = async (note_id, note) => {
        try {
            util_store.set_loading(true)
            const response = await api.put(`/note/${note_id}`, note)
            util_store.set_message(response.data.message, 'success')
            return response.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al actualizar nota'
            util_store.set_message(msg, 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    const delete_note = async (note_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.delete(`/note/${note_id}`)
            util_store.set_message(response.data.message, 'success')
            notes.value = notes.value.filter(n => n._id !== note_id)
            return true
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al eliminar nota'
            util_store.set_message(msg, 'error')
            return false
        } finally {
            util_store.set_loading(false)
        }
    }

    return {
        notes,
        get_all_notes,
        get_user_notes,
        create_note,
        update_note,
        delete_note
    }
})
