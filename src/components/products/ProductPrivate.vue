<template>
    <div class="product-private">
        <!-- Header del curso -->
        <section class="course-header">
            <div class="container">
                <div class="header-content">
                    <span class="course-badge">{{ productTypeLabel }}</span>
                    <h1 class="course-title">{{ product.title }}</h1>
                    <p class="course-description">{{ product.description }}</p>

                    <!-- Progreso del usuario (si es curso) -->
                    <div v-if="product.type === 'course' && userProgress" class="progress-bar">
                        <div class="progress-bar__label">
                            <span>Tu progreso</span>
                            <span class="progress-percentage">{{ userProgress.percentage }}%</span>
                        </div>
                        <div class="progress-bar__track">
                            <div class="progress-bar__fill" :style="{ width: `${userProgress.percentage}%` }"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contenido según tipo de producto -->

        <!-- CURSO: Mostrar curriculum completo -->
        <section v-if="product.type === 'course' && hasCurriculum" class="course-content">
            <div class="container">
                <h2>Contenido del curso</h2>

                <div class="curriculum">
                    <div v-for="(lesson, index) in product.curriculum" :key="lesson._id || index"
                        class="curriculum-item"
                        :class="{ 'curriculum-item--completed': isLessonCompleted(lesson._id) }">
                        <div class="curriculum-item__header" @click="toggleLesson(index)">
                            <div class="curriculum-item__title">
                                <span class="curriculum-number">{{ index + 1 }}</span>
                                <h3>{{ lesson.title }}</h3>
                            </div>

                            <div class="curriculum-item__status">
                                <span v-if="isLessonCompleted(lesson._id)" class="status-completed">
                                    ✓ Completado
                                </span>
                                <span v-else class="status-pending">
                                    ○ Pendiente
                                </span>
                                <span class="expand-icon" :class="{ 'expanded': expandedLesson === index }">
                                    ▼
                                </span>
                            </div>
                        </div>

                        <!-- Contenido expandible -->
                        <div v-if="expandedLesson === index" class="curriculum-item__content">
                            <!-- Video -->
                            <div v-if="lesson.video_url" class="lesson-video">
                                <iframe :src="getEmbedUrl(lesson.video_url)" frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen></iframe>
                            </div>

                            <!-- Notas de la lección -->
                            <div v-if="lesson.notes" class="lesson-notes">
                                <h4>Notas:</h4>
                                <p>{{ lesson.notes }}</p>
                            </div>

                            <!-- Botón para marcar como completado -->
                            <button v-if="!isLessonCompleted(lesson._id)" @click="markAsCompleted(lesson._id)"
                                class="btn-complete" :disabled="loading">
                                {{ loading ? 'Guardando...' : '✓ Marcar como completado' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- EBOOK/DESCARGABLE: Mostrar botón de descarga -->
        <section v-if="product.type === 'ebook' && product.download_url" class="download-section">
            <div class="container">
                <div class="download-card">
                    <div class="download-card__icon">
                        📥
                    </div>
                    <div class="download-card__content">
                        <h3>Tu guía está lista</h3>
                        <p>Descarga el archivo PDF y accede al contenido cuando quieras</p>
                    </div>
                    <a :href="product.download_url" target="_blank" rel="noopener noreferrer" class="btn-download"
                        @click="handleDownload">
                        Descargar PDF
                    </a>
                </div>
            </div>
        </section>

        <!-- BUNDLE: Mostrar lista de productos incluidos (si aplica) -->
        <section v-if="product.type === 'bundle'" class="bundle-section">
            <div class="container">
                <h2>Productos incluidos</h2>
                <p class="bundle-note">Este pack incluye múltiples recursos. Revisa el contenido completo:</p>

                <!-- Aquí podrías listar productos incluidos si el modelo lo soporta -->
                <div v-if="hasCurriculum" class="bundle-content">
                    <div v-for="(item, index) in product.curriculum" :key="index" class="bundle-item">
                        <span class="bundle-item__icon">📦</span>
                        <h4>{{ item.title }}</h4>
                        <p v-if="item.notes">{{ item.notes }}</p>
                        <a v-if="item.video_url || item.download_url" :href="item.video_url || item.download_url"
                            target="_blank" class="bundle-item__link">
                            Acceder →
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Mensaje de soporte/ayuda -->
        <section class="support-section">
            <div class="container">
                <div class="support-card">
                    <h3>¿Necesitas ayuda?</h3>
                    <p>Si tienes alguna duda o problema con el contenido, no dudes en contactarnos.</p>
                    <RouterLink to="/contacto" class="btn-support">
                        Contactar soporte
                    </RouterLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProgressStore } from '../../stores/progress-store'
import { useUtilStore } from '../../stores/util-store'

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const progress_store = useProgressStore()
const util_store = useUtilStore()

const expandedLesson = ref(null)
const loading = ref(false)

// Etiqueta del tipo de producto
const productTypeLabel = computed(() => {
    const types = {
        'course': 'Curso Online',
        'ebook': 'Guía Digital',
        'bundle': 'Pack Completo',
        'service': 'Servicio'
    }
    return types[props.product.type] || props.product.type
})

// Verificar si tiene curriculum
const hasCurriculum = computed(() => {
    return props.product.curriculum && props.product.curriculum.length > 0
})

// Progreso del usuario (si es curso)
const userProgress = computed(() => {
    return progress_store.current_progress
})

// Verificar si una lección está completada
const isLessonCompleted = (lessonId) => {
    if (!userProgress.value || !userProgress.value.completed_lessons) return false
    return userProgress.value.completed_lessons.some(l => l.lesson_id === lessonId)
}

// Expandir/contraer lección
const toggleLesson = (index) => {
    expandedLesson.value = expandedLesson.value === index ? null : index
}

// Obtener URL embedable de video (Vimeo, YouTube, etc.)
const getEmbedUrl = (url) => {
    // Vimeo
    if (url.includes('vimeo.com')) {
        const vimeoId = url.split('/').pop().split('?')[0]
        return `https://player.vimeo.com/video/${vimeoId}`
    }

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId
        if (url.includes('youtu.be')) {
            videoId = url.split('/').pop().split('?')[0]
        } else {
            videoId = new URL(url).searchParams.get('v')
        }
        return `https://www.youtube.com/embed/${videoId}`
    }

    // Bunny.net u otro CDN
    return url
}

