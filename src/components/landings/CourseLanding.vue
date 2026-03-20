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

// --- Paid workshop computed ---
const available_places = computed(() => {
    if (!is_paid_workshop.value || !props.formation) return null
    const enrolled = props.formation.users_enrolled?.length || 0
    return Math.max(0, props.course.max_places - enrolled)
})

const is_full = computed(() => available_places.value === 0)

const places_message = computed(() => {
    if (!is_paid_workshop.value) return null
    const places = available_places.value
    if (places === 0) return '✋ Plazas agotadas'
    if (places <= 3) return `🔥 ¡ÚLTIMAS ${places} PLAZAS!`
    if (places <= 7) return `⚠️ Solo quedan ${places} plazas disponibles`
    return '✓ Plazas disponibles'
})

const whatsapp_link = computed(() => util_store.whatsapp_link)

// --- Date formatting ---
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

// Replace [FECHA] placeholder in texts
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
    <div class="course-landing">

        <!-- ========== HERO ========== -->
        <section class="hero">
            <div class="hero__container">
                <h1 class="hero__headline">{{ course.hero.headline }}</h1>
                <p class="hero__subheadline">{{ course.hero.subheadline }}</p>

                <!-- Free course CTA -->
                <div v-if="!is_paid_workshop" class="hero__cta">
                    <RouterLink :to="inscription_route" class="cta-btn cta-btn--primary">
                        {{ course.hero.cta_primary_label }}
                    </RouterLink>
                </div>

                <!-- Paid workshop CTAs -->
                <template v-else>
                    <div v-if="!is_full" class="hero__ctas">
                        <a :href="course.paypal_reserva_url" class="cta-btn cta-btn--primary" target="_blank">
                            {{ course.hero.cta_primary_label }}
                        </a>
                        <a :href="formation?.paypal_button" class="cta-btn cta-btn--secondary" target="_blank">
                            {{ course.hero.cta_secondary_label }} ({{ formation?.price }}$)
                        </a>
                    </div>
                    <div v-else class="hero__full">
                        <p class="full-message">✋ Plazas agotadas para esta fecha</p>
                        <a :href="whatsapp_link" class="cta-btn cta-btn--whatsapp" target="_blank">
                            Contactar por WhatsApp para próximas fechas
                        </a>
                    </div>
                </template>

                <!-- Info quick strip -->
                <div class="hero__info">
                    <template v-if="!is_paid_workshop">
                        <span v-for="(item, i) in course.hero.info_items" :key="i">
                            {{ replace_date(item) }}
                        </span>
                    </template>
                    <template v-else>
                        <span>{{ places_message }}</span>
                        <span>📍 {{ course.hero.location }}</span>
                        <span>📅 {{ formatted_date }} ({{ days_until }})</span>
                    </template>
                </div>
            </div>
        </section>

        <!-- ========== MIRROR ========== -->
        <section class="mirror">
            <div class="mirror__container">
                <h2 class="mirror__title">{{ course.mirror.title }}</h2>

                <!-- Apego: categorized items -->
                <template v-if="course.mirror.categories">
                    <div class="mirror__category" v-for="(cat, ci) in course.mirror.categories" :key="ci">
                        <h3 class="mirror__category-title">{{ cat.title }}</h3>
                        <div class="mirror__items">
                            <div class="check-item" v-for="(item, ii) in cat.items" :key="ii">
                                <span class="check-icon">✓</span>
                                <p>{{ item }}</p>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- Despierta: flat items -->
                <template v-else-if="course.mirror.items">
                    <div class="mirror__checks">
                        <div class="check-item" v-for="(item, ii) in course.mirror.items" :key="ii">
                            <span class="check-icon">✓</span>
                            <p>{{ item }}</p>
                        </div>
                    </div>
                </template>

                <p class="mirror__conclusion" v-html="course.mirror.conclusion" />
            </div>
        </section>

        <!-- ========== BENEFITS (workshop only) ========== -->
        <section v-if="is_paid_workshop && course.benefits" class="benefits">
            <div class="benefits__container">
                <h2 class="benefits__title">{{ course.benefits.title }}</h2>
                <div class="benefits__grid">
                    <div class="benefit-card" v-for="(benefit, bi) in course.benefits.items" :key="bi">
                        <span class="benefit-number">{{ bi + 1 }}</span>
                        <p class="benefit-text">{{ benefit }}</p>
                    </div>
                </div>
                <p class="benefits__footer">{{ course.benefits.footer }}</p>
            </div>
        </section>

        <!-- ========== CONTENT BLOCKS ========== -->
        <section class="content">
            <div class="content__container">
                <h2 class="content__title">{{ course.content.title }}</h2>
                <div class="content__blocks">
                    <div class="content-block" v-for="(block, bi) in course.content.blocks" :key="bi">
                        <div class="content-block__header">
                            <span class="content-block__number">{{ bi + 1 }}</span>
                            <h3 class="content-block__title">{{ block.title }}</h3>
                        </div>
                        <p class="content-block__description">{{ block.description }}</p>
                        <div v-if="block.patterns" class="content-block__patterns">
                            <div class="pattern-item" v-for="(pattern, pi) in block.patterns" :key="pi">
                                <strong>{{ pattern.title }}</strong>
                                <p>{{ pattern.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <p v-if="course.content.footer" class="content__footer">{{ course.content.footer }}</p>
            </div>
        </section>

        <!-- ========== INCLUDES (free course only) ========== -->
        <section v-if="!is_paid_workshop && course.includes" class="includes">
            <div class="includes__container">
                <h2 class="includes__title">{{ course.includes.title }}</h2>
                <div class="includes__grid">
                    <div class="include-card" v-for="(item, ii) in course.includes.items" :key="ii">
                        <span class="include-icon">{{ item.icon }}</span>
                        <h4>{{ replace_date(item.title) }}</h4>
                        <p>{{ replace_date(item.description) }}</p>
                    </div>
                </div>
                <div class="includes__cta">
                    <RouterLink :to="inscription_route" class="cta-btn cta-btn--secondary">
                        {{ course.includes.cta_label }}
                    </RouterLink>
                </div>
            </div>
        </section>

        <!-- ========== TARGET (free course only) ========== -->
        <section v-if="!is_paid_workshop && course.target" class="target">
            <div class="target__container">
                <div class="target__column">
                    <h3 class="target__subtitle">{{ course.target.yes_title }}</h3>
                    <div class="target__list">
                        <div class="target-item target-item--yes" v-for="(item, ti) in course.target.yes" :key="ti">
                            <span class="target-icon">✓</span>
                            <p>{{ item }}</p>
                        </div>
                    </div>
                </div>
                <div class="target__column">
                    <h3 class="target__subtitle">{{ course.target.no_title }}</h3>
                    <div class="target__list">
                        <div class="target-item target-item--no" v-for="(item, ti) in course.target.no" :key="ti">
                            <span class="target-icon">✗</span>
                            <p>{{ item }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========== FACILITATOR ========== -->
        <section class="facilitator">
            <div class="facilitator__container">
                <h2 class="facilitator__title">Quién facilita</h2>
                <div class="facilitator__content">
                    <div class="facilitator__photo">
                        <img :src="facilitator.photo" :alt="facilitator.name" />
                    </div>
                    <div class="facilitator__info">
                        <h3 class="facilitator__name">{{ facilitator.name }}</h3>
                        <p class="facilitator__title-role">{{ facilitator.title }}</p>
                        <p class="facilitator__bio" v-html="facilitator.bio.replace(/\n/g, '<br>')" />
                        <a :href="facilitator.instagram" class="facilitator__instagram" target="_blank" rel="noopener">
                            📸 {{ facilitator.instagram_handle }}
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========== PROCESS (free course only) ========== -->
        <section v-if="!is_paid_workshop && course.process" class="process">
            <div class="process__container">
                <h2 class="process__title">{{ course.process.title }}</h2>
                <div class="process__steps">
                    <div class="step" v-for="(step, si) in course.process.steps" :key="si">
                        <span class="step__number">{{ si + 1 }}</span>
                        <h4 class="step__title">{{ step.title }}</h4>
                        <p class="step__description">{{ replace_date(step.description) }}</p>
                    </div>
                </div>
                <div class="process__cta">
                    <RouterLink :to="inscription_route" class="cta-btn cta-btn--primary cta-btn--large">
                        Inscribirme ahora
                    </RouterLink>
                </div>
            </div>
        </section>

        <!-- ========== LOGISTICS (workshop only) ========== -->
        <section v-if="is_paid_workshop && course.logistics" class="logistics">
            <div class="logistics__container">
                <h2 class="logistics__title">{{ course.logistics.title }}</h2>
                <div class="logistics__grid">
                    <div class="logistics-card">
                        <span class="logistics-icon">📅</span>
                        <h4>Fecha</h4>
                        <p>{{ formatted_date }}</p>
                    </div>
                    <div class="logistics-card">
                        <span class="logistics-icon">🕐</span>
                        <h4>Horario</h4>
                        <p>{{ formation?.duration }}</p>
                    </div>
                    <div class="logistics-card">
                        <span class="logistics-icon">📍</span>
                        <h4>Lugar</h4>
                        <p>{{ course.logistics.location }}</p>
                    </div>
                    <div class="logistics-card">
                        <span class="logistics-icon">👥</span>
                        <h4>Cupo</h4>
                        <p>{{ course.logistics.cupo }}</p>
                    </div>
                </div>

                <!-- Pricing block -->
                <div class="pricing">
                    <h3 class="pricing__title">Inversión</h3>
                    <div class="pricing__content">
                        <div class="pricing__options">
                            <div class="pricing-option">
                                <span class="pricing-label">Reserva tu lugar</span>
                                <span class="pricing-value pricing-value--accent">30$</span>
                                <span class="pricing-note">Pagas el resto el día del curso</span>
                            </div>
                            <div class="pricing-separator">o</div>
                            <div class="pricing-option">
                                <span class="pricing-label">Pago completo</span>
                                <span class="pricing-value">{{ formation?.price }}$</span>
                                <span class="pricing-note">Aseguras tu plaza ahora</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="!is_full" class="pricing__ctas">
                        <a :href="course.paypal_reserva_url" class="cta-btn cta-btn--primary cta-btn--large" target="_blank">
                            Reservar con 30$
                        </a>
                        <a :href="formation?.paypal_button" class="cta-btn cta-btn--secondary cta-btn--large" target="_blank">
                            Pagar completo ({{ formation?.price }}$)
                        </a>
                    </div>
                    <div v-else class="pricing__full">
                        <p class="full-message">✋ Plazas agotadas para esta fecha</p>
                        <a :href="whatsapp_link" class="cta-btn cta-btn--whatsapp cta-btn--large" target="_blank">
                            Contactar para próximas fechas
                        </a>
                    </div>

                    <div class="pricing__security">
                        <span>🔒 Pago seguro vía PayPal</span>
                        <span>{{ places_message }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========== FAQ ========== -->
        <section class="faq">
            <div class="faq__container">
                <h2 class="faq__title">Preguntas frecuentes</h2>
                <div class="faq__list">
                    <div class="faq-item" v-for="(item, fi) in faqs" :key="fi"
                        :class="{ 'faq-item--open': open_faq === fi }" @click="toggleFaq(fi)">
                        <div class="faq-item__question">
                            <h4>{{ item.question }}</h4>
                            <span class="faq-item__icon">{{ open_faq === fi ? '−' : '+' }}</span>
                        </div>
                        <transition name="faq-slide">
                            <div v-if="open_faq === fi" class="faq-item__answer">
                                <p v-html="replace_date(item.answer)" />
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========== FINAL CTA ========== -->
        <section class="final-cta">
            <div class="final-cta__container">
                <h2 class="final-cta__title">{{ course.final_cta.title }}</h2>
                <p v-if="course.final_cta.text" class="final-cta__text" v-html="course.final_cta.text" />
                <p class="final-cta__examples">
                    <span v-for="(line, li) in course.final_cta.examples.split('\n')" :key="li">
                        {{ line }}<br />
                    </span>
                </p>
                <p class="final-cta__urgency">{{ course.final_cta.urgency }}</p>

                <div v-if="!is_paid_workshop" class="final-cta__buttons">
                    <RouterLink :to="inscription_route" class="cta-btn cta-btn--primary cta-btn--xl">
                        {{ course.final_cta.cta_label }}
                    </RouterLink>
                </div>
                <div v-else-if="!is_full" class="final-cta__buttons">
                    <a :href="formation?.paypal_button" class="cta-btn cta-btn--primary cta-btn--xl" target="_blank">
                        {{ course.final_cta.cta_label }}
                    </a>
                </div>

                <p v-if="course.final_cta.note" class="final-cta__note">
                    {{ replace_date(course.final_cta.note) }}
                </p>
            </div>
        </section>

    </div>
</template>

<style scoped lang="scss">
$gradient-hero: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
$gradient-cta: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%);

.course-landing {
    width: 100%;
    margin: 0;
    padding: 0;
    background: var(--color-white);
}

// ========== HERO ==========
.hero {
    width: 100%;
    min-height: 90vh;
    background: $gradient-hero;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $space-32 $space-8 $space-16;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
            radial-gradient(circle at 20% 50%, rgba(30, 86, 160, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(46, 122, 212, 0.15) 0%, transparent 50%);
        pointer-events: none;
    }

    &__container {
        max-width: 900px;
        width: 100%;
        text-align: center;
        position: relative;
        z-index: 1;
    }

    &__headline {
        font-size: 3.2rem;
        font-family: $font-title;
        color: var(--color-white);
        line-height: 1.2;
        margin: 0 0 $space-6;
        font-weight: $fw-semibold;
    }

    &__subheadline {
        font-size: 1.3rem;
        font-family: $font-body;
        color: rgba(255, 255, 255, 0.95);
        line-height: 1.6;
        margin: 0 0 $space-12;
        font-weight: $fw-light;
    }

    &__cta {
        margin-bottom: $space-8;
    }

    &__ctas {
        display: flex;
        gap: $space-6;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: $space-8;
    }

    &__full {
        display: flex;
        flex-direction: column;
        gap: $space-6;
        align-items: center;
        margin-bottom: $space-8;

        .full-message {
            font-size: 1.3rem;
            color: var(--color-white);
            font-weight: $fw-medium;
            margin: 0;
        }
    }

    &__info {
        display: flex;
        gap: $space-6;
        justify-content: center;
        flex-wrap: wrap;
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.9);
        font-family: $font-body;

        span {
            display: flex;
            align-items: center;
            gap: $space-2;
        }
    }
}

// ========== BOTONES CTA ==========
.cta-btn {
    padding: $space-4 $space-10;
    font-size: 1.1rem;
    font-family: $font-body;
    font-weight: $fw-semibold;
    border-radius: $space-3;
    text-decoration: none;
    transition: $transition-slow;
    display: inline-block;
    border: none;
    cursor: pointer;

    &--primary {
        background: $gradient-cta;
        color: var(--color-white);
        box-shadow: 0 4px 15px rgba(212, 160, 23, 0.4);

        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(212, 160, 23, 0.6);
        }
    }

    &--secondary {
        background: var(--color-white);
        color: var(--color-primary);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
    }

    &--whatsapp {
        background: #25D366;
        color: var(--color-white);
        box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);

        &:hover {
            background: #20ba5a;
            transform: translateY(-3px);
        }
    }

    &--large {
        padding: $space-5 $space-12;
        font-size: 1.2rem;
    }

    &--xl {
        padding: $space-6 $space-16;
        font-size: 1.3rem;
    }
}

