<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    anamnesis: {
        type: Object,
        required: true
    },
    user_name: {
        type: String,
        required: true
    }

})

const anamnesis_result = Object.entries(props.anamnesis).map(([key, value]) => ({ pregunta: key, respuesta: value }))
</script>

<template>
    <section>
        <h2>Anamnesis completado por: {{ props.user_name }}</h2>
        <ul>
            <li v-for="({ respuesta, pregunta }) in anamnesis_result" :key="pregunta">
                <strong>{{ pregunta }}:</strong> {{ respuesta }}
            </li>
        </ul>
    </section>
</template>

<style scoped lang="scss">
section {
    display: flex;
    flex-direction: column;
    gap: $space-4;
    padding: 0;
    box-sizing: border-box;

    h2 {
        margin: 0;
    }

    ul {
        display: flex;
        flex-direction: column;
        gap: $space-2;
        list-style: none;
        padding: 0;

        li {
            max-width: 80%;
            display: flex;
            flex-wrap: wrap;
            gap: $space-2;
            margin-bottom: $space-2;
            box-shadow: var(--shadow-sm);
            padding: $space-3;
            border-radius: $radius-lg;

            @media screen and (max-width: $bp-md) {
                max-width: 100%;
            }
        }
    }
}
</style>
