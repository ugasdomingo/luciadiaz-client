<script setup>
import { defineProps, ref } from 'vue';
import { archetype_results_info } from '../../../static/answers/archetype-results.js'
import { useAuthStore } from '../../../stores/auth-store.js';
import TestClinicalDisclaimerComponent from '../TestClinicalDisclaimerComponent.vue'

const props = defineProps({
    archetype_results: { type: Object || null, default: null },
    user_name: { type: String, default: '' }
})
const auth_store = useAuthStore()

const archetype_result = ref(archetype_results_info.find(result => result.archetype_name === props.archetype_results.archetype))
const archetype_others = ref(archetype_results_info.filter(result => result.archetype_name !== props.archetype_results.archetype))
const show_others = ref(false)

const first_name = props.user_name?.split(' ')[0] || auth_store.user_data?.user?.name?.split(' ')[0] || ''

const score_items = [
    { label: 'Sabio Rey', key: 'wise', color: '#6366f1' },
    { label: 'Guerrero', key: 'warrior', color: '#ef4444' },
    { label: 'Mago', key: 'wizard', color: '#f59e0b' },
    { label: 'Amante', key: 'lover', color: '#10b981' },
]

const max_score = Math.max(
    props.archetype_results.wise,
    props.archetype_results.warrior,
    props.archetype_results.wizard,
    props.archetype_results.lover,
)
</script>

<template>
    <div class="result-page">

        <!-- Hero -->
        <div class="result-hero">
            <div class="result-hero__deco" />
            <div class="result-hero__inner">
                <span class="result-hero__chip">Test de Arquetipos</span>
                <h1 class="result-hero__title">
                    {{ first_name }}, tu arquetipo es
                    <span class="result-hero__name">{{ props.archetype_results.archetype }}</span>
                </h1>
                <p class="result-hero__tagline">Tu máxima necesidad es <strong>{{ archetype_result?.archetype_necesities }}</strong></p>
            </div>
        </div>

        <!-- Body -->
        <div class="result-body">

            <!-- Scores -->
            <div class="result-card result-card--scores">
                <h2 class="result-card__title">Tus puntuaciones</h2>
                <div class="scores-grid">
                    <div v-for="item in score_items" :key="item.key" class="score-item">
                        <div class="score-item__header">
                            <span class="score-item__label">{{ item.label }}</span>
                            <span class="score-item__value">{{ props.archetype_results[item.key] }}</span>
                        </div>
                        <div class="score-item__bar-bg">
                            <div
                                class="score-item__bar-fill"
                                :style="{ width: max_score > 0 ? (props.archetype_results[item.key] / max_score * 100) + '%' : '0%', background: item.color }"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Profile -->
            <div class="result-card">
                <h2 class="result-card__title">Tu perfil</h2>

                <div class="profile-grid">
                    <div class="profile-block">
                        <span class="profile-block__label">Necesidad principal</span>
                        <span class="profile-block__value">{{ archetype_result?.archetype_necesities }}</span>
                    </div>
                    <div class="profile-block">
                        <span class="profile-block__label">Cualidad principal</span>
                        <span class="profile-block__value">{{ archetype_result?.archetype_quality }}</span>
                    </div>
                    <div class="profile-block">
                        <span class="profile-block__label">Toma de decisiones</span>
                        <span class="profile-block__value">{{ archetype_result?.archetype_decision }}</span>
                    </div>
                    <div class="profile-block profile-block--wide">
                        <span class="profile-block__label">Lo que te gusta</span>
                        <span class="profile-block__value">{{ archetype_result?.archetype_like }}</span>
                    </div>
                </div>

                <div class="emotions-section">
                    <h3 class="emotions-section__title">Emociones contenidas</h3>
                    <div class="emotions-list">
                        <span v-for="emotion in archetype_result?.archetype_emotions" :key="emotion" class="emotion-tag">
                            {{ emotion }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Others toggle -->
            <button class="toggle-btn" @click="show_others = !show_others">
                <span>{{ show_others ? 'Ocultar otros arquetipos' : 'Ver otros arquetipos' }}</span>
                <svg class="toggle-btn__chevron" :class="{ 'toggle-btn__chevron--open': show_others }" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>

            <Transition name="fade-down">
                <div v-if="show_others" class="others-section">
                    <div v-for="archetype in archetype_others" :key="archetype.archetype_name" class="result-card result-card--other">
                        <h3 class="result-card__other-title">{{ archetype.archetype_name }}</h3>

                        <div class="profile-grid profile-grid--compact">
                            <div class="profile-block">
                                <span class="profile-block__label">Necesidad principal</span>
                                <span class="profile-block__value">{{ archetype.archetype_necesities }}</span>
                            </div>
                            <div class="profile-block">
                                <span class="profile-block__label">Cualidad</span>
                                <span class="profile-block__value">{{ archetype.archetype_quality }}</span>
                            </div>
                            <div class="profile-block">
                                <span class="profile-block__label">Decisiones</span>
                                <span class="profile-block__value">{{ archetype.archetype_decision }}</span>
                            </div>
                            <div class="profile-block profile-block--wide">
                                <span class="profile-block__label">Lo que le gusta</span>
                                <span class="profile-block__value">{{ archetype.archetype_like }}</span>
                            </div>
                        </div>

                        <div class="emotions-section">
                            <h4 class="emotions-section__title">Emociones contenidas</h4>
                            <div class="emotions-list">
                                <span v-for="emotion in archetype.archetype_emotions" :key="emotion" class="emotion-tag emotion-tag--muted">
                                    {{ emotion }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>

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
        line-height: 1.2;
    }

    &__name {
        color: var(--gold-light);
        display: block;
    }

    &__tagline {
        font-size: 16px;
        color: rgba(255,255,255,0.65);
        font-family: var(--font-body);
        margin: 0;

        strong { color: rgba(255,255,255,0.9); font-weight: $fw-semibold; }
    }
}

