<template>
    <div class="dashboard-layout">

        <!-- Backdrop móvil -->
        <div v-if="util_store.dashboard_sidebar_open"
            class="sidebar-backdrop"
            @click="util_store.close_dashboard_sidebar()" />

        <!-- Sidebar -->
        <aside class="dashboard-sidebar"
            :class="{ 'dashboard-sidebar--open': util_store.dashboard_sidebar_open }">

            <div class="sidebar__gold-line" />
            <div class="sidebar__deco" />

            <!-- Cerrar en móvil -->
            <button class="sidebar-close" @click="util_store.close_dashboard_sidebar()" aria-label="Cerrar menú">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
            </button>

            <!-- Perfil -->
            <div class="sidebar__profile">
                <div class="sidebar__avatar">{{ initial }}</div>
                <h3 class="sidebar__name">{{ auth_store.user_data?.user?.name }}</h3>
                <p class="sidebar__email">{{ auth_store.user_data?.user?.email }}</p>
                <span v-if="auth_store.user_data?.user?.medical_record" class="sidebar__hc-badge">
                    HC: {{ auth_store.user_data.user.medical_record }}
                </span>
            </div>

            <!-- Navegación -->
            <nav class="sidebar__nav">
                <button v-if="show_onboarding" @click="set_view('onboarding')" :class="['sidebar__nav-item', { active: current_view === 'onboarding' }]">
                    <svg class="nav-icon" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.3 5.2 16.9l.9-5.4L2.2 7.7l5.4-.8L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                    <span>Primeros pasos</span>
                    <span class="nav-dot" />
                </button>

                <button @click="set_view('courses')" :class="['sidebar__nav-item', { active: current_view === 'courses' }]">
                    <svg class="nav-icon" viewBox="0 0 20 20" fill="none"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" stroke="currentColor" stroke-width="1.5"/><path d="M8 15a2 2 0 002 2h5a2 2 0 002-2v-4a2 2 0 00-2-2h-1" stroke="currentColor" stroke-width="1.5"/></svg>
                    <span>Mis Cursos</span>
                </button>

                <button @click="set_view('tests')" :class="['sidebar__nav-item', { active: current_view === 'tests' }]">
                    <svg class="nav-icon" viewBox="0 0 20 20" fill="none"><rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    <span>Resultados de Tests</span>
                </button>

                <button @click="set_view('orders')" :class="['sidebar__nav-item', { active: current_view === 'orders' }]">
                    <svg class="nav-icon" viewBox="0 0 20 20" fill="none"><path d="M6 2L3 6v11a2 2 0 002 2h10a2 2 0 002-2V6l-3-4H6z" stroke="currentColor" stroke-width="1.5"/><path d="M3 6h14" stroke="currentColor" stroke-width="1.5"/><path d="M13 10a3 3 0 11-6 0" stroke="currentColor" stroke-width="1.5"/></svg>
                    <span>Mis Compras</span>
                </button>

                <button v-if="is_patient" @click="set_view('tasks')" :class="['sidebar__nav-item', { active: current_view === 'tasks' }]">
                    <svg class="nav-icon" viewBox="0 0 20 20" fill="none"><path d="M9 11l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/></svg>
                    <span>Tareas Terapéuticas</span>
                </button>

                <button v-if="is_patient" @click="set_view('medical')" :class="['sidebar__nav-item', { active: current_view === 'medical' }]">
                    <svg class="nav-icon" viewBox="0 0 20 20" fill="none"><path d="M10 3v14M3 10h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.5"/></svg>
                    <span>Historial Clínico</span>
                </button>

                <button @click="set_view('likes')" :class="['sidebar__nav-item', { active: current_view === 'likes' }]">
                    <svg class="nav-icon" viewBox="0 0 20 20" fill="none"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                    <span>Mis Likes</span>
                </button>

                <button @click="set_view('consent')" :class="['sidebar__nav-item', { active: current_view === 'consent', 'sidebar__nav-item--alert': !consent_signed }]">
                    <svg class="nav-icon" viewBox="0 0 20 20" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 4h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" stroke-width="1.5"/></svg>
                    <span>Consentimiento</span>
                    <span v-if="!consent_signed" class="nav-dot" />
                </button>

                <div class="sidebar__divider" />

                <RouterLink to="/terapias" class="sidebar__nav-item sidebar__nav-item--link" @click="util_store.close_dashboard_sidebar()">
                    <svg class="nav-icon" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M14 2v4M6 2v4M2 9h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    <span>Agendar cita</span>
                </RouterLink>
            </nav>

            <div class="sidebar__bottom">
                <button class="sidebar__delete-btn" @click="show_delete_modal = true" title="Eliminar cuenta">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                </button>
                <span class="sidebar__bottom-label">Eliminar cuenta</span>
                <button class="sidebar__logout-btn" @click="auth_store.logout()" aria-label="Cerrar sesión" title="Cerrar sesión">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span>Salir</span>
                </button>
            </div>
        </aside>

        <!-- Modal eliminar cuenta -->
        <Teleport to="body">
            <div v-if="show_delete_modal" class="delete-overlay" @click.self="close_delete_modal">
                <div class="delete-modal">
                    <div class="delete-modal__icon">🗑</div>
                    <h2>¿Eliminar tu cuenta?</h2>
                    <p class="delete-modal__warning">Esta acción es <strong>permanente e irreversible</strong>.</p>
                    <p class="delete-modal__detail">
                        Se eliminarán todos tus datos: compras, historial clínico,
                        tareas terapéuticas, progreso en cursos y likes.
                    </p>
                    <label class="delete-modal__confirm-label" for="delete-confirmation">
                        Escribe ELIMINAR para confirmar
                    </label>
                    <input
                        id="delete-confirmation"
                        v-model="delete_confirmation"
                        class="delete-modal__confirm-input"
                        autocomplete="off"
                    />
                    <div class="delete-modal__actions">
                        <button class="delete-modal__cancel" @click="close_delete_modal">Cancelar</button>
                        <button
                            class="delete-modal__confirm"
                            @click="handle_delete"
                            :disabled="delete_confirmation !== 'ELIMINAR'"
                        >
                            Eliminar mi cuenta
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Contenido principal -->
        <section class="dashboard-content">
            <button class="mobile-menu-btn" @click="util_store.toggle_dashboard_sidebar()" aria-label="Abrir menú">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                Menú
            </button>

            <Transition name="fade-view" mode="out-in">
                <UserOnboardingComponent v-if="current_view === 'onboarding'" key="onboarding" @navigate="set_view" />
                <UserCoursesComponent v-else-if="current_view === 'courses'" key="courses" />
                <UserTestResultsComponent v-else-if="current_view === 'tests'" key="tests" />
                <UserOrdersComponent v-else-if="current_view === 'orders'" key="orders" />
                <UserTaskComponent v-else-if="current_view === 'tasks'" key="tasks" />
                <UserMedicalHistoryComponent v-else-if="current_view === 'medical'" key="medical" />
                <UserLikesComponent v-else-if="current_view === 'likes'" key="likes" />
                <UserConsentComponent v-else-if="current_view === 'consent'" key="consent" @navigate="set_view" />
            </Transition>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../../stores/auth-store.js'
