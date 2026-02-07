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
    const current_order = ref(null)

    const init_paypal_checkout = async (product_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/orders/paypal/init', { product_id })

            // Redirigir a PayPal
            if (response.data.data?.approve_url) {
                window.location.href = response.data.data.approve_url
            } else {
                util_store.set_message('Error al conectar con PayPal', 'error')
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al iniciar pago'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    const confirm_paypal_payment = async (paypal_order_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/orders/paypal/confirm', { paypal_order_id })

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

    const create_offline_order = async (order_data) => {
        try {
            util_store.set_loading(true)
            const payload = {
                ...order_data,
                payment_method: 'offline'
            }
            const response = await api.post('/orders/offline', payload)

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
        current_order,

        // Actions - Cliente
        init_paypal_checkout,
        confirm_paypal_payment,
        create_offline_order,

        // Actions - Admin
        fetch_all_orders,
        fetch_pending_orders,
        approve_offline_order,
        reject_offline_order
    }
})