<template>
    <div class="dashboard-layout">

        <!-- Backdrop (móvil) -->
        <div v-if="util_store.dashboard_sidebar_open"
            class="sidebar-backdrop"
            @click="util_store.close_dashboard_sidebar()" />

        <!-- Sidebar / Aside -->
        <aside class="dashboard-sidebar"
            :class="{ 'dashboard-sidebar--open': util_store.dashboard_sidebar_open }">

            <!-- Cerrar (solo móvil) -->
            <button class="sidebar-close" @click="util_store.close_dashboard_sidebar()" aria-label="Cerrar menú">
                ✕
            </button>

            <div class="user-profile">
                <div class="avatar">{{ initial }}</div>
                <h3>{{ auth_store.user_data?.user?.name }}</h3>
                <p class="email">{{ auth_store.user_data?.user?.email }}</p>
                <span v-if="auth_store.user_data?.user?.medical_record" class="hc-badge">
                    HC: {{ auth_store.user_data.user.medical_record }}
                </span>
            </div>

            <nav class="dashboard-nav">
                <button @click="set_view('courses')" :class="{ active: current_view === 'courses' }">
                    📚 Mis Cursos
                </button>
                <button @click="set_view('orders')" :class="{ active: current_view === 'orders' }">
                    🛍️ Mis Compras
                </button>
                <button v-if="is_patient" @click="set_view('tasks')"
                    :class="{ active: current_view === 'tasks' }">
                    📝 Tareas Terapéuticas
                </button>
                <button v-if="is_patient" @click="set_view('medical')"
                    :class="{ active: current_view === 'medical' }">
                    🏥 Historial Clínico
                </button>

                <div class="divider"></div>

                <RouterLink to="/terapias" class="nav-link" @click="util_store.close_dashboard_sidebar()">
                    📅 Agendar cita
                </RouterLink>
            </nav>
        </aside>

        <!-- Contenido principal -->
        <section class="dashboard-content">
            <UserCoursesComponent v-if="current_view === 'courses'" />
            <UserOrdersComponent v-else-if="current_view === 'orders'" />
            <UserTaskComponent v-else-if="current_view === 'tasks'" />
            <UserMedicalHistoryComponent v-else-if="current_view === 'medical'" />
        </section>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth-store.js'
import { useUtilStore } from '../../stores/util-store.js'
import UserCoursesComponent from './user/UserCoursesComponent.vue'
import UserOrdersComponent from './user/UserOrdersComponent.vue'
import UserMedicalHistoryComponent from './user/UserMedicalHistoryComponent.vue'
import UserTaskComponent from './user/UserTaskComponent.vue'

const auth_store = useAuthStore()
const util_store = useUtilStore()

const current_view = ref('courses')
const is_patient = computed(() => auth_store.user_data?.user?.role === 'patient')
const initial = computed(() => auth_store.user_data?.user?.name?.charAt(0)?.toUpperCase() || '?')

const set_view = (view) => {
    current_view.value = view
    util_store.close_dashboard_sidebar()
}
</script>

<style scoped lang="scss">
// ─── Layout ────────────────────────────────────────────────────────────────
.dashboard-layout {
    display: flex;
    min-height: 80vh;
}

// ─── Backdrop ──────────────────────────────────────────────────────────────
.sidebar-backdrop {
    display: none;

    @media (max-width: 768px) {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 95;
    }
}

// ─── Sidebar ───────────────────────────────────────────────────────────────
.dashboard-sidebar {
    width: 260px;
    background: var(--color-bg-card);
    padding: 2rem;
    border-right: 1px solid var(--color-border-light);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    @media (max-width: 768px) {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 100;
        padding-top: 1rem;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
        overflow-y: auto;

        &--open { transform: translateX(0); }
    }
}

// Botón cerrar (solo móvil)
.sidebar-close {
    display: none;
    align-self: flex-end;
    background: none;
    border: 1px solid var(--color-border-light);
    border-radius: 6px;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    font-size: 0.85rem;
    color: var(--color-text-muted);
    margin-bottom: 1.5rem;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;

    &:hover { color: var(--color-text); }

    @media (max-width: 768px) { display: flex; }
}

// ─── User profile ──────────────────────────────────────────────────────────
.user-profile {
    text-align: center;
    margin-bottom: 2rem;

    .avatar {
        width: 68px;
        height: 68px;
        background: var(--color-primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 auto 0.75rem;
    }

    h3   { font-size: 0.95rem; margin: 0 0 0.25rem; }
    .email { color: var(--color-text-muted); font-size: 0.8rem; margin: 0; }

    .hc-badge {
        display: inline-block;
        margin-top: 0.5rem;
        background: var(--color-border-light);
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.72rem;
    }
}

// ─── Nav ───────────────────────────────────────────────────────────────────
.dashboard-nav {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    button, .nav-link {
        text-align: left;
        background: none;
        border: none;
        padding: 0.7rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        color: var(--color-text-muted);
        font-size: 0.9rem;
        transition: all 0.2s;
        text-decoration: none;
        display: block;

        &:hover {
            background: var(--color-bg);
            color: var(--color-primary);
        }

        &.active {
            background: var(--overlay-primary-10);
            color: var(--color-primary);
            font-weight: 600;
        }
    }

    .divider {
        height: 1px;
        background: var(--color-border-light);
        margin: 0.75rem 0;
    }
}

// ─── Content ───────────────────────────────────────────────────────────────
.dashboard-content {
    flex: 1;
    padding: 3rem;
    min-width: 0;

    @media (max-width: 768px) {
        padding: 1.5rem 1rem 3rem;
    }
}
</style>