// ========== MIRROR ==========
.mirror {
    padding: $space-24 $space-8;
    background: var(--color-white);

    &__container {
        max-width: 1100px;
        margin: 0 auto;
    }

    &__title {
        font-size: 2.5rem;
        text-align: center;
        margin: 0 0 $space-16;
        color: var(--color-primary);
    }

    &__category {
        margin-bottom: $space-12;

        &:last-of-type { margin-bottom: $space-16; }
    }

    &__category-title {
        font-size: $text-2xl;
        color: var(--color-primary-light);
        margin: 0 0 $space-6;
        font-family: $font-title;
    }

    &__items,
    &__checks {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
        gap: $space-4;
    }

    &__conclusion {
        font-size: 1.3rem;
        text-align: center;
        color: var(--color-primary-dark);
        margin: $space-12 0 0;
        line-height: 1.6;

        :deep(strong) {
            color: var(--color-primary);
            font-weight: $fw-semibold;
        }
    }
}

.check-item {
    display: flex;
    align-items: flex-start;
    gap: $space-4;
    padding: $space-6;
    background: var(--color-bg);
    border-radius: $space-3;
    transition: $transition-slow;

    &:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }

    .check-icon {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        background: var(--color-primary);
        color: var(--color-white);
        border-radius: $radius-full;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 0.9rem;
    }

    p {
        margin: 0;
        font-size: 1.05rem;
        color: var(--color-primary-dark);
        line-height: 1.5;
    }
}

