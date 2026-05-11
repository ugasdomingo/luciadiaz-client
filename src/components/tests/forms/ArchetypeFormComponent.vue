<script setup>
import { ref, watch, computed } from 'vue'
import { archetype_questions } from '../../../static/questions/archetype-questions'
import { useTestStore } from '../../../stores/test-store'

const test_store = useTestStore()
const answers = ref({})
const show_info = ref(false)
const answered = computed(() => Object.keys(answers.value).length)
const total = archetype_questions.length
const progress_pct = computed(() => Math.round((answered.value / total) * 100))

const handle_submit = async () => {
    try {
        const results = { archetype: '', wise: 0, warrior: 0, wizard: 0, lover: 0 }
        for (const key in answers.value) {
            const a = answers.value[key]
            if (a === 'a') results.wise++
            if (a === 'b') results.warrior++
            if (a === 'c') results.wizard++
            if (a === 'd') results.lover++
        }
        const max = Math.max(results.wise, results.warrior, results.wizard, results.lover)
        if (results.wise === max) results.archetype = 'Sabio Rey'
        else if (results.warrior === max) results.archetype = 'Guerrero'
        else if (results.wizard === max) results.archetype = 'Mago'
        else if (results.lover === max) results.archetype = 'Amante'
        await test_store.create_test_result('Arquetipo', results)
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
                <h1 class="test-hero__title">Arquetipos de la personalidad</h1>
                <p class="test-hero__sub">Selecciona la opción que más refleja tu manera de ser o actuar en cada situación.</p>

                <button class="test-hero__more" @click="show_info = !show_info">
                    {{ show_info ? 'Ocultar información' : '¿En qué se basa este test?' }}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" :style="{ transform: show_info ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }"><path d="M2 5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>

                <Transition name="info-fade">
                    <div v-if="show_info" class="test-hero__info">
                        <p>La teoría de arquetipos de Jung surgió de su investigación sobre la estructura psíquica humana, buscando comprender los patrones universales de comportamiento que trascienden culturas y épocas.</p>
                        <p>Este ejercicio nos sirve para identificar modelos y patrones de comportamiento para poder trabajar de forma más individualizada en nuestros planes de desarrollo personal.</p>
                    </div>
                </Transition>

                <p class="test-hero__disclaimer">Los resultados tienen una finalidad estrictamente psicoeducativa y de orientación personal.</p>
            </div>
        </div>

        <!-- Progreso -->
        <div class="test-progress">
            <div class="test-progress__inner">
                <div class="test-progress__bar">
                    <div class="test-progress__fill" :style="{ width: progress_pct + '%' }" />
                </div>
                <span class="test-progress__count">{{ answered }} / {{ total }} respondidas</span>
            </div>
        </div>

        <!-- Cuerpo -->
        <div class="test-body">
            <form @submit.prevent="handle_submit" class="test-form">
                <div
                    v-for="(question, index) in archetype_questions"
                    :key="index"
                    class="q-card"
                    :class="{ 'q-card--done': answers[question.key] }"
                >
                    <div class="q-card__header">
                        <div class="q-card__num">{{ index + 1 }}</div>
                        <p class="q-card__pregunta">{{ question.pregunta }}</p>
                    </div>
                    <div class="q-card__options">
                        <label
                            v-for="opt in ['a','b','c','d']"
                            :key="opt"
                            class="q-option"
                            :class="{ 'q-option--selected': answers[question.key] === opt }"
                        >
                            <input type="radio" :name="question.key" :value="opt" v-model="answers[question.key]" class="q-option__input" />
                            <span class="q-option__check" />
                            <span class="q-option__text">{{ question[opt] }}</span>
                        </label>
                    </div>
                </div>

                <Transition name="cta-appear">
                    <div v-if="answered === total" class="test-submit">
                        <p class="test-submit__note">¡Has respondido todas las preguntas!</p>
                        <button type="submit" class="test-submit__btn">
                            Ver mis resultados
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

    &__inner { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }

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
        margin: 0 0 20px;
        font-family: var(--font-body);
    }

    &__more {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: rgba(255,255,255,0.8);
        border-radius: $radius-full;
        padding: 8px 16px;
        font-size: 13px;
        font-family: var(--font-body);
        cursor: pointer;
        transition: background 0.2s;
        margin-bottom: 16px;
        &:hover { background: rgba(255,255,255,0.15); }
    }

    &__info {
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: var(--r-lg);
        padding: 20px 24px;
        text-align: left;
        margin-bottom: 16px;

        p {
            font-size: 14px;
            color: rgba(255,255,255,0.75);
            line-height: 1.7;
            margin: 0 0 10px;
            font-family: var(--font-body);
            &:last-child { margin: 0; }
        }
    }

    &__disclaimer {
        font-size: 12px;
        color: rgba(255,255,255,0.4);
        font-style: italic;
        margin: 0;
        font-family: var(--font-body);
    }
}

