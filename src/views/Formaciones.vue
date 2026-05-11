<script setup>
import { computed, onMounted, ref } from 'vue'
import { useProductStore } from '../stores/product-store'
import ProductCard from '../components/common/cards/ProductCardComponent.vue'
import LoadingComponent from '../components/common/LoadingComponent.vue'

const product_store = useProductStore()
const loading = ref(false)

onMounted(async () => {
    if (product_store.all_products.length === 0) {
        loading.value = true
        await product_store.fetch_products()
        loading.value = false
    }
})

const courses = computed(() =>
    product_store.all_products.filter(p => p.type === 'course')
)
</script>

<template>
    <div class="formaciones-page">

        <!-- Hero -->
        <div class="page-hero">
            <div class="page-hero__deco" />
            <div class="page-hero__inner">
                <span class="page-hero__chip">Formaciones Online</span>
                <h1 class="page-hero__title">Aprende con Lucía</h1>
                <p class="page-hero__sub">Formaciones clínicas diseñadas para que entiendas tu mente, tus vínculos y tus patrones desde la psicología aplicada.</p>
            </div>
        </div>

        <!-- Body -->
        <div class="page-body">
            <LoadingComponent v-if="loading" />

            <div v-else-if="courses.length === 0" class="page-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <p>Próximamente disponibles</p>
            </div>

            <div v-else class="page-grid">
                <ProductCard v-for="product in courses" :key="product._id" :product="product" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.formaciones-page {
    min-height: 100vh;
    background: var(--color-bg);
}

.page-hero {
    background: var(--blue-ink);
    padding: 100px 28px 72px;
    text-align: center;
    position: relative;
    overflow: hidden;

    &__deco {
        position: absolute;
        top: -160px; left: 50%;
        transform: translateX(-50%);
        width: 700px; height: 700px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(245,197,24,0.07), transparent 65%);
        pointer-events: none;
    }

    &__inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }

    &__chip {
        display: inline-block;
        font-size: 11px;
        font-weight: $fw-bold;
        font-family: var(--font-body);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: var(--gold-light);
        background: rgba(245,197,24,0.12);
        border: 1px solid rgba(245,197,24,0.25);
        padding: 5px 14px;
        border-radius: $radius-full;
        margin-bottom: 20px;
    }

    &__title {
        font-family: var(--font-title);
        font-size: clamp(32px, 6vw, 52px);
        font-weight: 700;
        color: white;
        margin: 0 0 16px;
        line-height: 1.15;
    }

    &__sub {
        font-size: 16px;
        color: rgba(255,255,255,0.68);
        line-height: 1.75;
        font-family: var(--font-body);
        margin: 0;
        max-width: 520px;
        margin: 0 auto;
    }
}

.page-body {
    max-width: 1160px;
    margin: 0 auto;
    padding: 56px 28px 80px;

    @media (max-width: $bp-sm) { padding: 36px 16px 60px; }
}

.page-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 28px;

    @media (max-width: $bp-sm) {
        grid-template-columns: 1fr;
        gap: 20px;
    }
}

.page-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 80px 0;
    color: var(--ink-muted);

    p {
        font-size: 16px;
        font-family: var(--font-body);
        margin: 0;
    }
}
</style>
