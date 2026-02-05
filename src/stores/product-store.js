import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'
import { useAuthStore } from './auth-store'

export const useProductStore = defineStore('product', () => {
    const util_store = useUtilStore()
    const products = ref([])
    const product = ref(null)

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
            return response.data.data
        } catch (error) {
            console.error('Error al obtener productos:', error)
            util_store.set_message('Error al cargar productos', 'error')
            return []
        } finally {
            util_store.set_loading(false)
        }
    }

    /**
     * Obtener un producto por Slug (público)
     * @param {string} slug
     * @returns {Object|null}
     */
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

    // ================= SECCIÓN ADMIN =================

    /**
     * Obtener todos los productos (Admin) - Incluye drafts y archived
     * @param {Object} filters - Filtros opcionales
     * @returns {Array}
     */
    const fetch_all_products_admin = async (filters = {}) => {
        try {
            util_store.set_loading(true)
            const auth_store = useAuthStore()

            const params = new URLSearchParams(filters).toString()
            const url = params ? `/products?${params}` : '/products'

            const response = await api({
                method: 'get',
                url,
                headers: {
                    'Authorization': `Bearer ${auth_store.token}`
                }
            })

            products.value = response.data.data
            return response.data.data
        } catch (error) {
            console.error('Error al obtener productos (admin):', error)
            util_store.set_message('Error al cargar productos', 'error')
            return []
        } finally {
            util_store.set_loading(false)
        }
    }

    /**
     * Crear producto (Admin)
     * @param {FormData} product_data - FormData con campos del producto
     * @returns {Object|null}
     */
    const create_product = async (product_data) => {
        try {
            util_store.set_loading(true)
            const auth_store = useAuthStore()

            const response = await api({
                method: 'post',
                url: '/products',
                data: product_data,
                headers: {
                    'Authorization': `Bearer ${auth_store.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            util_store.set_message(response.data.message, 'success')

            // Recargar lista de productos
            await fetch_all_products_admin()

            return response.data.data
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al crear producto'
            util_store.set_message(msg, 'error')
            console.error('Error create_product:', error)
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    /**
     * Actualizar producto (Admin)
     * @param {string} product_id
     * @param {FormData|Object} product_data
     * @returns {Object|null}
     */
    const update_product = async (product_id, product_data) => {
        try {
            util_store.set_loading(true)
            const auth_store = useAuthStore()

            const response = await api({
                method: 'put',
                url: `/products/${product_id}`,
                data: product_data,
                headers: {
                    'Authorization': `Bearer ${auth_store.token}`,
                    'Content-Type': product_data instanceof FormData ? 'multipart/form-data' : 'application/json'
                }
            })

            util_store.set_message(response.data.message, 'success')

            // Recargar lista de productos
            await fetch_all_products_admin()

            return response.data.data
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al actualizar producto'
            util_store.set_message(msg, 'error')
            console.error('Error update_product:', error)
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    /**
     * Eliminar producto (Admin)
     * @param {string} product_id
     * @returns {boolean}
     */
    const delete_product = async (product_id) => {
        try {
            util_store.set_loading(true)
            const auth_store = useAuthStore()

            const response = await api({
                method: 'delete',
                url: `/products/${product_id}`,
                headers: {
                    'Authorization': `Bearer ${auth_store.token}`
                }
            })

            util_store.set_message(response.data.message, 'success')

            // Recargar lista de productos
            await fetch_all_products_admin()

            return true
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al eliminar producto'
            util_store.set_message(msg, 'error')
            console.error('Error delete_product:', error)
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