// ========== BENEFITS ==========
.benefits {
    padding: $space-24 $space-8;
    background: linear-gradient(180deg, #f0f4f8 0%, var(--color-white) 100%);

    &__container {
        max-width: $max-width;
        margin: 0 auto;
    }

    &__title {
        font-size: 2.5rem;
        text-align: center;
        margin: 0 auto $space-16;
        color: var(--color-primary);
        max-width: 900px;
        display: block;
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: $space-8;
        margin-bottom: $space-12;
    }

    &__footer {
        font-size: 1.2rem;
        text-align: center;
        color: var(--color-primary-dark);
        margin: $space-12 0 0;
        font-weight: $fw-medium;
    }
}

.benefit-card {
    background: var(--color-white);
    padding: $space-8;
    border-radius: $radius-lg;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: $transition-slow;
    display: flex;
    gap: $space-4;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(30, 86, 160, 0.15);
    }

    .benefit-number {
        flex-shrink: 0;
        width: $space-10;
        height: $space-10;
        background: $gradient-cta;
        color: var(--color-white);
        border-radius: $radius-full;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.2rem;
    }

    .benefit-text {
        margin: 0;
        font-size: 1.05rem;
        color: var(--color-primary-dark);
        line-height: 1.6;
    }
}

// ========== CONTENT ==========
.content {
    padding: $space-24 $space-8;
    background: linear-gradient(180deg, #f0f4f8 0%, var(--color-white) 100%);

    &__container {
        max-width: 1000px;
        margin: 0 auto;
    }

    &__title {
        font-size: 2.5rem;
        text-align: center;
        margin: 0 0 $space-16;
        color: var(--color-primary);
    }

    &__blocks {
        display: flex;
        flex-direction: column;
        gap: $space-8;
    }

    &__footer {
        font-size: 1.2rem;
        text-align: center;
        color: var(--color-primary-dark);
        margin: $space-12 0 0;
        font-weight: $fw-medium;
    }
}

.content-block {
    background: var(--color-white);
    padding: $space-8;
    border-radius: $radius-lg;
    border-left: 4px solid var(--color-primary);
    transition: $transition-slow;

    &:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border-left-color: var(--color-secondary);
    }

    &__header {
        display: flex;
        align-items: center;
        gap: $space-4;
        margin-bottom: $space-4;
    }

    &__number {
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        background: var(--color-primary);
        color: var(--color-white);
        border-radius: $radius-full;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }

    &__title {
        margin: 0;
        font-size: 1.4rem;
        color: var(--color-primary);
    }

    &__description {
        margin: 0;
        font-size: 1.05rem;
        color: var(--color-primary-dark);
        line-height: 1.6;
    }

    &__patterns {
        margin-top: $space-6;
        display: flex;
        flex-direction: column;
        gap: $space-4;
        padding-left: $space-4;
    }
}

