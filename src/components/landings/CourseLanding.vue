<script setup>
import { ref, computed } from 'vue'
import { lucia_info } from '../../static/facilitators/lucia-diaz.info.js'
import { apego_faq } from '../../static/faqs/apego-faq.js'
import { despierta_tu_mente_faq } from '../../static/faqs/despierta-tu-mente-faq.js'
import { useUtilStore } from '../../stores/util-store.js'

const props = defineProps({
    course: { type: Object, required: true },
    formation: { type: Object, default: null },
})

const util_store = useUtilStore()
const open_faq = ref(null)
const facilitator = lucia_info

const faqs = computed(() => {
    if (props.course.faq_import === 'apego') return apego_faq
    if (props.course.faq_import === 'despierta-tu-mente') return despierta_tu_mente_faq
    return []
})

const is_paid_workshop = computed(() => props.course.type === 'paid_workshop')

const available_places = computed(() => {
    if (!is_paid_workshop.value || !props.formation) return null
    const enrolled = props.formation.users_enrolled?.length || 0
    return Math.max(0, props.course.max_places - enrolled)
})

const is_full = computed(() => available_places.value === 0)

const places_message = computed(() => {
    if (!is_paid_workshop.value) return null
    const places = available_places.value
    if (places === 0) return 'Plazas agotadas'
    if (places <= 3) return `¡Últimas ${places} plazas!`
    if (places <= 7) return `Solo quedan ${places} plazas`
    return 'Plazas disponibles'
})

const whatsapp_link = computed(() => util_store.whatsapp_link)

const formatted_date = computed(() => {
    if (!props.formation?.start_date) return 'Fecha por confirmar'
    const date = new Date(props.formation.start_date)
    const options = is_paid_workshop.value
        ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        : { year: 'numeric', month: 'long', day: 'numeric' }
    const formatted = date.toLocaleDateString('es-ES', options)
    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
})

const days_until = computed(() => {
    if (!props.formation?.start_date) return ''
    const today = new Date()
    const course_date = new Date(props.formation.start_date)
    const diff = Math.ceil((course_date - today) / (1000 * 60 * 60 * 24))
    if (diff < 0) return 'Fecha pasada'
    if (diff === 0) return '¡Hoy!'
    if (diff === 1) return 'Mañana'
    return `Faltan ${diff} días`
})

const replace_date = (text) => {
    if (!text) return ''
    return text.replace(/\[FECHA\]/g, formatted_date.value)
}

const toggleFaq = (index) => {
    open_faq.value = open_faq.value === index ? null : index
}

const inscription_route = computed(() => `/inscripcion/${props.formation?.slug || props.course.slug}`)
</script>

