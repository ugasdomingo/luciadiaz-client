<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth-store'
import { useProgressStore } from '../stores/progress-store'
import { useUtilStore } from '../stores/util-store'
import CourseContentComponent from '../components/dashboard/user/UserCourseContentComponent.vue'
import DownloadablesComponent from '../components/dashboard/user/UserDownloadablesComponent.vue'
import LoadingComponent from '../components/common/LoadingComponent.vue'

const route = useRoute()
const router = useRouter()
const auth_store = useAuthStore()
const progress_store = useProgressStore()
const util_store = useUtilStore()

const active_tab = ref('content')
const progress = ref(null)
const error = ref(false)

// Formatear fecha
const format_date = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('es-ES', options)
}

// Color de progreso dinámico
const progress_color = computed(() => {
    if (!progress.value) return '#d9837b'
    const percentage = progress.value.overall_progress_percentage
    if (percentage >= 0 && percentage < 20) return '#d9837b'
    if (percentage >= 20 && percentage < 90) return '#d4a574'
    return '#5a9e7d' // Verde al final
})

// Tabs dinámicos según contenido del producto
const available_tabs = computed(() => {
    if (!progress.value?.product_id) return []
    const tabs = []
    const product = progress.value.product_id

    // Tab de contenido (si tiene módulos/curriculum)
    // Nota: Adaptamos 'modules' o 'curriculum' según tu modelo nuevo
    if ((product.modules && product.modules.length > 0) || (product.curriculum && product.curriculum.length > 0)) {
        tabs.push({ id: 'content', label: 'Contenido', icon: '📚' })
    }

    // Tab de descargables
    if (product.downloadables && product.downloadables.length > 0) {
        tabs.push({ id: 'downloads', label: 'Recursos', icon: '📥' })
    }

    return tabs
})

// Helper para imagen
const get_cover_image = (product) => {
    // Soporte para string directo o objeto Cloudinary
    if (typeof product.cover_image === 'string') return product.cover_image
    return product.cover_image?.secure_url || product.formation_cover?.secure_url || '/img/background-individual.webp'
}

const request_certificate = () => {
    util_store.set_message('Pronto podrás solicitar tu certificado', 'success')
}

onBeforeMount(async () => {
    try {
        // 1. Asegurar sesión
        if (!auth_store.user_data) await auth_store.refresh()

        // 2. Buscar en el progreso del usuario local si tiene este curso (por slug)
        // Nota: user_data.progress viene populado del login
        const user_progress_item = auth_store.user_data?.progress?.find(p => {
            const prod = p.product_id || p.formation_id // Compatibilidad
            return prod.slug === route.params.formation_slug
        })

        if (!user_progress_item) {
            error.value = true
            util_store.set_message('No tienes acceso a este contenido', 'error')
            // Redirigir a la sales page para que lo compre
            router.replace(`/formaciones/${route.params.formation_slug}`)
            return
        }

        // 3. Obtener el ID real del producto
        const real_product_id = user_progress_item.product_id._id || user_progress_item.product_id

        // 4. Cargar detalle completo del progreso (para tener el último %)
        progress.value = await progress_store.get_progress(real_product_id)

        if (!progress.value) throw new Error('No se pudo cargar el progreso')

        // 5. Registrar acceso
        await progress_store.register_access(real_product_id)

        // 6. Set tab
        if (available_tabs.value.length > 0) {
            active_tab.value = available_tabs.value[0].id
        }

    } catch (err) {
        console.error('Error dashboard:', err)
        error.value = true
    }
})
</script>

