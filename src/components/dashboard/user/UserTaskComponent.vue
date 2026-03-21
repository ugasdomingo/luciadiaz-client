<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../../stores/auth-store.js'
import TaskCardComponent from '../../common/cards/TaskCardComponent.vue'

const auth_store = useAuthStore()

const all_tasks = computed(() => {
    const tasks = auth_store.user_data.therapy_tasks || []
    return [...tasks].sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1
        if (a.status !== 'pending' && b.status === 'pending') return 1
        return new Date(b.createdAt) - new Date(a.createdAt)
    })
})
</script>

<template>
    <section class="user-tasks">
        <h2>Tareas terapéuticas</h2>

        <div v-if="all_tasks.length > 0" class="tasks-list">
            <TaskCardComponent
                v-for="task in all_tasks"
                :key="task._id || task.id"
                :task="task"
                :show-complete-button="true" />
        </div>

        <p v-else class="empty-msg">No tienes tareas asignadas aún.</p>
    </section>
</template>

<style scoped lang="scss">
.user-tasks {
    display: flex;
    flex-direction: column;
    gap: $space-4;

    h2 { margin: 0; }
}

.tasks-list {
    border: 1px solid var(--color-border);
    border-radius: $radius-md;
    overflow: hidden;
}

.empty-msg {
    color: var(--color-text-muted);
    font-size: $text-sm;
    margin: 0;
}
</style>
