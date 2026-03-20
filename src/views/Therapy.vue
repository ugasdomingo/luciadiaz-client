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
    padding: $space-24 $space-16 $space-16;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-8;
    position: relative;
    box-sizing: border-box;

    h2 {
        text-align: center;
        margin: $space-4 0;
    }

    &__content {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        justify-items: center;
        gap: $space-8;
        box-sizing: border-box;
    }
}

@media screen and (max-width: $bp-md) {
    .therapy {
        padding: $space-20 $space-4 $space-12;

        &__content {
            grid-template-columns: 1fr;
            gap: $space-4;
        }
    }
}
</style>
