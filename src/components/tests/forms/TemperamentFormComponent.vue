<script setup>
import { ref, watch } from 'vue';
import { temperament_questions } from '../../../static/questions/temperament-questions';
import { useTestStore } from '../../../stores/test-store';
import TestDisclaimerComponent from '../TestDisclaimerComponent.vue'

const test_store = useTestStore()

const answers = ref({})

const answers_length = ref(0)

watch(() => answers.value, (
    (new_value) => {
        answers_length.value = Object.keys(new_value).length
    }
), { deep: true })

const handle_submit = async () => {
    try {
        const results = {
            temperament: '',
            melancholic: 0,
            sanguine: 0,
            choleric: 0,
            phlegmatic: 0,

        }

        for (const key in answers.value) {
            const answer = answers.value[key]
            if (answer === 'a') results.sanguine++
            if (answer === 'b') results.choleric++
            if (answer === 'c') results.melancholic++
            if (answer === 'd') results.phlegmatic++
        }

        const max_value = Math.max(results.melancholic, results.sanguine, results.choleric, results.phlegmatic)
        let temperament = ''
        if (results.melancholic === max_value) temperament = 'Melancólico'
        if (results.sanguine === max_value) temperament = 'Sanguíneo'
        if (results.choleric === max_value) temperament = 'Colérico'
        if (results.phlegmatic === max_value) temperament = 'Flegmático'

        results.temperament = temperament

        await test_store.create_test_result('Temperamento', results)

    } catch (error) {
        console.log(error)
    }
}
</script>

<template>
    <section class="temperament_form">
        <TestDisclaimerComponent />
        <h2>Test de temperamento</h2>
        <p>Selecciona la opción que te identifique más en cada sección.</p>
        <form @submit.prevent="handle_submit">
            <section v-for="(question, index) in temperament_questions" :key="index" class="question"
                :class="{ 'question--completed': answers[question.key] }">
                <div class="question__options">
                    <label>
                        <input type="radio" v-model="answers[question.key]" :name="question.key" value="a" />
                        <span>
                            {{ question.a }}
                        </span>
                    </label>
                    <label>
                        <input type="radio" v-model="answers[question.key]" :name="question.key" value="b" />
                        <span>
                            {{ question.b }}
                        </span>
                    </label>
                    <label>
                        <input type="radio" v-model="answers[question.key]" :name="question.key" value="c" />
                        <span>
                            {{ question.c }}
                        </span>
                    </label>
                    <label>
                        <input type="radio" v-model="answers[question.key]" :name="question.key" value="d" />
                        <span>
                            {{ question.d }}
                        </span>
                    </label>
                </div>
            </section>
            <button type="submit" class="nobg-btn" v-if="answers_length == temperament_questions.length">Enviar
                test</button>
        </form>
    </section>
</template>

<style scoped lang="scss">
.temperament_form {
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
        margin: 0 0 0 $space-2
    }

    form {
        display: flex;
        flex-direction: column;
        gap: $space-6;

        .question {
            display: flex;
            flex-direction: column;
            padding: $space-4;
            border-radius: $space-2;
            box-shadow: var(--shadow-sm);

            &__options {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                gap: $space-3;

                label {
                    flex: 1 1 45%;
                    cursor: pointer;
                    min-width: 0;
                }
            }

            &--completed {
                background-color: var(--color-approve-alert);
            }
        }

        button {
            margin: 0 auto;
        }
    }

}

@media screen and (max-width: $bp-md) {
    .temperament_form {
        max-width: 100%;

        form {
            max-width: 100%;

            .question {
                max-width: 100%;

                &__options {
                    flex-direction: column;
                    gap: $space-2;
                }
            }
        }
    }
}
</style>
