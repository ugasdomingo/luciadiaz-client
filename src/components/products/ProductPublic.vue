<template>
    <!-- Landing personalizada para cursos/talleres con diseño propio -->
    <CourseLanding v-if="course_config" :course="course_config" :formation="product" />

    <div v-else class="product-public">

        <!-- Hero -->
        <div class="pp-hero">
            <div class="pp-hero__deco" />
            <div class="pp-hero__inner">
                <div class="pp-hero__layout">
                    <!-- Cover image -->
                    <div class="pp-hero__cover" v-if="product.cover_image?.secure_url">
                        <img :src="product.cover_image.secure_url" :alt="product.title" />
                    </div>
                    <!-- Content -->
                    <div class="pp-hero__content">
                        <span class="pp-hero__chip">{{ type_label }}</span>
                        <h1 class="pp-hero__title">{{ product.title }}</h1>
                        <div class="pp-hero__meta">
                            <span v-if="product.category" class="pp-hero__meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="1.5"/></svg>
                                {{ product.category }}
                            </span>
                            <span v-if="product.start_date" class="pp-hero__meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                                Inicia: {{ formatted_start_date }}
                            </span>
                        </div>

                        <!-- ── Banner: ya disponible ── -->
                        <div v-if="show_available_banner" class="pp-banner pp-banner--success">
                            <p class="pp-banner__title">¡Ya está disponible!</p>
                            <p class="pp-banner__sub">El producto que esperabas ya está a la venta. ¡Es tu momento!</p>
                            <div class="pp-price-row">
                                <span class="pp-price">{{ formatted_price }}</span>
                                <button @click="handle_purchase" class="pp-btn pp-btn--gold">{{ cta_text }}</button>
                                <LikeButtonComponent item_type="Product" :item_id="product._id" />
                            </div>
                        </div>

                        <!-- ── Banner: en lista de espera ── -->
                        <div v-else-if="show_waitlist_banner" class="pp-banner pp-banner--wait">
                            <p class="pp-banner__title">Estás en la lista de espera</p>
                            <p class="pp-banner__sub">Te escribiremos por email en cuanto puedas acceder a la inscripción.</p>
                            <RouterLink to="/acceso" class="pp-btn pp-btn--outline">Crear cuenta</RouterLink>
                        </div>

                        <!-- ── CTA normal ── -->
                        <template v-else>
                            <div v-if="is_coming_soon" class="pp-coming">
                                <span class="pp-coming__badge">Próximamente</span>
                                <div class="pp-price-row">
                                    <button v-if="!auth_store.user_data" @click="show_waitlist_popup = true" class="pp-btn pp-btn--outline">
                                        Apuntarme a la lista de espera
                                    </button>
                                    <span v-else class="pp-coming__note">Te avisaremos cuando esté disponible</span>
                                    <LikeButtonComponent item_type="Product" :item_id="product._id" />
                                </div>
                            </div>
                            <div v-else class="pp-price-block">
                                <span v-if="product.status === 'pre_sale'" class="pp-presale-tag">Pre-venta</span>
                                <div class="pp-price-row">
                                    <span class="pp-price">{{ formatted_price }}</span>
                                    <button @click="handle_purchase" class="pp-btn pp-btn--gold">{{ cta_text }}</button>
                                    <LikeButtonComponent item_type="Product" :item_id="product._id" />
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <!-- Body -->
        <div class="pp-body">

            <!-- Description -->
            <div class="pp-card">
                <h2 class="pp-card__title">Descripción</h2>
                <div class="pp-description" v-html="product.description"></div>
            </div>

            <!-- Curriculum -->
            <div v-if="has_curriculum" class="pp-card">
                <h2 class="pp-card__title">Contenido del programa</h2>
                <div class="curriculum-list">
                    <div v-for="(lesson, index) in product.curriculum" :key="index"
                        class="curriculum-item"
                        :class="{ 'curriculum-item--free': lesson.is_free_preview, 'curriculum-item--open': expanded_lesson === index }">
                        <div class="curriculum-item__header" @click="expanded_lesson = expanded_lesson === index ? null : index">
                            <span class="curriculum-number">{{ index + 1 }}</span>
                            <h3 class="curriculum-title">{{ lesson.title }}</h3>
                            <div class="curriculum-item__right">
                                <span v-if="lesson.is_free_preview" class="curriculum-badge">Vista previa</span>
                                <span v-else class="curriculum-badge curriculum-badge--locked">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                                </span>
                                <span class="curriculum-chevron" :class="{ 'curriculum-chevron--open': expanded_lesson === index }">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                </span>
                            </div>
                        </div>
                        <div v-if="expanded_lesson === index" class="curriculum-body">
                            <div v-if="lesson.is_free_preview && lesson.notes" class="curriculum-notes" v-html="lesson.notes"></div>
                            <div v-if="lesson.has_video || lesson.has_pdf" class="curriculum-material">
                                <span class="curriculum-material__label">Material:</span>
                                <span v-if="lesson.has_video" class="curriculum-material__tag">Video</span>
                                <span v-if="lesson.has_pdf" class="curriculum-material__tag">PDF</span>
                            </div>
                            <p v-if="!lesson.is_free_preview" class="curriculum-locked-msg">Accede comprando el curso</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Includes -->
            <div class="pp-card pp-card--features">
                <h2 class="pp-card__title">¿Qué incluye?</h2>
                <ul class="features-list">
                    <li v-if="product.type === 'course'">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Acceso de por vida al contenido
                    </li>
                    <li v-if="product.type === 'course'">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Actualizaciones gratuitas
                    </li>
                    <li v-if="product.type === 'ebook'">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Descarga inmediata en PDF
                    </li>
                    <li v-if="product.certificate">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Certificado de finalización
                    </li>
                    <li>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Acceso desde cualquier dispositivo
                    </li>
                </ul>
            </div>

            <!-- Final CTA if not coming soon -->
            <div v-if="!is_coming_soon && !show_waitlist_banner" class="pp-final-cta">
                <div class="pp-final-cta__content">
                    <h3>¿Lista/o para empezar?</h3>
                    <p>Accede ahora y transforma tu bienestar.</p>
                </div>
                <div class="pp-final-cta__actions">
                    <span class="pp-final-cta__price">{{ formatted_price }}</span>
                    <button @click="handle_purchase" class="pp-btn pp-btn--gold pp-btn--lg">{{ cta_text }}</button>
                </div>
            </div>
        </div>

        <!-- Popup waitlist -->
        <Teleport to="body">
            <div v-if="show_waitlist_popup" class="waitlist-overlay" @click.self="show_waitlist_popup = false">
                <div class="waitlist-popup">
                    <button class="waitlist-popup__close" @click="show_waitlist_popup = false">✕</button>
                    <h3>Lista de espera</h3>
                    <p>Te avisaremos en cuanto esté disponible para la inscripción.</p>
                    <input v-model="waitlist_email" type="email" placeholder="tu@correo.com"
                        class="waitlist-popup__input" @keyup.enter="submit_waitlist" autofocus />
                    <p v-if="waitlist_error" class="waitlist-popup__error">{{ waitlist_error }}</p>
                    <button class="action-btn" @click="submit_waitlist" :disabled="waitlist_loading">
                        {{ waitlist_loading ? '...' : 'Apuntarme' }}
                    </button>
                </div>
            </div>
        </Teleport>

        <!-- CTA fijo móvil -->
        <div v-if="!is_coming_soon" class="cta-mobile">
            <div class="cta-mobile__price">{{ formatted_price }}</div>
            <button @click="handle_purchase" class="pp-btn pp-btn--gold cta-mobile__button">{{ cta_text }}</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth-store'
