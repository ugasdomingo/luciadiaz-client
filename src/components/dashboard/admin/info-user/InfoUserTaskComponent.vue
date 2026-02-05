<script setup>
import { computed, ref } from 'vue';
import { useAdminStore } from '../../../../stores/admin-store';
import { useTaskStore } from '../../../../stores/task-store';
import TaskCardComponent from '../../../common/cards/TaskCardComponent.vue';

const task_store = useTaskStore()
const admin_store = useAdminStore()
const user_tasks = computed(() => admin_store.user?.therapy_tasks)
const new_task = ref('')
const new_observations = ref('')
const create_new_task = ref(false)

const create_task = async () => {
    await task_store.create_task(new_task.value, admin_store.user.user._id, new_observations.value)
    await admin_store.get_user_by_id(admin_store.user.user._id)
    create_new_task.value = false
    new_task.value = ''
    new_observations.value = ''
}

</script>

<template>
    <button class="nobg-btn" @click="create_new_task = !create_new_task">{{ create_new_task ? 'Cancelar' : 'Crear tarea'
    }}</button>

    <form class="new-task-container" v-if="create_new_task" @submit.prevent="create_task">
        <input class="input" type="text" placeholder="Nombre de la tarea" v-model="new_task">
        <input class="input" type="text" placeholder="Observaciones" v-model="new_observations">
        <button class="action-btn" type="submit">Crear</button>
    </form>

    <div>
        <h2>Tareas</h2>
        <TaskCardComponent v-for="task in user_tasks" :key="task._id" :task="task" :showCompleteButton="false" />
    </div>
</template>

<style scoped lang="scss">
.new-task-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;

    button {
        width: fit-content;
    }
}
</style>