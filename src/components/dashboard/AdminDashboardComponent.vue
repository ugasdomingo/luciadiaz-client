<script setup>
import { ref, watch, defineAsyncComponent, markRaw } from 'vue'
import { useAuthStore } from '../../stores/auth-store'
import { useUtilStore } from '../../stores/util-store'

const auth_store = useAuthStore()
const util_store = useUtilStore()

const show_component = ref('ManageUserComponent')
const display_component = ref(null)
const component_cache = ref({})

const nav_items = [
    { key: 'ManageUserComponent', label: 'Buscar usuarios' },
    { key: 'ManagePostComponent', label: 'Gestionar posts' },
    { key: 'ManageVideoComponent', label: 'Gestionar videos' },
    { key: 'ManageOrdersComponent', label: 'Gestionar pedidos' },
    { key: 'ManageProductComponent', label: 'Gestionar productos' },
    { key: 'ManageLikesComponent', label: 'Ver últimos likes' },
]

const load_component = async (component_name) => {
    if (component_cache.value[component_name]) {
        return component_cache.value[component_name]
    }
    try {
        const component = defineAsyncComponent(() => import(`./admin/${component_name}.vue`))
        component_cache.value[component_name] = markRaw(component)
        return component_cache.value[component_name]
    } catch (error) {
        console.error(error)
        return null
    }
}

watch(() => show_component.value, async (new_value) => {
    util_store.set_loading(true)
    try {
        display_component.value = await load_component(new_value)
    } catch (error) {
        console.error(error)
    } finally {
        util_store.set_loading(false)
    }
}, { immediate: true })

const set_view = (key) => {
    show_component.value = key
    util_store.close_dashboard_sidebar()
}
</script>

<template>
    <div class="dashboard-layout">

        <!-- Backdrop (móvil) -->
        <div v-if="util_store.dashboard_sidebar_open"
            class="sidebar-backdrop"
            @click="util_store.close_dashboard_sidebar()" />

        <!-- Sidebar -->
        <aside class="dashboard-sidebar"
            :class="{ 'dashboard-sidebar--open': util_store.dashboard_sidebar_open }">

            <button class="sidebar-close" @click="util_store.close_dashboard_sidebar()" aria-label="Cerrar menú">
                ✕
            </button>

            <div class="admin-profile">
                <div class="avatar">L</div>
                <h3>{{ auth_store.user_data?.user?.name }}</h3>
                <p class="role">Administradora</p>
            </div>

            <nav class="dashboard-nav">
                <button
                    v-for="item in nav_items"
                    :key="item.key"
                    @click="set_view(item.key)"
                    :class="{ active: show_component === item.key }">
                    {{ item.label }}
                </button>
            </nav>
        </aside>

        <!-- Contenido principal -->
        <section class="dashboard-content">
            <Suspense v-if="display_component">
                <template #default>
                    <component :is="display_component" />
                </template>
                <template #fallback>
                    <p>Cargando...</p>
                </template>
            </Suspense>
        </section>

    </div>
</template>

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

.admin-profile {
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

    h3 { font-size: $text-base; margin: 0 0 $space-1; }
    .role { color: var(--color-text-muted); font-size: $text-xs; margin: 0; }
}

.dashboard-nav {
    display: flex;
    flex-direction: column;
    gap: $space-1;

    button {
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
}

.dashboard-content {
    flex: 1;
    padding: $space-12;
    min-width: 0;

    @media (max-width: $bp-md) {
        padding: $space-6 $space-4 $space-12;
    }
}
</style>
