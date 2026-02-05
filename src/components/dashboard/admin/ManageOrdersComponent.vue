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
    if (!price) return '0€'
    return `${price}€`
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
    background: var(--color-background);
    min-height: 100vh;
    padding: 40px 20px;
}

// HEADER
.manage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }
}

.manage-title {
    font-size: 32px;
    font-weight: 800;
    margin: 0;
    color: var(--color-text);

    @media (max-width: 768px) {
        font-size: 24px;
    }
}

.btn-refresh {
    padding: 12px 24px;
    border: 2px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-white);
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }
}

// ESTADO VACÍO
.empty-state {
    background: var(--color-white);
    border-radius: 16px;
    padding: 80px 40px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
    }

    h3 {
        font-size: 24px;
        font-weight: 700;
        margin: 0 0 8px;
        color: var(--color-text);
    }

    p {
        font-size: 16px;
        margin: 0;
        color: var(--color-text-light);
    }
}

// LISTA DE ÓRDENES
.orders-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.order-card {
    background: var(--color-white);
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    @media (max-width: 768px) {
        padding: 20px;
    }
}

// HEADER DE ORDEN
.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 24px;
    border-bottom: 2px solid var(--color-border);
    margin-bottom: 24px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }
}

.order-id {
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong {
        font-size: 18px;
        color: var(--color-text);
    }
}

.order-date {
    font-size: 14px;
    color: var(--color-text-light);
}

.order-badge {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;

    &--pending {
        background: #fef3c7;
        color: #92400e;
    }
}

// CONTENIDO DE ORDEN
.order-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 24px;
}

.order-section {
    background: var(--color-background);
    border-radius: 12px;
    padding: 20px;
}

.section-title {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 16px;
    color: var(--color-text);
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.info-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-light);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.info-value {
    font-size: 14px;
    color: var(--color-text);
    font-weight: 500;
}

// PRODUCTOS
.products-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

.product-item {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 12px;
    background: var(--color-white);
    border-radius: 8px;
}

.product-image {
    width: 60px;
    height: 60px;
    border-radius: 8px;
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
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 4px;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.product-price {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-primary);
}

.order-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 2px solid var(--color-border);
}

.total-label {
    font-size: 16px;
    font-weight: 700;
    color: var(--color-text);
}

.total-amount {
    font-size: 20px;
    font-weight: 800;
    color: var(--color-primary);
}

// COMPROBANTE DE PAGO
.payment-proof {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.proof-image {
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &:hover {
        transform: scale(1.02);
    }
}

.proof-date {
    font-size: 12px;
    color: var(--color-text-light);
    margin: 0;
}

.btn-view-full {
    width: fit-content;
    padding: 8px 16px;
    border: 2px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-white);
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }
}

.no-proof {
    padding: 20px;
    background: #fee2e2;
    border-radius: 8px;
    text-align: center;

    p {
        margin: 0;
        font-size: 14px;
        color: #991b1b;
        font-weight: 600;
    }
}

// ACCIONES
.order-actions {
    display: flex;
    gap: 12px;
    padding-top: 24px;
    border-top: 2px solid var(--color-border);

    @media (max-width: 768px) {
        flex-direction: column;
    }
}

.btn-approve,
.btn-reject {
    flex: 1;
    padding: 14px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.btn-approve {
    background: var(--color-approve-alert);
    color: #065f46;

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
    padding: 20px;
}

.modal-content {
    background: var(--color-white);
    border-radius: 16px;
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
    padding: 24px 32px;
    border-bottom: 1px solid var(--color-border);

    @media (max-width: 768px) {
        padding: 20px;
    }
}

.modal-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    color: var(--color-text);
}

.modal-close {
    width: 36px;
    height: 36px;
    border: none;
    background: var(--color-background);
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: var(--color-border);
    }
}

.modal-body {
    padding: 32px;

    @media (max-width: 768px) {
        padding: 20px;
    }

    p {
        margin: 0 0 12px;
        font-size: 14px;
        color: var(--color-text);

        &:last-child {
            margin-bottom: 0;
        }

        strong {
            font-weight: 600;
            color: var(--color-text-dark);
        }
    }
}

.info-text {
    padding: 12px;
    background: #dbeafe;
    border-radius: 8px;
    margin-top: 16px;
}

.warning-text {
    padding: 12px;
    background: #fee2e2;
    border-radius: 8px;
    color: #991b1b;
    margin-top: 16px;
}

.modal-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding: 24px 32px;
    border-top: 1px solid var(--color-border);

    @media (max-width: 768px) {
        padding: 20px;
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
        border-radius: 12px;
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
    padding: 12px 24px;
    border: 2px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-white);
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }
}
</style>