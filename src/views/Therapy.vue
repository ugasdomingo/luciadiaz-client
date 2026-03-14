<template>
    <section class="therapy">
        <h2>Terapias</h2>
        <div class="therapy__content">
            <TherapyCardComponent v-for="therapy in therapies" :key="therapy.id" :therapy="therapy" />
        </div>
    </section>
</template>

<script setup>
import { therapies } from '../static/therapies.js'
import TherapyCardComponent from '../components/common/cards/TherapyCardComponent.vue'
</script>

<style scoped lang="scss">
.therapy {
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 6rem 4rem 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    position: relative;
    box-sizing: border-box;

    h2 {
        text-align: center;
        margin: 1rem 0;
    }

    &__content {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        justify-items: center;
        gap: 2rem;
        box-sizing: border-box;
    }
}

@media screen and (max-width: 768px) {
    .therapy {
        padding: 5rem 1rem 3rem;

        &__content {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
    }
}
</style>
