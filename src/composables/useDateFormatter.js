export const useDateFormatter = () => {
    const format_date = (date) => {
        if (!date) return ''
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
    }
    const format_month_year = (date) => {
        if (!date) return ''
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long'
        })
    }
    const reading_time = (html_content) => {
        if (!html_content) return 1
        const plain = html_content.replace(/<[^>]*>/g, ' ')
        const words = plain.trim().split(/\s+/).length
        return Math.max(1, Math.ceil(words / 200))
    }
    return { format_date, format_month_year, reading_time }
}
