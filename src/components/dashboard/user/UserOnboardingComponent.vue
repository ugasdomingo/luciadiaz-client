<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../../stores/auth-store.js'
import { useUtilStore } from '../../../stores/util-store.js'
import { test_info } from '../../../static/test-info.js'

const emit = defineEmits(['navigate'])
const auth_store = useAuthStore()
const util_store = useUtilStore()

const first_name = computed(() => auth_store.user_data?.user?.name?.split(' ')[0] || '')

// ── Estado de cada paso ──────────────────────────────────────────────
const consent_done = computed(() => !!auth_store.user_data?.user?.consent_signed)

const history_count = computed(() => auth_store.user_data?.history?.length || 0)
const history_total = 13
const history_done = computed(() => history_count.value >= history_total)
const history_percent = computed(() => Math.min(100, Math.round((history_count.value / history_total) * 100)))

// Nombres tal cual se guardan en test_results
const completed_test_names = computed(() =>
    (auth_store.user_data?.test_results || []).map(t => t.test_name)
)
const test_done_map = {
    'Arquetipos de la personalidad': 'Arquetipo',
    'Temperamentos': 'Temperamento',
    'Carta del inconsciente': 'Carta del Inconsciente',
}
const is_test_done = (test_name) => completed_test_names.value.includes(test_done_map[test_name])
const tests_done_count = computed(() => test_info.filter(t => is_test_done(t.name)).length)
const tests_done = computed(() => tests_done_count.value === test_info.length)

// ── Progreso global ──────────────────────────────────────────────────
const steps_done = computed(() =>
    [consent_done.value, history_done.value, tests_done.value].filter(Boolean).length
)
const all_done = computed(() => steps_done.value === 3)
const overall_percent = computed(() => Math.round((steps_done.value / 3) * 100))

const go = (view) => {
    emit('navigate', view)
}
const go_test = () => {
    util_store.close_dashboard_sidebar()
}
</script>

