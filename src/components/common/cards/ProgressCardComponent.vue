<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    progress: {
        type: Object,
        required: true
    }
})

const router = useRouter()

// Formatear fecha
const format_date = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('es-ES', options)
}

// Color de barra de progreso según porcentaje
const progress_color = computed(() => {
    const percentage = props.progress.overall_progress_percentage
    if (percentage >= 0 && percentage < 20) return 'var(--color-error)' // Rojo
    if (percentage >= 20 && percentage < 90) return 'var(--color-warning)' // Amarillo/Naranja
    return 'var(--color-success)' // Verde
})

// Ícono según tipo de formación
const type_config = computed(() => {
    const types = {
        'presencial': { label: 'Presencial', color: 'var(--color-success)' },
        'live': { label: 'En vivo', color: 'var(--color-error)' },
        'online': { label: 'Online', color: 'var(--color-primary-light)' }
    }
    return types[props.progress.product_id.type] || types.online
})

// Ir al dashboard del curso
const go_to_course = () => {
    router.push(`/productos/${props.progress.product_id.slug}`)
}
</script>

<template>
    <article class="course-card" @click="go_to_course">
        <!-- Imagen -->
        <div class="course-card__image-wrapper">
            <img :src="progress.product_id.cover_image?.secure_url || '/placeholder-product.jpg'" :alt="progress.product_id.title"
                class="course-card__image">

            <!-- Badge de tipo -->
            <span class="course-card__type" :style="{ backgroundColor: type_config.color }">
                {{ type_config.label }}
            </span>

            <!-- Badge de completado -->
            <div v-if="progress.overall_progress_percentage === 100" class="course-card__completed">
                <span>✓ Completado</span>
            </div>
        </div>

        <!-- Contenido -->
        <div class="course-card__content">
            <h3 class="course-card__title">{{ progress.product_id.title }}</h3>

            <!-- Barra de progreso -->
            <div class="course-card__progress">
                <div class="progress-info">
                    <span class="progress-label">Tu progreso</span>
                    <span class="progress-percentage">{{ progress.percentage }}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-bar__fill" :style="{
                        width: `${progress.percentage}%`,
                        backgroundColor: progress_color
                    }"></div>
                </div>
            </div>

            <!-- Última vez accedido -->
            <div class="course-card__meta">
                <span class="meta-item">
                    Último acceso: {{ format_date(progress.last_accessed) }}
                </span>
            </div>

            <!-- CTA -->
            <button class="course-card__cta">
                {{ progress.percentage === 100 ? 'Revisar curso' : 'Continuar aprendiendo' }}
            </button>
        </div>
    </article>
</template>

<style scoped lang="scss">
.course-card {
    display: grid;
    grid-template-columns: 1fr;
    background: var(--color-white);
    border-radius: $radius-lg;
    box-shadow: var(--shadow-sm);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-md);

        .course-card__image {
            transform: scale(1.05);
        }

        .course-card__cta {
            background: var(--color-primary);
            color: var(--color-white);
        }
    }

    &__image-wrapper {
        position: relative;
        width: 100%;
        height: 220px;
        overflow: hidden;
        background: var(--color-disable);
    }

    &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &__type {
        position: absolute;
        top: $space-4;
        right: $space-4;
        padding: $space-1 $space-3;
        border-radius: $radius-full;
        font-family: $font-body;
        font-size: $text-xs;
        font-weight: $fw-semibold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--color-white);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    &__completed {
        position: absolute;
        top: $space-4;
        left: $space-4;
        padding: $space-2 $space-4;
        background: rgba(90, 158, 125, 0.95);
        color: var(--color-white);
        border-radius: $radius-full;
        font-family: $font-body;
        font-size: $text-sm;
        font-weight: $fw-semibold;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: $space-1;
    }

    &__content {
        padding: $space-6;
        display: flex;
        flex-direction: column;
        gap: $space-4;
    }

    &__title {
        margin: 0;
        font-size: $text-2xl;
        line-height: 1.3;
        color: var(--color-black);
        font-family: $font-title;
        font-weight: $fw-semibold;
    }

    &__progress {
        display: flex;
        flex-direction: column;
        gap: $space-2;

        .progress-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: $font-body;
            font-size: $text-sm;

            .progress-label {
                color: var(--color-text-dark);
            }

            .progress-percentage {
                font-weight: $fw-semibold;
                color: var(--color-primary);
            }
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: var(--color-disable);
            border-radius: $radius-full;
            overflow: hidden;

            &__fill {
                height: 100%;
                border-radius: $radius-full;
                transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }
        }
    }

    &__meta {
        display: flex;
        flex-direction: column;
        gap: $space-1;
        font-family: $font-body;
        font-size: $text-sm;
        color: var(--color-text-dark);

        .meta-item {
            display: flex;
            align-items: center;
            gap: $space-1;
        }
    }

    &__cta {
        width: 100%;
        padding: $space-3 $space-6;
        border: 2px solid var(--color-primary);
        background: transparent;
        color: var(--color-primary);
        border-radius: $radius-sm;
        font-family: $font-body;
        font-size: $text-base;
        font-weight: $fw-semibold;
        cursor: pointer;
        transition: $transition-slow;
        margin-top: auto;

        &:hover {
            transform: translateY(-2px);
        }
    }
}

@media screen and (min-width: $bp-md) {
    .course-card {
        grid-template-columns: 280px 1fr;

        &__image-wrapper {
            height: 100%;
            min-height: 250px;
        }

        &__content {
            padding: $space-8;
        }
    }
}

@media screen and (max-width: $bp-md) {
    .course-card {
        &__title {
            font-size: $text-xl;
        }

        &__cta {
            font-size: $text-sm;
            padding: $space-3 $space-5;
        }
    }
}
</style>