<template>
    <article class="product-card">
        <RouterLink :to="`/productos/${product.slug}`" class="product-card__link">
            <!-- Imagen del producto -->
            <div class="product-card__image">
                <img 
                    :src="product.cover_image?.secure_url || '/placeholder-product.jpg'" 
                    :alt="product.title"
                >
                
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

                <!-- Categoría -->
                <p v-if="product.category" class="product-card__category">
                    {{ product.category }}
                </p>

                <!-- Footer con precio -->
                <div class="product-card__footer">
                    <span class="product-card__price">
                        {{ formattedPrice }}
                    </span>
                    
                    <span class="product-card__cta">
                        {{ ctaText }}
                    </span>
                </div>
            </div>
        </RouterLink>
    </article>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth-store'

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const auth_store = useAuthStore()

// Verificar si el usuario compró este producto
const isPurchased = computed(() => {
    if (!auth_store.user_data) return false
    const purchases = auth_store.user_data.purchases || []
    return purchases.some(p => 
        p.product_id === props.product._id && 
        p.payment_status === 'completed'
    )
})

// Verificar si tiene orden pendiente
const isPending = computed(() => {
    if (!auth_store.user_data) return false
    const purchases = auth_store.user_data.purchases || []
    return purchases.some(p => 
        p.product_id === props.product._id && 
        p.payment_status === 'pending'
    )
})

// Etiqueta del tipo de producto
const productTypeLabel = computed(() => {
    const types = {
        'course': 'Formación',
        'ebook': 'Guía',
        'bundle': 'Pack',
        'service': 'Servicio'
    }
    return types[props.product.type] || props.product.type
})

// Descripción truncada
const truncatedDescription = computed(() => {
    if (!props.product.description) return ''
    return props.product.description.length > 120 
        ? props.product.description.substring(0, 120) + '...'
        : props.product.description
})

// Precio formateado
const formattedPrice = computed(() => {
    if (props.product.price === 0) return 'Gratis'
    return `${props.product.price}€`
})

// Texto del CTA
const ctaText = computed(() => {
    if (isPurchased.value) return 'Ver contenido →'
    if (isPending.value) return 'En validación...'
    if (props.product.price === 0) return 'Acceder gratis →'
    return 'Ver más →'
})
</script>

<style scoped lang="scss">
.product-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    &__link {
        display: block;
        text-decoration: none;
        color: inherit;
    }

    &__image {
        position: relative;
        width: 100%;
        padding-top: 56.25%; // Aspect ratio 16:9
        overflow: hidden;
        background: #f5f5f5;

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    &__badge {
        position: absolute;
        top: 12px;
        left: 12px;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        background: rgba(255, 255, 255, 0.95);
        
        &.badge--course {
            color: #6366f1;
        }
        &.badge--ebook {
            color: #10b981;
        }
        &.badge--bundle {
            color: #f59e0b;
        }
        &.badge--service {
            color: #8b5cf6;
        }
    }

    &__purchased {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        background: #10b981;
        color: white;
    }

    &__pending {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        background: #f59e0b;
        color: white;
    }

    &__content {
        padding: 20px;
    }

    &__title {
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 8px;
        color: #111;
        line-height: 1.4;
    }

    &__description {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
        margin: 0 0 12px;
    }

    &__category {
        font-size: 12px;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 0 0 16px;
    }

    &__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 16px;
        border-top: 1px solid #eee;
    }

    &__price {
        font-size: 20px;
        font-weight: 700;
        color: #111;
    }

    &__cta {
        font-size: 14px;
        font-weight: 600;
        color: #6366f1;
    }
}

@media (max-width: 768px) {
    .product-card__title {
        font-size: 16px;
    }

    .product-card__description {
        font-size: 13px;
    }
}
</style>