<template>
    <section class="onboarding">

        <!-- Header -->
        <div class="section-header">
            <div class="section-header__text">
                <h2 class="section-header__title">
                    {{ all_done ? '¡Todo listo!' : `Bienvenido/a${first_name ? ', ' + first_name : ''}` }}
                </h2>
                <p class="section-header__sub">
                    {{ all_done
                        ? 'Has completado todos los pasos previos a tu primera sesión.'
                        : 'Completa estos pasos antes de tu primera sesión para que Lucía pueda acompañarte mejor.' }}
                </p>
            </div>
        </div>

        <!-- Barra de progreso global -->
        <div class="onboarding-progress">
            <div class="onboarding-progress__top">
                <span class="onboarding-progress__label">Tu progreso</span>
                <span class="onboarding-progress__count">{{ steps_done }} / 3 completados</span>
            </div>
            <div class="onboarding-progress__track">
                <div class="onboarding-progress__fill" :style="{ width: overall_percent + '%' }" />
            </div>
        </div>

        <!-- Pasos -->
        <div class="step-list">

            <!-- Paso 1: Consentimiento -->
            <article class="step-card" :class="{ 'step-card--done': consent_done }">
                <div class="step-card__index">
                    <span v-if="consent_done" class="step-card__check">✓</span>
                    <span v-else>1</span>
                </div>
                <div class="step-card__body">
                    <div class="step-card__head">
                        <h3 class="step-card__title">Firma tu consentimiento</h3>
                        <span class="step-card__badge" :class="consent_done ? 'badge--done' : 'badge--pending'">
                            {{ consent_done ? 'Completado' : 'Pendiente' }}
                        </span>
                    </div>
                    <p class="step-card__desc">
                        El consentimiento informado es obligatorio antes de tu primera sesión y solo toma un par de minutos.
                    </p>
                    <button v-if="!consent_done" class="step-card__cta" @click="go('consent')">
                        Firmar consentimiento
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <button v-else class="step-card__link" @click="go('consent')">Ver mi consentimiento</button>
                </div>
            </article>

            <!-- Paso 2: Historial clínico -->
            <article class="step-card" :class="{ 'step-card--done': history_done }">
                <div class="step-card__index">
                    <span v-if="history_done" class="step-card__check">✓</span>
                    <span v-else>2</span>
                </div>
                <div class="step-card__body">
                    <div class="step-card__head">
                        <h3 class="step-card__title">Completa tu historial clínico</h3>
                        <span class="step-card__badge" :class="history_done ? 'badge--done' : 'badge--pending'">
                            {{ history_done ? 'Completado' : `${history_percent}%` }}
                        </span>
                    </div>
                    <p class="step-card__desc">
                        Cuéntale a Lucía tu historia para que la primera sesión parta de un punto de partida claro.
                    </p>
                    <div v-if="!history_done && history_count > 0" class="step-card__minibar">
                        <div class="step-card__minibar-fill" :style="{ width: history_percent + '%' }" />
                    </div>
                    <button v-if="!history_done" class="step-card__cta" @click="go('medical')">
                        {{ history_count > 0 ? 'Seguir completando' : 'Completar historial' }}
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <button v-else class="step-card__link" @click="go('medical')">Ver mi historial</button>
                </div>
            </article>

            <!-- Paso 3: Tests -->
            <article class="step-card" :class="{ 'step-card--done': tests_done }">
                <div class="step-card__index">
                    <span v-if="tests_done" class="step-card__check">✓</span>
                    <span v-else>3</span>
                </div>
                <div class="step-card__body">
                    <div class="step-card__head">
                        <h3 class="step-card__title">Realiza los 3 tests</h3>
                        <span class="step-card__badge" :class="tests_done ? 'badge--done' : 'badge--pending'">
                            {{ tests_done ? 'Completado' : `${tests_done_count} / ${test_info.length}` }}
                        </span>
                    </div>
                    <p class="step-card__desc">
                        Estos tests le dan a Lucía una primera lectura de tu personalidad, temperamento e inconsciente.
                    </p>

                    <ul class="test-mini-list">
                        <li v-for="test in test_info" :key="test.id" class="test-mini">
                            <span class="test-mini__dot" :class="is_test_done(test.name) ? 'done' : 'pending'" />
                            <span class="test-mini__name">{{ test.name }}</span>
                            <span v-if="is_test_done(test.name)" class="test-mini__state test-mini__state--done">Hecho</span>
                            <RouterLink v-else :to="test.link" class="test-mini__do" @click="go_test">
                                Hacer test
                                <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </article>

        </div>

        <!-- Estado final -->
        <div v-if="all_done" class="onboarding-done">
            <span class="onboarding-done__icon">🎉</span>
            <p>Ya puedes <button class="onboarding-done__link" @click="go('courses')">explorar tus cursos</button> mientras esperas tu primera sesión.</p>
        </div>

    </section>
</template>

<style scoped lang="scss">
.onboarding {
    max-width: 760px;
}

/* ── Header de sección (igual que Resultados de Tests) ── */
.section-header {
    margin-bottom: 28px;

    &__title {
        font-family: var(--font-title);
        font-size: clamp(26px, 4vw, 36px);
        font-weight: 700;
        color: var(--blue-ink);
        margin: 0 0 8px;
        line-height: 1.2;
        position: relative;
        display: inline-block;

        &::after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 0;
            width: 48px;
            height: 3px;
            background: var(--gold-grad);
            border-radius: $radius-full;
        }
    }

    &__sub {
        font-size: 14px;
        color: var(--color-text-muted);
        margin: 16px 0 0;
        line-height: 1.6;
        max-width: 560px;
    }
}

/* ── Barra de progreso global ── */
.onboarding-progress {
    background: white;
    border: 1.5px solid var(--border);
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-xs);
    padding: 18px 24px;
    margin-bottom: 24px;

    &__top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
    }

    &__label {
        font-family: var(--font-title);
        font-size: 14px;
        font-weight: 600;
        color: var(--blue-ink);
    }

    &__count {
        font-size: 12.5px;
        font-weight: $fw-semibold;
        color: var(--color-text-muted);
    }

    &__track {
        height: 8px;
        background: var(--color-bg);
        border-radius: $radius-full;
        overflow: hidden;
    }

    &__fill {
        height: 100%;
        background: var(--gold-grad);
        border-radius: $radius-full;
        transition: width 0.5s cubic-bezier(.4,0,.2,1);
    }
}

