<template>
    <main class="dashboard-page">
        <AdminDashboardComponent v-if="is_admin" />
        <UserDashboardComponent v-else />
    </main>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth-store'
import AdminDashboardComponent from '../components/dashboard/AdminDashboardComponent.vue'
import UserDashboardComponent from '../components/dashboard/UserDashboardComponent.vue'

const auth_store = useAuthStore()

// Computada segura para evitar errores si user_data es null al cargar
const is_admin = computed(() => {
    return auth_store.user_data?.user?.role === 'Admin'
})
</script>

<style scoped>
.dashboard-page {
    padding-top: 4rem;
    /* Espacio para navbar fija */
    min-height: 100vh;
}
</style>