import { useLikeStore } from '../../stores/like-store'
import CourseLanding from '../landings/CourseLanding.vue'
import LikeButtonComponent from '../common/LikeButtonComponent.vue'
import { courses } from '../../static/courses.js'

const props = defineProps({
    product: { type: Object, required: true }
})

const router = useRouter()
const auth_store = useAuthStore()
const like_store = useLikeStore()

const expanded_lesson = ref(null)

// ── Waitlist ──────────────────────────────────────────────────────────
const WAITLIST_LS_KEY = 'waitlist_products'

const get_local_waitlist = () => {
    try { return JSON.parse(localStorage.getItem(WAITLIST_LS_KEY) || '[]') } catch { return [] }
}
const add_to_local_waitlist = (slug) => {
    const list = get_local_waitlist()
    if (!list.includes(slug)) {
        list.push(slug)
        localStorage.setItem(WAITLIST_LS_KEY, JSON.stringify(list))
    }
}

const show_waitlist_popup = ref(false)
const waitlist_email = ref(like_store.session_email || '')
const waitlist_error = ref('')
const waitlist_loading = ref(false)
// joined en esta sesión O ya estaba guardado en localStorage
const waitlist_joined = ref(get_local_waitlist().includes(props.product?.slug))

// coming_soon = aún no se puede comprar (solo waitlist)
// pre_sale / active / etc. = ya se puede comprar
const is_coming_soon = computed(() => props.product.status === 'coming_soon')