<template>
    <div class="cl">

        <!-- ── HERO ── -->
        <section class="cl-hero">
            <div class="cl-hero__deco" />
            <div class="cl-hero__inner">
                <span class="cl-chip">
                    {{ is_paid_workshop ? 'Taller Presencial' : 'Curso Online Gratuito' }}
                </span>
                <h1 class="cl-hero__headline">{{ course.hero.headline }}</h1>
                <p class="cl-hero__sub">{{ course.hero.subheadline }}</p>

                <!-- Free course CTA -->
                <div v-if="!is_paid_workshop" class="cl-hero__cta">
                    <RouterLink :to="inscription_route" class="cl-btn cl-btn--gold cl-btn--lg">
                        {{ course.hero.cta_primary_label }}
                    </RouterLink>
                </div>

                <!-- Paid workshop CTAs -->
                <template v-else>
                    <div v-if="!is_full" class="cl-hero__cta cl-hero__cta--row">
                        <a :href="course.paypal_reserva_url" class="cl-btn cl-btn--gold cl-btn--lg" target="_blank">
                            {{ course.hero.cta_primary_label }}
                        </a>
                        <a :href="formation?.paypal_button" class="cl-btn cl-btn--outline cl-btn--lg" target="_blank">
                            {{ course.hero.cta_secondary_label }} ({{ formation?.price }}€)
                        </a>
                    </div>
                    <div v-else class="cl-hero__cta">
                        <p class="cl-hero__full-msg">Plazas agotadas para esta fecha</p>
                        <a :href="whatsapp_link" class="cl-btn cl-btn--whatsapp cl-btn--lg" target="_blank">
                            Contactar para próximas fechas
                        </a>
                    </div>
                </template>

                <!-- Info strip -->
                <div class="cl-hero__strip">
                    <template v-if="!is_paid_workshop">
                        <span v-for="(item, i) in course.hero.info_items" :key="i" class="cl-hero__strip-item">
                            {{ replace_date(item) }}
                        </span>
                    </template>
                    <template v-else>
                        <span class="cl-hero__strip-item">{{ places_message }}</span>
                        <span class="cl-hero__strip-item">{{ course.hero.location }}</span>
                        <span class="cl-hero__strip-item">{{ formatted_date }} · {{ days_until }}</span>
                    </template>
                </div>
            </div>
        </section>

        <!-- ── MIRROR ── -->
        <section class="cl-mirror">
            <div class="cl-container">
                <h2 class="cl-section-title">{{ course.mirror.title }}</h2>

                <template v-if="course.mirror.categories">
                    <div v-for="(cat, ci) in course.mirror.categories" :key="ci" class="cl-mirror__cat">
                        <h3 class="cl-mirror__cat-title">{{ cat.title }}</h3>
                        <div class="cl-check-grid">
                            <div v-for="(item, ii) in cat.items" :key="ii" class="cl-check-item">
                                <span class="cl-check-icon">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </span>
                                <p>{{ item }}</p>
                            </div>
                        </div>
                    </div>
                </template>

                <template v-else-if="course.mirror.items">
                    <div class="cl-check-grid cl-check-grid--flat">
                        <div v-for="(item, ii) in course.mirror.items" :key="ii" class="cl-check-item">
                            <span class="cl-check-icon">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
                            <p>{{ item }}</p>
                        </div>
                    </div>
                </template>

                <p class="cl-mirror__conclusion" v-html="course.mirror.conclusion" />
            </div>
        </section>

        <!-- ── BENEFITS (workshop only) ── -->
        <section v-if="is_paid_workshop && course.benefits" class="cl-benefits">
            <div class="cl-container">
                <h2 class="cl-section-title cl-section-title--white">{{ course.benefits.title }}</h2>
                <div class="cl-benefits__grid">
                    <div v-for="(benefit, bi) in course.benefits.items" :key="bi" class="cl-benefit-card">
                        <span class="cl-benefit-num">{{ bi + 1 }}</span>
                        <p>{{ benefit }}</p>
                    </div>
                </div>
                <p v-if="course.benefits.footer" class="cl-benefits__footer">{{ course.benefits.footer }}</p>
            </div>
        </section>

        <!-- ── CONTENT BLOCKS ── -->
        <section class="cl-content">
            <div class="cl-container cl-container--narrow">
                <h2 class="cl-section-title">{{ course.content.title }}</h2>
                <div class="cl-blocks">
                    <div v-for="(block, bi) in course.content.blocks" :key="bi" class="cl-block">
                        <div class="cl-block__head">
                            <span class="cl-block__num">{{ bi + 1 }}</span>
                            <h3 class="cl-block__title">{{ block.title }}</h3>
                        </div>
                        <p class="cl-block__desc">{{ block.description }}</p>
                        <div v-if="block.patterns" class="cl-patterns">
                            <div v-for="(pattern, pi) in block.patterns" :key="pi" class="cl-pattern">
                                <strong>{{ pattern.title }}</strong>
                                <p>{{ pattern.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <p v-if="course.content.footer" class="cl-content__footer">{{ course.content.footer }}</p>
            </div>
        </section>

        <!-- ── INCLUDES (free course only) ── -->
        <section v-if="!is_paid_workshop && course.includes" class="cl-includes">
            <div class="cl-container">
                <h2 class="cl-section-title cl-section-title--white">{{ course.includes.title }}</h2>
                <div class="cl-includes__grid">
                    <div v-for="(item, ii) in course.includes.items" :key="ii" class="cl-include-card">
                        <span class="cl-include-icon">{{ item.icon }}</span>
                        <h4>{{ replace_date(item.title) }}</h4>
                        <p>{{ replace_date(item.description) }}</p>
                    </div>
                </div>
                <div class="cl-includes__cta">
                    <RouterLink :to="inscription_route" class="cl-btn cl-btn--outline cl-btn--lg">
                        {{ course.includes.cta_label }}
                    </RouterLink>
                </div>
            </div>
        </section>

        <!-- ── TARGET (free course only) ── -->
        <section v-if="!is_paid_workshop && course.target" class="cl-target">
            <div class="cl-container">
                <div class="cl-target__grid">
                    <div class="cl-target__col">
                        <h3 class="cl-target__title cl-target__title--yes">{{ course.target.yes_title }}</h3>
                        <div class="cl-target__list">
                            <div v-for="(item, ti) in course.target.yes" :key="ti" class="cl-target-item cl-target-item--yes">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <p>{{ item }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="cl-target__col">
                        <h3 class="cl-target__title cl-target__title--no">{{ course.target.no_title }}</h3>
                        <div class="cl-target__list">
                            <div v-for="(item, ti) in course.target.no" :key="ti" class="cl-target-item cl-target-item--no">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                                <p>{{ item }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ── FACILITATOR ── -->
        <section class="cl-facilitator">
            <div class="cl-container">
                <h2 class="cl-section-title">Quién facilita</h2>
                <div class="cl-facilitator__inner">
                    <div class="cl-facilitator__photo">
                        <img :src="facilitator.photo" :alt="facilitator.name" />
                    </div>
                    <div class="cl-facilitator__info">
                        <p class="cl-facilitator__role">{{ facilitator.title }}</p>
                        <h3 class="cl-facilitator__name">{{ facilitator.name }}</h3>
                        <p class="cl-facilitator__bio" v-html="facilitator.bio.replace(/\n/g, '<br>')" />
                        <a :href="facilitator.instagram" class="cl-facilitator__ig" target="_blank" rel="noopener">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.5"/>
                                <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5"/>
                                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                            </svg>
                            {{ facilitator.instagram_handle }}
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- ── PROCESS (free course only) ── -->
        <section v-if="!is_paid_workshop && course.process" class="cl-process">
            <div class="cl-container">
                <h2 class="cl-section-title cl-section-title--white">{{ course.process.title }}</h2>
                <div class="cl-process__steps">
                    <div v-for="(step, si) in course.process.steps" :key="si" class="cl-step">
                        <span class="cl-step__num">{{ si + 1 }}</span>
                        <h4 class="cl-step__title">{{ step.title }}</h4>
                        <p class="cl-step__desc">{{ replace_date(step.description) }}</p>
                    </div>
                </div>
                <div class="cl-process__cta">
                    <RouterLink :to="inscription_route" class="cl-btn cl-btn--gold cl-btn--lg">
                        Inscribirme ahora
                    </RouterLink>
                </div>
            </div>
        </section>

        <!-- ── LOGISTICS (workshop only) ── -->
        <section v-if="is_paid_workshop && course.logistics" class="cl-logistics">
            <div class="cl-container cl-container--narrow">
                <h2 class="cl-section-title">{{ course.logistics.title }}</h2>
                <div class="cl-logistics__grid">
                    <div class="cl-logistics-card">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                        <h4>Fecha</h4>
                        <p>{{ formatted_date }}</p>
                    </div>
                    <div class="cl-logistics-card">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                        <h4>Horario</h4>
                        <p>{{ formation?.duration }}</p>
                    </div>
                    <div class="cl-logistics-card">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="1.5"/></svg>
                        <h4>Lugar</h4>
                        <p>{{ course.logistics.location }}</p>
                    </div>
                    <div class="cl-logistics-card">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                        <h4>Cupo</h4>
                        <p>{{ course.logistics.cupo }}</p>
                    </div>
                </div>

                <div class="cl-pricing">
                    <h3 class="cl-pricing__title">Inversión</h3>
                    <div class="cl-pricing__options">
                        <div class="cl-pricing-opt">
                            <span class="cl-pricing-opt__label">Reserva tu lugar</span>
                            <span class="cl-pricing-opt__price">30€</span>
                            <span class="cl-pricing-opt__note">Pagas el resto el día del curso</span>
                        </div>
                        <div class="cl-pricing-sep">o</div>
                        <div class="cl-pricing-opt">
                            <span class="cl-pricing-opt__label">Pago completo</span>
                            <span class="cl-pricing-opt__price">{{ formation?.price }}€</span>
                            <span class="cl-pricing-opt__note">Aseguras tu plaza ahora</span>
                        </div>
                    </div>
                    <div v-if="!is_full" class="cl-pricing__ctas">
                        <a :href="course.paypal_reserva_url" class="cl-btn cl-btn--gold cl-btn--lg" target="_blank">Reservar con 30€</a>
                        <a :href="formation?.paypal_button" class="cl-btn cl-btn--outline-dark cl-btn--lg" target="_blank">Pagar completo</a>
                    </div>
                    <div v-else class="cl-pricing__full">
                        <p>Plazas agotadas para esta fecha</p>
                        <a :href="whatsapp_link" class="cl-btn cl-btn--whatsapp cl-btn--lg" target="_blank">Contactar para próximas fechas</a>
                    </div>
                    <p class="cl-pricing__security">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                        Pago seguro · {{ places_message }}
                    </p>
                </div>
            </div>
        </section>

        <!-- ── FAQ ── -->
        <section v-if="faqs.length" class="cl-faq">
            <div class="cl-container cl-container--narrow">
                <h2 class="cl-section-title">Preguntas frecuentes</h2>
                <div class="cl-faq__list">
                    <div v-for="(item, fi) in faqs" :key="fi"
                        class="cl-faq-item"
                        :class="{ 'cl-faq-item--open': open_faq === fi }"
                        @click="toggleFaq(fi)">
                        <div class="cl-faq-item__q">
                            <h4>{{ item.question }}</h4>
                            <span class="cl-faq-item__chevron" :class="{ 'cl-faq-item__chevron--open': open_faq === fi }">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
                        </div>
                        <transition name="cl-faq-slide">
                            <div v-if="open_faq === fi" class="cl-faq-item__a">
                                <p v-html="replace_date(item.answer)" />
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </section>

        <!-- ── FINAL CTA ── -->
        <section class="cl-final">
            <div class="cl-final__deco" />
            <div class="cl-container cl-container--narrow cl-final__inner">
                <h2 class="cl-final__title">{{ course.final_cta.title }}</h2>
                <p v-if="course.final_cta.text" class="cl-final__text" v-html="course.final_cta.text" />
                <ul class="cl-final__examples">
                    <li v-for="(line, li) in course.final_cta.examples.split('\n').filter(l => l.trim())" :key="li">
                        {{ line }}
                    </li>
                </ul>
                <p class="cl-final__urgency">{{ course.final_cta.urgency }}</p>
                <div v-if="!is_paid_workshop" class="cl-final__cta">
                    <RouterLink :to="inscription_route" class="cl-btn cl-btn--gold cl-btn--xl">
                        {{ course.final_cta.cta_label }}
                    </RouterLink>
                </div>
                <div v-else-if="!is_full" class="cl-final__cta">
                    <a :href="formation?.paypal_button" class="cl-btn cl-btn--gold cl-btn--xl" target="_blank">
                        {{ course.final_cta.cta_label }}
                    </a>
                </div>
                <p v-if="course.final_cta.note" class="cl-final__note">{{ replace_date(course.final_cta.note) }}</p>
            </div>
        </section>

    </div>
</template>

<style scoped lang="scss">
.cl {
    width: 100%;
    background: var(--color-bg);
}

/* ── Shared layout ── */
.cl-container {
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 28px;

    &--narrow { max-width: 860px; }

    @media (max-width: $bp-sm) { padding: 0 16px; }
}

.cl-chip {
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

.cl-section-title {
    font-family: var(--font-title);
    font-size: clamp(26px, 4vw, 38px);
    font-weight: 700;
    color: var(--blue-ink);
    text-align: center;
    margin: 0 0 40px;
    line-height: 1.2;

    &--white { color: white; }
}

/* ── Buttons ── */
.cl-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 13px 28px;
    border-radius: $radius-full;
    font-size: 14px;
    font-weight: $fw-bold;
    font-family: var(--font-body);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;

    &--gold {
        background: var(--gold-grad);
        color: white;
        box-shadow: var(--shadow-gold-new);
        &:hover { transform: translateY(-2px); box-shadow: var(--shadow-gold-glow); color: var(--blue-ink); }
    }

    &--outline {
        background: transparent;
        color: rgba(255,255,255,0.9);
        border: 1.5px solid rgba(255,255,255,0.4);
        &:hover { border-color: white; color: white; }
    }

    &--outline-dark {
        background: transparent;
        color: var(--blue-ink);
        border: 1.5px solid rgba(30,86,160,0.3);
        &:hover { border-color: var(--blue-ink); }
    }

    &--whatsapp {
        background: #25D366;
        color: white;
        &:hover { background: #20ba5a; transform: translateY(-2px); }
    }

    &--lg { padding: 16px 36px; font-size: 15px; }
    &--xl { padding: 18px 48px; font-size: 16px; }
}

/* ── HERO ── */
.cl-hero {
    background: var(--blue-ink);
    min-height: 92vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120px 28px 80px;
    position: relative;
    overflow: hidden;
    text-align: center;

    @media (max-width: $bp-sm) { padding: 100px 16px 60px; }

    &__deco {
        position: absolute;
        top: -160px; left: 50%;
        transform: translateX(-50%);
        width: 900px; height: 900px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(245,197,24,0.07), transparent 60%);
        pointer-events: none;
    }

    &__inner {
        position: relative;
        z-index: 1;
        max-width: 840px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    &__headline {
        font-family: var(--font-title);
        font-size: clamp(28px, 5.5vw, 58px);
        font-weight: 700;
        color: white;
        line-height: 1.15;
        margin: 0 0 24px;
    }

    &__sub {
        font-family: var(--font-body);
        font-size: clamp(16px, 2vw, 20px);
        color: rgba(255,255,255,0.72);
        line-height: 1.7;
        margin: 0 0 40px;
        max-width: 680px;
    }

    &__cta { margin-bottom: 32px; }

    &__cta--row {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        justify-content: center;
    }

    &__full-msg {
        font-family: var(--font-body);
        font-size: 16px;
        color: rgba(255,255,255,0.7);
        margin: 0 0 16px;
    }

    &__strip {
        display: flex;
        gap: 24px;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 8px;
    }

    &__strip-item {
        font-family: var(--font-body);
        font-size: 13px;
        color: rgba(255,255,255,0.6);
        display: flex;
        align-items: center;
        gap: 6px;
    }
}

/* ── MIRROR ── */
.cl-mirror {
    padding: 80px 28px;
    background: white;

    @media (max-width: $bp-sm) { padding: 56px 16px; }

    &__cat { margin-bottom: 48px; }

    &__cat-title {
        font-family: var(--font-title);
        font-size: 18px;
        color: var(--blue-ink);
        margin: 0 0 20px;
    }

    &__conclusion {
        font-family: var(--font-body);
        font-size: 18px;
        text-align: center;
        color: var(--ink);
        line-height: 1.65;
        margin: 40px 0 0;

        :deep(strong) { color: var(--blue-ink); }
    }
}

.cl-check-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 12px;

    &--flat { margin-top: 8px; }

    @media (max-width: $bp-sm) { grid-template-columns: 1fr; }
}

.cl-check-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 18px;
    background: var(--color-bg);
    border-radius: $radius-md;
    border: 1.5px solid var(--border);
    transition: border-color 0.2s;

    &:hover { border-color: rgba(30,86,160,0.25); }

    p {
        margin: 0;
        font-size: 14px;
        font-family: var(--font-body);
        color: var(--ink);
        line-height: 1.55;
    }
}

.cl-check-icon {
    flex-shrink: 0;
    width: 22px; height: 22px;
    background: var(--blue-ink);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
}

/* ── BENEFITS ── */
.cl-benefits {
    padding: 80px 28px;
    background: var(--blue-ink);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        bottom: -160px; right: -100px;
        width: 600px; height: 600px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(245,197,24,0.06), transparent 65%);
        pointer-events: none;
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
        position: relative;
        z-index: 1;
        @media (max-width: $bp-sm) { grid-template-columns: 1fr; }
    }

    &__footer {
        font-family: var(--font-body);
        font-size: 16px;
        color: rgba(255,255,255,0.65);
        text-align: center;
        margin: 32px 0 0;
        font-style: italic;
    }
}

.cl-benefit-card {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--r-xl);
    padding: 24px;
    display: flex;
    gap: 16px;
    align-items: flex-start;

    p {
        margin: 0;
        font-size: 14px;
        font-family: var(--font-body);
        color: rgba(255,255,255,0.82);
        line-height: 1.6;
    }
}

