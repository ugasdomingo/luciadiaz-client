<script setup>
import { ref, defineProps } from 'vue';
import { useAuthStore } from '../../../stores/auth-store.js';
import { temperament_results_info } from '../../../static/answers/temperament-results.js'
import TestClinicalDisclaimerComponent from '../TestClinicalDisclaimerComponent.vue'

const auth_store = useAuthStore()
const props = defineProps({
    temperament_results: { type: Object, required: true },
    user_name: { type: String, required: true }
})

const normalize = (s) => s?.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
const temperament_result = ref(
    temperament_results_info.find(r => r.title === props.temperament_results.temperament) ||
    temperament_results_info.find(r => normalize(r.title) === normalize(props.temperament_results.temperament))
)
const other_temperaments = ref(temperament_results_info.filter(r => r.title !== temperament_result.value?.title))
const show_others = ref(false)

const first_name = props.user_name?.split(' ')[0] || auth_store.user_data?.user?.name?.split(' ')[0] || ''

const score_items = [
    { label: 'Melancólico', key: 'melancholic', color: '#6366f1' },
    { label: 'Sanguíneo', key: 'sanguine', color: '#f59e0b' },
    { label: 'Colérico', key: 'choleric', color: '#ef4444' },
    { label: 'Flemático', key: 'phlegmatic', color: '#10b981' },
]

const max_score = Math.max(
    props.temperament_results.melancholic,
    props.temperament_results.sanguine,
    props.temperament_results.choleric,
    props.temperament_results.phlegmatic,
)

const detail_rows = [
    { label: 'Lema', key: 'slogan' },
    { label: 'Deseo', key: 'deseo' },
    { label: 'Necesidades', key: 'necesidades' },
    { label: 'Fuerzas claves', key: 'fuerzas' },
    { label: 'Debilidades claves', key: 'debilidades' },
    { label: 'Se deprime cuando', key: 'deprime' },
    { label: 'Tiene miedo de', key: 'miedo' },
    { label: 'Le gustan personas que', key: 'gustan' },
    { label: 'No le gustan personas que', key: 'no_gustan' },
    { label: 'Podría mejorar si', key: 'mejorar' },
    { label: 'Como líder', key: 'lider' },
    { label: 'Tiende a casarse con', key: 'casarse' },
    { label: 'Reacciona al estrés', key: 'estres' },
    { label: 'Se le reconoce por', key: 'reconoce' },
]
</script>

<template>
    <div class="result-page">

        <!-- Hero -->
        <div class="result-hero">
            <div class="result-hero__deco" />
            <div class="result-hero__inner">
                <span class="result-hero__chip">Test de Temperamento</span>
                <h1 class="result-hero__title">
                    {{ first_name }}, eres
                    <span class="result-hero__name">{{ temperament_result?.title }}</span>
                </h1>
                <p class="result-hero__slogan">"{{ temperament_result?.slogan }}"</p>
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
                            <span class="score-item__value">{{ props.temperament_results[item.key] }}</span>
                        </div>
                        <div class="score-item__bar-bg">
                            <div
                                class="score-item__bar-fill"
                                :style="{ width: max_score > 0 ? (props.temperament_results[item.key] / max_score * 100) + '%' : '0%', background: item.color }"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detail -->
            <div class="result-card">
                <h2 class="result-card__title">Tu perfil completo</h2>
                <dl class="detail-list">
                    <div v-for="row in detail_rows" :key="row.key" class="detail-item">
                        <dt class="detail-item__label">{{ row.label }}</dt>
                        <dd class="detail-item__value">{{ temperament_result?.[row.key] }}</dd>
                    </div>
                </dl>
            </div>

            <!-- Others toggle -->
            <button class="toggle-btn" @click="show_others = !show_others">
                <span>{{ show_others ? 'Ocultar otros temperamentos' : 'Ver otros temperamentos' }}</span>
                <svg class="toggle-btn__chevron" :class="{ 'toggle-btn__chevron--open': show_others }" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>

            <Transition name="fade-down">
                <div v-if="show_others" class="others-section">
                    <div v-for="t in other_temperaments" :key="t.title" class="result-card result-card--other">
                        <h3 class="result-card__other-title">{{ t.title }}</h3>
                        <p class="result-card__other-slogan">"{{ t.slogan }}"</p>
                        <dl class="detail-list detail-list--compact">
                            <div v-for="row in detail_rows" :key="row.key" class="detail-item">
                                <dt class="detail-item__label">{{ row.label }}</dt>
                                <dd class="detail-item__value">{{ t[row.key] }}</dd>
                            </div>
                        </dl>
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
        font-size: clamp(28px, 5vw, 48px);
        font-weight: 700;
        color: white;
        margin: 0 0 16px;
        line-height: 1.2;
    }

    &__name {
        color: var(--gold-light);
        display: block;
    }

    &__slogan {
        font-size: 17px;
        color: rgba(255,255,255,0.65);
        font-style: italic;
        font-family: var(--font-body);
        margin: 0;
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
        margin: 0 0 6px;
    }

    &__other-slogan {
        font-size: 13px;
        color: var(--ink-muted);
        font-style: italic;
        font-family: var(--font-body);
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

/* Detail list */
.detail-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 0;

    &--compact { margin-top: 0; }
}

.detail-item {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);

    &:last-child { border-bottom: none; padding-bottom: 0; }
    &:first-child { padding-top: 0; }

    @media (max-width: $bp-sm) {
        grid-template-columns: 1fr;
        gap: 4px;
    }

    &__label {
        font-size: 12px;
        font-weight: $fw-bold;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--color-primary);
        font-family: var(--font-body);
        padding-top: 2px;
    }

    &__value {
        font-size: 14px;
        color: var(--color-text);
        line-height: 1.6;
        font-family: var(--font-body);
        margin: 0;
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
