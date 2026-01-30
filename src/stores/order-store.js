import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { ref } from 'vue'
import { useUtilStore } from './util-store'
import { useRouter } from 'vue-router'

export const useOrderStore = defineStore('order', () => {
    const util_store = useUtilStore()
    const router = useRouter()

    // State
    const my_orders = ref([])
    const current_order = ref(null)

    // ================= CLIENTE: PROCESO DE COMPRA =================

    /**
     * Iniciar pago con PayPal
     * @param {string} product_id 
     */
    const init_paypal_checkout = async (product_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/orders/paypal/init', { product_id })

            // Redirigir a PayPal si devuelve la URL de aprobación
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

    /**
     * Confirmar pago PayPal (se llama tras volver de PayPal)
     * @param {string} token - Token que envía PayPal en la URL
     */
    const confirm_paypal_payment = async (token) => {
        try {
            util_store.set_loading(true)
            const response = await api.post('/orders/paypal/confirm', { token })

            util_store.set_message(response.data.message, 'success')
            return true // Éxito
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al confirmar pago'
            util_store.set_message(msg, 'error')
            return false
        } finally {
            util_store.set_loading(false)
        }
    }

    /**
     * Reportar pago manual (Transferencia/Bizum)
     */
    const create_offline_order = async (order_data) => {
        try {
            util_store.set_loading(true)
            // order_data debe incluir: { product_id, payment_method, reference_image (base64 o url) }
            const response = await api.post('/orders/offline', order_data)

            util_store.set_message(response.data.message, 'success')
            return true
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al reportar pago'
            util_store.set_message(msg, 'error')
            return false
        } finally {
            util_store.set_loading(false)
        }
    }

    /**
     * Obtener mis compras (Historial)
     */
    const fetch_my_orders = async () => {
        try {
            util_store.set_loading(true)
            const response = await api.get('/orders/my-orders')
            my_orders.value = response.data.data
        } catch (error) {
            console.error(error)
        } finally {
            util_store.set_loading(false)
        }
    }

    // ================= ADMIN: GESTIÓN =================

    const approve_offline_order = async (order_id) => {
        try {
            util_store.set_loading(true)
            const response = await api.patch(`/orders/${order_id}/approve`)

            util_store.set_message(response.data.message, 'success')
            // Podríamos actualizar la lista local de órdenes si tuviéramos una view de admin cargada
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al aprobar orden'
            util_store.set_message(msg, 'error')
        } finally {
            util_store.set_loading(false)
        }
    }

    return {
        my_orders,
        current_order,
        init_paypal_checkout,
        confirm_paypal_payment,
        create_offline_order,
        fetch_my_orders,
        approve_offline_order
    }
})