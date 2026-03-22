<script setup>
import { useAuthStore } from '../../stores/auth-store'
import { ref } from 'vue'

const auth_store = useAuthStore()
const is_patient = ref(false)
const show_password = ref(false)

const register = async () => {
    await auth_store.register({ name: auth_store.name, email: auth_store.email, password: auth_store.password, role: is_patient.value ? 'patient' : 'user', phone: auth_store.phone, policy_accepted: auth_store.policy_accepted })
}
</script>

<template>
    <form @submit.prevent="register" class="register-form">

        <div class="field">
            <label for="reg-name">Nombre completo</label>
            <input id="reg-name" type="text" v-model="auth_store.name" placeholder="Tu nombre" />
        </div>

        <div class="field">
            <label for="reg-email">Correo electrónico</label>
            <input id="reg-email" type="email" v-model="auth_store.email" placeholder="correo@ejemplo.com" />
        </div>

        <div class="field">
            <label for="reg-password">Contraseña</label>
            <div class="password-wrap">
                <input id="reg-password" v-model="auth_store.password" placeholder="Mínimo 8 caracteres"
                    :type="show_password ? 'text' : 'password'" />
                <img :src="show_password ? '/icon/icon-eye-open.svg' : '/icon/icon-eye-close.svg'" alt="ver contraseña"
                    @click="show_password = !show_password" />
            </div>
        </div>

        <!-- Toggle paciente -->
        <label class="patient-toggle">
            <div class="patient-toggle__text">
                <span class="patient-toggle__label">¿Eres paciente de Lucía?</span>
                <span class="patient-toggle__hint">Actívalo para acceder a tu historial y seguimiento</span>
            </div>
            <div class="toggle-switch" :class="{ 'toggle-switch--on': is_patient }" @click="is_patient = !is_patient">
                <div class="toggle-switch__thumb"></div>
            </div>
        </label>

        <div class="field" v-if="is_patient">
            <label for="reg-phone">Teléfono</label>
            <input id="reg-phone" type="text" v-model="auth_store.phone" placeholder="+34 600 000 000" />
        </div>

        <label class="policy-check">
            <input type="checkbox" v-model="auth_store.policy_accepted" />
            <span>He leído y acepto las <RouterLink to="/privacy-policy">políticas de privacidad</RouterLink></span>
        </label>

        <button type="submit" class="action-btn submit-btn" :disabled="!auth_store.policy_accepted">
            Crear cuenta
        </button>

    </form>
</template>

<style scoped lang="scss">
.register-form {
    display: flex;
    flex-direction: column;
    gap: $space-5;
    width: 100%;
}

/* Campo con label */
.field {
    display: flex;
    flex-direction: column;
    gap: $space-2;
    width: 100%;
    max-width: 30rem;
    align-self: center;

    label {
        font-size: $text-sm;
        font-weight: $fw-semibold;
        color: var(--color-text);
    }

    input {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
    }
}

/* Contraseña con icono */
.password-wrap {
    position: relative;

    input { padding-right: $space-10; }

    img {
        width: 1rem;
        height: 1rem;
        position: absolute;
        right: $space-4;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        opacity: 0.5;
        transition: $transition-fast;

        &:hover { opacity: 1; }
    }
}

/* Toggle paciente */
.patient-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
    width: 100%;
    max-width: 30rem;
    align-self: center;
    background: var(--color-bg);
    border: 1px solid var(--color-border-light);
    border-radius: $radius-md;
    padding: $space-4;
    box-sizing: border-box;
    cursor: pointer;
    transition: $transition-fast;

    &:hover { border-color: var(--color-primary); }

    &__text {
        display: flex;
        flex-direction: column;
        gap: $space-1;
    }

    &__label {
        font-size: $text-sm;
        font-weight: $fw-semibold;
        color: var(--color-text);
    }

    &__hint {
        font-size: $text-xs;
        color: var(--color-text-muted);
        line-height: 1.4;
    }
}

.toggle-switch {
    flex-shrink: 0;
    width: 44px;
    height: 24px;
    background: var(--color-border);
    border-radius: $radius-full;
    position: relative;
    transition: background 0.25s;

    &--on { background: var(--color-primary); }

    &__thumb {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 18px;
        height: 18px;
        background: white;
        border-radius: $radius-full;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        transition: transform 0.25s;
    }

    &--on &__thumb { transform: translateX(20px); }
}

/* Checkbox política */
.policy-check {
    display: flex;
    align-items: flex-start;
    gap: $space-3;
    width: 100%;
    max-width: 30rem;
    align-self: center;
    cursor: pointer;
    font-size: $text-sm;
    color: var(--color-text-muted);
    line-height: 1.5;

    input[type="checkbox"] {
        width: 16px;
        height: 16px;
        min-width: 16px;
        margin-top: 2px;
        accent-color: var(--color-primary);
        cursor: pointer;
        max-width: 16px;
    }

    a {
        color: var(--color-primary);
        font-weight: $fw-semibold;
        text-decoration: underline;
        text-underline-offset: 2px;
    }
}

/* Botón submit */
.submit-btn {
    align-self: center;
    min-width: 160px;
    height: 42px;
    font-size: $text-base;
    margin-top: $space-1;

    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
    }
}
</style>
