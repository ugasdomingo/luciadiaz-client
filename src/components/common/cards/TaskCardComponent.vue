<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../../../stores/task-store'

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
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-left: 4px solid var(--color-primary);
    gap: 1rem;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(107, 76, 147, 0.12);
    }

    &.status-completed {
        border-left-color: #4CAF50;
        opacity: 0.85;
    }

    &.status-cancelled {
        border-left-color: #9E9E9E;
        opacity: 0.7;
    }

    &.status-pending {
        border-left-color: var(--color-secondary);
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    &__status {
        display: inline-block;
        padding: 0.4rem 0.9rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-family: 'Text', sans-serif;

        &.status-pending {
            background: rgba(255, 152, 0, 0.15);
            color: #F57C00;
        }

        &.status-completed {
            background: rgba(76, 175, 80, 0.15);
            color: #388E3C;
        }

        &.status-cancelled {
            background: rgba(158, 158, 158, 0.15);
            color: #616161;
        }
    }

    &__date {
        font-size: 0.85rem;
        color: var(--color-text);
        opacity: 0.7;
        font-family: 'Text', sans-serif;
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    &__title {
        margin: 0;
        font-size: 1.15rem;
        font-weight: 600;
        color: var(--color-black);
        font-family: 'Title', serif;
        line-height: 1.4;
    }

    &__observations {
        margin: 0;
        font-size: 0.95rem;
        line-height: 1.6;
        color: var(--color-text);
        font-family: 'Text', sans-serif;
    }

    &__footer {
        padding-top: 0.5rem;
        border-top: 1px solid var(--color-disable);
    }

    &__button {
        width: fit-content;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-size: 0.95rem;
        font-weight: 600;
        font-family: 'Text', sans-serif;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(107, 76, 147, 0.2);

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(107, 76, 147, 0.3);
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

@media screen and (max-width: 768px) {
    .task-card {
        padding: 1.25rem;

        &__title {
            font-size: 1.05rem;
        }

        &__observations {
            font-size: 0.9rem;
        }

        &__button {
            font-size: 0.9rem;
            padding: 0.7rem 1.25rem;
        }
    }
}
</style>