import { useUtilStore } from '../../stores/util-store.js'
import UserCoursesComponent from './user/UserCoursesComponent.vue'
import UserOrdersComponent from './user/UserOrdersComponent.vue'
import UserMedicalHistoryComponent from './user/UserMedicalHistoryComponent.vue'
import UserTaskComponent from './user/UserTaskComponent.vue'
import UserLikesComponent from './user/UserLikesComponent.vue'
import UserConsentComponent from './user/UserConsentComponent.vue'
import UserTestResultsComponent from './user/UserTestResultsComponent.vue'
import UserOnboardingComponent from './user/UserOnboardingComponent.vue'

const auth_store = useAuthStore()
const util_store = useUtilStore()

const show_delete_modal = ref(false)
const delete_confirmation = ref('')

const handle_delete = async () => {
    if (delete_confirmation.value !== 'ELIMINAR') return
    try {
        await auth_store.delete_account()
    } catch {
        show_delete_modal.value = false
    } finally {
        delete_confirmation.value = ''
    }
}

const close_delete_modal = () => {
    show_delete_modal.value = false
    delete_confirmation.value = ''
}

const is_patient = computed(() => auth_store.user_data?.user?.role === 'patient')
const initial = computed(() => auth_store.user_data?.user?.name?.charAt(0)?.toUpperCase() || '?')
const consent_signed = computed(() => !!auth_store.user_data?.user?.consent_signed)

// ── Estado de onboarding (solo pacientes) ──────────────────────────────
const history_done = computed(() => (auth_store.user_data?.history?.length || 0) >= 13)
const completed_test_names = computed(() => (auth_store.user_data?.test_results || []).map(t => t.test_name))
const tests_done = computed(() =>
    ['Arquetipo', 'Temperamento', 'Carta del Inconsciente'].every(n => completed_test_names.value.includes(n))
)
const onboarding_complete = computed(() => consent_signed.value && history_done.value && tests_done.value)
const show_onboarding = computed(() => is_patient.value && !onboarding_complete.value)

// Vista por defecto: onboarding si el paciente aún tiene pasos pendientes
const current_view = ref(show_onboarding.value ? 'onboarding' : 'courses')
const has_interacted = ref(false)

