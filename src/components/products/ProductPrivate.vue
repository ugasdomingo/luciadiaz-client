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
    font-family: $font-body;
}

.container {
    max-width: $max-width;
    margin: 0 auto;
    padding: 0 20px;
}

// Header del curso
.course-header {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-tertiary) 100%);
    color: var(--color-white);
    padding: 60px 0;

    @media (max-width: $bp-md) {
        padding: $space-10 0;
    }
}

.header-content {
    max-width: 800px;
}

.course-badge {
    display: inline-block;
    padding: 6px $space-4;
    border-radius: $radius-full;
    font-size: $text-xs;
    font-weight: $fw-bold;
    text-transform: uppercase;
    background: rgba(255, 255, 255, 0.2);
    margin-bottom: $space-4;
}

.course-title {
    font-size: 42px;
    font-weight: $fw-extrabold;
    line-height: 1.2;
    margin: 0 0 $space-4;
    font-family: $font-title;

    @media (max-width: $bp-md) {
        font-size: $text-4xl;
    }
}

.course-description {
    font-size: $text-lg;
    line-height: 1.6;
    opacity: 0.95;
    margin: 0 0 $space-8;
    font-weight: $fw-light;
}

// Barra de progreso
.progress-bar {
    background: rgba(255, 255, 255, 0.1);
    border-radius: $radius-md;
    padding: $space-5;

    &__label {
        display: flex;
        justify-content: space-between;
        margin-bottom: $space-3;
        font-size: $text-sm;
        font-weight: $fw-semibold;
    }

    &__track {
        height: 8px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: $radius-xs;
        overflow: hidden;
    }

    &__fill {
        height: 100%;
        background: var(--color-white);
        border-radius: $radius-xs;
        transition: width $transition-slow;
    }
}

// Contenido del curso
.course-content {
    padding: 60px 0;

    h2 {
        font-size: $text-4xl;
        font-weight: $fw-bold;
        margin: 0 0 $space-8;
        color: var(--color-primary);
        font-family: $font-title;
    }
}

.curriculum {
    display: flex;
    flex-direction: column;
    gap: $space-4;
}

.curriculum-item {
    background: var(--color-white);
    border-radius: $radius-md;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: $transition;

    &:hover {
        box-shadow: var(--shadow-md);
    }

    &--completed {
        border-left: 4px solid var(--color-secondary);
    }

    &__header {
        padding: $space-5;
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
        gap: $space-4;
        flex: 1;

        h3 {
            font-size: $text-lg;
            font-weight: $fw-semibold;
            margin: 0;
            color: var(--color-text);
            font-family: $font-body;
        }
    }

    &__status {
        display: flex;
        align-items: center;
        gap: $space-4;
    }

    &__content {
        padding: 0 $space-5 $space-5;
        border-top: 1px solid var(--color-disable);
        animation: slideDown $transition-slow;
    }
}

.curriculum-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: $space-8;
    height: $space-8;
    border-radius: $radius-full;
    background: var(--color-secondary);
    color: var(--color-white);
    font-weight: $fw-bold;
    font-size: $text-sm;
    flex-shrink: 0;
}

.status-completed {
    color: var(--color-secondary);
    font-weight: $fw-semibold;
    font-size: $text-sm;
}

.status-pending {
    color: var(--color-text);
    opacity: 0.5;
    font-size: $text-sm;
}

.expand-icon {
    color: var(--color-text);
    opacity: 0.5;
    font-size: $text-xs;
    transition: transform $transition-slow;

    &.expanded {
        transform: rotate(180deg);
    }
}

// Video de la lección
.lesson-video {
    margin: $space-5 0;
    position: relative;
    padding-bottom: 56.25%; // 16:9 aspect ratio
    height: 0;
    overflow: hidden;
    border-radius: $radius-sm;

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
    margin: $space-5 0;
    padding: $space-4;
    background: var(--color-text-light);
    border-radius: $radius-sm;
    border-left: 4px solid var(--color-secondary);

    h4 {
        font-size: $text-sm;
        font-weight: $fw-bold;
        margin: 0 0 $space-2;
        color: var(--color-text);
        font-family: $font-body;
    }

    p {
        font-size: $text-sm;
        line-height: 1.6;
        color: var(--color-text);
        margin: 0;
        font-weight: $fw-light;
    }
}

