<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProgressStore } from '../../stores/progress-store'
import { useProductStore } from '../../stores/product-store'
import { useUtilStore } from '../../stores/util-store'

const props = defineProps({
    product: { type: Object, required: true }
})

const progress_store = useProgressStore()
const product_store = useProductStore()
const util_store = useUtilStore()

const expanded_lesson = ref(null)
const loading = ref(false)
const downloading = ref(false)

const type_label = computed(() => {
    const types = { course: 'Curso Online', ebook: 'Guía Digital', bundle: 'Pack Completo', service: 'Servicio' }
    return types[props.product.type] || props.product.type
})

const has_curriculum = computed(() => props.product.curriculum?.length > 0)

const user_progress = computed(() => progress_store.current_progress)

const is_lesson_completed = (lessonId) => {
    return user_progress.value?.completed_lessons?.some(l => l.lesson_id === lessonId) || false
}

const toggle_lesson = (index) => {
    expanded_lesson.value = expanded_lesson.value === index ? null : index
}

const get_embed_url = (url) => {
    if (url.includes('vimeo.com')) {
        const id = url.split('/').pop().split('?')[0]
        return `https://player.vimeo.com/video/${id}`
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = url.includes('youtu.be')
            ? url.split('/').pop().split('?')[0]
            : new URL(url).searchParams.get('v')
        return `https://www.youtube.com/embed/${videoId}`
    }
    return url
}

const mark_as_completed = async (lessonId) => {
    loading.value = true
    const success = await progress_store.mark_as_completed(props.product._id, lessonId)
    if (success) util_store.set_message('¡Lección completada! 🎉', 'success')
    loading.value = false
}

const download_guide = async () => {
    downloading.value = true
    try {
        const data = await product_store.get_download_url(props.product.slug)
        window.open(data.download_url, '_blank')
    } catch {
        util_store.set_message('No se pudo obtener el enlace de descarga. Inténtalo de nuevo.', 'error')
    } finally {
        downloading.value = false
    }
}

onMounted(async () => {
    if (props.product.type === 'course') {
        await progress_store.get_progress(props.product._id)
        await progress_store.register_access(props.product._id)
    }
})
</script>

