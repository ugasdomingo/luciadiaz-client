<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../../../stores/auth-store.js'
import { test_info } from '../../../static/test-info.js'
import ArchetypeResultComponent from '../../tests/results/ArchetypeResultComponent.vue'
import TemperamentResultComponent from '../../tests/results/TemperamentResultComponent.vue'
import LetterResultComponent from '../../tests/results/LetterResultComponent.vue'

const auth_store = useAuthStore()
const archetype_completed = ref(false)
const temperament_completed = ref(false)
const letter_completed = ref(false)
const expanded_items = reactive({})

const toggle = (id) => {
    expanded_items[id] = !expanded_items[id]
}

const is_completed = (test_name) => {
    if (test_name === 'Arquetipos de la personalidad') return archetype_completed.value
    if (test_name === 'Temperamentos') return temperament_completed.value
    if (test_name === 'Carta del inconsciente') return letter_completed.value
    return false
}

// Accordion CSS transitions
const enter = (el) => { el.style.height = el.scrollHeight + 'px' }
const afterEnter = (el) => { el.style.height = 'auto' }
const leave = (el) => {
    el.style.height = el.scrollHeight + 'px'
    requestAnimationFrame(() => { el.style.height = '0' })
}
const afterLeave = (el) => { el.style.height = '' }

onMounted(async () => {
    if (!auth_store.user_data) await auth_store.refresh()
    const tests = auth_store.user_data?.test_results || []
    tests.forEach(t => {
        if (t.test_name === 'Arquetipo') archetype_completed.value = true
        else if (t.test_name === 'Temperamento') temperament_completed.value = true
        else if (t.test_name === 'Carta del Inconsciente') letter_completed.value = true
    })
})
</script>

<template>
    <section class="test-results">
        <!-- Header -->
        <div class="section-header">
            <div class="section-header__text">
                <h2 class="section-header__title">Resultados de Tests</h2>
                <p class="section-header__sub">Tus resultados guardados. Expande cada test para ver el análisis completo.</p>
            </div>
        </div>

        <!-- Cards accordion -->
        <div class="test-list">
            <article
                v-for="test in test_info"
                :key="test.id"
                class="test-card"
                :class="{ 'test-card--open': expanded_items[test.id], 'test-card--done': is_completed(test.name) }"
            >
                <!-- Header del card -->
                <button class="test-card__header" @click="toggle(test.id)">
                    <div class="test-card__header-left">
                        <span class="test-card__status-dot" :class="is_completed(test.name) ? 'done' : 'pending'" />
                        <span class="test-card__name">{{ test.name }}</span>
                        <span class="test-card__badge" :class="is_completed(test.name) ? 'badge--done' : 'badge--pending'">
                            {{ is_completed(test.name) ? 'Completado' : 'Pendiente' }}
                        </span>
                    </div>
                    <span class="test-card__chevron" :class="{ rotated: expanded_items[test.id] }">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </button>

                <!-- Contenido -->
                <Transition
                    name="accordion"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave"
                >
                    <div v-show="expanded_items[test.id]" class="test-card__body">
                        <div class="test-card__body-inner">
                            <!-- Resultado arquetipos -->
                            <template v-if="test.name === 'Arquetipos de la personalidad' && archetype_completed">
                                <ArchetypeResultComponent
                                    :archetype_results="auth_store.user_data.test_results.find(r => r.test_name === 'Arquetipo')?.results"
                                />
                            </template>

                            <!-- Resultado temperamentos -->
                            <template v-else-if="test.name === 'Temperamentos' && temperament_completed">
                                <TemperamentResultComponent
                                    :temperament_results="auth_store.user_data.test_results.find(r => r.test_name === 'Temperamento')?.results"
                                    :user_name="auth_store.user_data.user.name.split(' ')[0]"
                                />
                            </template>

                            <!-- Resultado carta -->
                            <template v-else-if="test.name === 'Carta del inconsciente' && letter_completed">
                                <LetterResultComponent
                                    :letter_results="auth_store.user_data.test_results.find(r => r.test_name === 'Carta del Inconsciente')?.results"
                                    :user_name="auth_store.user_data.user.name.split(' ')[0]"
                                />
                            </template>

                            <!-- No completado -->
                            <div v-else class="test-empty">
                                <div class="test-empty__icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                </div>
                                <h4>Aún no has realizado este test</h4>
                                <p class="test-empty__brief">{{ test.brief }}</p>
                                <p class="test-empty__desc">{{ test.description }}</p>
                                <RouterLink :to="test.link" class="test-empty__cta">
                                    Comenzar test
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </Transition>
            </article>
        </div>
    </section>
