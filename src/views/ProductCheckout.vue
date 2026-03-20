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
                        <div v-if="is_presale" class="price-row price-row--presale">
                            <span>Precio pre-venta:</span>
                            <span class="price-value price-value--presale">{{ product.presale_price }}$</span>
                        </div>
                        <div v-if="is_presale" class="price-row">
                            <span>Precio normal:</span>
                            <span class="price-value price-value--striked">{{ product.price }}$</span>
                        </div>
                        <div v-else class="price-row">
                            <span>Subtotal:</span>
                            <span class="price-value">{{ product.price }}$</span>
                        </div>
                        <div class="price-row price-row--total">
                            <span>Total:</span>
                            <span class="price-value">{{ effective_price }}$</span>
                        </div>
                    </div>
                </section>

                <!-- Métodos de pago -->
                <section class="checkout-payment" v-if="!is_product_free">
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

                        <!-- Pago Offline (Transferencia / Zelle / Pago Móvil) -->
                        <label class="payment-method"
                            :class="{ 'payment-method--selected': selectedMethod === 'offline' }">
                            <input type="radio" name="payment" value="offline" v-model="selectedMethod">
                            <div class="method-content">
                                <div class="method-icon">🏦</div>
                                <div class="method-info">
                                    <h3>Transferencia / Pago directo</h3>
                                    <p>Zelle, Pago Móvil, Transferencia bancaria — validación en 24-48h</p>
                                </div>
                            </div>
                        </label>
                    </div>

                    <!-- Formulario de pago offline -->
                    <div v-if="selectedMethod === 'offline'" class="offline-form">
                        <div class="bank-info">
                            <h3>Datos para el pago</h3>
                            <p class="bank-info__description">
                                Consulta los datos de pago según tu país o región.
                                Una vez realizado, adjunta tu comprobante aquí abajo.
                            </p>
                            <button class="btn-view-methods" @click="showPaymentModal = true">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <rect x="2" y="3" width="20" height="18" rx="3" stroke="currentColor"
                                        stroke-width="2" />
                                    <path d="M2 9h20" stroke="currentColor" stroke-width="2" />
                                </svg>
                                Ver métodos de pago disponibles
                            </button>
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

                    <!-- Modal métodos de pago -->
                    <PaymentMethodsModal :show="showPaymentModal" :product-title="product?.title || ''"
                        @close="showPaymentModal = false" />

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
                <section class="checkout-payment" v-else>
                    <button @click="handleFreePayment" :disabled="!canProceed" class="btn-pay"
                        :class="{ 'btn-pay--disabled': !canProceed }">
                        Inscribirme gratis
                    </button>
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
import PaymentMethodsModal from '../components/common/PaymentMethodsModal.vue'

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
const showPaymentModal = ref(false)
const is_presale = computed(() =>
    product.value?.status === 'pre_sale' && product.value?.presale_price != null
)
const effective_price = computed(() =>
    is_presale.value ? product.value.presale_price : product.value?.price
)
const is_product_free = computed(() => effective_price.value === 0)

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
const handleFreePayment = async () => {
    const result = await order_store.create_offline_order({ product_id: product.value._id })
    if (result) router.push(`/productos/${product.value.slug}`)
}

const handlePayment = async () => {
    if (!canProceed.value) return

    if (selectedMethod.value === 'paypal') {
        await order_store.init_paypal_checkout(product.value._id)
    } else if (selectedMethod.value === 'offline') {
        const result = await order_store.create_offline_order({
            product_id: product.value._id,
            file: uploadedProof.value?.file ?? null
        })
        if (result) router.push(`/productos/${product.value.slug}`)
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
    background: var(--color-bg);
    padding: $space-10 20px;

    @media (max-width: $bp-md) {
        padding: $space-5 $space-4;
    }
}

.checkout-container {
    max-width: 900px;
    margin: 0 auto;
}

.checkout-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-10;

    @media (max-width: 968px) {
        grid-template-columns: 1fr;
        gap: $space-6;
    }
}

.checkout-summary {
    background: var(--color-bg-card);
    padding: $space-8;
    border-radius: $radius-lg;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    height: fit-content;

    @media (max-width: $bp-md) {
        padding: $space-6;
    }
}

.checkout-title {
    font-size: 28px;
    font-weight: $fw-extrabold;
    margin: 0 0 $space-6;
    color: var(--color-text-heading);
}

.product-summary {
    margin-bottom: $space-8;
}

.product-image {
    width: 100%;
    height: auto;
    border-radius: $radius-md;
    margin-bottom: $space-5;
}

.product-title {
    font-size: $text-xl;
    font-weight: $fw-bold;
    margin: 0 0 $space-2;
    color: var(--color-text);
}

.product-description {
    font-size: $text-sm;
    color: var(--color-text-muted);
    line-height: 1.6;
    margin: 0;
}

.price-summary {
    border-top: 2px solid var(--color-border-light);
    padding-top: $space-5;
}

