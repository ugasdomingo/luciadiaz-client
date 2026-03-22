<script setup>
import { useUtilStore } from '../../stores/util-store';
import { useAuthStore } from '../../stores/auth-store';

const util_store = useUtilStore()
const auth_store = useAuthStore()

const close = () => util_store.toggle_navbar()

const links = [
    {
        name: 'Mi espacio',
        path: '/mi-espacio'
    },
    {
        name: 'Terapias',
        path: '/terapias'
    },
    {
        name: 'Blog',
        path: '/blog'
    },
    {
        name: 'Formaciones',
        path: '/formaciones'
    },
    {
        name: 'Productos',
        path: '/productos'
    },
]
</script>

<template>
    <nav>
        <ul>
            <li v-for="link in links" :key="link.name">
                <RouterLink :to="link.path" @click="close">{{ link.name }}</RouterLink>
            </li>
        </ul>

        <div class="nav-actions">
            <RouterLink to="/terapias" class="nav-action nav-action--agendar" @click="close">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Agendar cita
            </RouterLink>

            <button v-if="auth_store.token" class="nav-action nav-action--logout" @click="() => { auth_store.logout(); close() }">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Cerrar sesión
            </button>
        </div>
    </nav>
</template>

<style scoped lang="scss">
nav {
    width: max-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
    position: fixed;
    top: 4.25rem;
    right: $space-8;
    z-index: 100;
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    border-radius: $radius-lg;

    ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        padding: $space-2 $space-4;
        margin: 0;
        gap: $space-4;

        li {
            padding: 0;
            margin: 0;

            &:first-child a {
                color: var(--color-soft-alert);
                text-decoration: underline;
            }

            a {
                display: inline-block;
                text-decoration: none;
                color: var(--color-white);
                padding: $space-2 $space-6;
                margin: 0;
                border-radius: $radius-lg;
                transition: $transition;

                &:hover {
                    scale: 1.15;
                    color: var(--color-secondary-light);
                }
            }
        }
    }
}

.nav-actions {
    display: flex;
    flex-direction: column;
    gap: $space-2;
    padding: $space-3 $space-4 $space-4;
    border-top: 1px solid rgba(255,255,255,0.15);
    margin-top: $space-2;
}

.nav-action {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-4;
    border-radius: $radius-md;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    cursor: pointer;
    transition: $transition-fast;
    text-decoration: none;
    width: 100%;
    box-sizing: border-box;

    svg { flex-shrink: 0; }

    &--agendar {
        background: var(--color-secondary);
        color: var(--color-white);
        border: none;
        justify-content: center;

        &:hover { background: var(--color-secondary-dark); }
    }

    &--logout {
        background: none;
        border: 1px solid rgba(255,255,255,0.3);
        color: rgba(255,255,255,0.8);
        justify-content: center;

        &:hover {
            border-color: rgba(255,255,255,0.6);
            color: var(--color-white);
        }
    }
}
</style>