.cl-benefit-num {
    flex-shrink: 0;
    width: 32px; height: 32px;
    background: var(--gold-grad);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: $fw-bold;
    font-size: 14px;
    font-family: var(--font-body);
}

/* ── CONTENT BLOCKS ── */
.cl-content {
    padding: 80px 28px;
    background: var(--color-bg);

    @media (max-width: $bp-sm) { padding: 56px 16px; }

    &__footer {
        font-family: var(--font-body);
        font-size: 15px;
        color: var(--ink-muted);
        text-align: center;
        margin: 32px 0 0;
        font-style: italic;
    }
}

.cl-blocks {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.cl-block {
    background: white;
    border-radius: var(--r-xl);
    border: 1.5px solid var(--border);
    padding: 28px 32px;
    box-shadow: var(--shadow-md-new);

    @media (max-width: $bp-sm) { padding: 20px 18px; }

    &__head {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 12px;
    }

    &__num {
        flex-shrink: 0;
        width: 32px; height: 32px;
        background: var(--blue-ink);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: $fw-bold;
        font-size: 14px;
        font-family: var(--font-body);
    }

    &__title {
        font-family: var(--font-title);
        font-size: 18px;
        font-weight: 700;
        color: var(--blue-ink);
        margin: 0;
    }

    &__desc {
        font-family: var(--font-body);
        font-size: 14px;
        color: var(--ink-soft);
        line-height: 1.7;
        margin: 0;
    }
}

.cl-patterns {
    margin-top: 16px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;

    @media (max-width: $bp-sm) { grid-template-columns: 1fr; }
}

.cl-pattern {
    background: var(--color-bg);
    border-radius: $radius-md;
    border: 1px solid var(--border);
    padding: 14px 18px;

    strong {
        display: block;
        font-family: var(--font-body);
        font-size: 13px;
        font-weight: $fw-bold;
        color: var(--blue-ink);
        margin-bottom: 6px;
    }

    p {
        margin: 0;
        font-family: var(--font-body);
        font-size: 13px;
        color: var(--ink-soft);
        line-height: 1.6;
    }
}

/* ── INCLUDES ── */
.cl-includes {
    padding: 80px 28px;
    background: var(--blue-ink);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -120px; left: -80px;
        width: 500px; height: 500px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(245,197,24,0.06), transparent 65%);
        pointer-events: none;
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 20px;
        position: relative;
        z-index: 1;
        margin-bottom: 40px;

        @media (max-width: $bp-sm) { grid-template-columns: 1fr; }
    }

    &__cta {
        text-align: center;
        position: relative;
        z-index: 1;
    }
}

