<script setup>
import { onMounted, ref } from 'vue'
import { useUtilStore } from '../../stores/util-store'
import { useAuthStore } from '../../stores/auth-store'
import NavbarComponent from './NavbarComponent.vue'

const util_store = useUtilStore()
const auth_store = useAuthStore()

const show_header = ref(true)
const need_bg = ref(false)
let last_scroll_y = 0

const on_hamburger_click = () => {
    util_store.toggle_navbar()
}

onMounted(() => {
    window.addEventListener('scroll', () => {
        show_header.value = window.scrollY <= last_scroll_y
        need_bg.value = window.scrollY > 100
        last_scroll_y = window.scrollY
    })
})
</script>

<template>
    <header class="header" :class="{ 'header--hidden': !show_header, 'header--bg': need_bg }">

        <RouterLink to="/" class="header__logo">
            <img src="/logo-notextbg.png" alt="logo lucia">
        </RouterLink>

        <div class="header__menu">
            <!-- Agendar: solo fuera de home -->
            <RouterLink v-if="!util_store.is_home" to="/terapias" class="action-btn header__agendar">
                <span class="text--long">Agendar consulta terapéutica</span>
                <span class="text--short">Agendar</span>
            </RouterLink>

            <!-- Cerrar sesión: solo si hay token -->
            <button v-if="auth_store.token" @click="auth_store.logout()" class="logout-btn" title="Cerrar sesión">
                <span class="text--long">Cerrar sesión</span>
                <span class="text--short">✕</span>
            </button>

            <!-- Hamburguesa: abre navbar global -->
            <button class="hamburger" @click="on_hamburger_click" aria-label="Menú">
                <span class="hamburger__line"
                    :class="{ 'hamburger__line--open': util_store.show_navbar }">
                    <span></span><span></span><span></span>
                </span>
            </button>

            <!-- Navbar global -->
            <NavbarComponent :class="util_store.show_navbar ? 'navbar--visible' : 'navbar--hidden'" />
        </div>

    </header>
</template>

<style scoped lang="scss">
.header {
    width: 100%;
    max-width: 1360px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-3 $space-16;
    margin: 0 auto;
    position: fixed;
    top: $space-2;
    left: 0;
    right: 0;
    z-index: 100;
    box-sizing: border-box;
    height: $header-height;

    &--hidden { display: none; }

    &--bg {
        background-color: var(--overlay-white-85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: var(--shadow-sm);
    }

    &__logo img {
        width: 3.5rem;
        object-fit: contain;
        display: block;
    }

    &__menu {
        display: flex;
        align-items: center;
        gap: $space-3;
        flex-shrink: 0;
    }

    &__agendar {
        white-space: nowrap;
        /* Compact: igual que diginode navbar__cta */
        width: auto;
        max-width: none;
        height: 36px;
        padding: 0 $space-4;
        font-size: $text-sm;
        font-weight: $fw-medium;
        display: inline-flex;
        align-items: center;
    }
}

.text--long  { display: inline; }
.text--short { display: none; }

.logout-btn {
    background: none;
    border: 1px solid var(--color-border-light);
    border-radius: $radius-sm;
    cursor: pointer;
    color: var(--color-text-muted);
    font-size: $text-sm;
    padding: $space-1 $space-3;
    white-space: nowrap;
    transition: color $transition-fast, border-color $transition-fast;
    flex-shrink: 0;

    &:hover { color: var(--color-error); border-color: var(--color-error); }
}

.hamburger {
    background: none;
    border: none;
    cursor: pointer;
    padding: $space-1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &__line {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 22px;

        span {
            display: block;
            height: 2px;
            background: var(--color-text);
            border-radius: $radius-xs;
            transition: $transition;
            transform-origin: center;
        }

        &--open {
            span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
            span:nth-child(2) { opacity: 0; transform: scaleX(0); }
            span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        }
    }
}

.navbar--visible { display: block; }
.navbar--hidden  { display: none; }

@media (max-width: $bp-md) {
    .header { padding: $space-3 $space-4; }

    .text--long  { display: none; }
    .text--short { display: inline; }

    .logout-btn { font-size: $text-base; padding: $space-1 $space-2; }
}
</style>
