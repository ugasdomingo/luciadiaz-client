<template>
    <div class="product-pending">
        <div class="pending-card">
            <div class="pending-icon">⏳</div>

            <h1 class="pending-title">Pago en validación</h1>

            <p class="pending-message">
                Hemos recibido tu comprobante de pago para <strong>{{ product.title }}</strong>.
            </p>

            <div class="pending-info">
                <div class="info-item">
                    <span class="info-label">Estado:</span>
                    <span class="info-value info-value--pending">Pendiente de aprobación</span>
                </div>

                <div class="info-item">
                    <span class="info-label">Producto:</span>
                    <span class="info-value">{{ product.title }}</span>
                </div>

                <div class="info-item">
                    <span class="info-label">Precio:</span>
                    <span class="info-value">{{ product.price }}$</span>
                </div>
            </div>

            <div class="pending-timeline">
                <h3>¿Qué sigue?</h3>
                <ol>
                    <li>
                        <strong>Revisión del comprobante</strong>
                        <span>Nuestro equipo verificará tu pago (24-48 horas hábiles)</span>
                    </li>
                    <li>
                        <strong>Confirmación por email</strong>
                        <span>Te enviaremos un correo cuando aprobemos tu pago</span>
                    </li>
                    <li>
                        <strong>Acceso inmediato</strong>
                        <span>Podrás acceder al contenido completo desde el enlace del email</span>
                    </li>
                </ol>
            </div>

            <!-- Sección para reenviar comprobante -->
            <div class="reupload-section">
                <button v-if="!showReupload" class="btn-reupload-toggle" @click="showReupload = true">
                    ¿Necesitas enviar otro comprobante?
                </button>

                <div v-if="showReupload" class="reupload-form">
                    <h3>Reenviar comprobante</h3>
                    <p>Si tu comprobante anterior no se ve bien o enviaste el archivo incorrecto, puedes subir uno nuevo.</p>

                    <div class="proof-upload">
                        <label for="new-proof" class="upload-label">
                            Nuevo comprobante de pago
                        </label>
                        <input type="file" id="new-proof" accept="image/*" @change="handleFileUpload"
                            ref="fileInput">

                        <div v-if="newProof" class="proof-preview">
                            <img :src="newProof.preview" alt="Comprobante">
                            <button @click="removeProof" class="btn-remove">✕</button>
                        </div>
                    </div>

                    <div class="reupload-actions">
                        <button class="btn-cancel" @click="cancelReupload">Cancelar</button>
                        <button class="btn-send" :disabled="!newProof || sending" @click="submitNewProof">
                            {{ sending ? 'Enviando...' : 'Enviar comprobante' }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="pending-actions">
                <button @click="goToDashboard" class="btn-secondary">
                    Ir a mi espacio
                </button>

                <button @click="goToProducts" class="btn-primary">
                    Ver más productos
                </button>
            </div>

            <p class="pending-note">
                Si tienes alguna duda, puedes contactarnos por email o redes sociales.
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../../stores/order-store'
import { useAuthStore } from '../../stores/auth-store'
import { useUtilStore } from '../../stores/util-store'

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const router = useRouter()
const order_store = useOrderStore()
const auth_store = useAuthStore()
const util_store = useUtilStore()

const showReupload = ref(false)
const newProof = ref(null)
const fileInput = ref(null)
const sending = ref(false)

const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
        util_store.set_message('El archivo no debe superar 5MB', 'error')
        return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        newProof.value = {
            file: file,
            preview: e.target.result,
            base64: e.target.result
        }
    }
    reader.readAsDataURL(file)
}

const removeProof = () => {
    newProof.value = null
    if (fileInput.value) fileInput.value.value = ''
}

const cancelReupload = () => {
    showReupload.value = false
    removeProof()
}

const submitNewProof = async () => {
    if (!newProof.value) return

    sending.value = true

    // Cargar órdenes si no las tenemos
    if (order_store.my_orders.length === 0) {
        await order_store.fetch_my_orders()
    }

    // Buscar la orden pendiente para este producto
    const order = order_store.my_orders.find(o =>
        o.payment_status === 'pending' &&
        o.products.some(p =>
            p.product_id?.slug === props.product.slug ||
            p.product_id?._id === props.product._id
        )
    )

    if (!order) {
        util_store.set_message('No se encontró la orden pendiente', 'error')
        sending.value = false
        return
    }

    const success = await order_store.update_payment_proof(order._id, {
        public_id: 'proof_' + Date.now(),
        secure_url: newProof.value.base64
    })

    if (success) {
        showReupload.value = false
        removeProof()
    }

    sending.value = false
}

const goToDashboard = () => {
    router.push('/mi-espacio')
}

const goToProducts = () => {
    router.push('/productos')
}
</script>

<style scoped lang="scss">
.product-pending {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $space-10 20px;

    @media (max-width: $bp-md) {
        padding: $space-5 $space-4;
    }
}

.pending-card {
    max-width: 600px;
    width: 100%;
    background: var(--color-white);
    padding: 60px $space-10;
    border-radius: $radius-lg;
    box-shadow: var(--shadow-md);
    text-align: center;

    @media (max-width: 568px) {
        padding: $space-10 $space-6;
    }
}

