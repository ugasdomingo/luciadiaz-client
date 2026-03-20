<template>
    <div class="manage-orders">
        <header class="manage-header">
            <h2 class="manage-title">Órdenes Pendientes</h2>
            <button @click="loadOrders" class="btn-refresh" title="Actualizar">
                🔄 Actualizar
            </button>
        </header>

        <!-- Loading -->
        <LoadingComponent v-if="loading" />

        <!-- Sin órdenes pendientes -->
        <div v-else-if="orders.length === 0" class="empty-state">
            <div class="empty-icon">✅</div>
            <h3>¡Todo al día!</h3>
            <p>No hay órdenes pendientes de validación</p>
        </div>

        <!-- Lista de órdenes -->
        <div v-else class="orders-list">
            <div v-for="order in orders" :key="order._id" class="order-card">
                <!-- Header -->
                <div class="order-header">
                    <div class="order-id">
                        <strong>Orden #{{ order._id.slice(-8) }}</strong>
                        <span class="order-date">{{ formatDate(order.createdAt) }}</span>
                    </div>
                    <span class="order-badge order-badge--pending">⏳ Pendiente</span>
                </div>

                <!-- Contenido -->
                <div class="order-content">
                    <!-- Info del cliente -->
                    <section class="order-section">
                        <h4 class="section-title">👤 Cliente</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Nombre:</span>
                                <span class="info-value">{{ order.user_id?.name || 'N/A' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Email:</span>
                                <span class="info-value">{{ order.user_id?.email || 'N/A' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Teléfono:</span>
                                <span class="info-value">{{ order.user_id?.phone || 'N/A' }}</span>
                            </div>
                        </div>
                    </section>

                    <!-- Productos -->
                    <section class="order-section">
                        <h4 class="section-title">📦 Productos</h4>
                        <div class="products-list">
                            <div v-for="(item, index) in order.products" :key="index" class="product-item">
                                <div class="product-image">
                                    <img :src="getProductImage(item.product_id)" :alt="item.title"
                                        @error="(e) => e.target.src = '/placeholder-product.jpg'">
                                </div>
                                <div class="product-info">
                                    <h5 class="product-name">{{ item.title }}</h5>
                                    <span class="product-price">{{ formatPrice(item.price_at_purchase) }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="order-total">
                            <span class="total-label">Total:</span>
                            <span class="total-amount">{{ formatPrice(order.total_amount) }}</span>
                        </div>
                    </section>

                    <!-- Comprobante de pago -->
                    <section class="order-section">
                        <h4 class="section-title">📸 Comprobante de pago</h4>

                        <div v-if="order.payment_proof?.secure_url" class="payment-proof">
                            <img :src="order.payment_proof.secure_url" :alt="`Comprobante orden ${order._id}`"
                                class="proof-image" @click="openImageModal(order.payment_proof.secure_url)">
                            <p class="proof-date">
                                Subido: {{ formatDate(order.payment_proof.uploaded_at) }}
                            </p>
                            <button @click="openImageModal(order.payment_proof.secure_url)" class="btn-view-full">
                                🔍 Ver en tamaño completo
                            </button>
                        </div>

                        <div v-else class="no-proof">
                            <p>⚠️ No se ha subido comprobante</p>
                        </div>
                    </section>
                </div>

                <!-- Acciones -->
                <div class="order-actions">
                    <button @click="confirmApprove(order)" :disabled="processingOrder === order._id"
                        class="btn-approve">
                        {{ processingOrder === order._id ? 'Procesando...' : '✅ Aprobar pago' }}
                    </button>

                    <button @click="confirmReject(order)" :disabled="processingOrder === order._id" class="btn-reject">
                        {{ processingOrder === order._id ? 'Procesando...' : '❌ Rechazar' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal: Ver imagen completa -->
        <Teleport to="body">
            <div v-if="showImageModal" class="modal-overlay" @click="closeImageModal">
                <div class="modal-image-content" @click.stop>
                    <button @click="closeImageModal" class="modal-close">✕</button>
                    <img :src="selectedImage" alt="Comprobante de pago">
                </div>
            </div>
        </Teleport>

        <!-- Modal: Confirmar aprobación -->
        <Teleport to="body">
            <div v-if="showApproveModal" class="modal-overlay" @click="showApproveModal = false">
                <div class="modal-content modal-content--small" @click.stop>
                    <div class="modal-header">
                        <h2 class="modal-title">✅ Aprobar pago</h2>
                        <button @click="showApproveModal = false" class="modal-close">✕</button>
                    </div>

                    <div class="modal-body">
                        <p>¿Confirmas que el pago es válido?</p>
                        <p><strong>Orden:</strong> #{{ orderToProcess?._id.slice(-8) }}</p>
                        <p><strong>Cliente:</strong> {{ orderToProcess?.user_id?.name }}</p>
                        <p><strong>Total:</strong> {{ formatPrice(orderToProcess?.total_amount) }}</p>
                        <p class="info-text">
                            El usuario recibirá un email de confirmación y tendrá acceso inmediato al contenido.
                        </p>
                    </div>

                    <div class="modal-footer">
                        <button @click="showApproveModal = false" class="btn-secondary">
                            Cancelar
                        </button>
                        <button @click="handleApprove" :disabled="approving" class="btn-approve">
                            {{ approving ? 'Aprobando...' : 'Sí, aprobar' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Modal: Confirmar rechazo -->
        <Teleport to="body">
            <div v-if="showRejectModal" class="modal-overlay" @click="showRejectModal = false">
                <div class="modal-content modal-content--small" @click.stop>
                    <div class="modal-header">
                        <h2 class="modal-title">❌ Rechazar pago</h2>
                        <button @click="showRejectModal = false" class="modal-close">✕</button>
                    </div>

                    <div class="modal-body">
                        <p>¿Estás seguro de rechazar esta orden?</p>
                        <p><strong>Orden:</strong> #{{ orderToProcess?._id.slice(-8) }}</p>
                        <p><strong>Cliente:</strong> {{ orderToProcess?.user_id?.name }}</p>
                        <p class="warning-text">
                            El usuario recibirá un email notificándole que su pago no fue aprobado.
                        </p>
                    </div>

                    <div class="modal-footer">
                        <button @click="showRejectModal = false" class="btn-secondary">
                            Cancelar
                        </button>
                        <button @click="handleReject" :disabled="rejecting" class="btn-reject">
                            {{ rejecting ? 'Rechazando...' : 'Sí, rechazar' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOrderStore } from '../../../stores/order-store'
import LoadingComponent from '../../common/LoadingComponent.vue'

const order_store = useOrderStore()

// State
const loading = ref(false)
const orders = ref([])
const processingOrder = ref(null)
const approving = ref(false)
const rejecting = ref(false)
const showImageModal = ref(false)
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const selectedImage = ref(null)
const orderToProcess = ref(null)

// Cargar órdenes pendientes
const loadOrders = async () => {
    loading.value = true
    const result = await order_store.fetch_pending_orders()
    orders.value = result || []
    loading.value = false
}

// Abrir modal imagen
const openImageModal = (imageUrl) => {
    selectedImage.value = imageUrl
    showImageModal.value = true
}

const closeImageModal = () => {
    showImageModal.value = false
    selectedImage.value = null
}

// Confirmar aprobación
const confirmApprove = (order) => {
    orderToProcess.value = order
    showApproveModal.value = true
}

// Manejar aprobación
const handleApprove = async () => {
    if (!orderToProcess.value) return

    approving.value = true
    processingOrder.value = orderToProcess.value._id

    const success = await order_store.approve_offline_order(orderToProcess.value._id)

    if (success) {
        showApproveModal.value = false
        orderToProcess.value = null
        await loadOrders()
    }

    approving.value = false
    processingOrder.value = null
}

// Confirmar rechazo
const confirmReject = (order) => {
    orderToProcess.value = order
    showRejectModal.value = true
}

// Manejar rechazo
const handleReject = async () => {
    if (!orderToProcess.value) return

    rejecting.value = true
    processingOrder.value = orderToProcess.value._id

    const success = await order_store.reject_offline_order(orderToProcess.value._id)

    if (success) {
        showRejectModal.value = false
        orderToProcess.value = null
        await loadOrders()
    }

    rejecting.value = false
    processingOrder.value = null
}

// Helpers
const getProductImage = (product) => {
    if (!product) return '/placeholder-product.jpg'

    if (typeof product.cover_image === 'string') {
        return product.cover_image
    }

    return product.cover_image?.secure_url || '/placeholder-product.jpg'
}

const formatPrice = (price) => {
    if (!price) return '0$'
    return `${price}$`
}

const formatDate = (date) => {
    if (!date) return '-'

    return new Date(date).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Cargar al montar
onMounted(() => {
    loadOrders()
})
</script>

<style scoped lang="scss">
.manage-orders {
    background: var(--color-bg);
    min-height: 100vh;
    padding: $space-10 $space-5;
}

// HEADER
.manage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-8;

    @media (max-width: $bp-md) {
        flex-direction: column;
        gap: $space-4;
        align-items: stretch;
    }
}

.manage-title {
    font-size: $text-4xl;
    font-weight: $fw-extrabold;
    margin: 0;
    color: var(--color-text);

    @media (max-width: $bp-md) {
        font-size: $text-2xl;
    }
}

.btn-refresh {
    padding: $space-3 $space-6;
    border: 2px solid var(--color-border);
    border-radius: $radius-sm;
    background: var(--color-white);
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: var(--color-text);
    cursor: pointer;
    transition: $transition;

    &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }
}

// ESTADO VACÍO
.empty-state {
    background: var(--color-white);
    border-radius: $radius-lg;
    padding: $space-20 $space-10;
    text-align: center;
    box-shadow: var(--shadow-sm);

    .empty-icon {
        font-size: $text-4xl;
        margin-bottom: $space-4;
    }

    h3 {
        font-size: $text-2xl;
        font-weight: $fw-bold;
        margin: 0 0 $space-2;
        color: var(--color-text);
    }

    p {
        font-size: $text-base;
        margin: 0;
        color: var(--color-text-light);
    }
}

// LISTA DE ÓRDENES
.orders-list {
    display: flex;
    flex-direction: column;
    gap: $space-6;
}

.order-card {
    background: var(--color-white);
    border-radius: $radius-lg;
    padding: $space-8;
    box-shadow: var(--shadow-sm);

    @media (max-width: $bp-md) {
        padding: $space-5;
    }
}

// HEADER DE ORDEN
.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: $space-6;
    border-bottom: 2px solid var(--color-border);
    margin-bottom: $space-6;

    @media (max-width: $bp-md) {
        flex-direction: column;
        gap: $space-3;
        align-items: flex-start;
    }
}

.order-id {
    display: flex;
    flex-direction: column;
    gap: $space-1;

    strong {
        font-size: $text-lg;
        color: var(--color-text);
    }
}

.order-date {
    font-size: $text-sm;
    color: var(--color-text-light);
}

.order-badge {
    padding: $space-2 $space-4;
    border-radius: $radius-full;
    font-size: $text-sm;
    font-weight: $fw-semibold;

    &--pending {
        background: rgba(245, 158, 11, 0.12);
        color: var(--color-warning);
    }
}

// CONTENIDO DE ORDEN
.order-content {
    display: flex;
    flex-direction: column;
    gap: $space-6;
    margin-bottom: $space-6;
}

.order-section {
    background: var(--color-bg);
    border-radius: $radius-md;
    padding: $space-5;
}

.section-title {
    font-size: $text-base;
    font-weight: $fw-bold;
    margin: 0 0 $space-4;
    color: var(--color-text);
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $space-4;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: $space-1;
}

.info-label {
    font-size: $text-xs;
    font-weight: $fw-semibold;
    color: var(--color-text-light);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.info-value {
    font-size: $text-sm;
    color: var(--color-text);
    font-weight: $fw-medium;
}

// PRODUCTOS
.products-list {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    margin-bottom: $space-4;
}

.product-item {
    display: flex;
    gap: $space-3;
    align-items: center;
    padding: $space-3;
    background: var(--color-white);
    border-radius: $radius-sm;
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

.product-info {
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

.product-price {
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: var(--color-primary);
}

.order-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: $space-4;
    border-top: 2px solid var(--color-border);
}

.total-label {
    font-size: $text-base;
    font-weight: $fw-bold;
    color: var(--color-text);
}

.total-amount {
    font-size: $text-xl;
    font-weight: $fw-extrabold;
    color: var(--color-primary);
}

// COMPROBANTE DE PAGO
.payment-proof {
    display: flex;
    flex-direction: column;
    gap: $space-3;
}

.proof-image {
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: $radius-sm;
    cursor: pointer;
    transition: transform $transition;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &:hover {
        transform: scale(1.02);
    }
}

.proof-date {
    font-size: $text-xs;
    color: var(--color-text-light);
    margin: 0;
}

.btn-view-full {
    width: fit-content;
    padding: $space-2 $space-4;
    border: 2px solid var(--color-border);
    border-radius: $radius-xs;
    background: var(--color-white);
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: var(--color-text);
    cursor: pointer;
    transition: $transition;

    &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }
}

.no-proof {
    padding: $space-5;
    background: rgba(239, 68, 68, 0.08);
    border-radius: $radius-sm;
    text-align: center;

    p {
        margin: 0;
        font-size: $text-sm;
        color: var(--color-error);
        font-weight: $fw-semibold;
    }
}

// ACCIONES
.order-actions {
    display: flex;
    gap: $space-3;
    padding-top: $space-6;
    border-top: 2px solid var(--color-border);

    @media (max-width: $bp-md) {
        flex-direction: column;
    }
}

.btn-approve,
.btn-reject {
    flex: 1;
    padding: 14px $space-6;
    border: none;
    border-radius: $radius-sm;
    font-size: $text-base;
    font-weight: $fw-semibold;
    cursor: pointer;
    transition: $transition;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.btn-approve {
    background: var(--color-approve-alert);
    color: var(--color-success);

    &:hover:not(:disabled) {
        opacity: 0.8;
    }
}

.btn-reject {
    background: var(--color-error);
    color: var(--color-white);

    &:hover:not(:disabled) {
        opacity: 0.8;
    }
}

// MODAL
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: $space-5;
}

.modal-content {
    background: var(--color-white);
    border-radius: $radius-lg;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

    &--small {
        max-width: 500px;
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-6 $space-8;
    border-bottom: 1px solid var(--color-border);

    @media (max-width: $bp-md) {
        padding: $space-5;
    }
}

.modal-title {
    font-size: $text-xl;
    font-weight: $fw-bold;
    margin: 0;
    color: var(--color-text);
}

.modal-close {
    width: 36px;
    height: 36px;
    border: none;
    background: var(--color-bg);
    border-radius: 50%;
    font-size: $text-xl;
    cursor: pointer;
    transition: background $transition;

    &:hover {
        background: var(--color-border);
    }
}

.modal-body {
    padding: $space-8;

    @media (max-width: $bp-md) {
        padding: $space-5;
    }

    p {
        margin: 0 0 $space-3;
        font-size: $text-sm;
        color: var(--color-text);

        &:last-child {
            margin-bottom: 0;
        }

        strong {
            font-weight: $fw-semibold;
            color: var(--color-text-dark);
        }
    }
}

.info-text {
    padding: $space-3;
    background: rgba(30, 86, 160, 0.08);
    border-radius: $radius-sm;
    margin-top: $space-4;
}

.warning-text {
    padding: $space-3;
    background: rgba(239, 68, 68, 0.08);
    border-radius: $radius-sm;
    color: var(--color-error);
    margin-top: $space-4;
}

.modal-footer {
    display: flex;
    gap: $space-3;
    justify-content: flex-end;
    padding: $space-6 $space-8;
    border-top: 1px solid var(--color-border);

    @media (max-width: $bp-md) {
        padding: $space-5;
        flex-direction: column;
    }
}

// MODAL IMAGEN
.modal-image-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;

    img {
        width: 100%;
        height: auto;
        border-radius: $radius-md;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .modal-close {
        position: absolute;
        top: -50px;
        right: 0;
        background: var(--color-white);
        color: var(--color-text);
    }
}

// BOTONES
.btn-secondary {
    padding: $space-3 $space-6;
    border: 2px solid var(--color-border);
    border-radius: $radius-sm;
    background: var(--color-white);
    font-size: $text-base;
    font-weight: $fw-semibold;
    color: var(--color-text);
    cursor: pointer;
    transition: $transition;

    &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }
}
</style>