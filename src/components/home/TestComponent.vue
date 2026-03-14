<script setup>
import { test_info } from '../../static/test-info.js'
import TestCardComponent from '../common/cards/TestCardComponent.vue';
import { use_scroll_reveal } from '../../composables/use-scroll-reveal.js'

use_scroll_reveal()
</script>

<template>
    <section class="test">
        <div class="test__intro" data-scroll-reveal>
            <h2>Tests Gratuitos</h2>
            <p>Pequeñas ventanas hacia tu mundo interior. Sin costo, sin compromiso.</p>
        </div>
        <div class="test__content">
            <TestCardComponent v-for="(test, index) in test_info" :key="test.id" :test="test" data-scroll-reveal
                :style="{ '--delay': `${0.2 + index * 0.12}s` }" />
        </div>
    </section>
</template>


<style scoped lang="scss">
.test {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 6rem 4rem 8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    box-sizing: border-box;

    &__intro {
        text-align: center;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;

        &.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        h2 {
            margin-bottom: 0.75rem;
        }

        p {
            color: var(--color-text-muted);
            font-size: 1.05rem;
            max-width: 420px;
            margin: 0 auto;
        }
    }

    &__content {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        justify-items: center;
    }
}

@media screen and (max-width: 1024px) {
    .test {
        padding: 4rem 2rem 6rem;

        &__content {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media screen and (max-width: 720px) {
    .test {
        padding: 4rem 1.25rem;

        &__content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
    }
}
</style>
