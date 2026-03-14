<template>
    <article class="product-card">
        <RouterLink :to="`/productos/${product.slug}`" class="product-card__link">
            <div class="product-card__image">
                <img :src="coverImage" :alt="product.title" @error="handleImageError">

                <span class="product-card__badge" :class="`badge--${product.type}`">
                    {{ productTypeLabel }}
                </span>

                <span v-if="isPurchased" class="product-card__purchased">
                    ✓ Comprado
                </span>

                <span v-else-if="isPending" class="product-card__pending">
                    ⏳ Pendiente
                </span>
            </div>

            <div class="product-card__price-banner">
                <span class="product-card__price">
                    {{ formattedPrice }}
                </span>
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

// Precio formateado
const formattedPrice = computed(() => {
    if (props.product.price === 0) return 'Gratis'
    return `${props.product.price}$`
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
</script>

<style scoped lang="scss">
.product-card {
    max-width: 300px;
    background: var(--color-white);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    font-family: 'Montserrat', sans-serif;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
    }

    &__link {
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    &__image {
        position: relative;
        width: 100%;
        aspect-ratio: 3/4;
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
        background: var(--overlay-white-85);
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

    &__price-banner {
        padding: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--color-white);
        /* Línea sutil que separa la imagen del banner */
        border-top: 1px solid var(--color-border-light);
        flex-grow: 1;
        /* Para que empuje el banner al final si las cards tienen alturas fijas */
    }

    &__price {
        font-size: 24px;
        font-weight: 800;
        color: var(--color-secondary);
        margin: 0;
        transition: transform 0.2s ease;

        /* Efecto opcional: un leve zoom al precio al hacer hover en la card */
        .product-card:hover & {
            transform: scale(1.05);
        }
    }
}

// Responsive
@media (max-width: 568px) {
    .product-card {
        &__price-banner {
            padding: 12px;
        }

        &__price {
            font-size: 20px;
        }
    }
}
</style>