import { ref, computed } from 'vue'

export const useImageFallback = (get_url, placeholder = '/img/placeholder.jpg') => {
    const has_error = ref(false)
    const src = computed(() => {
        if (has_error.value) return placeholder
        return get_url() || placeholder
    })
    const on_error = () => { has_error.value = true }
    return { src, on_error }
}
