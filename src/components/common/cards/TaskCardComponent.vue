<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../../../stores/task-store'
import { useAuthStore } from '../../../stores/auth-store'

const props = defineProps({
    task: { type: Object, required: true },
    showCompleteButton: { type: Boolean, default: false }
})

const auth_store = useAuthStore()
const task_store = useTaskStore()

const show_observations = ref(false)

const status_label = { completed: 'Completada', cancelled: 'Cancelada', pending: 'Pendiente' }

const status_class = computed(() => props.task.status || 'pending')
const status_text  = computed(() => status_label[props.task.status] || 'Pendiente')
const has_observations = computed(() => !!props.task.observations?.trim())

const formatted_date = computed(() => {
    if (!props.task.createdAt) return ''
    return new Date(props.task.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric'
    })
})

const handle_complete = async () => {
    if (props.task.status === 'completed') return
    await task_store.complete_task(props.task._id)
    await auth_store.refresh()
}
</script>

<template>
    <article class="task-card" :class="`task-card--${status_class}`">
        <div class="task-card__top">
            <span class="task-card__badge" :class="`task-card__badge--${status_class}`">
                {{ status_text }}
            </span>
            <span class="task-card__date">{{ formatted_date }}</span>
        </div>

        <h3 class="task-card__title">{{ task.task }}</h3>

        <div class="task-card__footer">
            <button v-if="has_observations" class="task-card__obs-btn"
                @click="show_observations = !show_observations">
                {{ show_observations ? 'Ocultar' : 'Ver observaciones' }}
            </button>

            <button v-if="showCompleteButton && task.status === 'pending'"
                class="nobg-btn task-card__complete"
                @click="handle_complete">
                ✓ Completar
            </button>
        </div>

        <p v-if="show_observations && has_observations" class="task-card__observations">
            {{ task.observations }}
        </p>
    </article>
</template>

<style scoped lang="scss">
.task-card {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    background: var(--color-bg-card);
    border-radius: $radius-md;
    border: 1px solid var(--color-border);
    border-top: 3px solid var(--color-border);
    padding: $space-5;
    box-shadow: var(--shadow-sm);
    transition: box-shadow $transition-fast, transform $transition-fast;

    &:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
    }

    &--pending   { border-top-color: var(--color-secondary); }
    &--completed { border-top-color: var(--color-success); opacity: 0.85; }
    &--cancelled { border-top-color: var(--color-text-muted); opacity: 0.65; }

    &__top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: $space-2;
    }

    &__badge {
        padding: $space-1 $space-3;
        border-radius: $radius-full;
        font-size: $text-xs;
        font-weight: $fw-bold;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-family: $font-body;

        &--pending   { background: rgba(212,160,23,.12); color: var(--color-secondary-dark); }
        &--completed { background: rgba(16,185,129,.12); color: var(--color-success); }
        &--cancelled { background: var(--color-border-light); color: var(--color-text-muted); }
    }

    &__date {
        font-size: $text-xs;
        color: var(--color-text-muted);
        font-family: $font-body;
        white-space: nowrap;
    }

    &__title {
        margin: 0;
        font-size: $text-base;
        font-weight: $fw-semibold;
        color: var(--color-text);
        font-family: $font-body;
        line-height: 1.4;
        flex: 1;
    }

    &__footer {
        display: flex;
        align-items: center;
        gap: $space-3;
        flex-wrap: wrap;
        margin-top: auto;
        padding-top: $space-2;
        border-top: 1px solid var(--color-border-light);
    }

    &__obs-btn {
        background: none;
        border: none;
        font-size: $text-xs;
        color: var(--color-primary);
        cursor: pointer;
        font-family: $font-body;
        padding: 0;
        text-decoration: underline;
        text-underline-offset: 2px;

        &:hover { opacity: 0.7; }
    }

    &__complete {
        font-size: $text-xs;
        height: 28px;
        padding: 0 $space-3;
        margin-left: auto;
    }

    &__observations {
        margin: 0;
        font-size: $text-sm;
        color: var(--color-text-muted);
        line-height: 1.6;
        font-family: $font-body;
        background: var(--color-bg);
        border-radius: $radius-sm;
        padding: $space-3;
    }
}
</style>
