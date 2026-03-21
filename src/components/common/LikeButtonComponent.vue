<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLikeStore } from '../../stores/like-store'
import { useAuthStore } from '../../stores/auth-store'

const props = defineProps({
    item_type: { type: String, required: true }, // 'Post' | 'Test' | 'Product'
    item_id:   { type: [String, Number], required: true },
})

const like_store = useLikeStore()
const auth_store = useAuthStore()

const loading    = ref(false)
const show_popup = ref(false)
const popup_email = ref('')
const popup_error = ref('')

onMounted(() => {
    like_store.fetch_count(props.item_type, props.item_id)
    // Pre-rellenar con email guardado
    popup_email.value = like_store.get_saved_email() || ''
})

const info = computed(() => like_store.get_count(props.item_type, props.item_id))

const handle_click = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading.value) return

    if (!auth_store.token && !like_store.get_saved_email()) {
        show_popup.value = true
        return
    }

    await do_toggle()
}

const do_toggle = async (email = null) => {
    loading.value = true
    try {
        await like_store.toggle(props.item_type, props.item_id, email)
        show_popup.value = false
    } catch (err) {
        if (err.message === 'EMAIL_REQUIRED') {
            show_popup.value = true
        }
    } finally {
        loading.value = false
    }
}

const submit_email = async () => {
    popup_error.value = ''
    const email = popup_email.value.trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        popup_error.value = 'Introduce un email válido'
        return
    }
    await do_toggle(email)
}

const close_popup = (e) => {
    e.preventDefault()
    e.stopPropagation()
    show_popup.value = false
    popup_error.value = ''
}
</script>

<template>
    <div class="like-btn-wrap" @click.stop>

        <button class="like-btn" :class="{ 'like-btn--liked': info.is_liked, 'like-btn--loading': loading }"
            @click="handle_click" :disabled="loading" :title="info.is_liked ? 'Quitar like' : 'Me gusta'">
            <span class="like-btn__heart">{{ info.is_liked ? '♥' : '♡' }}</span>
            <span class="like-btn__count">{{ info.count }}</span>
        </button>

        <!-- Popup email para visitantes -->
        <Teleport to="body">
            <div v-if="show_popup" class="like-popup-overlay" @click.self="close_popup">
                <div class="like-popup" @click.stop>
                    <button class="like-popup__close" @click="close_popup">✕</button>
                    <p class="like-popup__title">¿Te gustó? Déjanos tu email</p>
                    <p class="like-popup__sub">No hace falta registrarse.</p>
                    <input
                        v-model="popup_email"
                        type="email"
                        placeholder="tu@correo.com"
                        class="like-popup__input"
                        @keyup.enter="submit_email"
                        autofocus />
                    <p v-if="popup_error" class="like-popup__error">{{ popup_error }}</p>
                    <button class="action-btn like-popup__btn" @click="submit_email" :disabled="loading">
                        {{ loading ? '...' : '♥ Me gusta' }}
                    </button>
                </div>
            </div>
        </Teleport>

    </div>
</template>

<style scoped lang="scss">
.like-btn-wrap {
    display: inline-flex;
    position: relative;
}

.like-btn {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    background: none;
    border: 1px solid var(--color-border);
    border-radius: $radius-full;
    padding: $space-1 $space-3;
    font-size: $text-sm;
    font-family: $font-body;
    cursor: pointer;
    transition: $transition-fast;
    color: var(--color-text-muted);

    &:hover {
        border-color: #e05a6e;
        color: #e05a6e;
    }

    &--liked {
        border-color: #e05a6e;
        color: #e05a6e;
        background: rgba(224, 90, 110, 0.06);
    }

    &--loading { opacity: 0.6; pointer-events: none; }

    &__heart { font-size: $text-base; line-height: 1; }
    &__count { font-weight: $fw-semibold; }
}

/* Popup */
.like-popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: $space-4;
}

.like-popup {
    background: var(--color-bg-card);
    border-radius: $radius-lg;
    padding: $space-8;
    max-width: 360px;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: $space-3;
    box-shadow: var(--shadow-lg);

    &__close {
        position: absolute;
        top: $space-3;
        right: $space-3;
        background: none;
        border: none;
        font-size: $text-lg;
        cursor: pointer;
        color: var(--color-text-muted);
        line-height: 1;

        &:hover { color: var(--color-text); }
    }

    &__title {
        font-size: $text-base;
        font-weight: $fw-semibold;
        color: var(--color-text);
        margin: 0;
    }

    &__sub {
        font-size: $text-xs;
        color: var(--color-text-muted);
        margin: 0;
    }

    &__input {
        width: 100%;
        max-width: 100%;
    }

    &__error {
        color: var(--color-error);
        font-size: $text-xs;
        margin: 0;
    }

    &__btn {
        width: 100%;
        max-width: 100%;
    }
}
</style>