// Mostrar banner de waitlist (sólo cuando el producto sigue sin estar disponible)
const show_waitlist_banner = computed(() => waitlist_joined.value && is_coming_soon.value)

// Mostrar banner de "ya disponible" para los que estaban en waitlist
const show_available_banner = computed(() => waitlist_joined.value && !is_coming_soon.value)

const submit_waitlist = async () => {
    waitlist_error.value = ''
    const email = waitlist_email.value.trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        waitlist_error.value = 'Introduce un email válido'
        return
    }
    waitlist_loading.value = true
    try {
        const res = await like_store.join_waitlist(props.product.slug, email)
        if (res.data?.already_user) {
            waitlist_error.value = 'Ya tienes cuenta. Inicia sesión para acceder.'
        } else {
            like_store.save_email(email)
            add_to_local_waitlist(props.product.slug)
            waitlist_joined.value = true
            show_waitlist_popup.value = false   // cierra popup, muestra banner inline
        }
    } catch {
        waitlist_error.value = 'Error al apuntarse. Inténtalo de nuevo.'
    } finally {
        waitlist_loading.value = false
    }
}

// Si el producto tiene una landing personalizada (free_course / paid_workshop), la usamos
const course_config = computed(() => courses[props.product.slug] ?? null)

const type_label = computed(() => {
    const types = { course: 'Formación Online', ebook: 'Guía Digital', bundle: 'Pack Completo', service: 'Servicio' }
    return types[props.product.type] || props.product.type
})

const formatted_price = computed(() => props.product.price === 0 ? 'Gratis' : `${props.product.price}€`)

const formatted_start_date = computed(() => {
    if (!props.product.start_date) return ''
    return new Date(props.product.start_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
})

const has_curriculum = computed(() => props.product.curriculum?.length > 0)

const cta_text = computed(() => {
    if (props.product.price === 0) return 'Acceder gratis'
    if (props.product.status === 'pre_sale') return 'Comprar en preventa'
    return 'Comprar ahora'
})

const handle_purchase = () => {
    if (!auth_store.user_data) {
        router.push({ path: '/acceso', query: { redirect: `/productos/${props.product.slug}` } })
        return
    }
    router.push(`/checkout/${props.product.slug}`)
}
</script>

<style scoped lang="scss">
.product-public {
    background: var(--color-bg);
    min-height: 100vh;
    padding-bottom: 80px;
}

/* ── Hero ── */
.pp-hero {
    background: var(--blue-ink);
    padding: 100px 28px 64px;
    position: relative;
    overflow: hidden;

    &__deco {
        position: absolute;
        top: -200px; left: 50%;
        transform: translateX(-50%);
        width: 800px; height: 800px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(245,197,24,0.07), transparent 65%);
        pointer-events: none;
    }

    &__inner {
        position: relative;
        z-index: 1;
        max-width: 1000px;
        margin: 0 auto;
    }

    &__layout {
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: 48px;
        align-items: start;

        @media (max-width: $bp-md) {
            grid-template-columns: 1fr;
            gap: 28px;
        }
    }

    &__cover {
        border-radius: $radius-lg;
        overflow: hidden;
        box-shadow: 0 16px 48px rgba(0,0,0,0.35);
        flex-shrink: 0;

        img {
            width: 100%;
            height: auto;
            display: block;
        }

        @media (max-width: $bp-md) {
            max-width: 180px;
        }
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 8px;
    }

    &__chip {
        display: inline-block;
        align-self: flex-start;
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
    }

    &__title {
        font-family: var(--font-title);
        font-size: clamp(30px, 5vw, 52px);
        font-weight: 700;
        color: white;
        margin: 0;
        line-height: 1.15;
    }

    &__meta {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
    }

    &__meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: rgba(255,255,255,0.55);
        font-family: var(--font-body);
    }
}

