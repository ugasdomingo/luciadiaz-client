<template>
    <div class="checkout">
        <div class="checkout-container">
            <LoadingComponent v-if="loading" />

            <div v-else-if="product" class="checkout-content">
                <!-- Resumen del producto -->
                <section class="checkout-summary">
                    <h1 class="checkout-title">Finalizar compra</h1>

                    <div class="product-summary">
                        <img :src="product.cover_image?.secure_url || '/placeholder-product.jpg'" :alt="product.title"
                            class="product-image">
                        <div class="product-info">
                            <h2 class="product-title">{{ product.title }}</h2>
                            <p class="product-description">{{ truncatedDescription }}</p>
                        </div>
                    </div>

                    <div class="price-summary">
                        <div class="price-row">
                            <span>Subtotal:</span>
                            <span class="price-value">{{ product.price }}€</span>
                        </div>
                        <div class="price-row price-row--total">
                            <span>Total:</span>
                            <span class="price-value">{{ product.price }}€</span>
                        </div>
                    </div>
                </section>

                <!-- Métodos de pago -->
                <section class="checkout-payment">
                    <h2>Método de pago</h2>

                    <div class="payment-methods">
                        <!-- PayPal / Tarjeta -->
                        <label class="payment-method"
                            :class="{ 'payment-method--selected': selectedMethod === 'paypal' }">
                            <input type="radio" name="payment" value="paypal" v-model="selectedMethod">
                            <div class="method-content">
                                <div class="method-icon">💳</div>
                                <div class="method-info">
                                    <h3>PayPal / Tarjeta</h3>
                                    <p>Pago seguro con PayPal o tarjeta de crédito/débito</p>
                                </div>
                            </div>
                        </label>

                        <!-- Pago Offline (Bizum/Transferencia) -->
                        <label class="payment-method"
                            :class="{ 'payment-method--selected': selectedMethod === 'offline' }">
                            <input type="radio" name="payment" value="offline" v-model="selectedMethod">
                            <div class="method-content">
                                <div class="method-icon">🏦</div>
                                <div class="method-info">
                                    <h3>Bizum / Transferencia</h3>
                                    <p>Pago manual con validación en 24-48h</p>
                                </div>
                            </div>
                        </label>
                    </div>

                    <!-- Formulario de pago offline -->
                    <div v-if="selectedMethod === 'offline'" class="offline-form">
                        <div class="bank-info">
                            <h3>Datos para el pago</h3>
                            <div class="bank-details">
                                <div class="bank-item">
                                    <strong>Bizum:</strong>
                                    <span>+34 XXX XXX XXX</span>
                                </div>
                                <div class="bank-item">
                                    <strong>Titular:</strong>
                                    <span>Lucía Díaz</span>
                                </div>
                                <div class="bank-item">
                                    <strong>Concepto:</strong>
                                    <span>{{ product.title }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="proof-upload">
                            <label for="proof" class="upload-label">
                                Adjunta tu comprobante de pago *
                            </label>
                            <input type="file" id="proof" accept="image/*" @change="handleFileUpload" ref="fileInput">

                            <div v-if="uploadedProof" class="proof-preview">
                                <img :src="uploadedProof.preview" alt="Comprobante">
                                <button @click="removeProof" class="btn-remove">✕</button>
                            </div>
                        </div>
                    </div>

                    <!-- Botón de pagar -->
                    <button @click="handlePayment" :disabled="!canProceed" class="btn-pay"
                        :class="{ 'btn-pay--disabled': !canProceed }">
                        {{ payButtonText }}
                    </button>

                    <p class="checkout-note">
                        Al completar la compra aceptas nuestros
                        <RouterLink to="/terminos">términos y condiciones</RouterLink>
                    </p>
                </section>
            </div>

            <div v-else class="checkout-error">
                <h2>Producto no encontrado</h2>
                <RouterLink to="/productos" class="btn-back">
                    Ver todos los productos
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/product-store'
import { useOrderStore } from '../stores/order-store'
import { useUtilStore } from '../stores/util-store'
import LoadingComponent from '../components/common/LoadingComponent.vue'

const route = useRoute()
const router = useRouter()
const product_store = useProductStore()
const order_store = useOrderStore()
const util_store = useUtilStore()

// State
const loading = ref(false)
const product = ref(null)
const selectedMethod = ref('paypal')
const uploadedProof = ref(null)
const fileInput = ref(null)

// Computed
const truncatedDescription = computed(() => {
    if (!product.value?.description) return ''
    return product.value.description.length > 150
        ? product.value.description.substring(0, 150) + '...'
        : product.value.description
})

const canProceed = computed(() => {
    if (selectedMethod.value === 'paypal') return true
    if (selectedMethod.value === 'offline') return !!uploadedProof.value
    return false
})

const payButtonText = computed(() => {
    if (selectedMethod.value === 'paypal') return 'Pagar con PayPal'
    if (selectedMethod.value === 'offline') return 'Enviar comprobante'
    return 'Selecciona método de pago'
})

// Cargar producto
const loadProduct = async () => {
    loading.value = true
    const slug = route.params.slug
    product.value = await product_store.fetch_product_by_slug(slug)
    loading.value = false
}

// Manejar subida de archivo
const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        util_store.set_message('El archivo no debe superar 5MB', 'error')
        return
    }

    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
        uploadedProof.value = {
            file: file,
            preview: e.target.result,
            base64: e.target.result
        }
    }
    reader.readAsDataURL(file)
}

