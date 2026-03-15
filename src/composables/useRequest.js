import { useUtilStore } from '../stores/util-store.js'

export const useRequest = () => {
    const util_store = useUtilStore()

    const with_request = async (fn, success_msg = null) => {
        util_store.set_loading(true)
        try {
            const result = await fn()
            if (success_msg) util_store.set_message(success_msg, 'Approve')
            return result
        } catch (err) {
            const msg = err.response?.data?.message || 'Ha ocurrido un error'
            util_store.set_message(msg, 'Reject')
            return null
        } finally {
            util_store.set_loading(false)
        }
    }

    return { with_request }
}
