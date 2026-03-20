<script setup>
defineProps({
    product: { type: Object, required: true }
})

defineEmits(['edit', 'delete'])

const get_product_image = (product) => {
    if (typeof product.cover_image === 'string') return product.cover_image
    return product.cover_image?.secure_url || '/img/placeholder-product.jpg'
}

const get_type_label = (type) => {
    const labels = { course: 'Curso', ebook: 'Guía', bundle: 'Pack', service: 'Servicio' }
    return labels[type] || type
}

const get_status_label = (status) => {
    const labels = { active: 'Activo', draft: 'Borrador', archived: 'Archivado', coming_soon: 'Próximamente', pre_sale: 'Pre-venta' }
    return labels[status] || status
}

const format_price = (price) => price === 0 ? 'Gratis' : `${price}$`

const format_date = (date) => new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric'
})
</script>

<template>
    <tr class="product-row">
        <td class="product-info">
            <div class="product-image">
                <img :src="get_product_image(product)" :alt="product.title"
                    @error="(e) => e.target.src = '/img/placeholder-product.jpg'" />
            </div>
            <div class="product-details">
                <h4 class="product-name">{{ product.title }}</h4>
                <span class="product-slug">{{ product.slug }}</span>
            </div>
        </td>
        <td>
            <span class="type-badge" :class="`type-badge--${product.type}`">
                {{ get_type_label(product.type) }}
            </span>
        </td>
        <td class="product-price">{{ format_price(product.price) }}</td>
        <td>
            <span class="status-badge" :class="`status-badge--${product.status}`">
                {{ get_status_label(product.status) }}
            </span>
        </td>
        <td class="product-date">
            {{ product.start_date ? format_date(product.start_date) : '-' }}
        </td>
        <td class="product-actions">
            <button @click="$emit('edit', product)" class="btn-action btn-action--edit" title="Editar">
                ✏️
            </button>
            <button @click="$emit('delete', product)" class="btn-action btn-action--delete" title="Eliminar">
                🗑️
            </button>
        </td>
    </tr>
</template>

<style scoped lang="scss">
.product-info {
    display: flex;
    gap: $space-3;
    align-items: center;
    min-width: 250px;
}

.product-image {
    width: 60px;
    height: 60px;
    border-radius: $radius-sm;
    overflow: hidden;
    flex-shrink: 0;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.product-details {
    flex: 1;
    min-width: 0;
}

.product-name {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    margin: 0 0 $space-1;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.product-slug {
    font-size: $text-xs;
    color: var(--color-text-muted);
}

.type-badge,
.status-badge {
    display: inline-block;
    padding: $space-1 $space-3;
    border-radius: $radius-md;
    font-size: $text-xs;
    font-weight: $fw-semibold;
    white-space: nowrap;
}

.type-badge {
    &--course {
        background: var(--overlay-primary-10);
        color: var(--color-primary);
    }
    &--ebook {
        background: rgba(212, 160, 23, 0.12);
        color: var(--color-secondary-dark);
    }
    &--bundle {
        background: rgba(20, 61, 117, 0.12);
        color: var(--color-primary-dark);
    }
    &--service {
        background: var(--color-border-light);
        color: var(--color-text-muted);
    }
}

.status-badge {
    &--active {
        background: rgba(16, 185, 129, 0.12);
        color: var(--color-success);
    }
    &--draft {
        background: rgba(245, 158, 11, 0.12);
        color: var(--color-warning);
    }
    &--archived {
        background: var(--color-border-light);
        color: var(--color-text-muted);
    }
    &--coming_soon {
        background: rgba(30, 86, 160, 0.08);
        color: var(--color-primary-light);
    }
    &--pre_sale {
        background: rgba(16, 185, 129, 0.12);
        color: var(--color-success);
    }
}

.product-price {
    font-weight: $fw-semibold;
    color: var(--color-text);
    white-space: nowrap;
}

.product-date {
    color: var(--color-text-muted);
    white-space: nowrap;
}

.product-actions {
    display: flex;
    gap: $space-2;
    white-space: nowrap;
}

.btn-action {
    padding: $space-2 $space-3;
    border: none;
    border-radius: $radius-xs;
    background: var(--color-bg);
    font-size: $text-base;
    cursor: pointer;
    transition: $transition;

    &:hover {
        transform: scale(1.1);
    }

    &--edit:hover {
        background: rgba(30, 86, 160, 0.12);
    }

    &--delete:hover {
        background: rgba(239, 68, 68, 0.12);
    }
}
</style>
