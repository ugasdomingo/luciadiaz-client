import { defineStore } from 'pinia'
import { api } from '../service/axios'
import { useUtilStore } from './util-store'

export const useAppointmentStore = defineStore('appointments', () => {
    const util_store = useUtilStore()

    /**
     * Inicia el pago Stripe para una terapia.
     * Devuelve { session_url } o null.
     */
    const init_therapy_payment = async (therapy_id) => {
        try {
            const res = await api.post('/appointments/stripe/init', { therapy_id })
            return res.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error iniciando pago'
            util_store.set_message(msg, 'error')
            console.error('[appointment-store] init_therapy_payment:', err)
            return null
        }
    }

    /**
     * Confirma el pago Stripe y devuelve el link de cal.com para reservar.
     * Devuelve { cal_link, therapy_id } o null.
     */
    const confirm_therapy_payment = async (session_id) => {
        try {
            const res = await api.post('/appointments/stripe/confirm', { session_id })
            return res.data.data
        } catch (err) {
            const msg = err.response?.data?.message || 'Error confirmando pago'
            util_store.set_message(msg, 'error')
            console.error('[appointment-store] confirm_therapy_payment:', err)
            return null
        }
    }

    return { init_therapy_payment, confirm_therapy_payment }
})
