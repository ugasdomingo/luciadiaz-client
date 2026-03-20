<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../../../stores/task-store'
import { useAuthStore } from '../../../stores/auth-store'

const props = defineProps({
    task: {
        type: Object,
        required: true
    },
    showCompleteButton: {
        type: Boolean,
        default: false
    }
})

const auth_store = useAuthStore()
const task_store = useTaskStore()

const statusColor = computed(() => {
    switch (props.task.status) {
        case 'completed':
            return 'status-completed'
        case 'cancelled':
            return 'status-cancelled'
        case 'pending':
        default:
            return 'status-pending'
    }
})

const statusText = computed(() => {
    switch (props.task.status) {
        case 'completed':
            return 'Completada'
        case 'cancelled':
            return 'Cancelada'
        case 'pending':
        default:
            return 'Pendiente'
    }
})

const formattedDate = computed(() => {
    if (!props.task.createdAt) return ''
    const date = new Date(props.task.createdAt)
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
})

const handleComplete = async () => {
    if (props.task.status === 'completed') return
    await task_store.complete_task(props.task._id)
    await auth_store.refresh()
}
</script>

<template>
    <article class="task-card" :class="statusColor">
        <div class="task-card__header">
            <div class="task-card__status" :class="statusColor">
                {{ statusText }}
            </div>
            <div class="task-card__date">{{ formattedDate }}</div>
        </div>

        <div class="task-card__content">
            <h3 class="task-card__title">{{ task.task }}</h3>
            <p class="task-card__observations">{{ task.observations }}</p>
        </div>

        <div class="task-card__footer" v-if="showCompleteButton && task.status === 'pending'">
            <button class="task-card__button nobg-btn" @click="handleComplete">
                ✓ Marcar como completada
            </button>
        </div>
    </article>
</template>

<style scoped lang="scss">
.task-card {
    display: flex;
    flex-direction: column;
    background: var(--color-white);
    border-radius: $radius-md;
    padding: $space-6;
    margin-bottom: $space-4;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-left: 4px solid var(--color-primary);
    gap: $space-4;

    &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
    }

    &.status-completed {
        border-left-color: var(--color-success);
        opacity: 0.85;
    }

    &.status-cancelled {
        border-left-color: var(--color-text-muted);
        opacity: 0.7;
    }

    &.status-pending {
        border-left-color: var(--color-secondary);
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: $space-4;
    }

    &__status {
        display: inline-block;
        padding: $space-1 $space-3;
        border-radius: $radius-full;
        font-size: $text-xs;
        font-weight: $fw-bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-family: $font-body;

        &.status-pending {
            background: color-mix(in srgb, var(--color-warning) 15%, transparent);
            color: var(--color-warning);
        }

        &.status-completed {
            background: color-mix(in srgb, var(--color-success) 15%, transparent);
            color: var(--color-success);
        }

        &.status-cancelled {
            background: color-mix(in srgb, var(--color-text-muted) 15%, transparent);
            color: var(--color-text-muted);
        }
    }

    &__date {
        font-size: $text-sm;
        color: var(--color-text);
        opacity: 0.7;
        font-family: $font-body;
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: $space-3;
    }

    &__title {
        margin: 0;
        font-size: $text-lg;
        font-weight: $fw-semibold;
        color: var(--color-black);
        font-family: $font-title;
        line-height: 1.4;
    }

    &__observations {
        margin: 0;
        font-size: $text-base;
        line-height: 1.6;
        color: var(--color-text);
        font-family: $font-body;
    }

    &__footer {
        padding-top: $space-2;
        border-top: 1px solid var(--color-disable);
    }

    &__button {
        width: fit-content;
        padding: $space-3 $space-6;
        border: none;
        border-radius: $radius-sm;
        font-size: $text-base;
        font-weight: $fw-semibold;
        font-family: $font-body;
        cursor: pointer;
        transition: $transition-slow;
        box-shadow: var(--shadow-md);

        &:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-gold);
        }

        &:active {
            transform: translateY(0);
        }

        &:disabled {
            background: var(--color-disable);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
    }
}

@media screen and (max-width: $bp-md) {
    .task-card {
        padding: $space-5;

        &__title {
            font-size: $text-base;
        }

        &__button {
            font-size: $text-sm;
            padding: $space-3 $space-5;
        }
    }
}
</style>