<script setup>
import { ref, computed } from 'vue'
import { useTestStore } from '../../../stores/test-store'

const test_store = useTestStore()
const goal = ref('')
const answers = ref(['', '', '', '', '', ''])
const form_completed = computed(() => goal.value.trim().length > 0 && answers.value.every(a => a.trim().length > 0))

const handle_submit = async () => {
    try {
        await test_store.create_test_result('Carta del Inconsciente', {
            goal: goal.value,
            reasons: answers.value
        })
    } catch (error) {
        console.error(error)
    }
}
</script>

<template>
    <div class="test-page">

        <!-- Hero -->
        <div class="test-hero">
            <div class="test-hero__deco" />
            <div class="test-hero__inner">
                <span class="test-hero__label">Test de autoconocimiento</span>
                <h1 class="test-hero__title">Carta del Inconsciente</h1>
                <p class="test-hero__sub">Escribe lo que deseas lograr y las seis razones más profundas que te impulsan a alcanzarlo.</p>
                <p class="test-hero__disclaimer">Los resultados tienen una finalidad estrictamente psicoeducativa y de orientación personal.</p>
            </div>
        </div>

        <!-- Body -->
        <div class="test-body">
            <form @submit.prevent="handle_submit" class="letter-form">

                <!-- Meta -->
                <div class="letter-goal">
                    <div class="letter-goal__header">
                        <div class="letter-goal__icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                        </div>
                        <div>
                            <h3 class="letter-goal__title">Tu meta</h3>
                            <p class="letter-goal__hint">¿Qué quieres lograr? Escríbelo con claridad y detalle.</p>
                        </div>
                    </div>
                    <input
                        type="text"
                        v-model="goal"
                        placeholder="Ej: Tener más confianza en mí mismo para hablar en público…"
                        class="letter-goal__input"
                        required
                    />
                </div>

                <!-- Razones -->
                <div class="letter-reasons">
                    <div class="letter-reasons__header">
                        <h3 class="letter-reasons__title">Tus 6 razones</h3>
                        <p class="letter-reasons__hint">¿Por qué quieres alcanzar esa meta? Sé honesto/a contigo.</p>
                    </div>
                    <div class="letter-reasons__list">
                        <div v-for="(_, i) in answers" :key="i" class="reason-item">
                            <div class="reason-item__num">{{ i + 1 }}</div>
                            <input
                                type="text"
                                v-model="answers[i]"
                                :placeholder="`Razón ${i + 1}…`"
                                class="reason-item__input"
                                :class="{ 'reason-item__input--filled': answers[i].trim().length > 0 }"
                                required
                            />
                        </div>
                    </div>
                </div>

                <Transition name="cta-appear">
                    <div v-if="form_completed" class="test-submit">
                        <p class="test-submit__note">Estás listo/a para descubrir tu carta</p>
                        <button type="submit" class="test-submit__btn">
                            Generar mi carta
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                    </div>
                </Transition>
            </form>
        </div>
    </div>
</template>

<style scoped lang="scss">
.test-page {
    min-height: 100vh;
    background: var(--color-bg);
}

/* Hero */
.test-hero {
    background: var(--blue-ink);
    padding: 72px 28px 60px;
    text-align: center;
    position: relative;
    overflow: hidden;

    &__deco {
        position: absolute;
        top: -160px; left: 50%;
        transform: translateX(-50%);
        width: 600px; height: 600px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(245,197,24,0.08), transparent 65%);
        pointer-events: none;
    }

    &__inner { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; }

    &__label {
        display: inline-block;
        font-size: 11px;
        font-weight: $fw-bold;
        font-family: var(--font-body);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: var(--gold-light);
        background: rgba(245,197,24,0.12);
        border: 1px solid rgba(245,197,24,0.25);
        padding: 5px 14px;
        border-radius: $radius-full;
        margin-bottom: 18px;
    }

    &__title {
        font-family: var(--font-title);
        font-size: clamp(28px, 5vw, 48px);
        font-weight: 700;
        color: white;
        margin: 0 0 16px;
        line-height: 1.15;
    }

    &__sub {
        font-size: 16px;
        color: rgba(255,255,255,0.75);
        line-height: 1.7;
        margin: 0 0 16px;
        font-family: var(--font-body);
    }

    &__disclaimer {
        font-size: 12px;
        color: rgba(255,255,255,0.4);
        font-style: italic;
        margin: 0;
        font-family: var(--font-body);
    }
}

