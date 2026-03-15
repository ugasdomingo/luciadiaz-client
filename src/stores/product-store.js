import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref, computed } from 'vue'
import { useRequest } from '../composables/useRequest.js'
import { useAuthStore } from './auth-store'

export const useProductStore = defineStore('product', () => {
    const { with_request } = useRequest()

    // ========== STATE ==========
    const all_products = ref([])
    const product = ref(null)

    const filters = ref({
        type: '',
        category: '',
        search: '',
        sort: 'date_asc'
    })

    // ========== COMPUTED ==========

    const show_products = computed(() => {
        let result = [...all_products.value]

        if (filters.value.type) {
            result = result.filter(p => p.type === filters.value.type)
        }

        if (filters.value.category) {
            result = result.filter(p => p.category === filters.value.category)
        }

        if (filters.value.search) {
            const term = filters.value.search.toLowerCase()
            result = result.filter(p =>
                p.title?.toLowerCase().includes(term) ||
                p.description?.toLowerCase().includes(term)
            )
        }

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

    const categories = computed(() => {
        const cats = all_products.value.map(p => p.category).filter(Boolean)
        return [...new Set(cats)]
    })

    // ========== FILTROS ==========

    const set_filter = (key, value) => {
        filters.value[key] = value
    }

    const clear_filters = () => {
        filters.value = { type: '', category: '', search: '', sort: 'date_asc' }
    }

    // ========== ACCESO ==========

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

    // ========== API ==========

    const fetch_products = async () => {
        return await with_request(async () => {
            const response = await api.get('/products?page=1&limit=100')
            all_products.value = response.data.data
            return response.data
        })
    }

    const fetch_product_by_slug = async (slug) => {
        return await with_request(async () => {
            const response = await api.get(`/products/${slug}`)
            product.value = response.data.data
            return response.data.data
        })
    }

    const fetch_all_products_admin = async (admin_filters = {}, page = 1, limit = 50) => {
        return await with_request(async () => {
            const clean_filters = {}
            Object.entries(admin_filters).forEach(([key, value]) => {
                if (value !== '' && value !== undefined && value !== null) {
                    clean_filters[key] = value
                }
            })
            const query = new URLSearchParams({
                ...clean_filters,
                page: String(page),
                limit: String(limit)
            }).toString()
            const response = await api.get(`/products?${query}`)
            const products = response.data.data || []
            all_products.value = products
            return products
        })
    }

    const create_product = async (product_data) => {
        return await with_request(async () => {
            const response = await api.post('/products', product_data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            return response.data.data
        }, 'Producto creado correctamente')
    }

    const update_product = async (product_id, product_data) => {
        return await with_request(async () => {
            const headers = product_data instanceof FormData
                ? { 'Content-Type': 'multipart/form-data' }
                : { 'Content-Type': 'application/json' }
            const response = await api.put(`/products/${product_id}`, product_data, { headers })
            await fetch_all_products_admin()
            return response.data.data
        }, 'Producto actualizado correctamente')
    }

    const delete_product = async (product_id) => {
        return await with_request(async () => {
            await api.delete(`/products/${product_id}`)
            await fetch_all_products_admin()
            return true
        }, 'Producto eliminado correctamente')
    }

    return {
        all_products,
        product,
        filters,
        show_products,
        categories,
        set_filter,
        clear_filters,
        has_access,
        has_pending_order,
        fetch_products,
        fetch_product_by_slug,
        fetch_all_products_admin,
        create_product,
        update_product,
        delete_product
    }
})