// Remover comprobante
const removeProof = () => {
    uploadedProof.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

// Procesar pago
const handlePayment = async () => {
    if (!canProceed.value) return

    if (selectedMethod.value === 'paypal') {
        // Iniciar checkout de PayPal
        await order_store.init_paypal_checkout(product.value._id)
    } else if (selectedMethod.value === 'offline') {
        // NOTA: Aquí falta subir la imagen a Cloudinary primero
        // Por simplicidad, asumimos que ya tienes una función para eso

        // Crear orden offline
        const success = await order_store.create_offline_order({
            product_id: product.value._id,
            payment_proof: {
                public_id: 'temp_id', // Reemplazar con el ID de Cloudinary
                secure_url: uploadedProof.value.base64 // Reemplazar con URL de Cloudinary
            }
        })

        if (success) {
            // Redirigir a confirmación o al producto
            router.push(`/productos/${product.value.slug}`)
        }
    }
}

// Cargar al montar
onMounted(() => {
    loadProduct()
})
</script>

<style scoped lang="scss">
.checkout {
    min-height: 80vh;
    background: #f9f9f9;
    padding: 40px 20px;

    @media (max-width: 768px) {
        padding: 20px 16px;
    }
}

.checkout-container {
    max-width: 900px;
    margin: 0 auto;
}

.checkout-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;

    @media (max-width: 968px) {
        grid-template-columns: 1fr;
        gap: 24px;
    }
}

.checkout-summary {
    background: white;
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    height: fit-content;

    @media (max-width: 768px) {
        padding: 24px;
    }
}

.checkout-title {
    font-size: 28px;
    font-weight: 800;
    margin: 0 0 24px;
    color: #111;
}

.product-summary {
    margin-bottom: 32px;
}

.product-image {
    width: 100%;
    height: auto;
    border-radius: 12px;
    margin-bottom: 20px;
}

.product-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 8px;
    color: #333;
}

.product-description {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin: 0;
}

.price-summary {
    border-top: 2px solid #eee;
    padding-top: 20px;
}

.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 16px;
    color: #666;

    &--total {
        font-size: 24px;
        font-weight: 800;
        color: #111;
        margin-bottom: 0;
    }
}

.price-value {
    font-weight: 700;
}

.checkout-payment {
    background: white;
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

    @media (max-width: 768px) {
        padding: 24px;
    }

    h2 {
        font-size: 24px;
        font-weight: 700;
        margin: 0 0 24px;
        color: #111;
    }
}

.payment-methods {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
}

.payment-method {
    border: 2px solid #ddd;
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: #6366f1;
    }

    &--selected {
        border-color: #6366f1;
        background: #f5f5ff;
    }

    input[type="radio"] {
        display: none;
    }
}

.method-content {
    display: flex;
    align-items: center;
    gap: 16px;
}

.method-icon {
    font-size: 32px;
}

.method-info {
    flex: 1;

    h3 {
        font-size: 16px;
        font-weight: 700;
        margin: 0 0 4px;
        color: #333;
    }

    p {
        font-size: 14px;
        color: #666;
        margin: 0;
    }
}

.offline-form {
    margin-bottom: 24px;
}

.bank-info {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;

    h3 {
        font-size: 16px;
        font-weight: 700;
        margin: 0 0 16px;
        color: #333;
    }
}

.bank-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.bank-item {
    display: flex;
    justify-content: space-between;
    font-size: 14px;

    strong {
        color: #333;
    }

    span {
        color: #666;
    }
}

.proof-upload {
    input[type="file"] {
        width: 100%;
        padding: 12px;
        border: 2px dashed #ddd;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;

        &:hover {
            border-color: #6366f1;
        }
    }
}

.upload-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.proof-preview {
    position: relative;
    margin-top: 16px;
    border-radius: 8px;
    overflow: hidden;

    img {
        width: 100%;
        height: auto;
        display: block;
    }

    .btn-remove {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;

        &:hover {
            background: white;
        }
    }
}

.btn-pay {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 12px;
    background: #6366f1;
    color: white;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 16px;

    &:hover:not(.btn-pay--disabled) {
        background: #4f46e5;
        transform: translateY(-2px);
    }

    &--disabled {
        background: #ddd;
        color: #999;
        cursor: not-allowed;
    }
}

.checkout-note {
    font-size: 13px;
    color: #999;
    text-align: center;
    margin: 0;

    a {
        color: #6366f1;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}

.checkout-error {
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 16px;

    h2 {
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 24px;
        color: #333;
    }

    .btn-back {
        display: inline-block;
        padding: 14px 32px;
        border-radius: 10px;
        background: #6366f1;
        color: white;
        text-decoration: none;
        font-weight: 600;
    }
}
</style>