<template>
    <div class="product-private">

        <!-- Hero del producto -->
        <section class="product-hero">
            <div class="container">
                <div class="product-hero__inner">
                    <div class="product-hero__meta">
                        <span class="type-badge">{{ type_label }}</span>
                    </div>
                    <h1 class="product-hero__title">{{ product.title }}</h1>
                    <div class="product-hero__desc" v-html="product.description"></div>

                    <!-- Progreso (solo cursos) -->
                    <div v-if="product.type === 'course' && user_progress" class="progress-block">
                        <div class="progress-block__labels">
                            <span>Tu progreso</span>
                            <strong>{{ user_progress.percentage }}%</strong>
                        </div>
                        <div class="progress-block__track">
                            <div class="progress-block__fill" :style="{ width: `${user_progress.percentage}%` }"></div>
                        </div>
                    </div>

                    <!-- Descarga directa desde hero (ebook) -->
                    <div v-if="(product.type === 'ebook' || product.type === 'bundle') && (product.download_file?.public_id || product.download_url)" class="product-hero__download">
                        <button @click="download_guide" class="action-btn" :disabled="downloading">
                            {{ downloading ? 'Generando enlace...' : '⬇ Descargar PDF' }}
                        </button>
                        <span class="download-hint">Enlace seguro · expira en 5 min</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Curriculum del curso -->
        <section v-if="product.type === 'course' && has_curriculum" class="curriculum-section">
            <div class="container">
                <h2 class="section-title">Contenido del curso</h2>
                <p class="section-subtitle">{{ product.curriculum.length }} lecciones</p>

                <div class="curriculum">
                    <div
                        v-for="(lesson, index) in product.curriculum"
                        :key="lesson._id || index"
                        class="lesson"
                        :class="{ 'lesson--done': is_lesson_completed(lesson._id) }">

                        <div class="lesson__header" @click="toggle_lesson(index)">
                            <div class="lesson__num" :class="{ 'lesson__num--done': is_lesson_completed(lesson._id) }">
                                <span v-if="is_lesson_completed(lesson._id)">✓</span>
                                <span v-else>{{ index + 1 }}</span>
                            </div>
                            <h3 class="lesson__title">{{ lesson.title }}</h3>
                            <div class="lesson__right">
                                <span v-if="is_lesson_completed(lesson._id)" class="badge-done">Completado</span>
                                <span v-else class="badge-pending">Pendiente</span>
                                <span class="chevron" :class="{ 'chevron--open': expanded_lesson === index }">▾</span>
                            </div>
                        </div>

                        <div v-if="expanded_lesson === index" class="lesson__body">
                            <div v-if="lesson.video_url" class="lesson__video">
                                <iframe :src="get_embed_url(lesson.video_url)" frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen></iframe>
                            </div>
                            <div v-if="lesson.notes" class="lesson__notes">
                                <p>{{ lesson.notes }}</p>
                            </div>
                            <button v-if="!is_lesson_completed(lesson._id)" @click="mark_as_completed(lesson._id)"
                                class="action-btn" :disabled="loading">
                                {{ loading ? 'Guardando...' : '✓ Marcar como completada' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Bundle: lista de contenidos -->
        <section v-if="product.type === 'bundle' && has_curriculum" class="curriculum-section">
            <div class="container">
                <h2 class="section-title">Contenido del pack</h2>
                <div class="bundle-grid">
                    <div v-for="(item, index) in product.curriculum" :key="index" class="bundle-item">
                        <span class="bundle-item__icon">📦</span>
                        <div>
                            <h4>{{ item.title }}</h4>
                            <p v-if="item.notes">{{ item.notes }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Soporte -->
        <section class="support-section">
            <div class="container">
                <div class="support-card">
                    <div class="support-card__icon">💬</div>
                    <div>
                        <h3>¿Necesitas ayuda?</h3>
                        <p>Si tienes alguna duda con el contenido, escríbenos y te respondemos enseguida.</p>
                    </div>
                    <RouterLink to="/contacto" class="nobg-btn">Contactar soporte</RouterLink>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped lang="scss">
.product-private {
    min-height: 100vh;
    background: var(--color-bg);
    font-family: $font-body;
}

.container {
    max-width: $max-width;
    margin: 0 auto;
    padding: 0 $space-6;
}

/* ── HERO ─────────────────────────────────────── */
.product-hero {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-tertiary) 100%);
    padding: 120px 0 56px;   /* 120px arriba para limpiar el header fijo */
    color: #fff;

    @media (max-width: $bp-md) { padding: 100px 0 40px; }

    &__meta {
        margin-bottom: $space-4;
    }

    &__title {
        font-family: $font-title;
        font-size: clamp(2rem, 5vw, 3rem);
        font-weight: $fw-extrabold;
        color: #fff !important;   /* forzar blanco contra herencias globales */
        line-height: 1.15;
        margin: 0 0 $space-4;
    }

    &__desc {
        font-size: $text-lg;
        line-height: 1.65;
        color: rgba(255,255,255,0.88);
        max-width: 680px;
        margin: 0 0 $space-8;
        font-weight: $fw-light;
    }

    &__download {
        display: flex;
        align-items: center;
        gap: $space-4;
        flex-wrap: wrap;
    }
}

.type-badge {
    display: inline-block;
    padding: $space-1 $space-4;
    border-radius: $radius-full;
    background: rgba(255,255,255,0.18);
    font-size: $text-xs;
    font-weight: $fw-bold;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: #fff;
}

.download-hint {
    font-size: $text-xs;
    color: rgba(255,255,255,0.65);
}

/* ── PROGRESO ─────────────────────────────────── */
.progress-block {
    background: rgba(255,255,255,0.12);
    border-radius: $radius-md;
    padding: $space-4 $space-5;
    max-width: 520px;
    margin-bottom: $space-6;

    &__labels {
        display: flex;
        justify-content: space-between;
        font-size: $text-sm;
        color: rgba(255,255,255,0.9);
        margin-bottom: $space-2;
    }

    &__track {
        height: 8px;
        background: rgba(255,255,255,0.2);
        border-radius: $radius-xs;
        overflow: hidden;
    }

    &__fill {
        height: 100%;
        background: #fff;
        border-radius: $radius-xs;
        transition: width $transition-slow;
    }
}

/* ── CURRICULUM ───────────────────────────────── */
.curriculum-section {
    padding: $space-16 0;
}

.section-title {
    font-family: $font-title;
    font-size: $text-3xl;
    font-weight: $fw-bold;
    color: var(--color-primary);
    margin: 0 0 $space-1;
}

.section-subtitle {
    font-size: $text-sm;
    color: var(--color-text-muted);
    margin: 0 0 $space-8;
}

.curriculum {
    display: flex;
    flex-direction: column;
    gap: $space-3;
}

.lesson {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border-light);
    border-radius: $radius-md;
    overflow: hidden;
    transition: $transition-fast;

    &--done { border-left: 3px solid var(--color-success); }

    &:hover { box-shadow: var(--shadow-sm); }

    &__header {
        display: flex;
        align-items: center;
        gap: $space-4;
        padding: $space-4 $space-5;
        cursor: pointer;
        user-select: none;

        &:hover { background: var(--color-bg); }
    }

    &__num {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: $radius-full;
        background: var(--color-primary);
        color: #fff;
        font-size: $text-sm;
        font-weight: $fw-bold;
        flex-shrink: 0;

        &--done { background: var(--color-success); }
    }

    &__title {
        flex: 1;
        font-size: $text-base;
        font-weight: $fw-semibold;
        color: var(--color-text);
        margin: 0;
    }

    &__right {
        display: flex;
        align-items: center;
        gap: $space-3;
        flex-shrink: 0;
    }

    &__body {
        padding: $space-5;
        border-top: 1px solid var(--color-border-light);
        animation: fade-in 0.2s ease;
    }

    &__video {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        border-radius: $radius-sm;
        margin-bottom: $space-5;

        iframe {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
        }
    }

    &__notes {
        background: var(--color-bg);
        border-left: 3px solid var(--color-secondary);
        border-radius: $radius-sm;
        padding: $space-4;
        margin-bottom: $space-5;

        p {
            font-size: $text-sm;
            line-height: 1.65;
            color: var(--color-text);
            margin: 0;
        }
    }
}

