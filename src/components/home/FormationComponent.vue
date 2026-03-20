<script setup>
import { useCommonStore } from '../../stores/common-store'
import ProductCardComponent from '../common/cards/ProductCardComponent.vue'
import { use_scroll_reveal } from '../../composables/use-scroll-reveal.js'

use_scroll_reveal()
const common_store = useCommonStore()
</script>

<template>
    <section class="section-container formation">
        <div class="section-container__header" data-scroll-reveal>
            <h2>Próximas formaciones y talleres vivenciales</h2>
            <p>Experiencias diseñadas para acompañarte en tu proceso de crecimiento</p>
        </div>
        <div class="formation__grid">
            <ProductCardComponent v-for="(product, index) in common_store.products" :key="product._id"
                :product="product" data-scroll-reveal :style="{ '--delay': `${0.2 + index * 0.15}s` }" />
        </div>
        <RouterLink to="/formaciones" class="formation__link" data-scroll-reveal>
            Ver todas las formaciones →
        </RouterLink>
    </section>
</template>


<style scoped lang="scss">
.formation {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-10;

    &__grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: $space-8;
        box-sizing: border-box;
    }

    &__link {
        display: inline-block;
        padding: $space-3 $space-6;
        color: var(--color-primary);
        font-family: $font-body;
        font-size: $text-base;
        font-weight: $fw-medium;
        border: 1px solid var(--color-border);
        border-radius: $radius-sm;
        transition: $transition-slow;
        opacity: 0;
        transform: translateY(20px);

        &.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        &:hover {
            border-color: var(--color-primary);
            box-shadow: var(--shadow-sm);
            transform: translateY(-2px);
        }
    }
}

@media screen and (max-width: $bp-md) {
    .formation__grid {
        grid-template-columns: 1fr;
        gap: $space-6;
    }
}
</style>