.pattern-item {
    padding: $space-4;
    background: var(--color-bg);
    border-radius: $space-2;

    strong {
        display: block;
        color: var(--color-primary-light);
        margin-bottom: $space-2;
        font-size: 1.05rem;
    }

    p {
        margin: 0;
        font-size: 0.95rem;
        color: var(--color-primary-dark);
        line-height: 1.5;
    }
}

// ========== INCLUDES ==========
.includes {
    padding: $space-24 $space-8;
    background: var(--color-white);

    &__container {
        max-width: 1100px;
        margin: 0 auto;
    }

    &__title {
        font-size: 2.5rem;
        text-align: center;
        margin: 0 0 $space-16;
        color: var(--color-primary);
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: $space-8;
        margin-bottom: $space-12;
    }

    &__cta {
        text-align: center;
    }
}

.include-card {
    background: var(--color-bg);
    padding: $space-8;
    border-radius: $radius-lg;
    text-align: center;
    transition: $transition-slow;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .include-icon {
        font-size: $space-12;
        display: block;
        margin-bottom: $space-4;
    }

    h4 {
        margin: 0 0 $space-2;
        font-size: 1.2rem;
        color: var(--color-primary);
    }

    p {
        margin: 0;
        font-size: $text-base;
        color: var(--color-primary-dark);
        line-height: 1.5;
    }
}