.cl-include-card {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--r-xl);
    padding: 28px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .cl-include-icon {
        font-size: 28px;
    }

    h4 {
        font-family: var(--font-body);
        font-size: 15px;
        font-weight: $fw-bold;
        color: white;
        margin: 0;
    }

    p {
        font-family: var(--font-body);
        font-size: 13px;
        color: rgba(255,255,255,0.6);
        line-height: 1.6;
        margin: 0;
    }
}

/* ── TARGET ── */
.cl-target {
    padding: 80px 28px;
    background: white;

    @media (max-width: $bp-sm) { padding: 56px 16px; }

    &__grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        max-width: 860px;
        margin: 0 auto;

        @media (max-width: $bp-sm) { grid-template-columns: 1fr; gap: 32px; }
    }

    &__col { display: flex; flex-direction: column; gap: 12px; }

    &__title {
        font-family: var(--font-title);
        font-size: 20px;
        margin: 0 0 16px;

        &--yes { color: #10b981; }
        &--no  { color: #ef4444; }
    }

    &__list { display: flex; flex-direction: column; gap: 10px; }
}

.cl-target-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
    border-radius: $radius-md;

    svg { flex-shrink: 0; margin-top: 2px; }

    p {
        margin: 0;
        font-family: var(--font-body);
        font-size: 14px;
        line-height: 1.55;
    }

    &--yes {
        background: rgba(16,185,129,0.07);
        border: 1px solid rgba(16,185,129,0.2);
        svg { color: #10b981; }
        p { color: var(--ink); }
    }

    &--no {
        background: rgba(239,68,68,0.06);
        border: 1px solid rgba(239,68,68,0.15);
        svg { color: #ef4444; }
        p { color: var(--ink); }
    }
}

/* ── FACILITATOR ── */
.cl-facilitator {
    padding: 80px 28px;
    background: var(--color-bg);

    @media (max-width: $bp-sm) { padding: 56px 16px; }

    &__inner {
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: 48px;
        align-items: start;
        max-width: 860px;
        margin: 0 auto;

        @media (max-width: $bp-sm) { grid-template-columns: 1fr; gap: 28px; }
    }

    &__photo {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid transparent;
        background: var(--gold-grad);
        padding: 3px;
        flex-shrink: 0;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            display: block;
        }

        @media (max-width: $bp-sm) { margin: 0 auto; }
    }

    &__role {
        font-family: var(--font-body);
        font-size: 11px;
        font-weight: $fw-bold;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: var(--gold-deep);
        margin: 0 0 8px;
    }

    &__name {
        font-family: var(--font-title);
        font-size: 28px;
        font-weight: 700;
        color: var(--blue-ink);
        margin: 0 0 16px;
    }

    &__bio {
        font-family: var(--font-body);
        font-size: 15px;
        color: var(--ink-soft);
        line-height: 1.75;
        margin: 0 0 20px;
    }

    &__ig {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-body);
        font-size: 14px;
        font-weight: $fw-semibold;
        color: var(--blue-ink);
        text-decoration: none;
        transition: color 0.2s;
        &:hover { color: var(--color-primary); }
    }
}

