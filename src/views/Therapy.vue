<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { therapies } from '../static/therapies.js'
import TherapyCardComponent from '../components/common/cards/TherapyCardComponent.vue'
import { useAuthStore } from '../stores/auth-store'
import { useAppointmentStore } from '../stores/appointment-store'

const router = useRouter()
const auth_store = useAuthStore()
const appointment_store = useAppointmentStore()

const loading_id = ref(null)
const error_msg = ref(null)

const handle_reserve = async (therapy) => {
    error_msg.value = null

    // Si no está logado, redirigir a login con vuelta a /terapias
    if (!auth_store.token) {
        router.push({ path: '/acceso', query: { redirect: '/terapias' } })
        return
    }

    loading_id.value = therapy.id

    const result = await appointment_store.init_therapy_payment(therapy.id)
    loading_id.value = null

    if (result?.approve_url) {
        // Guardar therapy_id para recuperarlo en la vuelta
        localStorage.setItem('pending_therapy_id', therapy.id)
        // Redirigir a PayPal
        window.location.href = result.approve_url
    } else {
        error_msg.value = 'No se pudo iniciar el pago. Por favor inténtalo de nuevo.'
    }
}
</script>

<template>
    <section class="therapy">
        <!-- Cabecera -->
        <div class="therapy__header">
            <p class="therapy__header-tag">Consultas online</p>
            <h1 class="therapy__header-title">Encuentra tu espacio de bienestar</h1>
            <p class="therapy__header-sub">
                Sesiones individuales, de pareja y orientación parental adaptadas a tus necesidades.
                Reserva online y paga de forma segura.
            </p>
        </div>

        <!-- Error global -->
        <div v-if="error_msg" class="therapy__error">
            {{ error_msg }}
        </div>

        <!-- Cards -->
        <div class="therapy__content">
            <TherapyCardComponent
                v-for="therapy in therapies"
                :key="therapy.id"
                :therapy="therapy"
                :class="{ 'therapy-card--loading': loading_id === therapy.id }"
                @reserve="handle_reserve"
            />
        </div>

        <!-- Pie de confianza -->
        <div class="therapy__trust">
            <span>🔒 Pago seguro con PayPal</span>
            <span>·</span>
            <span>📅 Elige tu horario en Cal.com</span>
            <span>·</span>
            <span>💬 Sesiones 100% online</span>
        </div>
    </section>
</template>

<style scoped lang="scss">
.therapy {
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: $space-24 $space-16 $space-16;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-10;
    box-sizing: border-box;

    &__header {
        text-align: center;
        max-width: 640px;
    }

    &__header-tag {
        margin: 0 0 $space-2;
        font-size: $text-sm;
        font-weight: $fw-semibold;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-primary);
    }

    &__header-title {
        margin: 0 0 $space-3;
        font-size: $text-4xl;
        font-weight: $fw-bold;
        color: var(--color-text-heading);
        line-height: 1.15;
    }

    &__header-sub {
        margin: 0;
        font-size: $text-base;
        color: var(--color-text-muted);
        line-height: 1.7;
    }

    &__error {
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #fecaca;
        border-radius: $radius-md;
        padding: $space-3 $space-5;
        font-size: $text-sm;
        max-width: 600px;
        text-align: center;
    }

    &__content {
        width: 100%;
        max-width: 1100px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: $space-6;
        box-sizing: border-box;
    }

    &__trust {
        display: flex;
        align-items: center;
        gap: $space-4;
        font-size: $text-sm;
        color: var(--color-text-muted);
        flex-wrap: wrap;
        justify-content: center;
    }
}

@media screen and (max-width: $bp-lg) {
    .therapy {
        &__content {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media screen and (max-width: $bp-md) {
    .therapy {
        padding: $space-20 $space-4 $space-12;
        gap: $space-8;

        &__header-title {
            font-size: $text-3xl;
        }

        &__content {
            grid-template-columns: 1fr;
        }
    }
}
</style>
