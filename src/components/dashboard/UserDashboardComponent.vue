<template>
    <div class="dashboard-layout">
        <aside class="dashboard-sidebar">
            <div class="user-profile">
                <div class="avatar-placeholder">
                    {{ auth_store.user_data?.user?.name?.charAt(0) }}
                </div>
                <h3>{{ auth_store.user_data?.user?.name }}</h3>
                <p class="email">{{ auth_store.user_data?.user?.email }}</p>
                <span v-if="auth_store.user_data?.user?.medical_record" class="hc-badge">
                    HC: {{ auth_store.user_data.user.medical_record }}
                </span>
            </div>

            <nav class="dashboard-nav">
                <button @click="current_view = 'courses'" :class="{ active: current_view === 'courses' }">
                    📚 Mis Cursos
                </button>

                <button @click="current_view = 'orders'" :class="{ active: current_view === 'orders' }">
                    🛍️ Mis Compras
                </button>

                <button v-if="is_patient" @click="current_view = 'tasks'" :class="{ active: current_view === 'tasks' }">
                    📝 Tareas Terapéuticas
                </button>

                <button v-if="is_patient" @click="current_view = 'medical'"
                    :class="{ active: current_view === 'medical' }">
                    🏥 Historial Clínico
                </button>

                <div class="divider"></div>

                <RouterLink to="/terapias" class="nav-link">
                    📅 Agendar cita
                </RouterLink>
            </nav>
        </aside>

        <section class="dashboard-content">
            <UserCoursesComponent v-if="current_view === 'courses'" />

            <div v-else-if="current_view === 'orders'">
                <h2>Historial de Pedidos</h2>
                <p>Próximamente verás aquí tus facturas y pedidos.</p>
            </div>

            <UserTaskComponent v-else-if="current_view === 'tasks'" />

            <UserMedicalHistoryComponent v-else-if="current_view === 'medical'"
                :history_number_to_show="auth_store.user_data?.history?.length || 0" />
        </section>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth-store.js'
import UserCoursesComponent from './user/UserCoursesComponent.vue'
import UserMedicalHistoryComponent from './user/UserMedicalHistoryComponent.vue'
import UserTaskComponent from './user/UserTaskComponent.vue'

const auth_store = useAuthStore()
const current_view = ref('courses')

const is_patient = computed(() => {
    return auth_store.user_data?.user?.role === 'patient'
})
</script>

<style scoped lang="scss">
.dashboard-layout {
    display: flex;
    min-height: 80vh;
    background: #f9f9f9;
}

.dashboard-sidebar {
    width: 280px;
    background: white;
    padding: 2rem;
    border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;

    @media(max-width: 768px) {
        display: none; // En móvil debería ser un menú hamburguesa o superior
    }
}

.user-profile {
    text-align: center;
    margin-bottom: 2rem;

    .avatar-placeholder {
        width: 80px;
        height: 80px;
        background: var(--primary-color);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin: 0 auto 1rem;
    }

    h3 {
        font-size: 1.1rem;
        margin: 0;
    }

    .email {
        color: #666;
        font-size: 0.9rem;
    }

    .hc-badge {
        display: inline-block;
        margin-top: 0.5rem;
        background: #eee;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
    }
}

.dashboard-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    button,
    .nav-link {
        text-align: left;
        background: none;
        border: none;
        padding: 0.8rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        color: #555;
        font-size: 1rem;
        transition: all 0.2s;
        text-decoration: none;

        &:hover {
            background: #f5f5f5;
            color: var(--primary-color);
        }

        &.active {
            background: rgba(var(--primary-rgb), 0.1);
            color: var(--primary-color);
            font-weight: 600;
        }
    }

    .divider {
        height: 1px;
        background: #eee;
        margin: 1rem 0;
    }
}

.dashboard-content {
    flex: 1;
    padding: 3rem;

    @media(max-width: 768px) {
        padding: 1.5rem;
    }
}
</style>