// Botón completar
.btn-complete {
    margin-top: $space-4;
    padding: $space-3 $space-6;
    border: none;
    border-radius: $radius-sm;
    background: var(--color-secondary);
    color: var(--color-white);
    font-size: $text-sm;
    font-weight: $fw-bold;
    cursor: pointer;
    transition: $transition;
    font-family: $font-body;

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
    border-radius: $radius-lg;
    padding: $space-10;
    display: flex;
    align-items: center;
    gap: $space-8;
    box-shadow: var(--shadow-sm);

    @media (max-width: $bp-md) {
        flex-direction: column;
        text-align: center;
        padding: $space-8 $space-6;
    }

    &__icon {
        font-size: $space-16;
        flex-shrink: 0;
    }

    &__content {
        flex: 1;

        h3 {
            font-size: $text-2xl;
            font-weight: $fw-bold;
            margin: 0 0 $space-2;
            color: var(--color-primary);
            font-family: $font-title;
        }

        p {
            font-size: $text-base;
            color: var(--color-text);
            margin: 0;
            font-weight: $fw-light;
        }
    }
}

.btn-download {
    padding: 14px $space-8;
    border-radius: 10px;
    background: var(--color-secondary);
    color: var(--color-white);
    font-size: $text-base;
    font-weight: $fw-bold;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    transition: $transition;
    font-family: $font-body;

    &:hover {
        background: var(--color-secondary-dark);
        transform: translateY(-2px);
    }
}

// Sección bundle
.bundle-section {
    padding: 60px 0;

    h2 {
        font-size: $text-4xl;
        font-weight: $fw-bold;
        margin: 0 0 $space-4;
        color: var(--color-primary);
        font-family: $font-title;
    }
}

.bundle-note {
    font-size: $text-base;
    color: var(--color-text);
    margin: 0 0 $space-8;
    font-weight: $fw-light;
}

.bundle-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: $space-5;
}

.bundle-item {
    background: var(--color-white);
    border-radius: $radius-md;
    padding: $space-6;
    box-shadow: var(--shadow-sm);

    &__icon {
        font-size: $space-8;
        display: block;
        margin-bottom: $space-3;
    }

    h4 {
        font-size: $text-lg;
        font-weight: $fw-bold;
        margin: 0 0 $space-2;
        color: var(--color-primary);
        font-family: $font-body;
    }

    p {
        font-size: $text-sm;
        color: var(--color-text);
        margin: 0 0 $space-4;
        font-weight: $fw-light;
    }

    &__link {
        color: var(--color-secondary);
        font-weight: $fw-semibold;
        text-decoration: none;
        font-size: $text-sm;
        font-family: $font-body;

        &:hover {
            text-decoration: underline;
            color: var(--color-primary);
        }
    }
}

// Soporte
.support-section {
    padding: 60px 0 $space-20;
}

.support-card {
    background: var(--color-soft-alert);
    border-radius: $radius-lg;
    padding: $space-10;
    text-align: center;

    h3 {
        font-size: $text-2xl;
        font-weight: $fw-bold;
        margin: 0 0 $space-3;
        color: var(--color-primary);
        font-family: $font-title;
    }

    p {
        font-size: $text-base;
        color: var(--color-text);
        margin: 0 0 $space-6;
        font-weight: $fw-light;
    }
}

.btn-support {
    padding: $space-3 $space-8;
    border-radius: 10px;
    background: var(--color-white);
    color: var(--color-primary);
    font-size: $text-base;
    font-weight: $fw-bold;
    text-decoration: none;
    display: inline-block;
    border: 2px solid var(--color-primary);
    transition: $transition;
    font-family: $font-body;

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