.pending-icon {
    font-size: 72px;
    margin-bottom: $space-6;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }
}

.pending-title {
    font-size: $text-4xl;
    font-weight: $fw-extrabold;
    margin: 0 0 $space-4;
    color: var(--color-text-heading);

    @media (max-width: 568px) {
        font-size: 26px;
    }
}

.pending-message {
    font-size: $text-lg;
    line-height: 1.6;
    color: var(--color-text-muted);
    margin: 0 0 $space-10;

    strong {
        color: var(--color-text);
        font-weight: $fw-semibold;
    }
}

.pending-info {
    background: var(--color-bg);
    border-radius: $radius-md;
    padding: $space-6;
    margin-bottom: $space-10;
    text-align: left;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-3 0;
    border-bottom: 1px solid var(--color-border-light);

    &:last-child {
        border-bottom: none;
    }
}

.info-label {
    font-size: $text-sm;
    color: var(--color-text-muted);
    font-weight: $fw-semibold;
}

.info-value {
    font-size: $text-base;
    color: var(--color-text);
    font-weight: $fw-semibold;

    &--pending {
        color: var(--color-warning);
    }
}

.pending-timeline {
    margin-bottom: $space-10;
    text-align: left;

    h3 {
        font-size: $text-xl;
        font-weight: $fw-bold;
        margin: 0 0 $space-5;
        color: var(--color-text-heading);
    }

    ol {
        list-style: none;
        counter-reset: step-counter;
        padding: 0;
        margin: 0;
    }

    li {
        counter-increment: step-counter;
        position: relative;
        padding-left: 60px;
        margin-bottom: $space-6;

        &:last-child {
            margin-bottom: 0;
        }

        &::before {
            content: counter(step-counter);
            position: absolute;
            left: 0;
            top: 0;
            width: $space-10;
            height: $space-10;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-primary);
            color: var(--color-white);
            border-radius: $radius-full;
            font-weight: $fw-bold;
            font-size: $text-lg;
        }

        strong {
            display: block;
            font-size: $text-base;
            font-weight: $fw-bold;
            color: var(--color-text);
            margin-bottom: $space-1;
        }

        span {
            display: block;
            font-size: $text-sm;
            color: var(--color-text-muted);
            line-height: 1.5;
        }
    }
}

/* ── Reupload Section ── */
.reupload-section {
    margin-bottom: $space-8;
}

.btn-reupload-toggle {
    background: none;
    border: none;
    color: var(--color-primary);
    font-size: $text-sm;
    font-weight: $fw-semibold;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover {
        color: var(--color-primary-dark);
    }
}

.reupload-form {
    background: var(--color-bg);
    border-radius: $radius-md;
    padding: $space-6;
    text-align: left;

    h3 {
        font-size: $text-base;
        font-weight: $fw-bold;
        margin: 0 0 $space-2;
        color: var(--color-text-heading);
    }

    > p {
        font-size: $text-sm;
        color: var(--color-text-muted);
        line-height: 1.5;
        margin: 0 0 $space-4;
    }
}

.proof-upload {
    margin-bottom: $space-4;

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
    margin-top: $space-3;
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
        background: var(--overlay-white-85);
        border-radius: $radius-full;
        cursor: pointer;
        font-size: $text-base;

        &:hover {
            background: var(--color-white);
        }
    }
}

.reupload-actions {
    display: flex;
    gap: $space-3;
    justify-content: flex-end;
}

.btn-cancel {
    padding: 10px 20px;
    border: 1px solid var(--color-border);
    background: var(--color-white);
    border-radius: $radius-sm;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: var(--color-text-muted);
    cursor: pointer;

    &:hover {
        background: var(--color-border-light);
    }
}

.btn-send {
    padding: 10px 20px;
    border: none;
    background: var(--color-primary);
    color: var(--color-white);
    border-radius: $radius-sm;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    cursor: pointer;

    &:hover:not(:disabled) {
        background: var(--color-primary-dark);
    }

    &:disabled {
        background: var(--color-border);
        color: var(--color-text-muted);
        cursor: not-allowed;
    }
}

/* ── Actions ── */
.pending-actions {
    display: flex;
    gap: $space-4;
    margin-bottom: $space-8;

    @media (max-width: 568px) {
        flex-direction: column;
    }
}

.btn-primary,
.btn-secondary {
    flex: 1;
    padding: 14px $space-6;
    border: none;
    border-radius: 10px;
    font-size: $text-base;
    font-weight: $fw-bold;
    cursor: pointer;
    transition: $transition;

    @media (max-width: 568px) {
        width: 100%;
    }
}

.btn-primary {
    background: var(--color-primary);
    color: var(--color-white);

    &:hover {
        background: var(--color-primary-dark);
    }
}

.btn-secondary {
    background: var(--color-white);
    color: var(--color-primary);
    border: 2px solid var(--color-primary);

    &:hover {
        background: var(--color-bg);
    }
}

.pending-note {
    font-size: $text-sm;
    color: var(--color-text-muted);
    margin: 0;
}
</style>
