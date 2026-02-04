import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'
import { useAuthStore } from './auth-store'

export const useProductStore = defineStore('product', () => {
    const util_store = useUtilStore()
    const products = ref([])
    const product = ref()

    /**
     * ✨ SIMPLE: Verificar si el usuario tiene acceso a un producto por slug
     * Consulta localmente en auth_store.user_data.purchases
     * @param {string} slug - Slug del producto a verificar
     * @returns {boolean} - true si tiene acceso (comprado y completado)
     */
    const has_access = (slug) => {
        const auth_store = useAuthStore()


        // Si no está logueado, no tiene acceso
        if (!auth_store.user_data) return false

        // Admin siempre tiene acceso
        if (auth_store.is_admin) return true

        // Buscar en purchases si tiene este slug comprado y completado
        const purchases = auth_store.user_data.purchases || []

        const purchase = purchases.find(p =>
            p.slug === slug &&
            p.payment_status === 'completed'
        )

        return !!purchase
    }

    /**
     * Helper: Verificar si tiene orden pendiente de un producto por slug
     * @param {string} slug
     * @returns {boolean}
     */
    const has_pending_order = (slug) => {
        const auth_store = useAuthStore()

        if (!auth_store.user_data) return false

        const purchases = auth_store.user_data.purchases || []
        const purchase = purchases.find(p =>
            p.slug === slug &&
            p.payment_status === 'pending'
        )

        return !!purchase
    }

    /**
     * Obtener productos (Catálogo público)
     * @param {Object} filters - { type: 'course', category: 'salud', search: 'texto' }
     */
    const fetch_products = async (filters = {}) => {
        try {
            util_store.set_loading(true)

            const params = new URLSearchParams(filters).toString()
            const url = params ? `/products?${params}` : '/products'

            const response = await api.get(url)
            products.value = response.data.data
        } catch (error) {
            console.error('Error al obtener productos:', error)
            return []
        } finally {
            util_store.set_loading(false)
        }
    }

    /**
     * Obtener un producto por Slug (público)
     * @param {string} slug
     */
    const fetch_product_by_slug = async (slug) => {
        try {
            util_store.set_loading(true)
            const response = await api.get(`/products/${slug}`)
            product.value = response.data.data
        } catch (error) {
            console.error('Error al obtener producto:', error)
            util_store.set_message('Producto no encontrado', 'error')
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
            const response = await api.put(`/products/${product_id}`, product_data)
            util_store.set_message(response.data.message, 'success')
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
        // Validación de acceso (llamada desde router)
        has_access,
        has_pending_order,

        // Acciones
        fetch_products,
        fetch_product_by_slug,

        // Admin
        create_product,
        update_product,
        delete_product
    }
})