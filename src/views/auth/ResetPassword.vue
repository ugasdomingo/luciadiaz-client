<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../../stores/auth-store';
import { useUtilStore } from '../../stores/util-store';
import { useRoute } from 'vue-router';

const auth_store = useAuthStore()
const util_store = useUtilStore()
const route = useRoute()

// El token y email pueden venir por URL (link del email) o escritos manualmente
const token_from_url = route.query.token
const email_from_url = route.query.email

const manual_token = ref('')
const manual_email = ref('')
const password = ref('')
const confirm_password = ref('')

const has_url_params = computed(() => !!(token_from_url && email_from_url))

const handle_submit = () => {
    const token = token_from_url || manual_token.value.trim()
    const email = email_from_url || manual_email.value.trim()

    if (!token || !email) {
        util_store.set_message('Introduce el código y el correo electrónico', 'error')
        return
    }
    if (password.value !== confirm_password.value) {
        util_store.set_message('Las contraseñas no coinciden', 'error')
        return
    }
    auth_store.reset_password(token, email, password.value)
}

</script>

<template>
    <main class="pages">
        <h2>Restablecer contraseña</h2>
        <form @submit.prevent="handle_submit">
            <template v-if="!has_url_params">
                <input type="email" v-model="manual_email" placeholder="Correo electrónico" autocomplete="email" />
                <input type="text" v-model="manual_token" placeholder="Código recibido por email" inputmode="numeric" />
            </template>
            <input type="password" v-model="password" placeholder="Nueva contraseña" autocomplete="new-password" />
            <input type="password" v-model="confirm_password" placeholder="Confirmar contraseña" autocomplete="new-password" />
            <button type="submit" class="action-btn">Restablecer contraseña</button>
        </form>
    </main>
</template>

<style scoped lang="scss">
.pages {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: $space-4;

    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: $space-4;

        button {
            margin-top: $space-6;
        }
    }
}
</style>

