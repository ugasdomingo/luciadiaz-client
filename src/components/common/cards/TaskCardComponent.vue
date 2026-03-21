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
const status_mod   = { completed: 'completed', cancelled: 'cancelled', pending: 'pending' }

const status_class = computed(() => status_mod[props.task.status] || 'pending')
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
    <article class="task-row" :class="`task-row--${status_class}`">
        <div class="task-row__main">
            <span class="task-row__badge" :class="`task-row__badge--${status_class}`">
                {{ status_text }}
            </span>
            <span class="task-row__title">{{ task.task }}</span>
            <span class="task-row__date">{{ formatted_date }}</span>
        </div>

        <div class="task-row__sub">
            <button v-if="has_observations" class="task-row__obs-btn"
                @click="show_observations = !show_observations">
                {{ show_observations ? 'Ocultar' : 'Ver observaciones' }}
                <span class="task-row__chevron" :class="{ 'task-row__chevron--open': show_observations }">›</span>
            </button>

            <button v-if="showCompleteButton && task.status === 'pending'"
                class="nobg-btn task-row__complete-btn"
                @click="handle_complete">
                ✓ Completar
            </button>
        </div>

        <div v-if="show_observations && has_observations" class="task-row__observations">
            {{ task.observations }}
        </div>
    </article>
</template>

<style scoped lang="scss">
.task-row {
    border-left: 3px solid var(--color-border);
    border-bottom: 1px solid var(--color-border-light);
    padding: $space-3 $space-4;
    transition: background $transition-fast;

    &:last-child { border-bottom: none; }

    &:hover { background: var(--overlay-primary-06); }

    &--pending   { border-left-color: var(--color-secondary); }
    &--completed { border-left-color: var(--color-success); opacity: 0.8; }
    &--cancelled { border-left-color: var(--color-text-muted); opacity: 0.6; }

    &__main {
        display: flex;
        align-items: center;
        gap: $space-3;
        flex-wrap: wrap;
    }

    &__badge {
        flex-shrink: 0;
        padding: $space-1 $space-3;
        border-radius: $radius-full;
        font-size: $text-xs;
        font-weight: $fw-bold;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-family: $font-body;

        &--pending {
            background: rgba(245, 158, 11, 0.12);
            color: var(--color-warning);
        }
        &--completed {
            background: rgba(16, 185, 129, 0.12);
            color: var(--color-success);
        }
        &--cancelled {
            background: var(--color-border-light);
            color: var(--color-text-muted);
        }
    }

    &__title {
        flex: 1;
        font-size: $text-sm;
        font-weight: $fw-semibold;
        color: var(--color-text);
        font-family: $font-body;
        min-width: 0;
    }

    &__date {
        flex-shrink: 0;
        font-size: $text-xs;
        color: var(--color-text-muted);
        font-family: $font-body;
    }

    &__sub {
        display: flex;
        align-items: center;
        gap: $space-4;
        margin-top: $space-2;
        padding-left: calc($space-3 + 60px); // alinea con el título

        @media (max-width: $bp-md) {
            padding-left: 0;
        }
    }

    &__obs-btn {
        display: inline-flex;
        align-items: center;
        gap: $space-1;
        background: none;
        border: none;
        font-size: $text-xs;
        color: var(--color-primary);
        cursor: pointer;
        font-family: $font-body;
        padding: 0;
        transition: opacity $transition-fast;

        &:hover { opacity: 0.7; }
    }

    &__chevron {
        display: inline-block;
        font-size: $text-base;
        line-height: 1;
        transition: transform 0.2s ease;

        &--open { transform: rotate(90deg); }
    }

    &__complete-btn {
        font-size: $text-xs;
        height: 28px;
        padding: 0 $space-3;
    }

    &__observations {
        margin-top: $space-2;
        padding: $space-3 $space-4;
        background: var(--color-bg);
        border-radius: $radius-sm;
        font-size: $text-sm;
        color: var(--color-text-muted);
        line-height: 1.6;
        font-family: $font-body;
    }
}
</style>
