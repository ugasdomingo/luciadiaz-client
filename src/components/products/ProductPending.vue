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
                    <span class="info-value">{{ product.price }}€</span>
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
import { useRouter } from 'vue-router'

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const router = useRouter()

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
    padding: 40px 20px;

    @media (max-width: 768px) {
        padding: 20px 16px;
    }
}

.pending-card {
    max-width: 600px;
    width: 100%;
    background: white;
    padding: 60px 40px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    text-align: center;

    @media (max-width: 568px) {
        padding: 40px 24px;
    }
}

.pending-icon {
    font-size: 72px;
    margin-bottom: 24px;
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
    font-size: 32px;
    font-weight: 800;
    margin: 0 0 16px;
    color: #111;

    @media (max-width: 568px) {
        font-size: 26px;
    }
}

.pending-message {
    font-size: 18px;
    line-height: 1.6;
    color: #666;
    margin: 0 0 40px;

    strong {
        color: #333;
        font-weight: 600;
    }
}

.pending-info {
    background: #f9f9f9;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 40px;
    text-align: left;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #eee;

    &:last-child {
        border-bottom: none;
    }
}

.info-label {
    font-size: 14px;
    color: #999;
    font-weight: 600;
}

.info-value {
    font-size: 16px;
    color: #333;
    font-weight: 600;

    &--pending {
        color: #f59e0b;
    }
}

.pending-timeline {
    margin-bottom: 40px;
    text-align: left;

    h3 {
        font-size: 20px;
        font-weight: 700;
        margin: 0 0 20px;
        color: #111;
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
        margin-bottom: 24px;

        &:last-child {
            margin-bottom: 0;
        }

        &::before {
            content: counter(step-counter);
            position: absolute;
            left: 0;
            top: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #6366f1;
            color: white;
            border-radius: 50%;
            font-weight: 700;
            font-size: 18px;
        }

        strong {
            display: block;
            font-size: 16px;
            font-weight: 700;
            color: #333;
            margin-bottom: 4px;
        }

        span {
            display: block;
            font-size: 14px;
            color: #666;
            line-height: 1.5;
        }
    }
}

.pending-actions {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;

    @media (max-width: 568px) {
        flex-direction: column;
    }
}

.btn-primary,
.btn-secondary {
    flex: 1;
    padding: 14px 24px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;

    @media (max-width: 568px) {
        width: 100%;
    }
}

.btn-primary {
    background: #6366f1;
    color: white;

    &:hover {
        background: #4f46e5;
    }
}

.btn-secondary {
    background: white;
    color: #6366f1;
    border: 2px solid #6366f1;

    &:hover {
        background: #f5f5ff;
    }
}

.pending-note {
    font-size: 14px;
    color: #999;
    margin: 0;
}
</style>