/* ── Price & CTA elements ── */
.pp-price {
    font-family: var(--font-title);
    font-size: 36px;
    font-weight: 700;
    color: white;
}

.pp-price-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 8px;
}

.pp-price-block { display: flex; flex-direction: column; gap: 8px; }

.pp-presale-tag {
    display: inline-block;
    font-size: 11px;
    font-weight: $fw-bold;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: var(--gold-grad);
    color: white;
    padding: 4px 12px;
    border-radius: $radius-full;
    align-self: flex-start;
    font-family: var(--font-body);
}

.pp-coming {
    display: flex;
    flex-direction: column;
    gap: 12px;

    &__badge {
        display: inline-block;
        font-size: 12px;
        font-weight: $fw-bold;
        font-family: var(--font-body);
        color: rgba(255,255,255,0.6);
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        padding: 5px 14px;
        border-radius: $radius-full;
        align-self: flex-start;
    }

    &__note {
        font-size: 13px;
        color: rgba(255,255,255,0.5);
        font-style: italic;
        font-family: var(--font-body);
    }
}

/* Banners */
.pp-banner {
    border-radius: $radius-lg;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 4px;

    &--success {
        background: rgba(16,185,129,0.12);
        border: 1px solid rgba(16,185,129,0.3);
    }

    &--wait {
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.15);
    }

    &__title {
        font-size: 16px;
        font-weight: $fw-bold;
        color: white;
        font-family: var(--font-body);
        margin: 0;
    }

    &__sub {
        font-size: 13px;
        color: rgba(255,255,255,0.65);
        font-family: var(--font-body);
        margin: 0;
        line-height: 1.6;
    }
}

/* Buttons */
.pp-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 13px 24px;
    border-radius: $radius-full;
    font-size: 14px;
    font-weight: $fw-bold;
    font-family: var(--font-body);
    cursor: pointer;
    border: none;
    text-decoration: none;
    transition: transform 0.2s, opacity 0.2s, box-shadow 0.2s;

    &--gold {
        background: var(--gold-grad);
        color: white;
        box-shadow: var(--shadow-gold-new);
        &:hover { transform: translateY(-2px); box-shadow: var(--shadow-gold-glow); }
    }

    &--outline {
        background: transparent;
        color: white;
        border: 1.5px solid rgba(255,255,255,0.4);
        &:hover { border-color: white; }
    }

    &--lg {
        padding: 16px 36px;
        font-size: 16px;
    }
}

/* ── Body ── */
.pp-body {
    max-width: 760px;
    margin: 0 auto;
    padding: 48px 28px 80px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    @media (max-width: $bp-sm) { padding: 28px 16px 80px; }
}

/* Cards */
.pp-card {
    background: white;
    border: 1.5px solid var(--border);
    border-radius: var(--r-xl);
    padding: 32px;
    box-shadow: var(--shadow-md-new);

    @media (max-width: $bp-sm) { padding: 20px 16px; }

    &__title {
        font-family: var(--font-title);
        font-size: 20px;
        color: var(--blue-ink);
        margin: 0 0 20px;
    }

    &--features { border-top: 3px solid var(--gold); }
}

.pp-description {
    font-size: 15px;
    line-height: 1.75;
    color: var(--color-text);
    font-family: var(--font-body);

    :deep(p) { margin: 0 0 12px; &:last-child { margin-bottom: 0; } }
    :deep(ul), :deep(ol) { padding-left: 20px; margin: 8px 0; }
    :deep(li) { margin-bottom: 6px; line-height: 1.6; }
    :deep(strong) { color: var(--blue-ink); }
}

/* Curriculum */
.curriculum-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.curriculum-item {
    background: var(--color-bg);
    border-radius: $radius-md;
    border: 1.5px solid var(--border);
    overflow: hidden;
    transition: border-color 0.2s;

    &:hover { border-color: rgba(30,86,160,0.3); }
    &--free { border-left: 3px solid var(--color-success); }
    &--open { border-color: var(--color-primary); }

    &__header {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 18px;
        cursor: pointer;
        user-select: none;
    }

    &__right {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        margin-left: auto;
    }
}