/* ── PROCESS ── */
.cl-process {
    padding: 80px 28px;
    background: var(--blue-ink);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -120px; right: -80px;
        width: 500px; height: 500px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(245,197,24,0.07), transparent 65%);
        pointer-events: none;
    }

    &__steps {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 24px;
        position: relative;
        z-index: 1;
        margin-bottom: 48px;

        @media (max-width: $bp-sm) { grid-template-columns: 1fr; }
    }

    &__cta {
        text-align: center;
        position: relative;
        z-index: 1;
    }
}

.cl-step {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--r-xl);
    padding: 28px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__num {
        width: 36px; height: 36px;
        background: var(--gold-grad);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: $fw-bold;
        font-size: 16px;
        font-family: var(--font-body);
    }

    &__title {
        font-family: var(--font-title);
        font-size: 18px;
        color: white;
        margin: 0;
    }

    &__desc {
        font-family: var(--font-body);
        font-size: 14px;
        color: rgba(255,255,255,0.62);
        line-height: 1.65;
        margin: 0;
    }
}

/* ── LOGISTICS ── */
.cl-logistics {
    padding: 80px 28px;
    background: white;

    @media (max-width: $bp-sm) { padding: 56px 16px; }

    &__grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 48px;

        @media (max-width: $bp-md) { grid-template-columns: repeat(2, 1fr); }
        @media (max-width: $bp-sm) { grid-template-columns: 1fr 1fr; }
    }
}

