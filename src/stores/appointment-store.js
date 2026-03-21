import { defineStore } from 'pinia'
import { useAuthStore } from './auth-store'

export const useAppointmentStore = defineStore('appointments', () => {
    const auth_store = useAuthStore()

    /**
     * Inicia el pago PayPal para una terapia.
     * Devuelve { approve_url, paypal_order_id, therapy_id } o null.
     */
    const init_therapy_payment = async (therapy_id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/appointments/paypal/init`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth_store.token}`,
                },
                body: JSON.stringify({ therapy_id }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Error iniciando pago')
            return data.data
        } catch (err) {
            console.error('[appointment-store] init_therapy_payment:', err)
            return null
        }
    }

    /**
     * Confirma el pago PayPal y devuelve el link de cal.com para reservar.
     * Devuelve { cal_link, therapy_id } o null.
     */
    const confirm_therapy_payment = async (paypal_order_id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/appointments/paypal/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth_store.token}`,
                },
                body: JSON.stringify({ paypal_order_id }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Error confirmando pago')
            return data.data
        } catch (err) {
            console.error('[appointment-store] confirm_therapy_payment:', err)
            return null
        }
    }

    return { init_therapy_payment, confirm_therapy_payment }
})