<template>
    <main class="course-dashboard">
        <LoadingComponent v-if="util_store.loading && !progress" />

        <div v-else-if="error" class="error-state">
            <h2>⚠️ Acceso no disponible</h2>
            <p>Parece que no tienes acceso a este curso o ha ocurrido un error.</p>
            <RouterLink to="/mi-espacio" class="action-btn">Volver a Mi Espacio</RouterLink>
        </div>

        <div v-else-if="progress" class="course-dashboard__container">
            <header class="course-dashboard__header">
                <div class="header-content">
                    <div class="header-image">
                        <img :src="get_cover_image(progress.product_id)" :alt="progress.product_id.title">
                    </div>
                    <div class="header-info">
                        <span class="badge">Curso en curso</span>
                        <h1>{{ progress.product_id.title }}</h1>
                        <p class="header-meta">
                            Último acceso: {{ format_date(progress.last_accessed) }}
                        </p>

                        <div class="header-progress">
                            <div class="progress-info">
                                <span class="progress-label">Tu avance</span>
                                <span class="progress-percentage">{{ progress.overall_progress_percentage }}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-bar__fill" :style="{
                                    width: `${progress.overall_progress_percentage}%`,
                                    backgroundColor: progress_color
                                }"></div>
                            </div>
                        </div>

                        <button v-if="progress.overall_progress_percentage === 100" @click="request_certificate"
                            class="certificate-btn">
                            🎓 Obtener Certificado
                        </button>
                    </div>
                </div>
            </header>

            <nav v-if="available_tabs.length > 0" class="course-dashboard__tabs">
                <button v-for="tab in available_tabs" :key="tab.id"
                    :class="['tab-btn', { 'tab-btn--active': active_tab === tab.id }]" @click="active_tab = tab.id">
                    <span class="tab-icon">{{ tab.icon }}</span>
                    <span class="tab-label">{{ tab.label }}</span>
                </button>
            </nav>

            <div class="course-dashboard__content">

                <CourseContentComponent v-if="active_tab === 'content'" :formation="progress.product_id"
                    :progress="progress" />

                <DownloadablesComponent v-if="active_tab === 'downloads'" :formation="progress.product_id"
                    :formation_id="progress.product_id._id" />
            </div>
        </div>
    </main>
</template>

<style scoped lang="scss">
.course-dashboard {
    width: 100%;
    min-height: 100vh;
    padding: 2rem;
    padding-top: 6rem; // Espacio navbar
    background: #f8f9fa;

    &__container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    &__header {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        position: relative;
        overflow: hidden;

        // Borde superior decorativo
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        }
    }

    &__tabs {
        display: flex;
        gap: 1rem;
        border-bottom: 1px solid #ddd;
        padding-bottom: 1px;
    }

    &__content {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        min-height: 400px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.03);
    }
}

.header-content {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    align-items: start;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }

    .header-image {
        width: 100%;
        aspect-ratio: 16/9;
        border-radius: 12px;
        overflow: hidden;
        background: #eee;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .header-info {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;

        .badge {
            width: fit-content;
            background: #e3f2fd;
            color: #1976d2;
            padding: 0.25rem 0.75rem;
            border-radius: 50px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        h1 {
            margin: 0;
            font-size: 2rem;
            color: #333;
            font-family: 'Cormorant Garamond', serif;
        }

        .header-meta {
            color: #666;
            font-size: 0.9rem;
        }
    }
}

.header-progress {
    margin-top: 1rem;
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;

    .progress-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        font-weight: 600;
        color: #555;
    }

    .progress-bar {
        height: 8px;
        background: #ddd;
        border-radius: 4px;
        overflow: hidden;

        &__fill {
            height: 100%;
            border-radius: 4px;
            transition: width 1s ease;
        }
    }
}

.tab-btn {
    background: none;
    border: none;
    padding: 1rem 1.5rem;
    font-size: 1rem;
    color: #666;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        color: var(--primary-color);
    }

    &--active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
        font-weight: 600;
    }
}

.certificate-btn {
    margin-top: 1rem;
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    width: fit-content;

    &:hover {
        opacity: 0.9;
    }
}

.error-state {
    text-align: center;
    padding: 4rem;

    h2 {
        color: var(--primary-color);
    }

    .action-btn {
        display: inline-block;
        margin-top: 1rem;
        padding: 0.8rem 1.5rem;
        background: var(--primary-color);
        color: white;
        text-decoration: none;
        border-radius: 6px;
    }
}
</style>