.badge-done {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: var(--color-success);
    @media (max-width: $bp-sm) { display: none; }
}

.badge-pending {
    font-size: $text-xs;
    color: var(--color-text-muted);
    @media (max-width: $bp-sm) { display: none; }
}

.chevron {
    color: var(--color-text-muted);
    font-size: $text-sm;
    transition: transform $transition-fast;

    &--open { transform: rotate(180deg); }
}

/* ── BUNDLE ───────────────────────────────────── */
.bundle-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: $space-4;
    margin-top: $space-6;
}

.bundle-item {
    display: flex;
    gap: $space-4;
    align-items: flex-start;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border-light);
    border-radius: $radius-md;
    padding: $space-5;

    &__icon { font-size: $text-2xl; flex-shrink: 0; }

    h4 { font-size: $text-base; font-weight: $fw-semibold; color: var(--color-text); margin: 0 0 $space-1; }
    p  { font-size: $text-sm; color: var(--color-text-muted); margin: 0; }
}

/* ── SOPORTE ──────────────────────────────────── */
.support-section {
    padding: $space-10 0 $space-20;
}

.support-card {
    display: flex;
    align-items: center;
    gap: $space-6;
    background: var(--color-soft-alert);
    border-radius: $radius-lg;
    padding: $space-8 $space-10;
    flex-wrap: wrap;

    &__icon { font-size: $text-4xl; flex-shrink: 0; }

    div { flex: 1; min-width: 200px; }

    h3 {
        font-family: $font-title;
        font-size: $text-xl;
        font-weight: $fw-bold;
        color: var(--color-primary);
        margin: 0 0 $space-1;
    }

    p {
        font-size: $text-sm;
        color: var(--color-text);
        margin: 0;
    }

    @media (max-width: $bp-sm) { flex-direction: column; text-align: center; padding: $space-6; }
}

@keyframes fade-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
}
</style>
