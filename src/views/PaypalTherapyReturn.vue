<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppointmentStore } from '../stores/appointment-store'

const route = useRoute()
const router = useRouter()
const appointment_store = useAppointmentStore()

const status = ref('loading') // 'loading' | 'success' | 'error'
const cal_link = ref(null)

onMounted(async () => {
    const token = route.query.token
    if (!token) {
        router.replace('/terapias')
        return
    }

    const result = await appointment_store.confirm_therapy_payment(token)
    if (result?.cal_link) {
        cal_link.value = result.cal_link
        status.value = 'success'
        // Redirigir automáticamente a cal.com tras 2s
        setTimeout(() => {
            window.location.href = result.cal_link
        }, 2000)
    } else {
        status.value = 'error'
    }
})
</script>

<template>
    <div class="therapy-return">
        <!-- Cargando -->
        <div v-if="status === 'loading'" class="therapy-return__card">
            <div class="therapy-return__spinner"></div>
            <h2>Confirmando tu pago…</h2>
            <p>Por favor espera un momento.</p>
        </div>

        <!-- Éxito -->
        <div v-else-if="status === 'success'" class="therapy-return__card therapy-return__card--success">
            <div class="therapy-return__icon">✅</div>
            <h2>¡Pago completado!</h2>
            <p>Te redirigimos a Cal.com para que elijas el día y hora de tu sesión.</p>
            <a v-if="cal_link" :href="cal_link" class="action-btn">
                Reservar mi sesión →
            </a>
        </div>

        <!-- Error -->
        <div v-else class="therapy-return__card therapy-return__card--error">
            <div class="therapy-return__icon">❌</div>
            <h2>Algo salió mal</h2>
            <p>No pudimos confirmar tu pago. Por favor contacta con nosotros.</p>
            <RouterLink to="/terapias" class="action-btn">Volver a terapias</RouterLink>
        </div>
    </div>
</template>

<style scoped lang="scss">
.therapy-return {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $space-8;
    background: var(--color-bg);

    &__card {
        background: var(--color-bg-card);
        border-radius: $radius-lg;
        padding: $space-12;
        max-width: 480px;
        width: 100%;
        text-align: center;
        box-shadow: var(--shadow-lg);

        h2 {
            font-size: $text-2xl;
            font-weight: $fw-bold;
            margin: $space-4 0 $space-2;
            color: var(--color-text-heading);
        }

        p {
            color: var(--color-text-muted);
            margin: 0 0 $space-6;
            line-height: 1.6;
        }
    }

    &__icon {
        font-size: 3rem;
        line-height: 1;
    }

    &__spinner {
        width: 48px;
        height: 48px;
        border: 4px solid var(--color-border);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto $space-4;
    }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