// Marcar lección como completada
const markAsCompleted = async (lessonId) => {
    loading.value = true

    const success = await progress_store.mark_as_completed(props.product._id, lessonId)

    if (success) {
        util_store.set_message('¡Lección completada! 🎉', 'success')
    }

    loading.value = false
}

// Manejar descarga (registrar evento)
const handleDownload = () => {
    // Aquí podrías registrar el evento de descarga si lo necesitas
    console.log('Usuario descargó:', props.product.title)
}

// Cargar progreso al montar componente (si es curso)
onMounted(async () => {
    if (props.product.type === 'course') {
        await progress_store.get_progress(props.product._id)
        await progress_store.register_access(props.product._id)
    }
})
</script>

<style scoped lang="scss">
.product-private {
    background: var(--color-text-light);
    min-height: 100vh;
    font-family: 'Montserrat', sans-serif;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

// Header del curso
.course-header {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-tertiary) 100%);
    color: var(--color-white);
    padding: 60px 0;

    @media (max-width: 768px) {
        padding: 40px 0;
    }
}

.header-content {
    max-width: 800px;
}

.course-badge {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    background: rgba(255, 255, 255, 0.2);
    margin-bottom: 16px;
}

.course-title {
    font-size: 42px;
    font-weight: 800;
    line-height: 1.2;
    margin: 0 0 16px;
    font-family: 'Playfair Display', serif;

    @media (max-width: 768px) {
        font-size: 32px;
    }
}

.course-description {
    font-size: 18px;
    line-height: 1.6;
    opacity: 0.95;
    margin: 0 0 32px;
    font-weight: 300;
}

// Barra de progreso
.progress-bar {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;

    &__label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 14px;
        font-weight: 600;
    }

    &__track {
        height: 8px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        overflow: hidden;
    }

    &__fill {
        height: 100%;
        background: var(--color-white);
        border-radius: 4px;
        transition: width 0.3s ease;
    }
}

// Contenido del curso
.course-content {
    padding: 60px 0;

    h2 {
        font-size: 32px;
        font-weight: 700;
        margin: 0 0 32px;
        color: var(--color-primary);
        font-family: 'Playfair Display', serif;
    }
}

