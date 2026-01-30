import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'

export const useProductStore = defineStore('product', () => {
    const util_store = useUtilStore()

    // State
    const products = ref([])
    const current_product = ref(null) // Para la vista individual

    /**
     * Obtener productos (Catálogo público)
     * @param {Object} filters - Ej: { type: 'course' } o { category: 'salud' }
     */
    const fetch_products = async (filters = {}) => {
        try {
            util_store.set_loading(true)

            // Convertimos el objeto de filtros a query params (ej. ?type=course)
            const params = new URLSearchParams(filters).toString()
            const url = params ? `/products?${params}` : '/products'

            const response = await api.get(url)
            products.value = response.data.data
        } catch (error) {
            console.error(error)
            // No mostramos error al usuario en fetchs de listas por UX, solo log
        } finally {
            util_store.set_loading(false)
        }
    }

    /**
     * Obtener un producto por Slug (Vista detalle)
     * Auth opcional manejada por axios (si hay token lo envía) para saber si ya lo compró
     */
    const fetch_product_by_slug = async (slug) => {
        try {
            util_store.set_loading(true)
            const response = await api.get(`/products/${slug}`)
            current_product.value = response.data.data
            return response.data.data
        } catch (error) {
            console.error(error)
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    // ================= SECCIÓN ADMIN =================

    const create_product = async (product_data) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/products', product_data)

            // Actualizamos la lista local si es exitoso
            products.value.push(response.data.data)

            util_store.set_message(response.data.message, 'success')
            return true
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al crear producto'
            util_store.set_message(msg, 'error')
            return false
        } finally {
            util_store.set_loading(false)
        }
    }

    /* NOTA: Estas rutas (PUT/DELETE) no aparecen en tu product-router.js actual.
       Las dejo preparadas para cuando actualices el backend.
    */
    const update_product = async (id, product_data) => {
        try {
            util_store.set_loading(true)
            const response = await api.put(`/products/${id}`, product_data)

            // Actualizar en local
            const index = products.value.findIndex(p => p._id === id)
            if (index !== -1) products.value[index] = response.data.data

            util_store.set_message(response.data.message, 'success')
        } catch (error) {
            util_store.set_message('Error al actualizar (Verifica backend)', 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const delete_product = async (id) => {
        try {
            util_store.set_loading(true)
            const response = await api.delete(`/products/${id}`)

            products.value = products.value.filter(p => p._id !== id)
            util_store.set_message(response.data.message, 'success')
        } catch (error) {
            util_store.set_message('Error al eliminar (Verifica backend)', 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    return {
        products,
        current_product,
        fetch_products,
        fetch_product_by_slug,
        create_product,
        update_product,
        delete_product
    }
})