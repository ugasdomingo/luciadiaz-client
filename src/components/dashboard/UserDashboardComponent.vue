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

                <button @click="set_view('likes')" :class="{ active: current_view === 'likes' }">
                    ♥ Mis Likes
                </button>
                <button @click="set_view('consent')"
                    :class="{ active: current_view === 'consent', 'nav-btn--alert': !consent_signed }">
                    📋 Consentimiento
                    <span v-if="!consent_signed" class="nav-dot" title="Pendiente de firmar"></span>
                </button>

                <div class="divider"></div>

                <RouterLink to="/terapias" class="nav-link" @click="util_store.close_dashboard_sidebar()">
                    📅 Agendar cita
                </RouterLink>
            </nav>

            <div class="sidebar-bottom">
                <button class="delete-account-btn" @click="show_delete_modal = true" title="Eliminar cuenta">
                    🗑
                </button>
                <button class="logout-btn" @click="auth_store.logout()" aria-label="Cerrar sesión" title="Cerrar sesión">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                </button>
            </div>
        </aside>

        <!-- Modal eliminar cuenta -->
        <Teleport to="body">
            <div v-if="show_delete_modal" class="delete-modal-overlay" @click.self="show_delete_modal = false">
                <div class="delete-modal">
                    <h2>¿Eliminar tu cuenta?</h2>
                    <p class="delete-modal__warning">Esta acción es <strong>permanente e irreversible</strong>.</p>
                    <p class="delete-modal__detail">
                        Se eliminarán todos tus datos asociados: compras, historial clínico,
                        tareas terapéuticas, progreso en cursos y likes.
                        No podrás recuperar esta información.
                    </p>
                    <div class="delete-modal__actions">
                        <button class="btn-cancel" @click="show_delete_modal = false">Cancelar</button>
                        <button class="btn-confirm-delete" @click="handle_delete">
                            He leído — quiero eliminar mi cuenta
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Contenido principal -->
        <section class="dashboard-content">
            <!-- Botón menú del sidebar (solo mobile) -->
            <button class="sidebar-menu-btn" @click="util_store.toggle_dashboard_sidebar()" aria-label="Abrir menú">
                ☰ Menú
            </button>

            <UserCoursesComponent v-if="current_view === 'courses'" />
            <UserOrdersComponent v-else-if="current_view === 'orders'" />
            <UserTaskComponent v-else-if="current_view === 'tasks'" />
            <UserMedicalHistoryComponent v-else-if="current_view === 'medical'" />
            <UserLikesComponent v-else-if="current_view === 'likes'" />
            <UserConsentComponent v-else-if="current_view === 'consent'" @navigate="set_view" />
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
import UserLikesComponent from './user/UserLikesComponent.vue'
import UserConsentComponent from './user/UserConsentComponent.vue'

const auth_store = useAuthStore()
const util_store = useUtilStore()

const current_view = ref('courses')
const show_delete_modal = ref(false)

const handle_delete = async () => {
    try {
        await auth_store.delete_account()
    } catch {
        show_delete_modal.value = false
    }
}
const is_patient = computed(() => auth_store.user_data?.user?.role === 'patient')
const initial = computed(() => auth_store.user_data?.user?.name?.charAt(0)?.toUpperCase() || '?')
const consent_signed = computed(() => !!auth_store.user_data?.user?.consent_signed)

const set_view = (view) => {
    current_view.value = view
    util_store.close_dashboard_sidebar()
}
</script>

<style scoped lang="scss">
.dashboard-layout {
    display: flex;
    min-height: 80vh;
}

.sidebar-backdrop {
    display: none;

    @media (max-width: $bp-md) {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 95;
    }
}

.dashboard-sidebar {
    width: $sidebar-width;
    background: var(--color-bg-card);
    padding: $space-8;
    border-right: 1px solid var(--color-border-light);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    @media (max-width: $bp-md) {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 100;
        padding-top: $space-4;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
        overflow-y: auto;

        &--open { transform: translateX(0); }
    }
}

.sidebar-close {
    display: none;
    align-self: flex-end;
    background: none;
    border: 1px solid var(--color-border-light);
    border-radius: $radius-sm;
    width: $space-8;
    height: $space-8;
    cursor: pointer;
    font-size: $text-sm;
    color: var(--color-text-muted);
    margin-bottom: $space-6;
    align-items: center;
    justify-content: center;
    transition: $transition-fast;

    &:hover { color: var(--color-text); }

    @media (max-width: $bp-md) { display: flex; }
}

