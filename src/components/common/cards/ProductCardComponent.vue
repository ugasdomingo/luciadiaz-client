<template>
    <article class="product-card">
        <RouterLink :to="`/productos/${product.slug}`" class="product-card__link">
            <!-- Imagen del producto -->
            <div class="product-card__image">
                <img :src="coverImage" :alt="product.title" @error="handleImageError">

                <!-- Badge de tipo de producto -->
                <span class="product-card__badge" :class="`badge--${product.type}`">
                    {{ productTypeLabel }}
                </span>

                <!-- Badge si ya lo compró -->
                <span v-if="isPurchased" class="product-card__purchased">
                    ✓ Comprado
                </span>

                <!-- Badge si tiene orden pendiente -->
                <span v-else-if="isPending" class="product-card__pending">
                    ⏳ Pendiente
                </span>
            </div>

            <!-- Contenido -->
            <div class="product-card__content">
                <h3 class="product-card__title">{{ product.title }}</h3>

                <p class="product-card__description">
                    {{ truncatedDescription }}
                </p>

                <!-- Categoría y fecha de inicio (si aplica) -->
                <div class="product-card__meta">
                    <span v-if="product.category" class="meta-category">
                        📂 {{ product.category }}
                    </span>
                    <span v-if="product.start_date" class="meta-date">
                        📅 {{ formattedStartDate }}
                    </span>
                </div>

                <!-- Footer con precio y CTA -->
                <div class="product-card__footer">
                    <span class="product-card__price">
                        {{ formattedPrice }}
                    </span>

                    <span class="product-card__cta">
                        {{ ctaText }} →
                    </span>
                </div>
            </div>
        </RouterLink>
    </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../../../stores/auth-store'
import { useProductStore } from '../../../stores/product-store'

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const auth_store = useAuthStore()
const product_store = useProductStore()
const imageError = ref(false)

// Imagen de portada (con fallback)
const coverImage = computed(() => {
    if (imageError.value) return '/placeholder-product.jpg'

    // Soporte para diferentes formatos de cover_image
    if (typeof props.product.cover_image === 'string') {
        return props.product.cover_image
    }

    return props.product.cover_image?.secure_url || '/placeholder-product.jpg'
})

// Manejar error de carga de imagen
const handleImageError = () => {
    imageError.value = true
}

// Etiqueta del tipo de producto
const productTypeLabel = computed(() => {
    const types = {
        'course': 'Curso',
        'ebook': 'Guía',
        'bundle': 'Pack',
        'service': 'Servicio'
    }
    return types[props.product.type] || props.product.type
})

// Descripción truncada (máx 120 caracteres)
const truncatedDescription = computed(() => {
    if (!props.product.description) return ''
    if (props.product.description.length <= 120) return props.product.description
    return props.product.description.substring(0, 120) + '...'
})

// Precio formateado
const formattedPrice = computed(() => {
    if (props.product.price === 0) return 'Gratis'
    return `${props.product.price}$`
})

// Fecha de inicio formateada (para cursos con fecha)
const formattedStartDate = computed(() => {
    if (!props.product.start_date) return ''
    const date = new Date(props.product.start_date)
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
    })
})

// Verificar si el usuario compró este producto
const isPurchased = computed(() => {
    if (!auth_store.user_data) return false
    return product_store.has_access(props.product.slug)
})

// Verificar si tiene orden pendiente
const isPending = computed(() => {
    if (!auth_store.user_data) return false
    return product_store.has_pending_order(props.product.slug)
})

// Texto del botón CTA
const ctaText = computed(() => {
    if (isPurchased.value) return 'Acceder'
    if (isPending.value) return 'Pendiente'
    if (props.product.price === 0) return 'Ver gratis'
    return 'Ver más'
})
</script>

<style scoped lang="scss">
.product-card {
    background: var(--color-white);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    font-family: 'Montserrat', sans-serif;

    &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
    }

    &__link {
        text-decoration: none;
        color: inherit;
        display: block;
    }

    &__image {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        overflow: hidden;
        background: var(--color-text-light);

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        &:hover img {
            transform: scale(1.05);
        }
    }

    &__badge {
        position: absolute;
        top: 12px;
        left: 12px;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        background: rgba(255, 255, 255, 0.95);
        color: var(--color-text);
        backdrop-filter: blur(4px);

        &.badge--course {
            background: var(--color-primary);
            color: var(--color-white);
        }

        &.badge--ebook {
            background: var(--color-secondary);
            color: var(--color-white);
        }

        &.badge--bundle {
            background: var(--color-tertiary);
            color: var(--color-white);
        }

        &.badge--service {
            background: var(--color-text-dark);
            color: var(--color-white);
        }
    }

    &__purchased {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 700;
        background: var(--color-approve-alert);
        color: var(--color-text-dark);
        backdrop-filter: blur(4px);
        border: 2px solid var(--color-approve-alert);
    }

    &__pending {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 700;
        background: var(--color-secondary);
        color: var(--color-white);
        backdrop-filter: blur(4px);
    }

    &__content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__title {
        font-size: 20px;
        font-weight: 700;
        line-height: 1.3;
        margin: 0;
        color: var(--color-primary);
        font-family: 'Playfair Display', serif;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    &__description {
        font-size: 14px;
        line-height: 1.5;
        color: var(--color-text);
        margin: 0;
        font-weight: 300;
    }

    &__meta {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        font-size: 13px;
        color: var(--color-text);
        opacity: 0.7;

        .meta-category,
        .meta-date {
            display: flex;
            align-items: center;
            gap: 4px;
        }
    }

    &__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 8px;
        border-top: 1px solid var(--color-disable);
        margin-top: auto;
    }

    &__price {
        font-size: 24px;
        font-weight: 800;
        color: var(--color-secondary);
    }

    &__cta {
        font-size: 14px;
        font-weight: 700;
        color: var(--color-primary);
        transition: transform 0.2s ease;

        .product-card:hover & {
            transform: translateX(4px);
            color: var(--color-secondary);
        }
    }
}

// Responsive
@media (max-width: 568px) {
    .product-card {
        &__content {
            padding: 16px;
        }

        &__title {
            font-size: 18px;
        }

        &__price {
            font-size: 20px;
        }
    }
}
</style>