import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'
import { useAuthStore } from './auth-store'

export const useProductStore = defineStore('product', () => {
    const util_store = useUtilStore()
    const products = ref([])
    const product = ref(null)

    const has_access = (slug) => {
        const auth_store = useAuthStore()
        if (!auth_store.user_data) return false
        if (auth_store.is_admin) return true

        const purchases = auth_store.user_data.purchases || []
        return purchases.some(p => p.slug === slug && p.payment_status === 'completed')
    }

    const has_pending_order = (slug) => {
        const auth_store = useAuthStore()
        if (!auth_store.user_data) return false

        const purchases = auth_store.user_data.purchases || []
        return purchases.some(p => p.slug === slug && p.payment_status === 'pending')
    }

    const fetch_products = async (filters = {}, page = 1, limit = 20) => {
        try {
            util_store.set_loading(true)

            const queryParams = new URLSearchParams({
                ...filters,
                page: String(page),
                limit: String(limit)
            }).toString()

            const response = await api.get(`/products?${queryParams}`)
            products.value = response.data.data
            return response.data
        } catch (error) {
            console.error('Error al obtener productos:', error)
            util_store.set_message('Error al cargar productos', 'error')
            return []
        } finally {
            util_store.set_loading(false)
        }
    }

    const fetch_product_by_slug = async (slug) => {
        try {
            util_store.set_loading(true)
            const response = await api.get(`/products/${slug}`)
            product.value = response.data.data
            return response.data.data
        } catch (error) {
            console.error('Error al obtener producto:', error)
            util_store.set_message('Producto no encontrado', 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    const fetch_all_products_admin = async (filters = {}, page = 1, limit = 50) => {
        try {
            util_store.set_loading(true)
            const auth_store = useAuthStore()

            const queryParams = new URLSearchParams({
                ...filters,
                page: String(page),
                limit: String(limit)
            }).toString()

            const response = await api.get(`/products?${queryParams}`)
            products.value = response.data.data
            return response.data
        } catch (error) {
            console.error('Error al obtener productos (admin):', error)
            util_store.set_message('Error al cargar productos', 'error')
            return []
        } finally {
            util_store.set_loading(false)
        }
    }

    const create_product = async (product_data) => {
        try {
            util_store.set_loading(true)

            const response = await api.post('/products', product_data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            util_store.set_message(response.data.message, 'success')

            return response.data.data
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al crear producto'
            util_store.set_message(msg, 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    const update_product = async (product_id, product_data) => {
        try {
            util_store.set_loading(true)

            const headers = product_data instanceof FormData
                ? { 'Content-Type': 'multipart/form-data' }
                : { 'Content-Type': 'application/json' }

            const response = await api.put(`/products/${product_id}`, product_data, { headers })

            util_store.set_message(response.data.message, 'success')
            await fetch_all_products_admin()

            return response.data.data
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al actualizar producto'
            util_store.set_message(msg, 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    const delete_product = async (product_id) => {
        try {
            util_store.set_loading(true)

            const response = await api.delete(`/products/${product_id}`)

            util_store.set_message(response.data.message, 'success')
            await fetch_all_products_admin()

            return true
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al eliminar producto'
            util_store.set_message(msg, 'error')
            return false
        } finally {
            util_store.set_loading(false)
        }
    }

    return {
        // State
        products,
        product,

        // Validación de acceso
        has_access,
        has_pending_order,

        // Acciones públicas
        fetch_products,
        fetch_product_by_slug,

        // Admin
        fetch_all_products_admin,
        create_product,
        update_product,
        delete_product
    }
})