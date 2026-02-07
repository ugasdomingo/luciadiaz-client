<template>
    <div class="product-public">
        <!-- Hero / Portada -->
        <section class="product-hero">
            <div class="product-hero__image">
                <img :src="product.cover_image?.secure_url || '/placeholder-product.jpg'" :alt="product.title">
            </div>
            <div class="product-hero__content">
                <span class="product-badge">{{ productTypeLabel }}</span>
                <h1 class="product-title">{{ product.title }}</h1>
                <p class="product-description">{{ product.description }}</p>

                <div class="product-meta">
                    <span v-if="product.category" class="meta-item">
                        📂 {{ product.category }}
                    </span>
                    <span v-if="product.start_date" class="meta-item">
                        📅 Inicia: {{ formattedStartDate }}
                    </span>
                </div>

                <!-- CTA principal -->
                <div class="product-cta">
                    <div class="product-price">
                        <span class="price-amount">{{ formattedPrice }}</span>
                    </div>

                    <button @click="handlePurchaseClick" class="btn-primary">
                        {{ ctaText }}
                    </button>
                </div>
            </div>
        </section>

        <!-- Curriculum / Contenido (preview) -->
        <section v-if="hasCurriculum" class="product-curriculum">
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
            <div class="cta-mobile__price">{{ formattedPrice }}</div>
            <button @click="handlePurchaseClick" class="cta-mobile__button">
                {{ ctaText }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth-store'

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const router = useRouter()
const auth_store = useAuthStore()

// Etiqueta del tipo
const productTypeLabel = computed(() => {
    const types = {
        'course': 'Formación Online',
        'ebook': 'Guía Digital',
        'bundle': 'Pack Completo',
        'service': 'Servicio'
    }
    return types[props.product.type] || props.product.type
})

// Precio formateado
const formattedPrice = computed(() => {
    if (props.product.price === 0) return 'Gratis'
    return `${props.product.price}$`
})

// Fecha de inicio formateada
const formattedStartDate = computed(() => {
    if (!props.product.start_date) return ''
    const date = new Date(props.product.start_date)
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
})

// Verificar si tiene curriculum
const hasCurriculum = computed(() => {
    return props.product.curriculum && props.product.curriculum.length > 0
})

// Texto del botón
const ctaText = computed(() => {
    if (props.product.price === 0) return 'Acceder gratis'
    return 'Comprar ahora'
})

// Manejar click en comprar
const handlePurchaseClick = () => {
    // Si no está logueado, redirigir a login con redirect
    if (!auth_store.user_data) {
        router.push({
            path: '/acceso',
            query: { redirect: `/productos/${props.product.slug}` }
        })
        return
    }

    // Si está logueado, ir a checkout
    router.push(`/checkout/${props.product.slug}`)
}
</script>

<style scoped lang="scss">
.product-public {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    padding-bottom: 100px; // Espacio para CTA móvil

    @media (max-width: 768px) {
        padding: 20px 16px 100px;
    }
}

.product-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    margin-bottom: 60px;

    @media (max-width: 968px) {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    &__image {
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

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
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    background: var(--color-bg);
    color: var(--color-primary);
    margin-bottom: 16px;
}

.product-title {
    font-size: 42px;
    font-weight: 800;
    line-height: 1.2;
    margin: 0 0 16px;
    color: var(--color-text-heading);

    @media (max-width: 768px) {
        font-size: 32px;
    }
}

.product-description {
    font-size: 18px;
    line-height: 1.6;
    color: var(--color-text-muted);
    margin: 0 0 24px;
}

.product-meta {
    display: flex;
    gap: 20px;
    margin-bottom: 32px;
    flex-wrap: wrap;

    .meta-item {
        font-size: 14px;
        color: var(--color-text-muted);
    }
}

.product-cta {
    display: flex;
    align-items: center;
    gap: 20px;

    @media (max-width: 568px) {
        flex-direction: column;
        align-items: stretch;
    }
}

.product-price {
    .price-amount {
        font-size: 36px;
        font-weight: 800;
        color: var(--color-text-heading);
    }
}

.btn-primary {
    padding: 16px 48px;
    border: none;
    border-radius: 12px;
    background: var(--color-secondary);
    color: var(--color-bg-card);
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: var(--color-secondary-dark);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(30, 86, 160, 0.2);
    }

    @media (max-width: 568px) {
        width: 100%;
    }
}

.product-curriculum {
    margin-bottom: 60px;

    h2 {
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 24px;
        color: var(--color-text-heading);
    }
}

.curriculum-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.curriculum-item {
    background: var(--color-bg);
    border-radius: 12px;
    padding: 20px;
    border: 2px solid transparent;
    transition: all 0.2s ease;

    &--free {
        background: var(--color-bg-card);
        border-color: var(--color-success);
    }

    &__header {
        display: flex;
        align-items: center;
        gap: 16px;
    }
}

.curriculum-number {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-border);
    border-radius: 50%;
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
}

.curriculum-title {
    flex: 1;
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: var(--color-text);
}

.curriculum-badge {
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 6px;
    background: var(--color-success);
    color: var(--color-bg-card);
    font-weight: 600;

    &--locked {
        background: var(--color-border);
        color: var(--color-text-muted);
    }
}

.curriculum-notes {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--color-border-light);
    font-size: 14px;
    color: var(--color-text-muted);
    line-height: 1.6;
}

.product-info {
    h2 {
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 24px;
        color: var(--color-text-heading);
    }
}

.features-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 16px;

    li {
        font-size: 16px;
        color: var(--color-text);
        padding: 16px 20px;
        background: var(--color-bg);
        border-radius: 8px;
    }
}

.cta-mobile {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--color-bg-card);
    padding: 16px 20px;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    z-index: 100;
    align-items: center;
    gap: 16px;

    @media (max-width: 768px) {
        display: flex;
    }

    &__price {
        font-size: 24px;
        font-weight: 800;
        color: var(--color-text-heading);
    }

    &__button {
        flex: 1;
        padding: 14px;
        border: none;
        border-radius: 10px;
        background: var(--color-secondary);
        color: var(--color-bg-card);
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
    }
}
</style>