/* Progreso */
.test-progress {
    background: white;
    border-bottom: 1px solid var(--border);
    padding: 14px 28px;
    position: sticky;
    top: var(--header-h, 80px);
    z-index: 10;
    box-shadow: 0 2px 8px rgba(7,30,77,0.06);

    &__inner {
        max-width: 760px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 14px;
    }

    &__bar {
        flex: 1;
        height: 6px;
        background: var(--border);
        border-radius: $radius-full;
        overflow: hidden;
    }

    &__fill {
        height: 100%;
        background: var(--gold-grad);
        border-radius: $radius-full;
        transition: width 0.4s var(--ease);
    }

    &__count {
        font-size: 12px;
        font-weight: $fw-semibold;
        font-family: var(--font-body);
        color: var(--ink-muted);
        white-space: nowrap;
    }
}

/* Body */
.test-body {
    max-width: 760px;
    margin: 0 auto;
    padding: 40px 28px 80px;
    @media (max-width: $bp-sm) { padding: 24px 16px 60px; }
}

.test-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

/* Card pregunta */
.q-card {
    background: white;
    border: 1.5px solid var(--border);
    border-radius: var(--r-lg);
    padding: 20px 24px;
    box-shadow: var(--shadow-xs);
    transition: border-color 0.2s, box-shadow 0.2s;

    &:hover { box-shadow: var(--shadow-sm-new); }

    &--done {
        border-color: rgba(16,185,129,0.35);
        background: rgba(16,185,129,0.02);
    }

    @media (max-width: $bp-sm) { padding: 16px; }
}

.q-card__header {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 14px;
}

.q-card__num {
    width: 28px; height: 28px;
    border-radius: $radius-full;
    background: var(--blue-ink);
    color: white;
    font-size: 12px;
    font-weight: $fw-bold;
    font-family: var(--font-body);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;

    .q-card--done & { background: var(--color-success); }
}

.q-card__pregunta {
    font-size: 14px;
    font-weight: $fw-semibold;
    color: var(--blue-ink);
    margin: 0;
    line-height: 1.5;
    font-family: var(--font-body);
}

.q-card__options {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* Opciones */
.q-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 14px;
    border: 1.5px solid var(--border);
    border-radius: $radius-md;
    cursor: pointer;
    background: var(--color-bg);
    transition: border-color 0.18s, background 0.18s;
    user-select: none;

    &:hover { border-color: var(--color-primary); background: var(--blue-wash); }

    &--selected {
        background: var(--blue-ink);
        border-color: var(--blue-ink);
        .q-option__check { background: white; border-color: white; }
        .q-option__check::after { opacity: 1; }
        .q-option__text { color: white; }
    }

    &__input { display: none; }

    &__check {
        width: 16px; height: 16px;
        border-radius: $radius-full;
        border: 1.5px solid var(--border);
        background: white;
        flex-shrink: 0;
        position: relative;
        transition: border-color 0.18s, background 0.18s;

        &::after {
            content: '';
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%,-50%);
            width: 6px; height: 6px;
            background: var(--blue-ink);
            border-radius: $radius-full;
            opacity: 0;
            transition: opacity 0.15s;
        }
    }

    &__text {
        font-size: 13px;
        font-family: var(--font-body);
        color: var(--blue-ink);
        line-height: 1.4;
        transition: color 0.18s;
    }
}

/* Submit */
.test-submit {
    margin-top: 24px;
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

/* Transiciones */
.info-fade-enter-active, .info-fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.info-fade-enter-from, .info-fade-leave-to { opacity: 0; transform: translateY(-8px); }

.cta-appear-enter-active { transition: opacity 0.4s var(--ease), transform 0.4s var(--ease); }
.cta-appear-enter-from   { opacity: 0; transform: translateY(16px); }
</style>
