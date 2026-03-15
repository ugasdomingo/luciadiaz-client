import { ref } from 'vue'

export const useModalState = () => {
    const is_open = ref(false)
    const mode = ref('create')
    const selected = ref(null)

    const open_create = () => {
        selected.value = null
        mode.value = 'create'
        is_open.value = true
    }
    const open_edit = (item) => {
        selected.value = { ...item }
        mode.value = 'edit'
        is_open.value = true
    }
    const close = () => {
        is_open.value = false
        selected.value = null
    }
    return { is_open, mode, selected, open_create, open_edit, close }
}
