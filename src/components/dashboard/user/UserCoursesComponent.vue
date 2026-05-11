<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../../stores/auth-store.js'
import { useProductStore } from '../../../stores/product-store.js'
import ProgressCardComponent from '../../common/cards/ProgressCardComponent.vue'
import { RouterLink } from 'vue-router'
import { api } from '../../../service/axios.js'

const auth_store = useAuthStore()
const product_store = useProductStore()

// Descarga segura de guías — proxy en servidor, el PDF nunca se expone al cliente
const downloading = ref({})
const download_guide = async (slug) => {
    if (downloading.value[slug]) return
    downloading.value[slug] = true
    try {
        const res = await api.get(`/products/${slug}/download`, { responseType: 'blob' })
        const blob = new Blob([res.data], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${slug}.pdf`
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 15000)
    } catch {
        alert('No se pudo descargar el archivo. Inténtalo de nuevo.')
    } finally {
        downloading.value[slug] = false
    }
}

// Guías/ebooks compradas (payment_status completed, type ebook o bundle)
const purchased_guides = computed(() => {
    const purchases = auth_store.user_data?.purchases || []
    return purchases.filter(p =>
        p.payment_status === 'completed' &&
        (p.type === 'ebook' || p.type === 'bundle')
    )
})

onMounted(async () => {
    // Asegurar datos actualizados
    if (!auth_store.user_data) {
        await auth_store.refresh()
    }

    // Si no tiene cursos, cargamos sugerencias
    if (!auth_store.user_data.progress || auth_store.user_data.progress.length === 0) {
        if (product_store.all_products.length === 0) {
            await product_store.fetch_products()
        }
    }
})

// Ordenar cursos: en progreso primero, completados después
const sorted_courses = computed(() => {
    if (!auth_store.user_data?.progress) return { in_progress: [], completed: [], algo: 'Algo' }

    const in_progress = auth_store.user_data.progress
        .filter(p => p.percentage < 100)
        .sort((a, b) => new Date(b.last_accessed) - new Date(a.last_accessed)) // Más recientes primero

    const completed = auth_store.user_data.progress
        .filter(p => p.percentage === 100)

    return { in_progress, completed }
})

// Sugerencia para CTA (el primer curso disponible en la tienda)
const suggested_course = computed(() => {
    const courses = product_store.all_products.filter(p => p.type === 'course')
    if (!courses.length) return null
    return courses[0]
})

const user_name = computed(() => auth_store.user_data?.user?.name?.split(' ')[0] || 'Hola')
</script>

<template>
    <section class="user-courses">
        <div class="section-header">
            <h2 class="section-header__title">Mis Aprendizajes</h2>
            <p class="section-header__sub">Tu progreso en formaciones y contenido adquirido.</p>
        </div>

        <!-- Estado vacío -->
        <div v-if="!auth_store.user_data.progress" class="dash-empty">
            <div class="dash-empty__icon">🌱</div>
            <h3 class="dash-empty__title">Tu camino empieza hoy</h3>
            <p class="dash-empty__desc">
                {{ user_name }}, aún no tienes cursos activos.
                <span v-if="suggested_course">Te recomiendo empezar con <strong>{{ suggested_course.title }}</strong>.</span>
            </p>
            <RouterLink v-if="suggested_course" :to="`/formaciones/${suggested_course.slug}`" class="dash-cta">
                Descubrir este curso
            </RouterLink>
            <RouterLink v-else to="/formaciones" class="dash-cta">
                Ver catálogo completo
            </RouterLink>
        </div>

        <div v-else class="courses-list">
            <div v-if="sorted_courses.in_progress.length > 0">
                <div class="subsection-label">
                    <span class="subsection-label__dot active" />
                    En curso
                </div>
                <div class="courses-grid">
                    <ProgressCardComponent v-for="item in sorted_courses.in_progress" :key="item._id" :progress="item" />
                </div>
            </div>

            <div v-if="sorted_courses.completed.length > 0" class="completed-section">
                <div class="subsection-label">
                    <span class="subsection-label__dot done" />
                    Completados
                </div>
                <div class="courses-grid">
                    <ProgressCardComponent v-for="item in sorted_courses.completed" :key="item._id" :progress="item" />
                </div>
            </div>
        </div>

        <!-- Guías -->
        <div v-if="purchased_guides.length > 0" class="guides-section">
            <div class="subsection-label">
                <span class="subsection-label__dot guide" />
                Mis Guías y Ebooks
            </div>
            <div class="guides-list">
                <div v-for="guide in purchased_guides" :key="guide.product_id" class="guide-item">
                    <div class="guide-item__icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" stroke-width="1.5"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    </div>
                    <div class="guide-item__info">
                        <p class="guide-item__title">{{ guide.title }}</p>
                        <span class="guide-item__type">{{ guide.type === 'bundle' ? 'Pack' : 'Guía PDF' }}</span>
                    </div>
                    <button class="guide-item__btn" @click="download_guide(guide.slug)" :disabled="downloading[guide.slug]">
                        <svg v-if="!downloading[guide.slug]" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3v13M5 16l7 7 7-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 20h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                        {{ downloading[guide.slug] ? 'Descargando…' : 'Descargar' }}
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.user-courses { padding: 0; }

/* Header */
.section-header {
    margin-bottom: 36px;

    &__title {
        font-family: var(--font-title);
        font-size: clamp(26px, 4vw, 36px);
        font-weight: 700;
        color: var(--blue-ink);
        margin: 0 0 8px;
        position: relative;
        display: inline-block;

        &::after {
            content: '';
            position: absolute;
            bottom: -6px; left: 0;
            width: 48px; height: 3px;
            background: var(--gold-grad);
            border-radius: $radius-full;
        }
    }

    &__sub {
        font-size: 14px;
        color: var(--color-text-muted);
        margin: 16px 0 0;
    }
}

/* Subsección label */
.subsection-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: $fw-bold;
    font-family: var(--font-body);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--ink-muted);
    margin: 36px 0 16px;

    &__dot {
        width: 8px; height: 8px;
        border-radius: $radius-full;
        flex-shrink: 0;
        &.active { background: var(--color-warning); }
        &.done   { background: var(--color-success); }
        &.guide  { background: var(--color-primary); }
    }
}

.completed-section { opacity: 0.85; }

.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
}

/* Estado vacío */
.dash-empty {
    background: white;
    border-radius: var(--r-xl);
    padding: 64px 32px;
    text-align: center;
    border: 1.5px solid var(--border);
    box-shadow: var(--shadow-sm-new);

    &__icon { font-size: 48px; display: block; margin-bottom: 16px; }

    &__title {
        font-family: var(--font-title);
        font-size: 22px;
        color: var(--blue-ink);
        margin: 0 0 10px;
    }

    &__desc {
        font-size: 14px;
        color: var(--color-text-muted);
        margin: 0 0 24px;
        max-width: 440px;
        margin-left: auto; margin-right: auto;
        line-height: 1.7;
    }
}

.dash-cta {
    display: inline-flex;
    align-items: center;
    padding: 12px 28px;
    background: var(--gold-grad);
    color: white;
    text-decoration: none;
    border-radius: $radius-full;
    font-size: 13px;
    font-weight: $fw-semibold;
    font-family: var(--font-body);
    box-shadow: var(--shadow-gold-new);
    transition: transform 0.2s var(--ease), box-shadow 0.2s;
    &:hover { transform: translateY(-2px); box-shadow: var(--shadow-gold-glow); }
}

/* Guías */
.guides-section { margin-top: 12px; }

.guides-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.guide-item {
    display: grid;
    grid-template-columns: 44px 1fr auto;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: white;
    border: 1.5px solid var(--border);
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-xs);
    transition: border-color 0.2s, box-shadow 0.2s;

    &:hover {
        border-color: var(--border-gold);
        box-shadow: var(--shadow-sm-new);
    }

    &__icon {
        width: 44px; height: 44px;
        background: var(--blue-wash);
        border-radius: $radius-md;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-primary);
    }

    &__info { display: flex; flex-direction: column; gap: 3px; min-width: 0; }

    &__title {
        font-size: 14px;
        font-weight: $fw-semibold;
        color: var(--blue-ink);
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__type {
        font-size: 11px;
        color: var(--ink-muted);
        font-family: var(--font-body);
    }

    &__btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 9px 18px;
        background: var(--gold-grad);
        color: white;
        border: none;
        border-radius: $radius-full;
        font-size: 12px;
        font-weight: $fw-semibold;
        font-family: var(--font-body);
        cursor: pointer;
        white-space: nowrap;
        transition: opacity 0.2s, transform 0.2s;
        box-shadow: var(--shadow-gold-new);

        &:hover { opacity: 0.9; transform: translateY(-1px); }
        &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    }

    @media (max-width: $bp-sm) {
        grid-template-columns: 36px 1fr;
        &__btn { grid-column: 1 / -1; justify-content: center; }
    }
}
</style>