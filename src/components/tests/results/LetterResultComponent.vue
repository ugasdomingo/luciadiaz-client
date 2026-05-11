<script setup>
import { ref, defineProps } from 'vue';
import { useAuthStore } from '../../../stores/auth-store';
import TestClinicalDisclaimerComponent from '../TestClinicalDisclaimerComponent.vue'

const props = defineProps({
    letter_results: { type: Object || null, default: null },
    user_name: { type: String || null }
})
const auth_store = useAuthStore()
const goal = ref(props.letter_results.goal)
const reasons = ref(props.letter_results.reasons)

const first_name = props.user_name?.split(' ')[0] || auth_store.user_data?.user?.name?.split(' ')[0] || ''
const full_name = props.user_name || auth_store.user_data?.user?.name || ''
</script>

<template>
    <div class="result-page">

        <!-- Hero -->
        <div class="result-hero">
            <div class="result-hero__deco" />
            <div class="result-hero__inner">
                <span class="result-hero__chip">Carta del Inconsciente</span>
                <h1 class="result-hero__title">
                    {{ first_name }}, tu inconsciente<br>
                    <span class="result-hero__sub">te ha enviado una carta</span>
                </h1>
                <p class="result-hero__goal">Tu meta: <strong>{{ goal }}</strong></p>
            </div>
        </div>

        <!-- Body -->
        <div class="result-body">

            <!-- The letter -->
            <div class="letter-card">
                <div class="letter-card__header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M22 6l-10 7L2 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <span class="letter-card__label">Tu carta</span>
                </div>
                <p class="letter-card__text">
                    Yo, <strong>{{ full_name }}</strong>, conscientemente quiero <strong>{{ goal }}</strong>. Ya que bloqueo en mi <strong>{{ reasons[2] }}</strong>. Además quisiera <strong>{{ reasons[3] }}</strong> ya que rechazo en mi <strong>{{ reasons[5] }}</strong>.
                </p>
            </div>

            <!-- How to read -->
            <div class="result-card">
                <div class="result-card__icon-header">
                    <div class="result-card__icon-wrap">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <h2 class="result-card__title">Cómo leer tu carta</h2>
                </div>

                <div class="reading-steps">
                    <div class="reading-step">
                        <div class="reading-step__num">1</div>
                        <p class="reading-step__text">
                            Lee la carta <strong>de abajo hacia arriba</strong> para descubrir la ruta que tu inconsciente te propone.
                        </p>
                    </div>
                    <div class="reading-step">
                        <div class="reading-step__num">2</div>
                        <p class="reading-step__text">
                            Para alcanzar tu objetivo de <strong>{{ goal }}</strong>, debes resolver primero lo que el inconsciente rechaza: <strong>{{ reasons[5] }}</strong>.
                        </p>
                    </div>
                    <div class="reading-step">
                        <div class="reading-step__num">3</div>
                        <p class="reading-step__text">
                            Eso te permitirá conectar con <strong>{{ reasons[3] }}</strong> y resolver el bloqueo en <strong>{{ reasons[2] }}</strong>.
                        </p>
                    </div>
                    <div class="reading-step">
                        <div class="reading-step__num">4</div>
                        <p class="reading-step__text">
                            Una vez liberado/a de ese bloqueo, alcanzarás tu meta de <strong>{{ goal }}</strong>.
                        </p>
                    </div>
                </div>
            </div>

            <!-- CTA -->
            <div class="cta-card">
                <div class="cta-card__content">
                    <h3 class="cta-card__title">¿Necesitas ayuda para entenderla?</h3>
                    <p class="cta-card__text">Si algo no te suena o te genera ruido, contáctame. Lo más importante es entender tu carta para poder lograr lo que deseas.</p>
                </div>
                <a href="https://wa.me/34624721896" class="cta-card__btn" target="_blank" rel="noopener">
                    Contactar por WhatsApp
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            </div>

            <TestClinicalDisclaimerComponent />
        </div>
    </div>
