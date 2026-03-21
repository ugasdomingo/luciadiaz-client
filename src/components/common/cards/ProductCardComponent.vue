<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../../stores/auth-store'
import { useProductStore } from '../../../stores/product-store'
import { useImageFallback } from '../../../composables/useImageFallback.js'
import LikeButtonComponent from '../LikeButtonComponent.vue'

const props = defineProps({
    product: { type: Object, required: true }
})

const auth_store = useAuthStore()
const product_store = useProductStore()

const { src: cover_image, on_error } = useImageFallback(
    () => typeof props.product.cover_image === 'string'
        ? props.product.cover_image
        : props.product.cover_image?.secure_url,
    '/img/placeholder-product.jpg'
)

const product_type_label = computed(() => {
    const types = { course: 'Formación', ebook: 'Guía', bundle: 'Pack', service: 'Servicio' }
    return types[props.product.type] || props.product.type
})

const formatted_price = computed(() => {
    if (props.product.price === 0) return 'Gratis'
    return `${props.product.price}$`
})

const is_purchased = computed(() => auth_store.user_data && product_store.has_access(props.product.slug))
const is_pending = computed(() => auth_store.user_data && product_store.has_pending_order(props.product.slug))
</script>

<template>
    <article class="product-card">
        <RouterLink :to="`/productos/${product.slug}`" class="product-card__link">
            <div class="product-card__image">
                <img :src="cover_image" :alt="product.title" @error="on_error" />

                <span class="product-card__type-badge badge" :class="`product-card__type-badge--${product.type}`">
                    {{ product_type_label }}
                </span>

                <span v-if="is_purchased" class="product-card__status badge badge--success">
                    ✓ Acceder
                </span>
                <span v-else-if="is_pending" class="product-card__status badge badge--gold">
                    ⏳ Pendiente
                </span>
            </div>

            <div class="product-card__footer">
                <div v-if="is_purchased" class="product-card__action product-card__action--purchased">
                    Ir al contenido →
                </div>
                <div v-else-if="is_pending" class="product-card__action product-card__action--pending">
                    Pago en revisión
                </div>
                <div v-else class="product-card__action">
                    <span class="product-card__price">{{ formatted_price }}</span>
                    <span class="product-card__cta">Ver producto →</span>
                </div>
                <LikeButtonComponent item_type="Product" :item_id="product._id" /></div>
        </RouterLink>
    </article>
</template>

<style scoped lang="scss">
.product-card {
    background: var(--color-white);
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--color-border-light);
    transition: var(--transition-slow);
    font-family: 'Montserrat', sans-serif;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    &:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-md);
        border-color: var(--color-border);

        .product-card__image img {
            transform: scale(1.04);
        }
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
        aspect-ratio: 3 / 4;
        overflow: hidden;
        background: var(--color-bg);

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
        }
    }

    &__type-badge {
        position: absolute;
        top: 0.75rem;
        left: 0.75rem;
        backdrop-filter: blur(4px);
        text-transform: uppercase;
        font-size: var(--text-xs);
        font-weight: 700;
        letter-spacing: 0.05em;

        &--course {
            background: var(--color-primary);
            color: var(--color-white);
        }
        &--ebook {
            background: var(--color-secondary);
            color: var(--color-white);
        }
        &--bundle {
            background: var(--color-tertiary);
            color: var(--color-white);
        }
        &--service {
            background: var(--color-text-dark);
            color: var(--color-white);
        }
    }

    &__status {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        backdrop-filter: blur(4px);
    }

    &__footer {
        padding: 1rem 1.25rem;
        border-top: 1px solid var(--color-border-light);
        background: var(--color-white);
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
    }

    &__action {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        font-size: var(--text-sm);
        color: var(--color-text-muted);

        &--purchased {
            color: var(--color-success);
            font-weight: 600;
        }

        &--pending {
            color: var(--color-secondary-dark);
            font-weight: 600;
        }
    }

    &__price {
        font-size: var(--text-2xl);
        font-weight: 800;
        color: var(--color-secondary);
        transition: transform 0.2s ease;

        .product-card:hover & {
            transform: scale(1.05);
        }
    }

    &__cta {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--color-primary);
    }
}

@media (max-width: 568px) {
    .product-card {
        &__price {
            font-size: var(--text-xl);
        }
    }
}
</style>
