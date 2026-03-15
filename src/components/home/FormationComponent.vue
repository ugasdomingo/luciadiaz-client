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
    gap: 2.5rem;

    &__grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        box-sizing: border-box;
    }

    &__link {
        display: inline-block;
        padding: 0.75rem 1.75rem;
        color: var(--color-primary);
        font-family: 'Montserrat', sans-serif;
        font-size: 0.95rem;
        font-weight: 500;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        transition: all 0.3s ease;
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

@media screen and (max-width: 720px) {
    .formation__grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}
</style>
