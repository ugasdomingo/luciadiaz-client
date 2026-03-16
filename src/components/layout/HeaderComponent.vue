<script setup>
import { onMounted, ref } from 'vue';
import { useUtilStore } from '../../stores/util-store';
import { useAuthStore } from '../../stores/auth-store';
import NavbarComponent from './NavbarComponent.vue';

const util_store = useUtilStore()
const auth_store = useAuthStore()
const show_header = ref(true)
const need_bg = ref(false)
let last_scroll_position_y = 0

onMounted(() => {
    window.addEventListener('scroll', () => {
        if (window.scrollY > last_scroll_position_y) {
            show_header.value = false
        } else {
            show_header.value = true
        }

        last_scroll_position_y = window.scrollY

        if (last_scroll_position_y > 100) {
            need_bg.value = true
        } else {
            need_bg.value = false
        }
    })
})

</script>

<template>

    <header class="header" :class="{ 'header__hidden': !show_header, 'header__bg': need_bg }">
        <RouterLink to="/" class="header__logo">
            <img src="/logo-notextbg.png" alt="logo lucia">
        </RouterLink>
        <section class="header__menu">
            <RouterLink to="/terapias" class="action-btn" v-if="!util_store.is_home">
                <span class="btn-long">Agendar consulta terapéutica</span>
                <span class="btn-short">Agendar</span>
            </RouterLink>
            <button @click="auth_store.logout()" v-if="auth_store.token" class="logout-btn" title="Cerrar sesión">
                <span class="logout-long">Cerrar sesión</span>
                <span class="logout-short">✕</span>
            </button>
            <img src="/icon/icon-hamburguer-menu.svg" alt="menu" class="header__menu__icon"
                @click="util_store.toggle_navbar">
            <NavbarComponent :class="util_store.show_navbar ? 'header__navbar' : 'header__navbar__hidden'" />
        </section>
    </header>
</template>


<style scoped lang="scss">
.header {
    width: 100%;
    max-width: 1360px;
    max-height: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 4rem;
    margin: 0 auto;
    position: fixed;
    top: 0.5rem;
    left: 0;
    right: 0;
    z-index: 100;
    box-sizing: border-box;

    &__logo {
        img {
            width: 4rem;
            object-fit: contain;
        }
    }

    &__menu {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-shrink: 0;

        &__icon {
            width: 2rem;
            cursor: pointer;
            flex-shrink: 0;
        }

        .action-btn {
            white-space: nowrap;
        }
    }

    &__navbar {
        display: block;

        &__hidden {
            display: none;
        }
    }
}

// Botón "Agendar": texto largo en desktop, corto en móvil
.btn-long  { display: inline; }
.btn-short { display: none; }

// Botón logout
.logout-btn {
    background: none;
    border: 1px solid var(--color-border-light);
    border-radius: 6px;
    cursor: pointer;
    color: var(--color-text-muted);
    font-size: 0.82rem;
    padding: 0.35rem 0.75rem;
    white-space: nowrap;
    transition: color 0.2s, border-color 0.2s;
    flex-shrink: 0;

    &:hover { color: var(--color-error); border-color: var(--color-error); }
}
.logout-long  { display: inline; }
.logout-short { display: none; }

.header__hidden { display: none; }

.header__bg {
    background-color: var(--overlay-white-85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: var(--shadow-sm);
}

@media screen and (max-width: 720px) {
    .header { padding: 0.75rem 1rem; }

    // "Agendar consulta terapéutica" → "Agendar"
    .btn-long  { display: none; }
    .btn-short { display: inline; }
}

@media screen and (max-width: 480px) {
    // Logout: texto → icono ✕
    .logout-long  { display: none; }
    .logout-short { display: inline; }

    .logout-btn {
        padding: 0.35rem 0.5rem;
        font-size: 0.95rem;
    }
}
</style>