.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-3;
    font-size: $text-base;
    color: var(--color-text-muted);

    &--total {
        font-size: $text-2xl;
        font-weight: $fw-extrabold;
        color: var(--color-text-heading);
        margin-bottom: 0;
    }
}

.price-value {
    font-weight: $fw-bold;

    &--presale {
        color: var(--color-success);
    }

    &--striked {
        text-decoration: line-through;
        color: var(--color-text-muted);
        font-weight: $fw-regular;
    }
}

.price-row--presale {
    color: var(--color-success);
    font-weight: $fw-semibold;
}

.checkout-payment {
    background: var(--color-bg-card);
    padding: $space-8;
    border-radius: $radius-lg;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

    @media (max-width: $bp-md) {
        padding: $space-6;
    }

    h2 {
        font-size: $text-2xl;
        font-weight: $fw-bold;
        margin: 0 0 $space-6;
        color: var(--color-text-heading);
    }
}

.payment-methods {
    display: flex;
    flex-direction: column;
    gap: $space-4;
    margin-bottom: $space-6;
}

.payment-method {
    border: 2px solid var(--color-border);
    border-radius: $radius-md;
    padding: $space-5;
    cursor: pointer;
    transition: $transition;

    &:hover {
        border-color: var(--color-primary);
    }

    &--selected {
        border-color: var(--color-primary);
        background: var(--color-border-light);
    }

    input[type="radio"] {
        display: none;
    }
}

.method-content {
    display: flex;
    align-items: center;
    gap: $space-4;
}

.method-icon {
    font-size: $space-8;
}

.method-info {
    flex: 1;

    h3 {
        font-size: $text-base;
        font-weight: $fw-bold;
        margin: 0 0 $space-1;
        color: var(--color-text);
    }

    p {
        font-size: $text-sm;
        color: var(--color-text-muted);
        margin: 0;
    }
}

.offline-form {
    margin-bottom: $space-6;
}

.bank-info {
    background: var(--color-bg);
    padding: $space-5;
    border-radius: $radius-md;
    margin-bottom: $space-5;

    h3 {
        font-size: $text-base;
        font-weight: $fw-bold;
        margin: 0 0 $space-2;
        color: var(--color-text);
    }

    &__description {
        font-size: $text-sm;
        color: var(--color-text-muted);
        line-height: 1.5;
        margin: 0 0 $space-4;
    }
}

.btn-view-methods {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 14px $space-5;
    border: 2px solid var(--color-primary);
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-primary);
    font-size: 15px;
    font-weight: $fw-semibold;
    cursor: pointer;
    transition: $transition;

    &:hover {
        background: var(--color-primary);
        color: var(--color-white);
    }
}

.proof-upload {
    input[type="file"] {
        width: 100%;
        padding: $space-3;
        border: 2px dashed var(--color-border);
        border-radius: $radius-sm;
        cursor: pointer;
        font-size: $text-sm;

        &:hover {
            border-color: var(--color-primary);
        }
    }
}

.upload-label {
    display: block;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: var(--color-text);
    margin-bottom: $space-2;
}

.proof-preview {
    position: relative;
    margin-top: $space-4;
    border-radius: $radius-sm;
    overflow: hidden;

    img {
        width: 100%;
        height: auto;
        display: block;
    }

    .btn-remove {
        position: absolute;
        top: $space-2;
        right: $space-2;
        width: $space-8;
        height: $space-8;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: rgba(255, 255, 255, 0.9);
        border-radius: $radius-full;
        cursor: pointer;
        font-size: $text-base;

        &:hover {
            background: var(--color-bg-card);
        }
    }
}

.btn-pay {
    width: 100%;
    padding: $space-4;
    border: none;
    border-radius: $radius-md;
    background: var(--color-primary);
    color: var(--color-bg-card);
    font-size: $text-lg;
    font-weight: $fw-bold;
    cursor: pointer;
    transition: $transition-slow;
    margin-bottom: $space-4;

    &:hover:not(.btn-pay--disabled) {
        background: var(--color-primary-dark);
        transform: translateY(-2px);
    }

    &--disabled {
        background: var(--color-border);
        color: var(--color-text-muted);
        cursor: not-allowed;
    }
}

.checkout-note {
    font-size: 13px;
    color: var(--color-text-muted);
    text-align: center;
    margin: 0;

    a {
        color: var(--color-primary);
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}

.checkout-error {
    text-align: center;
    padding: $space-20 20px;
    background: var(--color-bg-card);
    border-radius: $radius-lg;

    h2 {
        font-size: 28px;
        font-weight: $fw-bold;
        margin: 0 0 $space-6;
        color: var(--color-text);
    }

    .btn-back {
        display: inline-block;
        padding: 14px $space-8;
        border-radius: 10px;
        background: var(--color-primary);
        color: var(--color-bg-card);
        text-decoration: none;
        font-weight: $fw-semibold;
    }
}
</style>