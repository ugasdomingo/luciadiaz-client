import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref, computed } from 'vue'
import { useUtilStore } from './util-store'
import { useAuthStore } from './auth-store'

export const useProductStore = defineStore('product', () => {
    const util_store = useUtilStore()

    // ========== STATE ==========
    const all_products = ref([])
    const product = ref(null)

    // Filtros aplicados localmente
    const filters = ref({
        type: '',
        category: '',
        search: '',
        sort: 'date_asc'
    })

    // ========== COMPUTED ==========

    // Productos filtrados — resultado de aplicar los filtros sobre all_products
    const show_products = computed(() => {
        let result = [...all_products.value]

        // Filtro por tipo
        if (filters.value.type) {
            result = result.filter(p => p.type === filters.value.type)
        }

        // Filtro por categoría
        if (filters.value.category) {
            result = result.filter(p => p.category === filters.value.category)
        }

        // Filtro por búsqueda de texto
        if (filters.value.search) {
            const term = filters.value.search.toLowerCase()
            result = result.filter(p =>
                p.title?.toLowerCase().includes(term) ||
                p.description?.toLowerCase().includes(term)
            )
        }

        // Ordenar
        switch (filters.value.sort) {
            case 'date_asc':
                result.sort((a, b) => {
                    const dateA = a.start_date ? new Date(a.start_date) : new Date(a.createdAt)
                    const dateB = b.start_date ? new Date(b.start_date) : new Date(b.createdAt)
                    return dateA - dateB
                })
                break
            case 'date_desc':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break
            case 'price_asc':
                result.sort((a, b) => a.price - b.price)
                break
            case 'price_desc':
                result.sort((a, b) => b.price - a.price)
                break
            case 'title_asc':
                result.sort((a, b) => a.title.localeCompare(b.title))
                break
        }

        return result
    })

    // Categorías únicas extraídas de TODOS los productos (no de los filtrados)
    const categories = computed(() => {
        const cats = all_products.value.map(p => p.category).filter(Boolean)
        return [...new Set(cats)]
    })

    // ========== ACCIONES DE FILTRO ==========

    const set_filter = (key, value) => {
        filters.value[key] = value
    }

    const clear_filters = () => {
        filters.value = {
            type: '',
            category: '',
            search: '',
            sort: 'date_asc'
        }
    }

    // ========== VALIDACIÓN DE ACCESO ==========

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

    // ========== ACCIONES API ==========

    // Carga TODOS los productos del backend (sin filtros, con paginación alta)
    const fetch_products = async () => {
        try {
            util_store.set_loading(true)
            const response = await api.get('/products?page=1&limit=100')
            all_products.value = response.data.data
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

            // Limpiar filtros vacíos
            const cleanFilters = {}
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== undefined && value !== null) {
                    cleanFilters[key] = value
                }
            })

            const queryParams = new URLSearchParams({
                ...cleanFilters,
                page: String(page),
                limit: String(limit)
            }).toString()

            const response = await api.get(`/products?${queryParams}`)
            const products = response.data.data || []
            all_products.value = products
            return products
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
        all_products,
        product,
        filters,

        // Computed
        show_products,
        categories,

        // Filtros
        set_filter,
        clear_filters,

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
