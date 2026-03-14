<script setup>
import { computed, onMounted } from 'vue'
import { useOrderStore } from '../../../stores/order-store'
import { useUtilStore } from '../../../stores/util-store'
import { RouterLink } from 'vue-router'

const order_store = useOrderStore()
const util_store = useUtilStore()

onMounted(async () => {
    if (order_store.my_orders.length === 0) {
        await order_store.fetch_my_orders()
    }
})

const status_map = {
    pending: { label: 'Pendiente', class: 'pending' },
    completed: { label: 'Completado', class: 'completed' },
    failed: { label: 'Rechazado', class: 'failed' },
    refunded: { label: 'Reembolsado', class: 'refunded' }
}

const method_map = {
    paypal: 'PayPal',
    offline: 'Transferencia'
}

const sorted_orders = computed(() => {
    return [...order_store.my_orders].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
})
</script>

<template>
    <section class="user-orders">
        <h2 class="section-title">Mis Compras</h2>

        <div v-if="util_store.loading" class="loading-state">
            Cargando pedidos...
        </div>

        <div v-else-if="sorted_orders.length === 0" class="empty-state">
            <div class="empty-content">
                <span class="icon">🛍️</span>
                <h3>Aún no tienes pedidos</h3>
                <p>Cuando realices tu primera compra, aparecerá aquí.</p>
                <RouterLink to="/productos" class="btn-primary">
                    Ver productos
                </RouterLink>
            </div>
        </div>

        <div v-else class="orders-list">
            <div v-for="order in sorted_orders" :key="order._id" class="order-card">
                <div class="order-header">
                    <div class="order-meta">
                        <span class="order-date">{{ util_store.format_date(order.createdAt) }}</span>
                        <span class="order-method">{{ method_map[order.payment_method] || order.payment_method }}</span>
                    </div>
                    <span class="status-badge" :class="status_map[order.payment_status]?.class">
                        {{ status_map[order.payment_status]?.label || order.payment_status }}
                    </span>
                </div>

                <div v-for="item in order.products" :key="item._id" class="order-product">
                    <img v-if="item.product_id?.cover_image?.secure_url"
                        :src="item.product_id.cover_image.secure_url" :alt="item.title" class="product-thumb">
                    <div class="product-thumb product-thumb--placeholder" v-else>
                        📦
                    </div>

                    <div class="product-info">
                        <RouterLink v-if="item.product_id?.slug" :to="`/productos/${item.product_id.slug}`"
                            class="product-name">
                            {{ item.product_id?.title || item.title }}
                        </RouterLink>
                        <span v-else class="product-name">{{ item.title }}</span>
                        <span class="product-type">{{ item.product_id?.type || 'producto' }}</span>
                    </div>

                    <span class="product-price">{{ item.price_at_purchase }}$</span>
                </div>

                <div class="order-footer">
                    <span class="order-total">Total: <strong>{{ order.total_amount }}$</strong></span>

                    <RouterLink v-if="order.payment_status === 'completed' && order.products[0]?.product_id?.slug"
                        :to="`/productos/${order.products[0].product_id.slug}`" class="btn-access">
                        Acceder al contenido
                    </RouterLink>

                    <RouterLink v-if="order.payment_status === 'pending' && order.products[0]?.product_id?.slug"
                        :to="`/productos/${order.products[0].product_id.slug}`" class="btn-pending">
                        Ver estado del pago
                    </RouterLink>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.user-orders {
    padding: 1rem;
}

.section-title {
    font-family: 'Title', serif;
    font-size: 2.2rem;
    color: var(--color-primary);
    margin-bottom: 2rem;
}

.loading-state {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-muted);
}

.empty-state {
    background: var(--color-bg-card);
    border-radius: var(--radius-md);
    padding: 4rem 2rem;
    text-align: center;
    box-shadow: var(--shadow-sm);

    .icon {
        font-size: 3rem;
        display: block;
        margin-bottom: 1rem;
    }

    h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    p {
        color: var(--color-text-muted);
        margin-bottom: 2rem;
    }

    .btn-primary {
        display: inline-block;
        padding: 0.8rem 2rem;
        background: var(--color-secondary);
        color: var(--color-white);
        text-decoration: none;
        border-radius: var(--radius-full);
        transition: transform 0.2s;

        &:hover {
            transform: translateY(-2px);
        }
    }
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.order-card {
    background: var(--color-bg-card);
    border-radius: var(--radius-md);
    padding: 24px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--color-border-light);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--color-border-light);
}

.order-meta {
    display: flex;
    align-items: center;
    gap: 12px;
}

.order-date {
    font-size: 14px;
    color: var(--color-text-muted);
}

.order-method {
    font-size: 12px;
    padding: 2px 8px;
    background: var(--color-border-light);
    border-radius: 4px;
    color: var(--color-text-muted);
}

.status-badge {
    font-size: 13px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: var(--radius-full);

    &.pending {
        background: rgba(245, 158, 11, 0.1);
        color: var(--color-warning);
    }

    &.completed {
        background: rgba(16, 185, 129, 0.1);
        color: var(--color-success);
    }

    &.failed {
        background: rgba(239, 68, 68, 0.1);
        color: var(--color-error);
    }

    &.refunded {
        background: rgba(107, 114, 128, 0.1);
        color: var(--color-text-muted);
    }
}

.order-product {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
}

.product-thumb {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-sm);
    object-fit: cover;
    flex-shrink: 0;

    &--placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-border-light);
        font-size: 24px;
    }
}

.product-info {
    flex: 1;
    min-width: 0;
}

.product-name {
    display: block;
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text);
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        color: var(--color-primary);
    }
}

.product-type {
    font-size: 13px;
    color: var(--color-text-muted);
    text-transform: capitalize;
}

.product-price {
    font-size: 16px;
    font-weight: 700;
    color: var(--color-text-heading);
    flex-shrink: 0;
}

.order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--color-border-light);
}

.order-total {
    font-size: 15px;
    color: var(--color-text-muted);

    strong {
        color: var(--color-text-heading);
        font-size: 17px;
    }
}

.btn-access,
.btn-pending {
    font-size: 14px;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: var(--radius-sm);
    text-decoration: none;
    transition: all 0.2s ease;
}

.btn-access {
    background: var(--color-primary);
    color: var(--color-white);

    &:hover {
        background: var(--color-primary-dark);
    }
}

.btn-pending {
    background: transparent;
    color: var(--color-warning);
    border: 1px solid var(--color-warning);

    &:hover {
        background: rgba(245, 158, 11, 0.05);
    }
}
</style>
