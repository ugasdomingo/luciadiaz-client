<template>
    <!-- Landing personalizada para cursos/talleres con diseño propio -->
    <CourseLanding v-if="course_config" :course="course_config" :formation="product" />

    <div v-else class="product-public">
        <!-- Hero / Portada -->
        <section class="product-hero">
            <div class="product-hero__image">
                <img :src="product.cover_image?.secure_url || '/placeholder-product.jpg'" :alt="product.title">
            </div>
            <div class="product-hero__content">
                <span class="product-badge">{{ type_label }}</span>
                <h1 class="product-title">{{ product.title }}</h1>
                <p class="product-description">{{ product.description }}</p>

                <div class="product-meta">
                    <span v-if="product.category" class="meta-item">
                        📂 {{ product.category }}
                    </span>
                    <span v-if="product.start_date" class="meta-item">
                        📅 Inicia: {{ formatted_start_date }}
                    </span>
                </div>

                <!-- CTA principal -->
                <div class="product-cta">
                    <div class="product-price">
                        <span class="price-amount">{{ formatted_price }}</span>
                    </div>

                    <div class="product-cta__actions">
                        <button @click="handle_purchase" class="action-btn">
                            {{ cta_text }}
                        </button>

                        <!-- Waitlist: solo para no logueados en productos coming_soon/pre_sale -->
                        <button v-if="!auth_store.user_data && (product.status === 'coming_soon' || product.status === 'pre_sale')"
                            @click="show_waitlist_popup = true"
                            class="nobg-btn">
                            📋 Lista de espera
                        </button>

                        <LikeButtonComponent item_type="Product" :item_id="product._id" />
                    </div>
                </div>

                <!-- Popup waitlist -->
                <Teleport to="body">
                    <div v-if="show_waitlist_popup" class="waitlist-overlay" @click.self="show_waitlist_popup = false">
                        <div class="waitlist-popup">
                            <button class="waitlist-popup__close" @click="show_waitlist_popup = false">✕</button>
                            <template v-if="!waitlist_done">
                                <h3>Lista de espera</h3>
                                <p>Te avisaremos cuando esté disponible.</p>
                                <input v-model="waitlist_email" type="email" placeholder="tu@correo.com"
                                    class="waitlist-popup__input" @keyup.enter="submit_waitlist" />
                                <p v-if="waitlist_error" class="waitlist-popup__error">{{ waitlist_error }}</p>
                                <button class="action-btn" @click="submit_waitlist" :disabled="waitlist_loading">
                                    {{ waitlist_loading ? '...' : 'Apuntarme' }}
                                </button>
                            </template>
                            <template v-else>
                                <p class="waitlist-popup__success">✅ ¡Apuntado! Te avisaremos pronto.</p>
                            </template>
                        </div>
                    </div>
                </Teleport>
            </div>
        </section>

        <!-- Curriculum / Contenido (preview) -->
        <section v-if="has_curriculum" class="product-curriculum">
            <h2>Contenido del programa</h2>
            <div class="curriculum-list">
                <div v-for="(lesson, index) in product.curriculum" :key="index" class="curriculum-item"
                    :class="{ 'curriculum-item--free': lesson.is_free_preview }">
                    <div class="curriculum-item__header">
                        <span class="curriculum-number">{{ index + 1 }}</span>
                        <h3 class="curriculum-title">{{ lesson.title }}</h3>
                        <span v-if="lesson.is_free_preview" class="curriculum-badge">
                            👁️ Vista previa
                        </span>
                        <span v-else class="curriculum-badge curriculum-badge--locked">
                            🔒 Bloqueado
                        </span>
                    </div>

                    <!-- Solo mostrar contenido si es preview gratuito -->
                    <div v-if="lesson.is_free_preview && lesson.notes" class="curriculum-notes">
                        <p>{{ lesson.notes }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Información adicional -->
        <section class="product-info">
            <h2>¿Qué incluye?</h2>
            <ul class="features-list">
                <li v-if="product.type === 'course'">✓ Acceso de por vida al contenido</li>
                <li v-if="product.type === 'course'">✓ Actualizaciones gratuitas</li>
                <li v-if="product.type === 'ebook'">✓ Descarga inmediata en PDF</li>
                <li v-if="product.certificate">✓ Certificado de finalización</li>
                <li>✓ Acceso desde cualquier dispositivo</li>
            </ul>
        </section>

        <!-- CTA fijo en móvil -->
        <div class="cta-mobile">
            <div class="cta-mobile__price">{{ formatted_price }}</div>
            <button @click="handle_purchase" class="action-btn cta-mobile__button">
                {{ cta_text }}
            </button>
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

// Waitlist
const show_waitlist_popup = ref(false)
const waitlist_email = ref(like_store.get_saved_email() || '')
const waitlist_error = ref('')
const waitlist_loading = ref(false)
const waitlist_done = ref(false)

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
            waitlist_error.value = 'Ya tienes cuenta. Inicia sesión para apuntarte.'
        } else {
            like_store.save_email(email)
            waitlist_done.value = true
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

const cta_text = computed(() => props.product.price === 0 ? 'Acceder gratis' : 'Comprar ahora')

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
    max-width: $max-width;
    margin: 0 auto;
    padding: $space-10 20px;
    padding-bottom: 100px; // Espacio para CTA móvil

    @media (max-width: $bp-md) {
        padding: $space-5 $space-4 100px;
    }
}