const set_view = (view) => {
    has_interacted.value = true
    current_view.value = view
    util_store.close_dashboard_sidebar()
}

// Si los datos del usuario llegan después de montar, recalculamos la vista
// por defecto (solo mientras el usuario no haya navegado manualmente)
watch(() => auth_store.user_data, () => {
    if (!has_interacted.value) {
        current_view.value = show_onboarding.value ? 'onboarding' : 'courses'
    }
})

// Si el paciente completa el onboarding mientras lo ve, lo sacamos a cursos
watch(show_onboarding, (visible) => {
    if (!visible && current_view.value === 'onboarding') {
        current_view.value = 'courses'
    }
})
</script>

<style scoped lang="scss">
.dashboard-layout {
    display: flex;
    min-height: calc(100vh - var(--header-h, 80px));
}

/* ── Backdrop móvil ── */
.sidebar-backdrop {
    display: none;
    @media (max-width: $bp-md) {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.55);
        z-index: 95;
    }
}

/* ══════════════════════════════
   SIDEBAR
══════════════════════════════ */
.dashboard-sidebar {
    width: 272px;
    background: var(--blue-ink);
    padding: 36px 20px 28px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;

    @media (max-width: $bp-md) {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 100;
        width: 290px;
        padding-top: 20px;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(.4,0,.2,1);
        box-shadow: 8px 0 40px rgba(0,0,0,0.4);
        overflow-y: auto;
        &--open { transform: translateX(0); }
    }
}

.sidebar__gold-line {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--gold-grad);
}

.sidebar__deco {
    position: absolute;
    top: -120px; right: -120px;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(245,197,24,0.08), transparent 70%);
    pointer-events: none;
}

/* Cerrar (móvil) */
.sidebar-close {
    display: none;
    align-self: flex-end;
    background: rgba(255,255,255,0.08);
    border: none;
    border-radius: $radius-sm;
    width: 32px; height: 32px;
    cursor: pointer;
    color: rgba(255,255,255,0.65);
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    margin-bottom: 20px;
    flex-shrink: 0;
    &:hover { background: rgba(255,255,255,0.14); color: white; }
    @media (max-width: $bp-md) { display: flex; }
}

/* Perfil */
.sidebar__profile {
    text-align: center;
    margin-bottom: 32px;
    position: relative;
    z-index: 1;
}

.sidebar__avatar {
    width: 72px; height: 72px;
    background: var(--blue-bright);
    color: white;
    border-radius: $radius-full;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: $fw-bold;
    font-family: var(--font-title);
    margin: 0 auto 14px;
    border: 2.5px solid rgba(245,197,24,0.5);
    box-shadow: 0 0 0 4px rgba(245,197,24,0.1);
}

.sidebar__name {
    font-family: var(--font-title);
    font-size: 17px;
    font-weight: 700;
    color: var(--white);
    margin: 0 0 4px;
}

.sidebar__email {
    font-size: 11.5px;
    color: rgba(255,255,255,0.5);
    margin: 0 0 10px;
    font-family: var(--font-body);
    word-break: break-all;
}

.sidebar__hc-badge {
    display: inline-block;
    background: rgba(245,197,24,0.15);
    border: 1px solid rgba(245,197,24,0.3);
    color: var(--gold-light);
    padding: 3px 10px;
    border-radius: $radius-full;
    font-size: 11px;
    font-weight: $fw-semibold;
    font-family: var(--font-body);
    letter-spacing: 0.04em;
}

/* Navegación */
.sidebar__nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    position: relative;
    z-index: 1;
}

.sidebar__nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: left;
    background: none;
    border: none;
    padding: 11px 14px;
    border-radius: $radius-md;
    cursor: pointer;
    color: rgba(255,255,255,0.6);
    font-size: 13px;
    font-family: var(--font-body);
    font-weight: $fw-regular;
    transition: background 0.18s, color 0.18s;
    text-decoration: none;
    line-height: 1;
    position: relative;

    &:hover {
        background: rgba(255,255,255,0.06);
        color: var(--gold-light);
        .nav-icon { stroke: var(--gold-light); }
    }

    &.active {
        background: rgba(245,197,24,0.12);
        color: var(--gold-light);
        font-weight: $fw-semibold;
        .nav-icon { stroke: var(--gold-light); }
    }

    &--alert {
        color: rgba(245,197,24,0.8) !important;
    }

    &--link {
        display: flex;
        text-decoration: none;
    }
}

.nav-icon {
    width: 16px; height: 16px;
    stroke: rgba(255,255,255,0.5);
    flex-shrink: 0;
    transition: stroke 0.18s;
}

.nav-dot {
    width: 7px; height: 7px;
    background: var(--color-error);
    border-radius: $radius-full;
    margin-left: auto;
    flex-shrink: 0;
}

