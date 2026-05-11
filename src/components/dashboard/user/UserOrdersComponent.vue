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
        <div class="section-header">
            <h2 class="section-header__title">Mis Compras</h2>
            <p class="section-header__sub">Historial completo de tus pedidos y acceso a tus productos.</p>
        </div>

        <div v-if="util_store.loading" class="loading-state">
            <div class="loading-state__dot" /><div class="loading-state__dot" /><div class="loading-state__dot" />
        </div>

        <div v-else-if="sorted_orders.length === 0" class="dash-empty">
            <div class="dash-empty__icon">🛍️</div>
            <h3 class="dash-empty__title">Aún no tienes pedidos</h3>
            <p class="dash-empty__desc">Cuando realices tu primera compra, aparecerá aquí.</p>
            <RouterLink to="/productos" class="dash-cta">Ver productos</RouterLink>
        </div>

        <div v-else class="orders-list">
            <div v-for="order in sorted_orders" :key="order._id" class="order-card">

                <!-- Barra de estado lateral -->
                <div class="order-card__stripe" :class="status_map[order.payment_status]?.class" />

                <div class="order-card__content">
                    <!-- Header -->
                    <div class="order-header">
                        <div class="order-meta">
                            <span class="order-date">{{ util_store.format_date(order.createdAt) }}</span>
                            <span class="order-method">{{ method_map[order.payment_method] || order.payment_method }}</span>
                        </div>
                        <span class="status-badge" :class="status_map[order.payment_status]?.class">
                            {{ status_map[order.payment_status]?.label || order.payment_status }}
                        </span>
                    </div>

                    <!-- Productos -->
                    <div v-for="item in order.products" :key="item._id" class="order-product">
                        <img v-if="item.product_id?.cover_image?.secure_url"
                            :src="item.product_id.cover_image.secure_url"
                            :alt="item.title"
                            class="product-thumb">
                        <div class="product-thumb product-thumb--placeholder" v-else>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" stroke-width="1.5"/></svg>
                        </div>
                        <div class="product-info">
                            <RouterLink v-if="item.product_id?.slug" :to="`/productos/${item.product_id.slug}`" class="product-name">
                                {{ item.product_id?.title || item.title }}
                            </RouterLink>
                            <span v-else class="product-name product-name--plain">{{ item.title }}</span>
                            <span class="product-type">{{ item.product_id?.type || 'producto' }}</span>
                        </div>
                        <span class="product-price">{{ item.price_at_purchase }}$</span>
                    </div>

                    <!-- Footer -->
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
        </div>
    </section>
</template>

<style scoped lang="scss">
.user-orders { padding: 0; }

/* Header */
.section-header {
    margin-bottom: 36px;

    &__title {
        font-family: var(--font-title);
        font-size: clamp(26px, 4vw, 36px);
        font-weight: 700;
        color: var(--blue-ink);
        margin: 0 0 8px;
        position: relative;
        display: inline-block;

        &::after {
            content: '';
            position: absolute;
            bottom: -6px; left: 0;
            width: 48px; height: 3px;
            background: var(--gold-grad);
            border-radius: $radius-full;
        }
    }

    &__sub {
        font-size: 14px;
        color: var(--color-text-muted);
        margin: 16px 0 0;
    }
}

/* Loading */
.loading-state {
    display: flex;
    gap: 8px;
    padding: 48px;
    justify-content: center;

    &__dot {
        width: 10px; height: 10px;
        background: var(--color-primary);
        border-radius: $radius-full;
        opacity: 0.3;
        animation: pulse-dot 1.2s ease-in-out infinite;
        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
    }
}
@keyframes pulse-dot {
    0%, 100% { opacity: 0.2; transform: scale(0.8); }
    50%       { opacity: 1; transform: scale(1.1); }
}

/* Empty */
.dash-empty {
    background: white;
    border-radius: var(--r-xl);
    padding: 64px 32px;
    text-align: center;
    border: 1.5px solid var(--border);
    box-shadow: var(--shadow-sm-new);

    &__icon { font-size: 48px; display: block; margin-bottom: 16px; }

    &__title {
        font-family: var(--font-title);
        font-size: 22px;
        color: var(--blue-ink);
        margin: 0 0 10px;
    }

    &__desc {
        font-size: 14px;
        color: var(--color-text-muted);
        margin: 0 0 24px;
        line-height: 1.7;
    }
}

