import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'
import { useAuthStore } from './auth-store'
import { useRouter } from 'vue-router'

export const useOrderStore = defineStore('order', () => {
    const util_store = useUtilStore()
    const auth_store = useAuthStore()
    const router = useRouter()

    // State
    const pending_orders = ref([]) // Para admin
    const all_orders = ref([]) // Para admin
    const my_orders = ref([]) // Para usuario
    const current_order = ref(null)

    const init_stripe_checkout = async (product_id, { selected_date = null, split_payment = false } = {}) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/orders/stripe/init', { product_id, selected_date, split_payment })

            if (response.data.data?.session_url) {
                window.location.href = response.data.data.session_url
            } else {
                util_store.set_message('Error al conectar con Stripe', 'error')
            }
        } catch (error) {
            console.error('Stripe init error:', error)
            const msg = error.response?.data?.message || 'Error al iniciar pago'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const confirm_stripe_payment = async (session_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/orders/stripe/confirm', { session_id })

            util_store.set_message(response.data.message, 'success')

            await auth_store.refresh()

            return true
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al confirmar pago'
            util_store.set_message(msg, 'error')
            return false
        } finally {
            util_store.set_loading(false)
        }
    }

    const create_offline_order = async ({ product_id, file = null, selected_date = null, split_payment = false }) => {
        try {
            util_store.set_loading(true)
            const form_data = new FormData()
            form_data.append('product_id', product_id)
            if (file) form_data.append('payment_proof', file)
            if (selected_date) form_data.append('selected_date', selected_date)
            form_data.append('split_payment', split_payment)

            const response = await api.post('/orders/offline', form_data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            util_store.set_message(response.data.message, 'success')
            await auth_store.refresh()

            return response.data.data
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al reportar pago'
            util_store.set_message(msg, 'error')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    const fetch_my_orders = async () => {
        try {
            util_store.set_loading(true)
            const response = await api.get('/orders/my-orders')
            my_orders.value = response.data.data
            return response.data.data
        } catch (error) {
            console.error('Error al obtener mis órdenes:', error)
            util_store.set_message('Error al cargar tus pedidos', 'error')
            return []
        } finally {
            util_store.set_loading(false)
        }
    }

    const update_payment_proof = async (order_id, payment_proof) => {
        try {
            util_store.set_loading(true)
            const response = await api.patch(`/orders/${order_id}/update-proof`, { payment_proof })

            util_store.set_message(response.data.message, 'success')

            // Actualizar en my_orders local
            const index = my_orders.value.findIndex(o => o._id === order_id)
            if (index !== -1) {
                my_orders.value[index].payment_proof = payment_proof
            }

            return true
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al actualizar comprobante'
            util_store.set_message(msg, 'error')
            return false
        } finally {
            util_store.set_loading(false)
        }
    }

    const fetch_all_orders = async (filters = {}) => {
        try {
            util_store.set_loading(true)

            const params = new URLSearchParams(filters).toString()
            const url = params ? `/orders?${params}` : '/orders'

            const response = await api.get(url)
            all_orders.value = response.data.data

            return response.data.data
        } catch (error) {
            console.error('Error al obtener órdenes:', error)
            util_store.set_message('Error al cargar órdenes', 'error')
            return []
        } finally {
            util_store.set_loading(false)
        }
    }

    const fetch_pending_orders = async () => {
        try {
            util_store.set_loading(true)
            const response = await api.get('/orders/pending')

            pending_orders.value = response.data.data
            return response.data.data
        } catch (error) {
            console.error('Error al obtener órdenes pendientes:', error)
            util_store.set_message('Error al cargar órdenes pendientes', 'error')
            return []
        } finally {
            util_store.set_loading(false)
        }
    }

    const approve_offline_order = async (order_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.patch(`/orders/${order_id}/approve`)

            util_store.set_message(response.data.message, 'success')

            pending_orders.value = pending_orders.value.filter(o => o._id !== order_id)

            const index = all_orders.value.findIndex(o => o._id === order_id)
            if (index !== -1) {
                all_orders.value[index].payment_status = 'completed'
            }

            return true
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al aprobar orden'
            util_store.set_message(msg, 'error')
            return false
        } finally {
            util_store.set_loading(false)
        }
    }

    const reject_offline_order = async (order_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.patch(`/orders/${order_id}/reject`)

            util_store.set_message(response.data.message, 'success')

            pending_orders.value = pending_orders.value.filter(o => o._id !== order_id)

            const index = all_orders.value.findIndex(o => o._id === order_id)
            if (index !== -1) {
                all_orders.value[index].payment_status = 'failed'
            }

            return true
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al rechazar orden'
            util_store.set_message(msg, 'error')
            return false
        } finally {
            util_store.set_loading(false)
        }
    }

    return {
        // State
        pending_orders,
        all_orders,
        my_orders,
        current_order,

        // Actions - Cliente
        init_stripe_checkout,
        confirm_stripe_payment,
        create_offline_order,
        fetch_my_orders,
        update_payment_proof,

        // Actions - Admin
        fetch_all_orders,
        fetch_pending_orders,
        approve_offline_order,
        reject_offline_order
    }
})