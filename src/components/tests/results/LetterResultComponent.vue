<script setup>
import { ref, defineProps } from 'vue';
import { useAuthStore } from '../../../stores/auth-store';
import TestDisclaimerComponent from '../TestDisclaimerComponent.vue'
import TestClinicalDisclaimerComponent from '../TestClinicalDisclaimerComponent.vue'

const props = defineProps({
    letter_results: { type: Object || null, default: null },
    user_name: { type: String || null }
})
const auth_store = useAuthStore()
const goal = ref(props.letter_results.goal)
const reasons = ref(props.letter_results.reasons)
</script>

<template>
    <section class="letter-result-section">
        <TestDisclaimerComponent />
        <h2>
            Felicidades {{ props.user_name || auth_store.user_data.user.name.split(" ")[0] }}, tu inconsciente te ha
            enviado una carta.
        </h2>
        <p class="letter">
            Yo, {{ props.user_name || auth_store.user_data.user.name }}, conscientemente quiero <strong>{{ goal
                }}</strong>. Ya que bloqueo
            en mi <strong>{{ reasons[2] }}</strong>. Ademas quisiera <strong>{{ reasons[3] }}</strong> ya que rechazo en
            mi <strong>{{ reasons[5] }}</strong>
        </p>
        <div class="help-info">

            <p>
                La manera de leer y entender esta carta que ha redactado tu inconsciente para ti es leyendo de abajo
                hacia arriba.
                Para poder alcanzar tu objetivo de <strong>{{ goal }}</strong> debes resolver primero eso que el
                inconsciente está
                rechazando (en tu caso: <strong>{{ reasons[5] }}</strong>).
                Eso te va a permitir conectar con <strong>{{ reasons[3] }}</strong> y resolver el bloqueo que tienes con
                <strong>{{ reasons[2] }}</strong>. Una vez liberado de ese bloqueo alcanzarás tu meta de <strong>{{ goal
                }}</strong>.
            </p>
            <p>
                Si no te suena lo que dice la carta, no lo entiendes o existe algo que te hace ruido y no te deja
                tranquila/o, contáctame para que pueda ayudarte a entenderlo mejor, hazlo por WhatsApp o correo.
                Lo más importante de esta carta es entenderla para poder lograr lo que deseas, tu inconsciente
                te ha pasado la ruta para lograrlo, solo tienes que seguirla.
            </p>
        </div>
        <TestClinicalDisclaimerComponent />
    </section>
</template>

<style scoped lang="scss">
.letter-result-section {
    display: flex;
    flex-direction: column;
    gap: $space-4;
    padding: 0 0 0 $space-8;
    box-sizing: border-box;

    h2 {
        margin: 0;
    }

    .letter {
        max-width: 60%;
        padding: $space-4;
        border-radius: $radius-lg;
        border: 1px dotted var(--color-text);
        box-shadow: var(--shadow-sm);
        box-sizing: border-box;
        margin: 0 auto;

    }
}

@media screen and (max-width: $bp-md) {
    .letter-result-section {
        padding: 0;

        .letter {
            max-width: 100%;
        }
    }
}
</style>
