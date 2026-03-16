<template>
    <div class="dashboard-layout">

        <!-- Barra superior móvil (solo visible en móvil) -->
        <div class="mobile-bar">
            <div class="mobile-bar__left">
                <button class="mobile-bar__toggle" @click="sidebar_open = !sidebar_open" aria-label="Menú">
                    <span class="toggle-icon" :class="{ 'toggle-icon--open': sidebar_open }">
                        <span></span><span></span><span></span>
                    </span>
                </button>
                <span class="mobile-bar__title">{{ section_title }}</span>
            </div>
            <RouterLink to="/terapias" class="mobile-bar__cta">📅 Agendar</RouterLink>
        </div>

        <!-- Backdrop -->
        <div v-if="sidebar_open" class="sidebar-backdrop" @click="sidebar_open = false" />

        <!-- Sidebar -->
        <aside class="dashboard-sidebar" :class="{ 'dashboard-sidebar--open': sidebar_open }">

            <!-- Botón cerrar (solo móvil) -->
            <button class="sidebar-close" @click="sidebar_open = false" aria-label="Cerrar menú">✕</button>

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
                <button v-if="is_patient" @click="set_view('tasks')" :class="{ active: current_view === 'tasks' }">
                    📝 Tareas Terapéuticas
                </button>
                <button v-if="is_patient" @click="set_view('medical')" :class="{ active: current_view === 'medical' }">
                    🏥 Historial Clínico
                </button>

                <div class="divider"></div>

                <RouterLink to="/terapias" class="nav-link" @click="sidebar_open = false">
                    📅 Agendar cita
                </RouterLink>
            </nav>
        </aside>

        <!-- Contenido -->
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
import UserCoursesComponent from './user/UserCoursesComponent.vue'
import UserOrdersComponent from './user/UserOrdersComponent.vue'
import UserMedicalHistoryComponent from './user/UserMedicalHistoryComponent.vue'
import UserTaskComponent from './user/UserTaskComponent.vue'

const auth_store = useAuthStore()
const current_view = ref('courses')
const sidebar_open = ref(false)

const is_patient = computed(() => auth_store.user_data?.user?.role === 'patient')
const initial = computed(() => auth_store.user_data?.user?.name?.charAt(0)?.toUpperCase() || '?')

const section_labels = {
    courses: '📚 Mis Cursos',
    orders:  '🛍️ Mis Compras',
    tasks:   '📝 Tareas',
    medical: '🏥 Historial',
}
const section_title = computed(() => section_labels[current_view.value] || 'Mi Espacio')

const set_view = (view) => {
    current_view.value = view
    sidebar_open.value = false
}
</script>

<style scoped lang="scss">
// ─── Layout ────────────────────────────────────────────────────────────────
.dashboard-layout {
    display: flex;
    min-height: 80vh;
    background: var(--color-bg);
}

// ─── Mobile top bar ────────────────────────────────────────────────────────
.mobile-bar {
    display: none;
    position: fixed;
    top: 4rem;          // justo bajo el header global
    left: 0;
    right: 0;
    z-index: 90;
    height: 3rem;
    background: var(--color-bg-card);
    border-bottom: 1px solid var(--color-border-light);
    padding: 0 1rem;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;

    &__left {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-width: 0;
    }

    &__title {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--color-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__cta {
        white-space: nowrap;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--color-primary);
        background: var(--overlay-primary-10);
        border-radius: 6px;
        padding: 0.3rem 0.7rem;
        text-decoration: none;
        flex-shrink: 0;
    }

    @media (max-width: 768px) {
        display: flex;
    }
}

// Botón hamburguesa animado
.mobile-bar__toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.toggle-icon {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 20px;

    span {
        display: block;
        height: 2px;
        background: var(--color-text);
        border-radius: 2px;
        transition: all 0.25s ease;
        transform-origin: center;
    }

    &--open {
        span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
    }
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
    width: 280px;
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
        width: 280px;
        z-index: 100;
        padding-top: 1rem;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
        overflow-y: auto;

        &--open {
            transform: translateX(0);
        }
    }
}

.sidebar-close {
    display: none;
    align-self: flex-end;
    background: none;
    border: 1px solid var(--color-border-light);
    border-radius: 6px;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--color-text-muted);
    margin-bottom: 1rem;

    &:hover { color: var(--color-text); }

    @media (max-width: 768px) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

// ─── User profile ──────────────────────────────────────────────────────────
.user-profile {
    text-align: center;
    margin-bottom: 2rem;

    .avatar {
        width: 72px;
        height: 72px;
        background: var(--color-primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0 auto 0.75rem;
    }

    h3 { font-size: 1rem; margin: 0 0 0.25rem; }
    .email { color: var(--color-text-muted); font-size: 0.82rem; margin: 0; }

    .hc-badge {
        display: inline-block;
        margin-top: 0.5rem;
        background: var(--color-border-light);
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
    }
}

// ─── Nav ───────────────────────────────────────────────────────────────────
.dashboard-nav {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    button, .nav-link {
        text-align: left;
        background: none;
        border: none;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        color: var(--color-text-muted);
        font-size: 0.95rem;
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
        padding: 1rem 1rem 2rem;
        margin-top: 3rem; // altura de .mobile-bar
    }
}
</style>