.user-profile {
    text-align: center;
    margin-bottom: $space-8;

    .avatar {
        width: 68px;
        height: 68px;
        background: var(--color-primary);
        color: white;
        border-radius: $radius-full;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: $text-2xl;
        font-weight: $fw-bold;
        margin: 0 auto $space-3;
    }

    h3    { font-size: $text-base; margin: 0 0 $space-1; }
    .email { color: var(--color-text-muted); font-size: $text-xs; margin: 0; }

    .hc-badge {
        display: inline-block;
        margin-top: $space-2;
        background: var(--color-border-light);
        padding: $space-1 $space-2;
        border-radius: $radius-xs;
        font-size: $text-xs;
    }
}

.dashboard-nav {
    display: flex;
    flex-direction: column;
    gap: $space-1;

    button, .nav-link {
        text-align: left;
        background: none;
        border: none;
        padding: $space-3 $space-4;
        border-radius: $radius-sm;
        cursor: pointer;
        color: var(--color-text-muted);
        font-size: $text-sm;
        font-family: $font-body;
        transition: $transition-fast;
        text-decoration: none;
        display: block;

        &:hover {
            background: var(--color-bg);
            color: var(--color-primary);
        }

        &.active {
            background: var(--overlay-primary-10);
            color: var(--color-primary);
            font-weight: $fw-semibold;
        }
    }

    .divider {
        height: 1px;
        background: var(--color-border-light);
        margin: $space-3 0;
    }

    .nav-btn--alert {
        color: var(--color-secondary) !important;
    }
}

.nav-dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    background: var(--color-error);
    border-radius: $radius-full;
    margin-left: $space-2;
    vertical-align: middle;
    flex-shrink: 0;
}

.sidebar-menu-btn {
    display: none;
    align-items: center;
    gap: $space-2;
    background: none;
    border: 1px solid var(--color-border);
    border-radius: $radius-sm;
    padding: $space-2 $space-4;
    font-size: $text-sm;
    font-family: $font-body;
    color: var(--color-text-muted);
    cursor: pointer;
    margin-bottom: $space-4;
    transition: $transition-fast;

    &:hover { color: var(--color-text); border-color: var(--color-text-muted); }

    @media (max-width: $bp-md) { display: inline-flex; }
}

.dashboard-content {
    flex: 1;
    padding: $space-12;
    min-width: 0;

    @media (max-width: $bp-md) {
        padding: $space-6 $space-4 $space-12;
    }
}

.sidebar-bottom {
    margin-top: auto;
    padding-top: $space-6;
    display: flex;
    align-items: center;
    gap: $space-2;
}

.delete-account-btn {
    background: none;
    border: 1px solid transparent;
    border-radius: $radius-sm;
    padding: $space-2;
    cursor: pointer;
    font-size: $text-base;
    line-height: 1;
    color: var(--color-text-muted);
    transition: $transition-fast;

    &:hover {
        color: #dc2626;
        border-color: #dc2626;
        background: rgba(220, 38, 38, 0.06);
    }
}

.logout-btn {
    margin-left: auto;
    background: none;
    border: none;
    cursor: pointer;
    padding: $space-2;
    color: var(--color-text-muted);
    border-radius: $radius-sm;
    transition: $transition-fast;
    display: flex;
    align-items: center;

    &:hover { color: var(--color-error, #dc2626); }
}

// Modal eliminar cuenta
.delete-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $space-4;
}

.delete-modal {
    background: var(--color-bg-card);
    border-radius: $radius-lg;
    padding: $space-10;
    max-width: 480px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);

    h2 {
        font-size: $text-xl;
        margin: 0 0 $space-4;
        color: #dc2626;
    }

    &__warning {
        font-size: $text-base;
        margin: 0 0 $space-3;
        font-weight: $fw-semibold;
    }

    &__detail {
        font-size: $text-sm;
        color: var(--color-text-muted);
        margin: 0 0 $space-8;
        line-height: 1.6;
    }

    &__actions {
        display: flex;
        gap: $space-3;
        flex-wrap: wrap;

        @media (max-width: $bp-sm) { flex-direction: column-reverse; }
    }
}

.btn-cancel {
    flex: 1;
    padding: $space-3 $space-6;
    border: 1px solid var(--color-border);
    border-radius: $radius-sm;
    background: none;
    font-family: $font-body;
    font-size: $text-sm;
    cursor: pointer;
    color: var(--color-text-muted);
    transition: $transition-fast;

    &:hover { background: var(--color-bg); }
}

.btn-confirm-delete {
    flex: 2;
    padding: $space-3 $space-6;
    border: none;
    border-radius: $radius-sm;
    background: #dc2626;
    color: #fff;
    font-family: $font-body;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    cursor: pointer;
    transition: $transition-fast;

    &:hover { background: #b91c1c; }
}
</style>