// ========== TARGET ==========
.target {
    padding: $space-24 $space-8;
    background: linear-gradient(180deg, var(--color-white) 0%, #f0f4f8 100%);

    &__container {
        max-width: 1100px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
        gap: $space-12;
    }

    &__subtitle {
        font-size: $space-8;
        color: var(--color-primary);
        margin: 0 0 $space-8;
        text-align: center;
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: $space-4;
    }
}

.target-item {
    display: flex;
    align-items: flex-start;
    gap: $space-4;
    padding: $space-6;
    background: var(--color-white);
    border-radius: $space-3;
    transition: $transition-slow;

    &:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }

    .target-icon {
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        border-radius: $radius-full;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.1rem;
    }

    &--yes .target-icon {
        background: var(--color-success);
        color: var(--color-white);
    }

    &--no .target-icon {
        background: var(--color-error);
        color: var(--color-white);
    }

    p {
        margin: 0;
        font-size: 1.05rem;
        color: var(--color-primary-dark);
        line-height: 1.5;
    }
}

// ========== FACILITATOR ==========
.facilitator {
    padding: $space-24 $space-8;
    background: var(--color-white);

    &__container {
        max-width: 1000px;
        margin: 0 auto;
    }

    &__title {
        font-size: 2.5rem;
        text-align: center;
        margin: 0 0 $space-16;
        color: var(--color-primary);
    }

    &__content {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: $space-12;
        align-items: start;
    }

    &__photo img {
        width: 100%;
        height: auto;
        border-radius: $radius-lg;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    &__info {
        display: flex;
        flex-direction: column;
        gap: $space-4;
    }

    &__name {
        font-size: $space-8;
        color: var(--color-primary);
        margin: 0;
    }

    &__title-role {
        font-size: 1.2rem;
        color: var(--color-secondary-dark);
        margin: 0;
        font-weight: $fw-medium;
    }

    &__bio {
        font-size: 1.05rem;
        color: var(--color-primary-dark);
        line-height: 1.7;
        margin: $space-4 0;
    }

    &__instagram {
        display: inline-flex;
        align-items: center;
        gap: $space-2;
        color: var(--color-primary);
        text-decoration: none;
        font-weight: $fw-medium;
        transition: $transition-slow;

        &:hover {
            color: var(--color-secondary);
            transform: translateX(5px);
        }
    }
}

// ========== PROCESS ==========
.process {
    padding: $space-24 $space-8;
    background: linear-gradient(180deg, #f0f4f8 0%, var(--color-white) 100%);

    &__container {
        max-width: 1000px;
        margin: 0 auto;
    }

    &__title {
        font-size: 2.5rem;
        text-align: center;
        margin: 0 0 $space-16;
        color: var(--color-primary);
    }

    &__steps {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: $space-8;
        margin-bottom: $space-12;
    }

    &__cta {
        text-align: center;
    }
}

.step {
    background: var(--color-white);
    padding: $space-8;
    border-radius: $radius-lg;
    text-align: center;
    transition: $transition-slow;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    &__number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        background: $gradient-cta;
        color: var(--color-white);
        border-radius: $radius-full;
        font-size: $space-8;
        font-weight: bold;
        margin-bottom: $space-6;
    }

    &__title {
        margin: 0 0 $space-4;
        font-size: 1.3rem;
        color: var(--color-primary);
    }

    &__description {
        margin: 0;
        font-size: $text-base;
        color: var(--color-primary-dark);
        line-height: 1.6;
    }
}

// ========== LOGISTICS ==========
.logistics {
    padding: $space-24 $space-8;
    background: var(--color-white);

    &__container {
        max-width: 1000px;
        margin: 0 auto;
    }

    &__title {
        font-size: 2.5rem;
        text-align: center;
        margin: 0 0 $space-12;
        color: var(--color-primary);
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: $space-8;
        margin-bottom: $space-16;
    }
}

.logistics-card {
    background: var(--color-bg);
    padding: $space-8;
    border-radius: $radius-lg;
    text-align: center;
    transition: $transition-slow;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .logistics-icon {
        font-size: $space-12;
        display: block;
        margin-bottom: $space-4;
    }

    h4 {
        margin: 0 0 $space-2;
        font-size: 1.2rem;
        color: var(--color-primary);
    }

    p {
        margin: 0;
        font-size: $text-base;
        color: var(--color-primary-dark);
    }
}

// ========== PRICING ==========
.pricing {
    background: $gradient-hero;
    padding: $space-16;
    border-radius: $space-6;
    box-shadow: 0 8px 40px rgba(30, 86, 160, 0.3);

    &__title {
        font-size: $space-8;
        text-align: center;
        margin: 0 0 $space-8;
        color: var(--color-white);
    }

    &__content {
        margin-bottom: $space-12;
    }

    &__options {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: $space-12;
        flex-wrap: wrap;
    }

    &__ctas {
        display: flex;
        gap: $space-6;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: $space-8;
    }

    &__full {
        text-align: center;
        margin-bottom: $space-8;

        .full-message {
            font-size: 1.3rem;
            color: var(--color-white);
            margin-bottom: $space-6;
        }
    }

    &__security {
        display: flex;
        gap: $space-8;
        justify-content: center;
        flex-wrap: wrap;
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.9);
    }
}

