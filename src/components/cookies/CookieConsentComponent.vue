<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth-store'

const auth_store = useAuthStore()
const visible = ref(false)

const should_show = computed(() => visible.value && !auth_store.token)

const accept_all = () => {
    localStorage.setItem('cookies_consent', JSON.stringify({
        accepted: true,
        date: new Date().toISOString()
    }))
    visible.value = false
}

const accept_necessary = () => {
    localStorage.setItem('cookies_consent', JSON.stringify({
        accepted: false,
        date: new Date().toISOString()
    }))
    visible.value = false
}

onMounted(() => {
    if (!localStorage.getItem('cookies_consent')) {
        visible.value = true
    }
})
</script>

<template>
    <Transition name="cookie-slide">
        <div v-if="should_show" class="cookie-banner" role="dialog" aria-label="Aviso de cookies">
            <div class="cookie-banner__inner">
                <div class="cookie-banner__text">
                    <p>
                        Usamos cookies propias y de terceros para mejorar tu experiencia y analizar el tráfico.
                        Puedes aceptarlas todas o solo las necesarias.
                        <RouterLink to="/cookies" class="cookie-banner__link">Más información</RouterLink>
                    </p>
                </div>
                <div class="cookie-banner__actions">
                    <button class="cookie-banner__btn cookie-banner__btn--secondary" @click="accept_necessary">
                        Solo necesarias
                    </button>
                    <button class="cookie-banner__btn cookie-banner__btn--primary" @click="accept_all">
                        Aceptar todas
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
.cookie-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    background: var(--blue-ink);
    border-top: 2px solid rgba(245, 197, 24, 0.4);
    padding: 20px 28px;

    &__inner {
        max-width: var(--max-w, 1280px);
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;

        @media (max-width: 680px) {
            flex-direction: column;
            align-items: flex-start;
        }
    }

    &__text {
        flex: 1;

        p {
            margin: 0;
            font-size: 14px;
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.82);
        }
    }

    &__link {
        color: var(--gold-light, #f5c518);
        text-decoration: underline;
        text-underline-offset: 2px;
        white-space: nowrap;

        &:hover { opacity: 0.8; }
    }

    &__actions {
        display: flex;
        gap: 10px;
        flex-shrink: 0;

        @media (max-width: 680px) {
            width: 100%;
        }
    }

    &__btn {
        height: 40px;
        padding: 0 20px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.15s;
        white-space: nowrap;

        &:hover { opacity: 0.85; transform: translateY(-1px); }

        &--secondary {
            background: transparent;
            border: 1.5px solid rgba(255, 255, 255, 0.35);
            color: rgba(255, 255, 255, 0.8);

            @media (max-width: 680px) { flex: 1; }
        }

        &--primary {
            background: var(--gold-bright, #d4a017);
            border: none;
            color: white;

            @media (max-width: 680px) { flex: 1; }
        }
    }
}

.cookie-slide-enter-active,
.cookie-slide-leave-active {
    transition: transform 0.35s ease, opacity 0.35s ease;
}

.cookie-slide-enter-from,
.cookie-slide-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
</style>
