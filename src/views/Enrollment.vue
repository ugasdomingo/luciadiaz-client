<template>
    <div class="page-container">
        <div class="container enrollment-container">
            <div class="row">
                <div class="col-md-5 order-md-2">
                    <div class="summary-card">
                        <h3>Resumen del pedido</h3>
                        <div v-if="product" class="product-summary">
                            <img :src="product.cover_image" alt="Product" class="product-thumb">
                            <div class="product-details">
                                <h4>{{ product.title }}</h4>
                                <span class="price">{{ product.price }}€</span>
                            </div>
                        </div>
                        <LoadingComponent v-else />

                        <div class="divider"></div>
                        <div class="total-row">
                            <span>Total a pagar:</span>
                            <span class="total-price" v-if="product">{{ product.price }}€</span>
                        </div>
                    </div>
                </div>

                <div class="col-md-7 order-md-1">
                    <div class="payment-form-card">
                        <h2>Finalizar inscripción</h2>
                        <p class="mb-4">Elige tu método de pago preferido</p>

                        <div class="payment-methods">
                            <div class="payment-option" :class="{ active: payment_method === 'paypal' }"
                                @click="payment_method = 'paypal'">
                                <div class="option-header">
                                    <input type="radio" :checked="payment_method === 'paypal'">
                                    <span>Tarjeta / PayPal</span>
                                </div>
                                <p class="option-desc">Pago seguro e inmediato con tarjeta de crédito o débito.</p>
                            </div>

                            <div class="payment-option" :class="{ active: payment_method === 'offline' }"
                                @click="payment_method = 'offline'">
                                <div class="option-header">
                                    <input type="radio" :checked="payment_method === 'offline'">
                                    <span>Transferencia / Bizum</span>
                                </div>
                                <p class="option-desc">Realiza el pago manual y sube tu comprobante para que te demos
                                    acceso.</p>
                            </div>
                        </div>

                        <div class="action-area mt-4">

                            <div v-if="payment_method === 'paypal'">
                                <button class="btn-paypal" @click="handlePaypal" :disabled="util_store.loading">
                                    {{ util_store.loading ? 'Conectando...' : 'Pagar con PayPal / Tarjeta' }}
                                </button>
                            </div>

                            <div v-if="payment_method === 'offline'" class="offline-form">
                                <div class="alert-info">
                                    <p><strong>Datos para el pago:</strong></p>
                                    <p>Bizum: <strong>+34 604 82 23 85</strong></p>
                                    <p>Concepto: <strong>{{ product?.title }}</strong></p>
                                </div>

                                <div class="form-group mt-3">
                                    <label>Sube aquí la captura de tu pago:</label>
                                    <input type="file" @change="handleFileUpload" accept="image/*" class="form-control">
                                    <small class="text-muted">Formatos: JPG, PNG. Máx 5MB.</small>
                                </div>

                                <button class="btn-primary mt-3 full-width" @click="handleOffline"
                                    :disabled="!reference_image || util_store.loading">
                                    {{ util_store.loading ? 'Enviando...' : 'Confirmar Pago' }}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/product-store'
import { useOrderStore } from '../stores/order-store'
import { useUtilStore } from '../stores/util-store'
import LoadingComponent from '../components/common/LoadingComponent.vue'

const route = useRoute()
const product_store = useProductStore()
const order_store = useOrderStore()
const util_store = useUtilStore()

const product = ref(null)
const payment_method = ref('paypal') // 'paypal' | 'offline'
const reference_image = ref(null) // Base64 string

// Cargar producto
onMounted(async () => {
    const slug = route.params.formation_slug
    product.value = await product_store.fetch_product_by_slug(slug)
})

// Procesar PayPal
const handlePaypal = () => {
    if (!product.value) return
    order_store.init_paypal_checkout(product.value._id)
}

// Manejar subida de archivo (File -> Base64)
const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        reference_image.value = e.target.result // Base64 completo
    }
    reader.readAsDataURL(file)
}

// Procesar Offline
const handleOffline = async () => {
    if (!product.value || !reference_image.value) return

    const success = await order_store.create_offline_order({
        product_id: product.value._id,
        payment_method: 'transfer', // O 'bizum'
        reference_image: reference_image.value
    })

    if (success) {
        // Redirigir a confirmación o historial
        // router.push('/mi-espacio') -> Idealmente a una 'Thank You Page'
        // Por ahora, vamos al historial de pedidos para ver el estado 'pending'
        window.location.href = '/mi-espacio'
    }
}
</script>

<style lang="scss" scoped>
.page-container {
    background: #f9f9f9;
    min-height: 100vh;
    padding: 4rem 0;
}

.enrollment-container {
    max-width: 1000px;
}

.summary-card,
.payment-form-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
}

.summary-card {
    h3 {
        font-family: 'Cormorant Garamond', serif;
        margin-bottom: 1.5rem;
    }

    .product-summary {
        display: flex;
        gap: 1rem;
        align-items: center;

        .product-thumb {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
        }

        .product-details {
            h4 {
                font-size: 1.1rem;
                margin: 0;
            }

            .price {
                color: var(--primary-color);
                font-weight: bold;
            }
        }
    }

    .divider {
        height: 1px;
        background: #eee;
        margin: 1.5rem 0;
    }

    .total-row {
        display: flex;
        justify-content: space-between;
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
    }
}

.payment-methods {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.payment-option {
    border: 2px solid #eee;
    border-radius: 8px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: #ddd;
    }

    &.active {
        border-color: var(--primary-color);
        background: rgba(var(--primary-rgb), 0.05);
    }

    .option-header {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .option-desc {
        margin: 0;
        font-size: 0.9rem;
        color: #666;
        padding-left: 1.8rem;
    }
}

.btn-paypal {
    background: #0070ba;
    color: white;
    border: none;
    width: 100%;
    padding: 1rem;
    font-weight: bold;
    border-radius: 50px;
    cursor: pointer;

    &:hover {
        background: #005ea6;
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
}

.alert-info {
    background: #e3f2fd;
    padding: 1rem;
    border-radius: 8px;
    color: #0d47a1;
    font-size: 0.9rem;

    p {
        margin-bottom: 0.3rem;
    }
}
</style>