.sidebar__divider {
    height: 1px;
    background: rgba(255,255,255,0.08);
    margin: 8px 0;
}

/* Bottom */
.sidebar__bottom {
    margin-top: auto;
    padding-top: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    z-index: 1;
}

.sidebar__bottom-label {
    font-size: 11px;
    color: rgba(255,255,255,0.3);
    font-family: var(--font-body);
}

.sidebar__delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(255,255,255,0.3);
    padding: 6px;
    border-radius: $radius-sm;
    display: flex;
    align-items: center;
    transition: color 0.18s, background 0.18s;
    flex-shrink: 0;
    &:hover { color: #ef4444; background: rgba(239,68,68,0.1); }
}

.sidebar__logout-btn {
    margin-left: auto;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    cursor: pointer;
    color: rgba(255,255,255,0.6);
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    font-size: 12px;
    font-family: var(--font-body);
    font-weight: $fw-medium;
    transition: color 0.18s, background 0.18s, border-color 0.18s;
    &:hover { color: white; background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.2); }
}

/* ══════════════════════════════
   CONTENIDO PRINCIPAL
══════════════════════════════ */
.dashboard-content {
    flex: 1;
    padding: 48px;
    min-width: 0;
    background: var(--color-bg);

    @media (max-width: $bp-lg) { padding: 36px 28px; }
    @media (max-width: $bp-md) { padding: 24px 16px 80px; }
}

.mobile-menu-btn {
    display: none;
    align-items: center;
    gap: 8px;
    background: white;
    border: 1px solid var(--color-border);
    border-radius: $radius-md;
    padding: 9px 16px;
    font-size: 13px;
    font-family: var(--font-body);
    font-weight: $fw-medium;
    color: var(--color-text-muted);
    cursor: pointer;
    margin-bottom: 28px;
    transition: border-color 0.18s, color 0.18s;
    box-shadow: var(--shadow-xs);
    &:hover { color: var(--blue-ink); border-color: var(--color-primary); }
    @media (max-width: $bp-md) { display: inline-flex; }
}

/* Transición entre vistas */
.fade-view-enter-active, .fade-view-leave-active {
    transition: opacity 0.2s var(--ease), transform 0.2s var(--ease);
}
.fade-view-enter-from { opacity: 0; transform: translateY(8px); }
.fade-view-leave-to  { opacity: 0; transform: translateY(-6px); }

/* ══════════════════════════════
   MODAL ELIMINAR CUENTA
══════════════════════════════ */
.delete-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.65);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.delete-modal {
    background: var(--white);
    border-radius: var(--r-xl);
    padding: 40px;
    max-width: 460px;
    width: 100%;
    box-shadow: var(--shadow-lg-new);
    text-align: center;

    &__icon { font-size: 36px; margin-bottom: 16px; }

    h2 {
        font-family: var(--font-title);
        font-size: 22px;
        color: #dc2626;
        margin: 0 0 12px;
    }

    &__warning {
        font-size: 15px;
        color: var(--color-text);
        margin: 0 0 10px;
    }

    &__detail {
        font-size: 14px;
        color: var(--color-text-muted);
        line-height: 1.6;
        margin: 0 0 20px;
    }

    &__confirm-label {
        display: block;
        text-align: left;
        font-size: 12px;
        font-weight: $fw-semibold;
        color: var(--color-text);
        margin: 0 0 8px;
    }

    &__confirm-input {
        width: 100%;
        border: 1.5px solid var(--color-border);
        border-radius: $radius-md;
        padding: 12px 14px;
        margin-bottom: 24px;
        font-family: var(--font-body);
        font-size: 14px;
        box-sizing: border-box;

        &:focus {
            outline: none;
            border-color: #dc2626;
        }
    }

    &__actions {
        display: flex;
        gap: 12px;
        @media (max-width: $bp-sm) { flex-direction: column-reverse; }
    }

    &__cancel {
        flex: 1;
        padding: 12px;
        border: 1.5px solid var(--color-border);
        border-radius: $radius-md;
        background: none;
        font-family: var(--font-body);
        font-size: 14px;
        cursor: pointer;
        color: var(--color-text-muted);
        transition: background 0.18s;
        &:hover { background: var(--color-bg); }
    }

    &__confirm {
        flex: 2;
        padding: 12px;
        border: none;
        border-radius: $radius-md;
        background: #dc2626;
        color: white;
        font-family: var(--font-body);
        font-size: 14px;
        font-weight: $fw-semibold;
        cursor: pointer;
        transition: background 0.18s;
        &:hover { background: #b91c1c; }
        &:disabled { opacity: 0.45; cursor: not-allowed; background: #dc2626; }
    }
}
</style>
