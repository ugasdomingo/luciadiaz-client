<script setup>
import { ref, computed, defineProps, onMounted } from 'vue'
import { useAuthStore } from '../../../stores/auth-store.js'
import TaskCardComponent from '../../common/cards/TaskCardComponent.vue'

const auth_store = useAuthStore()
const all_tasks = computed(() => auth_store.user_data.therapy_tasks)

</script>

<template>
    <section>
        <h2>Tareas pendientes</h2>
        <TaskCardComponent v-for="task in all_tasks" :key="task.id" :task="task" :show-complete-button="true" />
    </section>
</template>

<style scoped lang="scss"></style>