/* ── Lista de pasos ── */
.step-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.step-card {
    display: flex;
    gap: 16px;
    background: white;
    border-radius: var(--r-lg);
    border: 1.5px solid var(--border);
    box-shadow: var(--shadow-xs);
    padding: 22px 24px;
    transition: border-color 0.2s var(--ease), box-shadow 0.2s var(--ease);

    &:hover { box-shadow: var(--shadow-sm-new); }

    &--done {
        border-color: rgba(16,185,129,0.3);
        background: rgba(16,185,129,0.025);
    }

    @media (max-width: $bp-sm) { padding: 18px 16px; gap: 12px; }
}

.step-card__index {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: $radius-full;
    background: var(--blue-wash);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-title);
    font-size: 16px;
    font-weight: 700;

    .step-card--done & {
        background: var(--color-success);
        color: white;
    }
}

.step-card__check { font-size: 18px; line-height: 1; }

.step-card__body {
    flex: 1;
    min-width: 0;
}

.step-card__head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 6px;
}

.step-card__title {
    font-family: var(--font-title);
    font-size: 16px;
    font-weight: 600;
    color: var(--blue-ink);
    margin: 0;
    flex: 1;

    @media (max-width: $bp-sm) { font-size: 15px; }
}

.step-card__badge {
    font-size: 11px;
    font-weight: $fw-semibold;
    font-family: var(--font-body);
    padding: 3px 10px;
    border-radius: $radius-full;
    white-space: nowrap;
    flex-shrink: 0;

    &.badge--done {
        background: rgba(16,185,129,0.1);
        color: var(--color-success);
    }

    &.badge--pending {
        background: var(--blue-wash);
        color: var(--color-primary);
    }
}

.step-card__desc {
    font-size: 13px;
    color: var(--ink-muted);
    line-height: 1.7;
    margin: 0 0 14px;
}

.step-card__minibar {
    height: 6px;
    background: var(--color-bg);
    border-radius: $radius-full;
    overflow: hidden;
    margin-bottom: 14px;

    &-fill {
        height: 100%;
        background: var(--gold-grad);
        border-radius: $radius-full;
        transition: width 0.5s var(--ease);
    }
}

.step-card__cta {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 22px;
    background: var(--gold-grad);
    color: white;
    border: none;
    cursor: pointer;
    border-radius: $radius-full;
    font-size: 13px;
    font-weight: $fw-semibold;
    font-family: var(--font-body);
    box-shadow: var(--shadow-gold-new);
    transition: transform 0.2s var(--ease), box-shadow 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-gold-glow);
    }
}

.step-card__link {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 13px;
    font-family: var(--font-body);
    font-weight: $fw-semibold;
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover { opacity: 0.75; }
}

/* ── Mini-lista de tests ── */
.test-mini-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.test-mini {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-top: 1px solid var(--border);

    &:first-child { border-top: none; }
}

.test-mini__dot {
    width: 8px; height: 8px;
    border-radius: $radius-full;
    flex-shrink: 0;
    &.done { background: var(--color-success); box-shadow: 0 0 0 3px rgba(16,185,129,0.15); }
    &.pending { background: var(--ink-faint); }
}

.test-mini__name {
    font-size: 13.5px;
    color: var(--blue-ink);
    flex: 1;
    min-width: 0;
}

.test-mini__state--done {
    font-size: 12px;
    font-weight: $fw-semibold;
    color: var(--color-success);
    flex-shrink: 0;
}

.test-mini__do {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12.5px;
    font-weight: $fw-semibold;
    font-family: var(--font-body);
    color: var(--color-primary);
    text-decoration: none;
    flex-shrink: 0;
    transition: gap 0.2s var(--ease);

    &:hover { gap: 9px; }
}

/* ── Estado final ── */
.onboarding-done {
    margin-top: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(16,185,129,0.06);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: var(--r-lg);
    padding: 18px 24px;

    p { margin: 0; font-size: 14px; color: var(--color-text); }

    &__icon { font-size: 24px; line-height: 1; }

    &__link {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        font-size: inherit;
        font-family: inherit;
        font-weight: $fw-semibold;
        color: var(--color-primary);
        text-decoration: underline;
        text-underline-offset: 2px;
        &:hover { opacity: 0.75; }
    }
}
</style>