.cl-logistics-card {
    background: var(--color-bg);
    border-radius: var(--r-xl);
    border: 1.5px solid var(--border);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    svg { color: var(--blue-ink); }

    h4 {
        font-family: var(--font-body);
        font-size: 11px;
        font-weight: $fw-bold;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--ink-muted);
        margin: 0;
    }

    p {
        font-family: var(--font-body);
        font-size: 15px;
        font-weight: $fw-semibold;
        color: var(--blue-ink);
        margin: 0;
    }
}

.cl-pricing {
    background: var(--color-bg);
    border-radius: var(--r-xl);
    border: 1.5px solid var(--border);
    padding: 36px;

    @media (max-width: $bp-sm) { padding: 24px 18px; }

    &__title {
        font-family: var(--font-title);
        font-size: 22px;
        color: var(--blue-ink);
        margin: 0 0 24px;
        text-align: center;
    }

    &__options {
        display: flex;
        align-items: center;
        gap: 24px;
        margin-bottom: 32px;
        justify-content: center;
        flex-wrap: wrap;
    }

    &__ctas {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 16px;
    }

    &__full {
        text-align: center;
        p {
            font-family: var(--font-body);
            color: var(--ink-muted);
            margin: 0 0 16px;
        }
    }

    &__security {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-family: var(--font-body);
        font-size: 12px;
        color: var(--ink-muted);
        margin: 16px 0 0;
    }
}