.curriculum {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.curriculum-item {
    background: var(--color-white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s ease;

    &:hover {
        box-shadow: var(--shadow-md);
    }

    &--completed {
        border-left: 4px solid var(--color-secondary);
    }

    &__header {
        padding: 20px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;

        &:hover {
            background: var(--color-text-light);
        }
    }

    &__title {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;

        h3 {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            color: var(--color-text);
            font-family: 'Montserrat', sans-serif;
        }
    }

    &__status {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    &__content {
        padding: 0 20px 20px;
        border-top: 1px solid var(--color-disable);
        animation: slideDown 0.3s ease;
    }
}

.curriculum-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--color-secondary);
    color: var(--color-white);
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
}

.status-completed {
    color: var(--color-secondary);
    font-weight: 600;
    font-size: 14px;
}

.status-pending {
    color: var(--color-text);
    opacity: 0.5;
    font-size: 14px;
}

.expand-icon {
    color: var(--color-text);
    opacity: 0.5;
    font-size: 12px;
    transition: transform 0.3s ease;

    &.expanded {
        transform: rotate(180deg);
    }
}

// Video de la lección
.lesson-video {
    margin: 20px 0;
    position: relative;
    padding-bottom: 56.25%; // 16:9 aspect ratio
    height: 0;
    overflow: hidden;
    border-radius: 8px;

    iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}

// Notas de la lección
.lesson-notes {
    margin: 20px 0;
    padding: 16px;
    background: var(--color-text-light);
    border-radius: 8px;
    border-left: 4px solid var(--color-secondary);

    h4 {
        font-size: 14px;
        font-weight: 700;
        margin: 0 0 8px;
        color: var(--color-text);
        font-family: 'Montserrat', sans-serif;
    }

    p {
        font-size: 14px;
        line-height: 1.6;
        color: var(--color-text);
        margin: 0;
        font-weight: 300;
    }
}

// Botón completar
.btn-complete {
    margin-top: 16px;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    background: var(--color-secondary);
    color: var(--color-white);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Montserrat', sans-serif;

    &:hover:not(:disabled) {
        background: var(--color-secondary-dark);
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

// Sección de descarga (ebooks)
.download-section {
    padding: 60px 0;
}

.download-card {
    background: var(--color-white);
    border-radius: 16px;
    padding: 40px;
    display: flex;
    align-items: center;
    gap: 32px;
    box-shadow: var(--shadow-sm);

    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        padding: 32px 24px;
    }

    &__icon {
        font-size: 64px;
        flex-shrink: 0;
    }

    &__content {
        flex: 1;

        h3 {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 8px;
            color: var(--color-primary);
            font-family: 'Playfair Display', serif;
        }

        p {
            font-size: 16px;
            color: var(--color-text);
            margin: 0;
            font-weight: 300;
        }
    }
}

.btn-download {
    padding: 14px 32px;
    border-radius: 10px;
    background: var(--color-secondary);
    color: var(--color-white);
    font-size: 16px;
    font-weight: 700;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    font-family: 'Montserrat', sans-serif;

    &:hover {
        background: var(--color-secondary-dark);
        transform: translateY(-2px);
    }
}

// Sección bundle
.bundle-section {
    padding: 60px 0;

    h2 {
        font-size: 32px;
        font-weight: 700;
        margin: 0 0 16px;
        color: var(--color-primary);
        font-family: 'Playfair Display', serif;
    }
}

.bundle-note {
    font-size: 16px;
    color: var(--color-text);
    margin: 0 0 32px;
    font-weight: 300;
}

.bundle-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.bundle-item {
    background: var(--color-white);
    border-radius: 12px;
    padding: 24px;
    box-shadow: var(--shadow-sm);

    &__icon {
        font-size: 32px;
        display: block;
        margin-bottom: 12px;
    }

    h4 {
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 8px;
        color: var(--color-primary);
        font-family: 'Montserrat', sans-serif;
    }

    p {
        font-size: 14px;
        color: var(--color-text);
        margin: 0 0 16px;
        font-weight: 300;
    }

    &__link {
        color: var(--color-secondary);
        font-weight: 600;
        text-decoration: none;
        font-size: 14px;
        font-family: 'Montserrat', sans-serif;

        &:hover {
            text-decoration: underline;
            color: var(--color-primary);
        }
    }
}

// Soporte
.support-section {
    padding: 60px 0 80px;
}

.support-card {
    background: var(--color-soft-alert);
    border-radius: 16px;
    padding: 40px;
    text-align: center;

    h3 {
        font-size: 24px;
        font-weight: 700;
        margin: 0 0 12px;
        color: var(--color-primary);
        font-family: 'Playfair Display', serif;
    }

    p {
        font-size: 16px;
        color: var(--color-text);
        margin: 0 0 24px;
        font-weight: 300;
    }
}

.btn-support {
    padding: 12px 32px;
    border-radius: 10px;
    background: var(--color-white);
    color: var(--color-primary);
    font-size: 16px;
    font-weight: 700;
    text-decoration: none;
    display: inline-block;
    border: 2px solid var(--color-primary);
    transition: all 0.2s ease;
    font-family: 'Montserrat', sans-serif;

    &:hover {
        background: var(--color-primary);
        color: var(--color-white);
    }
}

// Animación
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>