</template>

<style scoped lang="scss">
/* ── Header de sección ── */
.section-header {
    margin-bottom: 36px;

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
    }
}

/* ── Lista de tests ── */
.test-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* ── Card ── */
.test-card {
    background: white;
    border-radius: var(--r-lg);
    border: 1.5px solid var(--border);
    box-shadow: var(--shadow-xs);
    overflow: hidden;
    transition: border-color 0.2s var(--ease), box-shadow 0.2s var(--ease);

    &:hover { box-shadow: var(--shadow-sm-new); }

    &--done {
        border-color: rgba(16,185,129,0.25);
        &:hover { border-color: rgba(16,185,129,0.4); }
    }

    &--open {
        box-shadow: var(--shadow-md-new);
        border-color: var(--border-gold);
    }
}

/* ── Header del card ── */
.test-card__header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    gap: 12px;

    @media (max-width: $bp-sm) { padding: 16px; }
}

.test-card__header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
}

.test-card__status-dot {
    width: 9px; height: 9px;
    border-radius: $radius-full;
    flex-shrink: 0;
    &.done    { background: var(--color-success); box-shadow: 0 0 0 3px rgba(16,185,129,0.15); }
    &.pending { background: var(--ink-faint); }
}

.test-card__name {
    font-family: var(--font-title);
    font-size: 16px;
    font-weight: 600;
    color: var(--blue-ink);
    flex: 1;

    @media (max-width: $bp-sm) { font-size: 14px; }
}

.test-card__badge {
    font-size: 11px;
    font-weight: $fw-semibold;
    font-family: var(--font-body);
    padding: 3px 10px;
    border-radius: $radius-full;
    white-space: nowrap;
    flex-shrink: 0;

    &--done {
        background: rgba(16,185,129,0.1);
        color: var(--color-success);
    }

    &--pending {
        background: var(--color-bg);
        color: var(--ink-muted);
    }

    @media (max-width: $bp-xs) { display: none; }
}

.test-card__chevron {
    color: var(--ink-faint);
    transition: transform 0.3s var(--ease), color 0.2s;
    flex-shrink: 0;
    &.rotated { transform: rotate(180deg); color: var(--gold); }
}

/* ── Body (acordeón) ── */
.test-card__body {
    overflow: hidden;
    transition: height 0.35s cubic-bezier(.4,0,.2,1);
}

.test-card__body-inner {
    padding: 0 24px 28px;
    border-top: 1px solid var(--border);

    @media (max-width: $bp-sm) { padding: 0 16px 20px; }
}

/* ── Estado vacío ── */
.test-empty {
    padding-top: 28px;
    text-align: center;
    max-width: 480px;
    margin: 0 auto;

    &__icon {
        width: 56px; height: 56px;
        background: var(--blue-wash);
        border-radius: $radius-full;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        color: var(--color-primary);
    }

    h4 {
        font-family: var(--font-title);
        font-size: 17px;
        color: var(--blue-ink);
        margin: 0 0 10px;
    }

    &__brief {
        font-size: 13px;
        font-weight: $fw-semibold;
        color: var(--color-text-muted);
        margin: 0 0 6px;
    }

    &__desc {
        font-size: 13px;
        color: var(--ink-muted);
        line-height: 1.7;
        margin: 0 0 20px;
    }

    &__cta {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 11px 24px;
        background: var(--gold-grad);
        color: white;
        text-decoration: none;
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
}

/* ── Animación acordeón ── */
.accordion-enter-active, .accordion-leave-active {
    overflow: hidden;
    transition: height 0.35s cubic-bezier(.4,0,.2,1);
}
.accordion-enter-from, .accordion-leave-to { height: 0 !important; }
</style>