/* Body */
.result-body {
    max-width: 720px;
    margin: 0 auto;
    padding: 48px 28px 80px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    @media (max-width: $bp-sm) { padding: 28px 16px 60px; }
}

/* Card */
.result-card {
    background: white;
    border: 1.5px solid var(--border);
    border-radius: var(--r-xl);
    padding: 32px;
    box-shadow: var(--shadow-md-new);

    @media (max-width: $bp-sm) { padding: 20px 16px; }

    &--scores { border-top: 3px solid var(--gold); }

    &--other {
        border-left: 4px solid var(--blue-ink);
        opacity: 0.85;
    }

    &__title {
        font-family: var(--font-title);
        font-size: 20px;
        color: var(--blue-ink);
        margin: 0 0 24px;
    }

    &__other-title {
        font-family: var(--font-title);
        font-size: 18px;
        color: var(--blue-ink);
        margin: 0 0 20px;
    }
}

/* Scores */
.scores-grid {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.score-item {
    &__header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
    }

    &__label {
        font-size: 14px;
        font-weight: $fw-semibold;
        color: var(--blue-ink);
        font-family: var(--font-body);
    }

    &__value {
        font-size: 14px;
        font-weight: $fw-bold;
        color: var(--blue-ink);
        font-family: var(--font-body);
    }

    &__bar-bg {
        height: 8px;
        background: var(--blue-wash);
        border-radius: $radius-full;
        overflow: hidden;
    }

    &__bar-fill {
        height: 100%;
        border-radius: $radius-full;
        transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
}

/* Profile grid */
.profile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 28px;

    @media (max-width: $bp-sm) { grid-template-columns: 1fr; }

    &--compact { margin-bottom: 20px; }
}

.profile-block {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px;
    background: var(--color-bg);
    border-radius: $radius-md;
    border: 1px solid var(--border);

    &--wide {
        grid-column: 1 / -1;
    }

    &__label {
        font-size: 11px;
        font-weight: $fw-bold;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-primary);
        font-family: var(--font-body);
    }

    &__value {
        font-size: 14px;
        color: var(--blue-ink);
        line-height: 1.5;
        font-family: var(--font-body);
        font-weight: $fw-semibold;
    }
}

/* Emotions */
.emotions-section {
    &__title {
        font-family: var(--font-title);
        font-size: 15px;
        color: var(--blue-ink);
        margin: 0 0 12px;
    }
}

.emotions-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.emotion-tag {
    padding: 6px 14px;
    background: var(--blue-wash);
    color: var(--color-primary);
    border-radius: $radius-full;
    font-size: 13px;
    font-weight: $fw-semibold;
    font-family: var(--font-body);
    border: 1px solid rgba(30,86,160,0.15);

    &--muted {
        background: var(--color-bg);
        color: var(--ink-muted);
        border-color: var(--border);
    }
}

/* Toggle */
.toggle-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px;
    background: transparent;
    border: 1.5px solid var(--border);
    border-radius: $radius-full;
    font-size: 14px;
    font-weight: $fw-semibold;
    font-family: var(--font-body);
    color: var(--blue-ink);
    cursor: pointer;
    align-self: flex-end;
    transition: border-color 0.2s, color 0.2s;

    &:hover { border-color: var(--color-primary); color: var(--color-primary); }

    &__chevron {
        transition: transform 0.3s;
        &--open { transform: rotate(180deg); }
    }
}

/* Others section */
.others-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* Transitions */
.fade-down-enter-active { transition: opacity 0.35s, transform 0.35s; }
.fade-down-enter-from   { opacity: 0; transform: translateY(-10px); }
.fade-down-leave-active { transition: opacity 0.2s; }
.fade-down-leave-to     { opacity: 0; }
</style>