.cl-pricing-opt {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    &__label {
        font-family: var(--font-body);
        font-size: 12px;
        font-weight: $fw-semibold;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--ink-muted);
    }

    &__price {
        font-family: var(--font-title);
        font-size: 36px;
        font-weight: 700;
        color: var(--blue-ink);
    }

    &__note {
        font-family: var(--font-body);
        font-size: 12px;
        color: var(--ink-muted);
    }
}

.cl-pricing-sep {
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--ink-muted);
    padding: 0 8px;
}

/* ── FAQ ── */
.cl-faq {
    padding: 80px 28px;
    background: var(--color-bg);

    @media (max-width: $bp-sm) { padding: 56px 16px; }

    &__list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
}

.cl-faq-item {
    background: white;
    border-radius: var(--r-xl);
    border: 1.5px solid var(--border);
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.2s;

    &:hover { border-color: rgba(30,86,160,0.3); }
    &--open { border-color: var(--blue-ink); }

    &__q {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 20px 24px;

        h4 {
            font-family: var(--font-body);
            font-size: 15px;
            font-weight: $fw-semibold;
            color: var(--blue-ink);
            margin: 0;
            flex: 1;
        }
    }

    &__chevron {
        flex-shrink: 0;
        color: var(--ink-muted);
        transition: transform 0.25s;
        display: flex;

        &--open { transform: rotate(180deg); }
    }

    &__a {
        padding: 0 24px 20px;
        border-top: 1px solid var(--border);

        p {
            margin: 16px 0 0;
            font-family: var(--font-body);
            font-size: 14px;
            color: var(--ink-soft);
            line-height: 1.7;
        }
    }
}