.pricing-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-2;
}

.pricing-label {
    font-size: $text-base;
    color: rgba(255, 255, 255, 0.9);
}

.pricing-value {
    font-size: $space-12;
    font-weight: $fw-bold;
    color: var(--color-white);
    font-family: $font-title;

    &--accent {
        color: var(--color-secondary);
    }
}

.pricing-note {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
}

.pricing-separator {
    font-size: $space-6;
    color: rgba(255, 255, 255, 0.6);
    font-weight: $fw-light;
}

// ========== FAQ ==========
.faq {
    padding: $space-24 $space-8;
    background: var(--color-bg);

    &__container {
        max-width: 900px;
        margin: 0 auto;
    }

    &__title {
        font-size: 2.5rem;
        text-align: center;
        margin: 0 0 $space-12;
        color: var(--color-primary);
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: $space-4;
    }
}

.faq-item {
    background: var(--color-white);
    border-radius: $space-3;
    overflow: hidden;
    cursor: pointer;
    transition: $transition-slow;

    &:hover {
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }

    &__question {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: $space-6 $space-8;
        gap: $space-4;

        h4 {
            margin: 0;
            font-size: 1.1rem;
            color: var(--color-primary-dark);
            font-family: $font-body;
            font-weight: $fw-medium;
        }
    }

    &__icon {
        flex-shrink: 0;
        width: $space-8;
        height: $space-8;
        background: var(--color-primary);
        color: var(--color-white);
        border-radius: $radius-full;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: $space-6;
        font-weight: $fw-light;
        transition: $transition-slow;
    }

    &--open &__icon {
        background: var(--color-secondary);
    }

    &__answer {
        padding: 0 $space-8 $space-6;

        p {
            margin: 0;
            font-size: $text-base;
            color: var(--color-primary-dark);
            line-height: 1.7;
        }
    }
}

