<template>
    <div class="page-container">
        <HeroComponent title="Formaciones" subtitle="Espacios de aprendizaje y transformación personal"
            image="/img/background-individual.webp" />

        <div class="container main-content">
            <LoadingComponent v-if="util_store.loading" />

            <div v-else class="formations-grid">
                <div v-if="product_store.products.length === 0" class="no-results">
                    <p>No hay formaciones disponibles en este momento.</p>
                </div>

                <FormationCardComponent v-else v-for="product in product_store.products" :key="product._id"
                    :formation="product" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '../stores/product-store'
import { useUtilStore } from '../stores/util-store'
import HeroComponent from '../components/home/HeroComponent.vue'
import LoadingComponent from '../components/common/LoadingComponent.vue'
import FormationCardComponent from '../components/common/cards/FormationCardComponent.vue'

const product_store = useProductStore()
const util_store = useUtilStore()

onMounted(async () => {
    // Pedimos solo los productos que sean Cursos/Formaciones
    await product_store.fetch_products({ type: 'course' })
})
</script>

<style lang="scss" scoped>
.main-content {
    padding: 4rem 1rem;
}

.formations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.no-results {
    text-align: center;
    width: 100%;
    padding: 3rem;
    color: var(--text-light);
    font-size: 1.2rem;
}
</style>