.curriculum-number {
    width: 30px; height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--blue-ink);
    color: white;
    border-radius: $radius-full;
    font-weight: $fw-bold;
    font-size: 13px;
    flex-shrink: 0;
}

.curriculum-title {
    flex: 1;
    font-size: 14px;
    font-weight: $fw-semibold;
    margin: 0;
    color: var(--blue-ink);
    font-family: var(--font-body);
}

.curriculum-badge {
    font-size: 12px;
    padding: 4px 10px;
    border-radius: $radius-full;
    background: rgba(16,185,129,0.12);
    color: var(--color-success);
    font-weight: $fw-bold;
    font-family: var(--font-body);

    &--locked {
        background: transparent;
        color: var(--ink-muted);
        padding: 0;
    }
}

.curriculum-chevron {
    color: var(--ink-muted);
    transition: transform 0.25s;
    display: flex;
    &--open { transform: rotate(180deg); }
}

.curriculum-body {
    padding: 14px 18px 18px;
    border-top: 1px solid var(--border);
    background: white;
    animation: fade-down 0.2s ease;
}

.curriculum-notes {
    font-size: 13px;
    color: var(--color-text);
    line-height: 1.65;
    margin-bottom: 12px;
    font-family: var(--font-body);

    :deep(p) { margin: 0 0 8px; &:last-child { margin-bottom: 0; } }
}

.curriculum-material {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 10px;

    &__label { font-size: 12px; color: var(--ink-muted); font-weight: $fw-semibold; font-family: var(--font-body); }

    &__tag {
        font-size: 12px;
        padding: 3px 10px;
        background: var(--blue-wash);
        border: 1px solid rgba(30,86,160,0.15);
        border-radius: $radius-full;
        color: var(--color-primary);
        font-weight: $fw-semibold;
        font-family: var(--font-body);
    }
}

.curriculum-locked-msg {
    font-size: 12px;
    color: var(--ink-muted);
    margin: 10px 0 0;
    font-style: italic;
    font-family: var(--font-body);
}

@keyframes fade-down {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* Features */
.features-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;

    li {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        color: var(--color-text);
        font-family: var(--font-body);
        padding: 12px 16px;
        background: var(--color-bg);
        border-radius: $radius-md;

        svg { color: var(--color-success); flex-shrink: 0; }
    }
}

/* Final CTA */
.pp-final-cta {
    background: var(--blue-ink);
    border-radius: var(--r-xl);
    padding: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;

    @media (max-width: $bp-sm) { padding: 24px 20px; }

    &__content {
        h3 {
            font-family: var(--font-title);
            font-size: 20px;
            color: white;
            margin: 0 0 6px;
        }
        p {
            font-size: 14px;
            color: rgba(255,255,255,0.6);
            font-family: var(--font-body);
            margin: 0;
        }
    }

    &__actions {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
    }

    &__price {
        font-family: var(--font-title);
        font-size: 28px;
        font-weight: 700;
        color: white;
    }
}

/* Mobile CTA bar */
.cta-mobile {
    display: none;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: white;
    border-top: 1px solid var(--border);
    padding: 12px 20px;
    box-shadow: 0 -4px 16px rgba(0,0,0,0.1);
    z-index: 150;
    align-items: center;
    gap: 16px;

    @media (max-width: $bp-md) { display: flex; }

    &__price {
        font-family: var(--font-title);
        font-size: 22px;
        font-weight: 700;
        color: var(--blue-ink);
    }

    &__button { flex: 1; }
}

/* Waitlist popup */
.waitlist-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 20px;
}

.waitlist-popup {
    background: white;
    border-radius: var(--r-xl);
    padding: 36px;
    max-width: 400px;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 14px;
    box-shadow: var(--shadow-md-new);

    h3 {
        font-family: var(--font-title);
        font-size: 20px;
        color: var(--blue-ink);
        margin: 0;
    }

    p {
        font-size: 14px;
        color: var(--ink-muted);
        margin: 0;
        font-family: var(--font-body);
        line-height: 1.6;
    }

    &__close {
        position: absolute;
        top: 16px; right: 16px;
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: var(--ink-muted);
        line-height: 1;
    }

    &__input { width: 100%; max-width: 100%; box-sizing: border-box; }
    &__error { color: var(--color-error); font-size: 12px; margin: 0; font-family: var(--font-body); }

    .action-btn { width: 100%; max-width: 100%; }
}
</style>