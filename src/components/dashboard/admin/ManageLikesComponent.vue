<script setup>
import { ref } from 'vue'

const show_section = ref(false)

const toggle_section = () => {
    show_section.value = !show_section.value
}
</script>

<template>
    <section class="section__container">
        <h2>Likes <span @click="toggle_section">{{ show_section ? '-' : '+' }}</span></h2>
        <div v-if="show_section" class="section__container__content">
            <p>Los likes se gestionan de forma individual en cada post o video.</p>
        </div>
    </section>
</template>

<style scoped lang="scss">
.section__container {
    width: 100%;
    margin: 0;
    padding: 0 4rem;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    h2 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        padding: 2rem 0.5rem;
        cursor: pointer;
        transition: all 0.25s;

        &:hover {
            color: var(--color-primary);
        }
    }

    p {
        padding: 0 0.5rem 1rem;
        color: var(--color-text-dark);
    }
}
</style>
