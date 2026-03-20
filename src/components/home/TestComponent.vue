<script setup>
import { test_info } from '../../static/test-info.js'
import TestCardComponent from '../common/cards/TestCardComponent.vue';
import { use_scroll_reveal } from '../../composables/use-scroll-reveal.js'

use_scroll_reveal()
</script>

<template>
    <section class="section-container test">
        <div class="section-container__header" data-scroll-reveal>
            <h2>Tests Gratuitos</h2>
            <p>Pequeñas ventanas hacia tu mundo interior. Sin costo, sin compromiso.</p>
        </div>
        <div class="test__grid">
            <TestCardComponent v-for="(test, index) in test_info" :key="test.id" :test="test" :index="index"
                data-scroll-reveal :style="{ '--delay': `${0.2 + index * 0.12}s` }" />
        </div>
    </section>
</template>


<style scoped lang="scss">
.test {
    &__grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: $space-8;
        justify-items: center;
    }
}

@media screen and (max-width: $bp-lg) {
    .test__grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media screen and (max-width: $bp-md) {
    .test__grid {
        grid-template-columns: 1fr;
        gap: $space-6;
    }
}
</style>
