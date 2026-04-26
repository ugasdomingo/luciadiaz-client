<script setup>
import { ref, watch } from 'vue';
import { useTestStore } from '../../../stores/test-store';
import TestDisclaimerComponent from '../TestDisclaimerComponent.vue'

const test_store = useTestStore()
const goal = ref('')
const answers = ref([])

const form_completed = ref(false)

const handle_submit = async () => {

    try {
        const results = {
            goal: goal.value,
            reasons: answers.value
        }
        await test_store.create_test_result('Carta del Inconsciente', results)
    } catch (error) {
        console.log(error)
    }
}

//Si todas las respuestas estan completadas, se activa el boton
watch(() => answers.value, () => {
    if (answers.value.length === 6) {
        form_completed.value = true
    }
}, { deep: true })
</script>

<template>
    <section class="letter_form">
        <TestDisclaimerComponent />
        <h2>Carta del Inconsciente</h2>
        <p>
            Escribe primero lo que deseas lograr y luego escribe 6 razones por las cuales
            quieres alcanzar esa meta.
        </p>
        <form @submit.prevent="handle_submit">
            <input type="text" v-model="goal" placeholder="Escribe aquí algo que quieras lograr" required />
            <input type="text" v-model="answers[0]" placeholder="Razón 1" required />
            <input type="text" v-model="answers[1]" placeholder="Razón 2" required />
            <input type="text" v-model="answers[2]" placeholder="Razón 3" required />
            <input type="text" v-model="answers[3]" placeholder="Razón 4" required />
            <input type="text" v-model="answers[4]" placeholder="Razón 5" required />
            <input type="text" v-model="answers[5]" placeholder="Razón 6" required />
            <button type="submit" class="nobg-btn" v-if="form_completed">Enviar</button>
        </form>

    </section>
</template>

<style scoped lang="scss">
.letter_form {
    max-width: 60%;
    display: flex;
    flex-direction: column;
    gap: $space-4;
    margin: 0 auto;
    box-shadow: var(--shadow-md);
    padding: $space-4;
    border-radius: $space-2;
    box-sizing: border-box;

    h2,
    p {
        text-align: center;
        margin: 0 0 $space-2 0;
    }

    form {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: $space-4;
        margin: 0 auto;

        input {


            &:first-child {
                background-color: var(--color-approve-alert);
                margin: $space-8 0;
            }
        }
    }
}

@media screen and (max-width: $bp-md) {
    .letter_form {
        max-width: 100%;
    }
}
</style>