.dash-cta {
    display: inline-flex;
    align-items: center;
    padding: 12px 28px;
    background: var(--gold-grad);
    color: white;
    text-decoration: none;
    border-radius: $radius-full;
    font-size: 13px;
    font-weight: $fw-semibold;
    font-family: var(--font-body);
    box-shadow: var(--shadow-gold-new);
    transition: transform 0.2s var(--ease), box-shadow 0.2s;
    &:hover { transform: translateY(-2px); box-shadow: var(--shadow-gold-glow); }
}

/* Lista */
.orders-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.order-card {
    display: flex;
    background: white;
    border-radius: var(--r-lg);
    border: 1.5px solid var(--border);
    box-shadow: var(--shadow-xs);
    overflow: hidden;
    transition: box-shadow 0.2s var(--ease), border-color 0.2s;
    &:hover { box-shadow: var(--shadow-md-new); border-color: rgba(30,86,160,0.15); }
}

.order-card__stripe {
    width: 4px;
    flex-shrink: 0;
    &.completed { background: var(--color-success); }
    &.pending   { background: var(--color-warning); }
    &.failed    { background: var(--color-error); }
    &.refunded  { background: var(--ink-faint); }
}

.order-card__content {
    flex: 1;
    padding: 20px 24px;
    min-width: 0;

    @media (max-width: $bp-sm) { padding: 16px; }
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
    gap: 8px;
}

.order-meta { display: flex; align-items: center; gap: 10px; }

.order-date {
    font-size: 13px;
    color: var(--color-text-muted);
    font-family: var(--font-body);
}

.order-method {
    font-size: 11px;
    padding: 2px 8px;
    background: var(--blue-wash);
    border-radius: $radius-full;
    color: var(--color-primary);
    font-weight: $fw-medium;
}

.status-badge {
    font-size: 12px;
    font-weight: $fw-semibold;
    font-family: var(--font-body);
    padding: 4px 12px;
    border-radius: $radius-full;

    &.pending  { background: rgba(245,158,11,.1);  color: var(--color-warning); }
    &.completed { background: rgba(16,185,129,.1); color: var(--color-success); }
    &.failed   { background: rgba(239,68,68,.1);   color: var(--color-error); }
    &.refunded { background: rgba(107,114,128,.1); color: var(--color-text-muted); }
}

.order-product {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);

    &:last-of-type { border-bottom: none; }
}

.product-thumb {
    width: 52px; height: 52px;
    border-radius: $radius-md;
    object-fit: cover;
    flex-shrink: 0;

    &--placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--blue-wash);
        color: var(--color-primary);
        border-radius: $radius-md;
        flex-shrink: 0;
    }
}

.product-info { flex: 1; min-width: 0; }

.product-name {
    display: block;
    font-size: 14px;
    font-weight: $fw-semibold;
    color: var(--blue-ink);
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover { color: var(--color-primary); }
    &--plain { pointer-events: none; }
}

.product-type {
    font-size: 12px;
    color: var(--ink-muted);
    text-transform: capitalize;
}

.product-price {
    font-size: 15px;
    font-weight: $fw-bold;
    color: var(--blue-ink);
    flex-shrink: 0;
}

.order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
    flex-wrap: wrap;
    gap: 10px;
}

.order-total {
    font-size: 14px;
    color: var(--color-text-muted);
    strong { color: var(--blue-ink); font-size: 16px; }
}

.btn-access, .btn-pending {
    font-size: 13px;
    font-weight: $fw-semibold;
    font-family: var(--font-body);
    padding: 8px 18px;
    border-radius: $radius-full;
    text-decoration: none;
    transition: transform 0.2s, opacity 0.2s;
    &:hover { transform: translateY(-1px); opacity: 0.9; }
}

.btn-access {
    background: var(--gold-grad);
    color: white;
    box-shadow: var(--shadow-gold-new);
}

.btn-pending {
    background: transparent;
    color: var(--color-warning);
    border: 1.5px solid var(--color-warning);
    &:hover { background: rgba(245,158,11,0.06); }
}
</style>