.product-hero {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 48px;
    margin-bottom: 60px;
    align-items: start;

    @media (max-width: 968px) {
        grid-template-columns: 1fr;
        gap: 24px;
    }

    &__image {
        border-radius: $radius-lg;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        max-width: 280px;

        @media (max-width: 968px) {
            max-width: 220px;
        }

        img {
            width: 100%;
            height: auto;
            display: block;
        }
    }

    &__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}

.product-badge {
    display: inline-block;
    padding: 6px $space-4;
    border-radius: $radius-full;
    font-size: $text-xs;
    font-weight: $fw-bold;
    text-transform: uppercase;
    background: var(--color-bg);
    color: var(--color-primary);
    margin-bottom: $space-4;
}

.product-title {
    font-size: 42px;
    font-weight: $fw-extrabold;
    line-height: 1.2;
    margin: 0 0 $space-4;
    color: var(--color-text-heading);

    @media (max-width: $bp-md) {
        font-size: $text-4xl;
    }
}

.product-description {
    font-size: $text-lg;
    line-height: 1.6;
    color: var(--color-text-muted);
    margin: 0 0 $space-6;
}

.product-meta {
    display: flex;
    gap: $space-5;
    margin-bottom: $space-8;
    flex-wrap: wrap;

    .meta-item {
        font-size: $text-sm;
        color: var(--color-text-muted);
    }
}

.product-cta {
    display: flex;
    align-items: center;
    gap: $space-5;

    @media (max-width: 568px) {
        flex-direction: column;
        align-items: stretch;
    }
}

.product-price {
    .price-amount {
        font-size: $text-4xl;
        font-weight: $fw-extrabold;
        color: var(--color-text-heading);
    }
}


.product-curriculum {
    margin-bottom: 60px;

    h2 {
        font-size: 28px;
        font-weight: $fw-bold;
        margin: 0 0 $space-6;
        color: var(--color-text-heading);
    }
}

.curriculum-list {
    display: flex;
    flex-direction: column;
    gap: $space-4;
}

.curriculum-item {
    background: var(--color-bg);
    border-radius: $radius-md;
    padding: $space-5;
    border: 2px solid transparent;
    transition: $transition;

    &--free {
        background: var(--color-bg-card);
        border-color: var(--color-success);
    }

    &__header {
        display: flex;
        align-items: center;
        gap: $space-4;
    }
}

.curriculum-number {
    width: $space-8;
    height: $space-8;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-border);
    border-radius: $radius-full;
    font-weight: $fw-bold;
    font-size: $text-sm;
    flex-shrink: 0;
}

.curriculum-title {
    flex: 1;
    font-size: $text-base;
    font-weight: $fw-semibold;
    margin: 0;
    color: var(--color-text);
}

.curriculum-badge {
    font-size: $text-xs;
    padding: $space-1 $space-3;
    border-radius: $radius-xs;
    background: var(--color-success);
    color: var(--color-bg-card);
    font-weight: $fw-semibold;

    &--locked {
        background: var(--color-border);
        color: var(--color-text-muted);
    }
}

.curriculum-notes {
    margin-top: $space-3;
    padding-top: $space-3;
    border-top: 1px solid var(--color-border-light);
    font-size: $text-sm;
    color: var(--color-text-muted);
    line-height: 1.6;
}

.product-info {
    h2 {
        font-size: 28px;
        font-weight: $fw-bold;
        margin: 0 0 $space-6;
        color: var(--color-text-heading);
    }
}

.features-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: $space-4;

    li {
        font-size: $text-base;
        color: var(--color-text);
        padding: $space-4 $space-5;
        background: var(--color-bg);
        border-radius: $radius-sm;
    }
}

.cta-mobile {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--color-bg-card);
    padding: $space-4 $space-5;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    z-index: 100;
    align-items: center;
    gap: $space-4;

    @media (max-width: $bp-md) {
        display: flex;
    }

    &__price {
        font-size: $text-2xl;
        font-weight: $fw-extrabold;
        color: var(--color-text-heading);
    }

    &__button {
        flex: 1;
    }
}

.product-cta__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $space-3;
    margin-top: $space-4;
}

.waitlist-btn {
    font-size: $text-sm;
}

/* Waitlist popup */
.waitlist-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: $space-4;
}

.waitlist-popup {
    background: var(--color-bg-card);
    border-radius: $radius-lg;
    padding: $space-8;
    max-width: 380px;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: $space-3;
    box-shadow: var(--shadow-lg);

    &__close {
        position: absolute;
        top: $space-3;
        right: $space-3;
        background: none;
        border: none;
        font-size: $text-lg;
        cursor: pointer;
        color: var(--color-text-muted);
    }

    &__input { width: 100%; max-width: 100%; }

    &__error { color: var(--color-error); font-size: $text-xs; margin: 0; }

    &__success {
        font-size: $text-base;
        font-weight: $fw-semibold;
        color: var(--color-success);
        text-align: center;
        margin: $space-4 0;
    }

    .action-btn { width: 100%; max-width: 100%; }
}
</style>