.faq-slide-enter-active,
.faq-slide-leave-active {
    transition: $transition-slow;
}

.faq-slide-enter-from,
.faq-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

// ========== FINAL CTA ==========
.final-cta {
    padding: $space-24 $space-8;
    background: $gradient-hero;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
            radial-gradient(circle at 30% 40%, rgba(30, 86, 160, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(46, 122, 212, 0.15) 0%, transparent 50%);
        pointer-events: none;
    }

    &__container {
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
        position: relative;
        z-index: 1;
    }

    &__title {
        font-size: 2.5rem;
        color: var(--color-white);
        margin: 0 0 $space-8;
    }

    &__text {
        font-size: 1.4rem;
        color: rgba(255, 255, 255, 0.95);
        margin: 0 0 $space-8;
        line-height: 1.6;

        :deep(strong) {
            color: var(--color-secondary);
            font-weight: $fw-semibold;
        }
    }

    &__examples {
        font-size: 1.2rem;
        color: rgba(255, 255, 255, 0.9);
        margin: 0 0 $space-8;
        line-height: 1.8;
    }

    &__urgency {
        font-size: 1.3rem;
        color: var(--color-white);
        margin: 0 0 $space-12;
        font-weight: $fw-medium;
    }

    &__buttons {
        display: flex;
        justify-content: center;
        margin-bottom: $space-6;
    }

    &__note {
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
        line-height: 1.6;
        white-space: pre-line;
    }
}