</template>

<style scoped lang="scss">
.result-page {
    min-height: 100vh;
    background: var(--color-bg);
}

/* Hero */
.result-hero {
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

    &__chip {
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
        margin-bottom: 20px;
    }

    &__title {
        font-family: var(--font-title);
        font-size: clamp(26px, 5vw, 44px);
        font-weight: 700;
        color: white;
        margin: 0 0 16px;
        line-height: 1.25;
    }

    &__sub {
        color: var(--gold-light);
    }

    &__goal {
        font-size: 15px;
        color: rgba(255,255,255,0.65);
        font-family: var(--font-body);
        margin: 0;

        strong { color: rgba(255,255,255,0.9); }
    }
}

/* Body */
.result-body {
    max-width: 680px;
    margin: 0 auto;
    padding: 48px 28px 80px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    @media (max-width: $bp-sm) { padding: 28px 16px 60px; }
}

/* Letter card */
.letter-card {
    background: white;
    border: 2px solid var(--blue-ink);
    border-radius: var(--r-xl);
    padding: 32px;
    box-shadow: var(--shadow-md-new);
    position: relative;

    @media (max-width: $bp-sm) { padding: 20px; }

    &::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 4px;
        background: var(--gold-grad);
        border-radius: var(--r-xl) var(--r-xl) 0 0;
    }

    &__header {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--blue-ink);
        margin-bottom: 20px;
    }

    &__label {
        font-size: 12px;
        font-weight: $fw-bold;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-family: var(--font-body);
        color: var(--blue-ink);
    }

    &__text {
        font-family: var(--font-title);
        font-size: 17px;
        line-height: 1.8;
        color: var(--blue-ink);
        margin: 0;
        font-style: italic;

        strong {
            font-style: normal;
            color: var(--color-primary);
        }
    }
}

/* Result card */
.result-card {
    background: white;
    border: 1.5px solid var(--border);
    border-radius: var(--r-xl);
    padding: 32px;
    box-shadow: var(--shadow-md-new);

    @media (max-width: $bp-sm) { padding: 20px 16px; }

    &__icon-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
    }

    &__icon-wrap {
        width: 36px; height: 36px;
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
        font-size: 19px;
        color: var(--blue-ink);
        margin: 0;
    }
}

/* Reading steps */
.reading-steps {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.reading-step {
    display: flex;
    gap: 14px;
    align-items: flex-start;

    &__num {
        width: 28px; height: 28px;
        background: var(--blue-ink);
        color: white;
        border-radius: $radius-full;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: $fw-bold;
        font-family: var(--font-body);
        flex-shrink: 0;
    }

    &__text {
        font-size: 14px;
        color: var(--color-text);
        line-height: 1.65;
        font-family: var(--font-body);
        margin: 4px 0 0;

        strong { color: var(--blue-ink); }
    }
}

/* CTA card */
.cta-card {
    background: var(--blue-ink);
    border-radius: var(--r-xl);
    padding: 32px;
    display: flex;
    gap: 24px;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    @media (max-width: $bp-sm) { padding: 24px 20px; gap: 16px; }

    &__content { flex: 1; min-width: 200px; }

    &__title {
        font-family: var(--font-title);
        font-size: 18px;
        color: white;
        margin: 0 0 8px;
    }

    &__text {
        font-size: 13px;
        color: rgba(255,255,255,0.65);
        line-height: 1.6;
        font-family: var(--font-body);
        margin: 0;
    }

    &__btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 13px 22px;
        background: var(--gold-grad);
        color: white;
        border-radius: $radius-full;
        font-size: 14px;
        font-weight: $fw-bold;
        font-family: var(--font-body);
        text-decoration: none;
        white-space: nowrap;
        box-shadow: var(--shadow-gold-new);
        transition: transform 0.2s, opacity 0.2s;

        &:hover { transform: translateY(-2px); opacity: 0.9; }
    }
}
</style>