.cl-faq-slide-enter-active,
.cl-faq-slide-leave-active { transition: opacity 0.2s; }
.cl-faq-slide-enter-from,
.cl-faq-slide-leave-to { opacity: 0; }

/* ── FINAL CTA ── */
.cl-final {
    background: var(--blue-ink);
    padding: 96px 28px 80px;
    text-align: center;
    position: relative;
    overflow: hidden;

    @media (max-width: $bp-sm) { padding: 72px 16px 60px; }

    &__deco {
        position: absolute;
        bottom: -160px; left: 50%;
        transform: translateX(-50%);
        width: 800px; height: 800px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(245,197,24,0.08), transparent 60%);
        pointer-events: none;
    }

    &__inner {
        position: relative;
        z-index: 1;
    }

    &__title {
        font-family: var(--font-title);
        font-size: clamp(22px, 4vw, 38px);
        font-weight: 700;
        color: white;
        margin: 0 0 20px;
        line-height: 1.25;
    }

    &__text {
        font-family: var(--font-body);
        font-size: 18px;
        color: rgba(255,255,255,0.8);
        margin: 0 0 28px;
        line-height: 1.6;

        :deep(strong) { color: white; }
    }

    &__examples {
        list-style: none;
        padding: 0;
        margin: 0 0 28px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;

        li {
            font-family: var(--font-body);
            font-size: 15px;
            color: rgba(255,255,255,0.6);
            line-height: 1.5;
        }
    }

    &__urgency {
        font-family: var(--font-body);
        font-size: 16px;
        font-weight: $fw-semibold;
        color: rgba(255,255,255,0.85);
        margin: 0 0 36px;
    }

    &__cta { margin-bottom: 28px; }

    &__note {
        font-family: var(--font-body);
        font-size: 13px;
        color: rgba(255,255,255,0.45);
        margin: 0;
        line-height: 1.7;
        white-space: pre-line;
    }
}
</style>
