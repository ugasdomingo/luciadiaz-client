<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '../../../stores/auth-store.js'
import { useHistoryStore } from '../../../stores/history-store.js'
import { medical_history_questions } from '../../../static/questions/medical-history-questions.js'

const auth_store = useAuthStore()
const history_store = useHistoryStore()

const current_index = computed(() => auth_store.user_data?.history?.length || 0)
const current_questions = computed(() => medical_history_questions[current_index.value] || null)

const answers = ref([])
const show_completed = ref(false)
const expanded_items = reactive({})

const load_questions = () => {
    if (current_questions.value) {
        answers.value = current_questions.value.questions.map((pregunta) => ({
            question: pregunta.question,
            type: pregunta.type,
            answer: ''
        }))
    }
}

watch(current_index, () => {
    load_questions()
})

const submit_history = async () => {
    if (!current_questions.value) return
    await history_store.create_history(current_questions.value.title, answers.value)
    await auth_store.refresh()
    window.scrollTo(0, 0)
}

const toggle_completed = () => {
    show_completed.value = !show_completed.value
}
const toggle_answers = (history_id) => {
    expanded_items[history_id] = !expanded_items[history_id]
}

onMounted(() => {
    load_questions()
    if (current_index.value >= 13) {
        show_completed.value = true
    }
})

</script>

<template>
    <section class="medical-history__container">
        <h2>{{ current_index >= 13 ? 'Historial Médico Completado' : 'Historial Médico Pendiente' }}</h2>
        <div class="medical-history__container__header" v-if="current_index < 13">
            <p>
                Haz completado el
                <span>{{ (Math.round(current_index / 13 * 100)) }}%</span>
                de tu historial médico
            </p>
            <button class="nobg-btn" @click="toggle_completed">{{ show_completed ? 'Seguir llenando' :
                'Ver historial' }}</button>

        </div>
        <div class="medical-history__container__completed" v-if="show_completed">
            <article v-for="history in auth_store.user_data.history" :key="history._id" class="history-item">
                <h4 @click="toggle_answers(history._id)" class="history-title"
                    :class="{ 'active': expanded_items[history._id] }">
                    {{ history.title }}
                    <span class="arrow" :class="{ 'rotated': expanded_items[history._id] }">
                        <img src="/icon/icon-plus.svg" alt="plus icon">
                    </span>
                </h4>
                <transition name="accordion" @enter="enter" @after-enter="afterEnter" @leave="leave"
                    @after-leave="afterLeave">
                    <div class="answer-container" v-show="expanded_items[history._id]">
                        <div v-for="(answer, index) in history.answers" :key="index" class="answer-item">
                            <p>{{ answer.question }}: <strong>{{ answer.answer }}</strong></p>
                        </div>
                    </div>
                </transition>
            </article>
        </div>
        <form v-if="current_questions && !show_completed" @submit.prevent="submit_history"
            class="medical-history__container__form">
            <h4>{{ current_questions.title }}</h4>
            <div v-for="(answer, index) in answers" :key="index">
                <label :for="answer.question">{{ answer.question }}</label>
                <input :type="answer.type" :id="answer.question" v-model="answer.answer">
            </div>
            <button type="submit" class="action-btn">
                {{ current_index < 12 ? 'Guardar y seguir' : 'Guardar y finalizar' }} </button>
        </form>
    </section>
</template>

<style scoped lang="scss">
.medical-history__container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0;
    margin-right: 0;
    box-sizing: border-box;

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0;
        margin: 0;

        p {
            margin: 0;

            span {
                font-weight: 500;
            }
        }
    }

    &__completed {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0;
        margin: 0;
        box-sizing: border-box;

        .history-item {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 0;
            margin: 0;
            box-sizing: border-box;

            .history-title {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0;
                margin: 0;
                box-sizing: border-box;
                cursor: pointer;
                transition: all 0.25s;

                &:hover {
                    color: var(--color-primary);
                }

                &.active {
                    color: var(--color-primary);
                }

                .arrow {
                    transition: transform 0.25s;
                    font-size: 1.5rem;

                    img {
                        width: 1rem;
                        height: 1rem;
                    }

                    &.rotated {
                        transform: rotate(225deg);
                    }
                }

                .answer-container {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.25s;
                }
            }
        }
    }

    &__form {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0;
        margin: 0;
        box-sizing: border-box;

        div {
            max-width: 80%;
            display: flex;
            flex-direction: column;
            gap: 0.1rem;
            padding: 0.5rem 1rem;
            margin: 0 0 0 1rem;
            border-radius: 1rem;
            box-shadow: var(--shadow-sm);
            box-sizing: border-box;
        }
    }
}
</style>
