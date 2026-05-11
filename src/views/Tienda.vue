<script setup>
import { computed, onMounted, ref } from 'vue'
import { useProductStore } from '../stores/product-store'
import ProductCard from '../components/common/cards/ProductCardComponent.vue'
import LoadingComponent from '../components/common/LoadingComponent.vue'

const product_store = useProductStore()
const loading = ref(false)
const search = ref('')

onMounted(async () => {
    if (product_store.all_products.length === 0) {
        loading.value = true
        await product_store.fetch_products()
        loading.value = false
    }
})

const type_labels = { ebook: 'Guías', bundle: 'Packs', service: 'Servicios' }
const active_type = ref('')

const store_products = computed(() => {
    let result = product_store.all_products.filter(p => p.type !== 'course')
    if (active_type.value) result = result.filter(p => p.type === active_type.value)
    if (search.value.trim()) {
        const term = search.value.toLowerCase()
        result = result.filter(p =>
            p.title?.toLowerCase().includes(term) ||
            p.description?.toLowerCase().includes(term)
        )
    }
    return result
})

const available_types = computed(() => {
    const types = product_store.all_products
        .filter(p => p.type !== 'course')
        .map(p => p.type)
        .filter(Boolean)
    return [...new Set(types)]
})
</script>

<template>
    <div class="tienda-page">

        <!-- Hero -->
        <div class="page-hero">
            <div class="page-hero__deco" />
            <div class="page-hero__inner">
                <span class="page-hero__chip">Tienda Virtual</span>
                <h1 class="page-hero__title">Recursos para tu bienestar</h1>
                <p class="page-hero__sub">Guías, packs y recursos digitales para seguir creciendo a tu ritmo.</p>
            </div>
        </div>

        <!-- Body -->
        <div class="page-body">

            <!-- Toolbar -->
            <div class="toolbar">
                <div class="toolbar__filters">
                    <button
                        class="filter-chip"
                        :class="{ 'filter-chip--active': active_type === '' }"
                        @click="active_type = ''"
                    >Todos</button>
                    <button
                        v-for="t in available_types"
                        :key="t"
                        class="filter-chip"
                        :class="{ 'filter-chip--active': active_type === t }"
                        @click="active_type = t"
                    >{{ type_labels[t] || t }}</button>
                </div>
                <div class="toolbar__search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <input v-model="search" type="text" placeholder="Buscar…" class="toolbar__search-input" />
                </div>
            </div>

            <LoadingComponent v-if="loading" />

            <div v-else-if="store_products.length === 0" class="page-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p>No se encontraron productos</p>
                <button v-if="active_type || search" class="reset-btn" @click="active_type = ''; search = ''">
                    Limpiar filtros
                </button>
            </div>

            <div v-else class="page-grid">
                <ProductCard v-for="product in store_products" :key="product._id" :product="product" />
            </div>

            <p v-if="store_products.length > 0" class="page-count">
                {{ store_products.length }} producto{{ store_products.length !== 1 ? 's' : '' }}
            </p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.tienda-page {
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
        margin: 0 auto;
        max-width: 480px;
    }
}

.page-body {
    max-width: 1160px;
    margin: 0 auto;
    padding: 48px 28px 80px;

    @media (max-width: $bp-sm) { padding: 28px 16px 60px; }
}

/* Toolbar */
.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 36px;
    flex-wrap: wrap;

    &__filters {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    &__search {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        background: white;
        border: 1.5px solid var(--border);
        border-radius: $radius-full;
        color: var(--ink-muted);
        transition: border-color 0.2s;

        &:focus-within {
            border-color: var(--color-primary);
            color: var(--blue-ink);
        }
    }

    &__search-input {
        border: none;
        outline: none;
        font-size: 14px;
        font-family: var(--font-body);
        color: var(--blue-ink);
        background: transparent;
        width: 160px;

        &::placeholder { color: var(--ink-faint); }

        @media (max-width: $bp-sm) { width: 120px; }
    }
}

.filter-chip {
    padding: 8px 16px;
    border-radius: $radius-full;
    border: 1.5px solid var(--border);
    background: white;
    font-size: 13px;
    font-weight: $fw-semibold;
    font-family: var(--font-body);
    color: var(--ink-muted);
    cursor: pointer;
    transition: all 0.2s;

    &:hover { border-color: var(--color-primary); color: var(--color-primary); }

    &--active {
        background: var(--blue-ink);
        border-color: var(--blue-ink);
        color: white;
    }
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

.reset-btn {
    padding: 10px 20px;
    border: 1.5px solid var(--border);
    border-radius: $radius-full;
    background: transparent;
    font-size: 14px;
    font-family: var(--font-body);
    color: var(--blue-ink);
    cursor: pointer;
    transition: all 0.2s;

    &:hover { border-color: var(--color-primary); color: var(--color-primary); }
}

.page-count {
    text-align: center;
    font-size: 13px;
    color: var(--ink-muted);
    font-family: var(--font-body);
    margin: 32px 0 0;
}
</style>
