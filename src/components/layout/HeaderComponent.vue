<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth-store';

const router = useRouter();
const route = useRoute();
const auth_store = useAuthStore();

const scrolled = ref(false);
const menu_open = ref(false);

const links = [
    { id: 'terapias', label: 'Terapias', path: '/terapias' },
    { id: 'tests', label: 'Tests', path: '/tests' },
    { id: 'formaciones', label: 'Formaciones', path: '/productos' },
    { id: 'blog', label: 'Blog', path: '/blog' }
];

const is_active = (path) =>
    route.path === path || route.path.startsWith(path + '/');

const on_scroll = () => {
    scrolled.value = window.scrollY > 40;
};

onMounted(() =>
    window.addEventListener('scroll', on_scroll, { passive: true })
);
onUnmounted(() => window.removeEventListener('scroll', on_scroll));

const navigate = (path) => {
    menu_open.value = false;
    router.push(path);
};
</script>

<template>
    <header class="header" :class="{ 'header--scrolled': scrolled }">
        <div class="container header__inner">
            <!-- Logo -->
            <RouterLink to="/" class="header__brand">
                <div class="header__logo-wrap">
                    <div class="header__logo-inner">
                        <img
                            src="/logo.png"
                            alt="Lucía Díaz"
                            class="header__logo-img"
                        />
                    </div>
                </div>
                <div class="header__brand-text">
                    <span class="header__brand-name">Lucia Diaz</span>
                    <span class="header__brand-sub"
                        >Psicologa F.P.V - 16.657</span
                    >
                </div>
            </RouterLink>

            <!-- Desktop nav -->
            <nav class="header__nav nav-desktop">
                <RouterLink
                    v-for="l in links"
                    :key="l.id"
                    :to="l.path"
                    class="header__nav-link"
                    :class="{ 'header__nav-link--active': is_active(l.path) }"
                >
                    {{ l.label }}
                    <span v-if="is_active(l.path)" class="header__nav-dot" />
                </RouterLink>
            </nav>

            <!-- Actions -->
            <div class="header__actions">
                <RouterLink
                    to="/mi-espacio"
                    class="header__mi-espacio nav-desktop"
                    >Mi espacio</RouterLink
                >
                <RouterLink to="/terapias" class="btn-header-gold"
                    >Agendar sesión</RouterLink
                >
                <button
                    class="burger"
                    @click="menu_open = !menu_open"
                    aria-label="Menú"
                >
                    <span /><span /><span class="burger__third" />
                </button>
            </div>
        </div>
    </header>

    <!-- Mobile fullscreen menu -->
    <Transition name="menu-fade">
        <div v-if="menu_open" class="mobile-menu" @click="menu_open = false">
            <nav class="mobile-menu__nav" @click.stop>
                <RouterLink
                    v-for="l in links"
                    :key="l.id"
                    :to="l.path"
                    class="mobile-menu__link"
                    :class="{ 'mobile-menu__link--active': is_active(l.path) }"
                    @click="menu_open = false"
                    >{{ l.label }}</RouterLink
                >
                <RouterLink
                    to="/mi-espacio"
                    class="mobile-menu__link"
                    @click="menu_open = false"
                    >Mi espacio</RouterLink
                >
            </nav>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&display=swap');

.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: var(--header-h);
    background: transparent;
    border-bottom: 1px solid transparent;
    transition:
        background 0.35s var(--ease),
        border-color 0.35s var(--ease),
        backdrop-filter 0.35s var(--ease);

    &--scrolled {
        background: rgba(255, 255, 255, 0.88);
        backdrop-filter: blur(16px) saturate(1.4);
        -webkit-backdrop-filter: blur(16px) saturate(1.4);
        border-bottom-color: rgba(30, 86, 160, 0.08);
    }
}

.header__inner {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
}

.container {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 0 28px;
}

.header__brand {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    flex-shrink: 0;
}

.header__logo-wrap {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--gold-grad);
    padding: 2px;
    box-shadow: 0 2px 10px rgba(212, 160, 23, 0.3);
    flex-shrink: 0;
}

.header__logo-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.header__logo-img {
    width: 36px;
    height: 36px;
    object-fit: contain;
}

.header__brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1;
}

.header__brand-name {
    font-family: var(--font-title);
    font-size: 20px;
    font-weight: 700;
    color: var(--blue-ink);
    letter-spacing: -0.01em;
}

.header__brand-sub {
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold-deep);
    margin-top: 3px;
}

.header__nav {
    display: flex;
    align-items: center;
    gap: 6px;
}

.header__nav-link {
    position: relative;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    color: var(--ink-soft);
    text-decoration: none;
    transition: color 0.2s var(--ease);
    font-family: var(--font-body);

    &:hover {
        color: var(--blue-ink);
    }

    &--active {
        color: var(--blue-ink);
    }
}

.header__nav-dot {
    position: absolute;
    left: 50%;
    bottom: 2px;
    transform: translateX(-50%);
    width: 18px;
    height: 2px;
    background: var(--gold-grad);
    border-radius: 2px;
}

.header__actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.header__mi-espacio {
    font-size: 13px;
    font-weight: 500;
    color: var(--ink-soft);
    text-decoration: none;
    font-family: var(--font-body);
    transition: color 0.2s var(--ease);
    &:hover {
        color: var(--blue-ink);
    }
}

.btn-header-gold {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 22px;
    border-radius: var(--r-full);
    background: var(--gold-grad);
    color: var(--white);
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    border: none;
    cursor: pointer;
    box-shadow: var(--shadow-gold-new);
    transition:
        background 0.25s var(--ease),
        transform 0.25s var(--ease),
        box-shadow 0.3s var(--ease),
        color 0.25s var(--ease);

    &:hover {
        background: var(--gold-grad-hover);
        transform: translateY(-2px);
        box-shadow: var(--shadow-gold-glow);
        color: var(--blue-ink);
    }
}

.burger {
    display: none;
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    cursor: pointer;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;

    span {
        display: block;
        width: 22px;
        height: 2px;
        background: var(--blue-ink);
        border-radius: 2px;
    }
    .burger__third {
        width: 14px;
        background: var(--gold);
    }
}

/* Mobile fullscreen menu */
.mobile-menu {
    position: fixed;
    inset: 0;
    z-index: 99;
    background: linear-gradient(135deg, var(--blue) 0%, var(--blue-deep) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.mobile-menu__nav {
    display: flex;
    flex-direction: column;
    gap: 24px;
    text-align: center;
}

.mobile-menu__link {
    font-family: var(--font-title);
    font-size: 36px;
    font-weight: 600;
    color: var(--white);
    text-decoration: none;
    transition: color 0.2s var(--ease);

    &:hover,
    &--active {
        color: var(--gold-light);
    }
}

/* Transition */
.menu-fade-enter-active,
.menu-fade-leave-active {
    transition: opacity 0.3s var(--ease);
}
.menu-fade-enter-from,
.menu-fade-leave-to {
    opacity: 0;
}

/* Responsive */
.nav-desktop {
    display: flex !important;
}

@media (max-width: 980px) {
    .nav-desktop {
        display: none !important;
    }
    .btn-header-gold {
        display: none;
    }
    .burger {
        display: flex;
    }
}
</style>