/* Body */
.test-body {
    max-width: 680px;
    margin: 0 auto;
    padding: 48px 28px 80px;
    @media (max-width: $bp-sm) { padding: 28px 16px 60px; }
}

.letter-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Meta */
.letter-goal {
    background: white;
    border: 2px solid var(--blue-ink);
    border-radius: var(--r-xl);
    padding: 28px;
    box-shadow: var(--shadow-md-new);

    &__header {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        margin-bottom: 20px;
    }

    &__icon {
        width: 44px; height: 44px;
        background: var(--blue-ink);
        border-radius: $radius-md;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
    }

    &__title {
        font-family: var(--font-title);
        font-size: 18px;
        color: var(--blue-ink);
        margin: 0 0 4px;
    }

    &__hint {
        font-size: 13px;
        color: var(--ink-muted);
        margin: 0;
        font-family: var(--font-body);
    }

    &__input {
        width: 100%;
        box-sizing: border-box;
        padding: 14px 16px;
        border: 1.5px solid var(--border);
        border-radius: $radius-md;
        font-size: 15px;
        font-family: var(--font-body);
        color: var(--blue-ink);
        background: var(--color-bg);
        outline: none;
        transition: border-color 0.2s;

        &::placeholder { color: var(--ink-faint); }
        &:focus { border-color: var(--blue-ink); background: white; }
    }
}

/* Razones */
.letter-reasons {
    background: white;
    border: 1.5px solid var(--border);
    border-radius: var(--r-xl);
    padding: 28px;
    box-shadow: var(--shadow-sm-new);

    &__header { margin-bottom: 20px; }

    &__title {
        font-family: var(--font-title);
        font-size: 18px;
        color: var(--blue-ink);
        margin: 0 0 4px;
    }

    &__hint {
        font-size: 13px;
        color: var(--ink-muted);
        margin: 0;
        font-family: var(--font-body);
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}

.reason-item {
    display: flex;
    align-items: center;
    gap: 12px;

    &__num {
        width: 28px; height: 28px;
        border-radius: $radius-full;
        background: var(--blue-wash);
        color: var(--color-primary);
        font-size: 12px;
        font-weight: $fw-bold;
        font-family: var(--font-body);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: background 0.2s, color 0.2s;
    }

    &__input {
        flex: 1;
        padding: 12px 14px;
        border: 1.5px solid var(--border);
        border-radius: $radius-md;
        font-size: 14px;
        font-family: var(--font-body);
        color: var(--blue-ink);
        background: var(--color-bg);
        outline: none;
        transition: border-color 0.2s;

        &::placeholder { color: var(--ink-faint); }
        &:focus { border-color: var(--color-primary); background: white; }

        &--filled {
            border-color: rgba(16,185,129,0.4);
            background: rgba(16,185,129,0.02);

            & + .reason-item__num { background: rgba(16,185,129,0.15); color: var(--color-success); }
        }
    }

    &:has(.reason-item__input--filled) .reason-item__num {
        background: rgba(16,185,129,0.15);
        color: var(--color-success);
    }
}

/* Submit */
.test-submit {
    margin-top: 8px;
    text-align: center;

    &__note {
        font-size: 14px;
        color: var(--color-text-muted);
        margin: 0 0 16px;
        font-family: var(--font-body);
    }

    &__btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 16px 40px;
        background: var(--gold-grad);
        color: white;
        border: none;
        border-radius: $radius-full;
        font-family: var(--font-body);
        font-size: 15px;
        font-weight: $fw-bold;
        cursor: pointer;
        box-shadow: var(--shadow-gold-new);
        transition: transform 0.2s var(--ease), box-shadow 0.2s;
        &:hover { transform: translateY(-3px); box-shadow: var(--shadow-gold-glow); }
    }
}

.cta-appear-enter-active { transition: opacity 0.4s var(--ease), transform 0.4s var(--ease); }
.cta-appear-enter-from   { opacity: 0; transform: translateY(16px); }
</style>