// ========== RESPONSIVE ==========
@media screen and (max-width: $bp-lg) {
    .facilitator__content {
        grid-template-columns: 1fr;
        gap: $space-8;

        .facilitator__photo {
            max-width: 300px;
            margin: 0 auto;
        }
    }

    .target__container {
        grid-template-columns: 1fr;
    }

    .mirror__items,
    .mirror__checks {
        grid-template-columns: 1fr;
    }
}

@media screen and (max-width: $bp-md) {
    .hero {
        padding: $space-24 $space-6 $space-12;
        box-sizing: border-box;

        &__headline {
            font-size: 2.2rem;
        }

        &__subheadline {
            font-size: 1.1rem;
        }

        &__ctas {
            flex-direction: column;
            width: 100%;

            .cta-btn {
                width: fit-content;
                max-width: 100%;
                align-self: center;
            }
        }

        &__info {
            flex-direction: column;
            gap: $space-2;
        }
    }

    .benefits__grid,
    .process__steps,
    .includes__grid,
    .logistics__grid {
        grid-template-columns: 1fr;
    }

    .pricing {
        padding: $space-8 $space-6;

        &__options {
            flex-direction: column;
            gap: $space-8;
        }

        &__ctas {
            flex-direction: column;
            width: 100%;

            .cta-btn {
                width: fit-content;
                max-width: 100%;
                text-align: center;
            }
        }
    }

    .final-cta {
        padding: $space-16 $space-6;

        &__title {
            font-size: $space-8;
        }

        &__text,
        &__examples {
            font-size: 1.1rem;
        }
    }

    section {
        padding: $space-16 $space-6;
    }

    h2 {
        font-size: $space-8 !important;
    }
}
</style>
