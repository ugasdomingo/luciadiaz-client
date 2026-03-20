<template>
    <div class="product-catalog pages">
        <!-- Header -->
        <header class="catalog-header">
            <h1>Todos los Productos</h1>
            <p>Explora toda nuestra oferta de contenidos</p>
        </header>

        <div class="catalog-layout">
            <!-- Sidebar con filtros (Desktop)-->
            <aside class="catalog-sidebar">
                <ProductFilters />
            </aside>

            <!-- Contenido principal -->
            <main class="catalog-main">
                <!-- Botón de filtros móvil -->
                <button class="filters-toggle" @click="show_mobile_filters = true">
                    Filtros
                </button>

                <!-- Loading -->
                <div v-if="loading" class="catalog-loading">
                    <LoadingComponent />
                </div>

                <!-- Sin resultados -->
                <div v-else-if="product_store.show_products.length === 0" class="catalog-empty">
                    <h3>No se encontraron productos</h3>
                    <p>Intenta ajustar los filtros o busca otro término</p>
                    <button @click="product_store.clear_filters()" class="btn-clear">
                        Limpiar filtros
                    </button>
                </div>

                <!-- Grid de productos -->
                <div v-else class="catalog-grid">
                    <ProductCard v-for="product in product_store.show_products" :key="product._id" :product="product" />
                </div>

                <!-- Contador -->
                <div v-if="product_store.show_products.length > 0" class="catalog-count">
                    Mostrando {{ product_store.show_products.length }} de {{ product_store.all_products.length }}
                    producto{{ product_store.all_products.length !== 1 ? 's' : '' }}
                </div>
            </main>
        </div>

        <!-- Modal de filtros móvil -->
        <Teleport to="body">
            <div v-if="show_mobile_filters" class="filters-modal">
                <div class="filters-modal__overlay" @click="show_mobile_filters = false"></div>
                <div class="filters-modal__content">
                    <div class="filters-modal__header">
                        <h2>Filtros</h2>
                        <button @click="show_mobile_filters = false" class="btn-close">✕</button>
                    </div>
                    <ProductFilters />
                    <button @click="show_mobile_filters = false" class="filters-modal__apply">
                        Aplicar filtros
                    </button>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '../stores/product-store'
import ProductCard from '../components/common/cards/ProductCardComponent.vue'
import ProductFilters from '../components/common/ProductFilterComponent.vue'
import LoadingComponent from '../components/common/LoadingComponent.vue'

const product_store = useProductStore()
const loading = ref(false)
const show_mobile_filters = ref(false)

onMounted(async () => {
    if (product_store.all_products.length === 0) {
        loading.value = true
        await product_store.fetch_products()
        loading.value = false
    }
})
</script>

<style scoped lang="scss">
.product-catalog {
    min-height: 80vh;
    padding-top: $space-24;
}

.catalog-header {
    text-align: center;
    margin-bottom: $space-10;

    h1 {
        margin: 0;
        padding: 0;
    }

    p {
        font-size: $text-lg;
        color: var(--color-text-muted);
        max-width: 500px;
        margin: 0 auto;
    }
}

.catalog-layout {
    max-width: $max-width;
    width: 100%;
    display: grid;
    grid-template-columns: $sidebar-width 1fr;
    gap: $space-8;
    margin: 0 auto;
    align-items: start;

    @media (max-width: $bp-lg) {
        grid-template-columns: 1fr;
    }
}

.catalog-sidebar {
    @media (max-width: $bp-lg) {
        display: none;
    }
}

.catalog-main {
    min-height: 400px;
}

.filters-toggle {
    display: none;
    width: 100%;
    padding: $space-3;
    margin-bottom: $space-6;
    border: 1px solid var(--color-border);
    border-radius: $radius-sm;
    background: var(--color-white);
    font-size: $text-base;
    font-weight: $fw-medium;
    font-family: $font-body;
    color: var(--color-text);
    cursor: pointer;
    transition: $transition;

    &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }

    @media (max-width: $bp-lg) {
        display: block;
    }
}

.catalog-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
}

.catalog-empty {
    text-align: center;
    padding: $space-16 $space-4;

    h3 {
        font-size: $text-xl;
        margin: 0 0 $space-3;
        color: var(--color-text);
    }

    p {
        font-size: $text-base;
        color: var(--color-text-muted);
        margin: 0 0 $space-8;
    }

    .btn-clear {
        padding: $space-3 $space-8;
        border: 1px solid var(--color-primary);
        border-radius: $radius-sm;
        background: transparent;
        color: var(--color-primary);
        font-size: $text-base;
        font-weight: $fw-medium;
        font-family: $font-body;
        cursor: pointer;
        transition: $transition;

        &:hover {
            background: var(--color-primary);
            color: var(--color-white);
        }
    }
}

.catalog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: $space-6;
    margin-bottom: $space-8;

    @media (max-width: $bp-md) {
        grid-template-columns: 1fr;
        gap: $space-4;
    }
}

.catalog-count {
    text-align: center;
    font-size: $text-sm;
    color: var(--color-text-muted);
    padding: $space-6;
}

.filters-modal {
    position: fixed;
    inset: 0;
    z-index: 1000;

    &__overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
    }

    &__content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        max-height: 85vh;
        background: var(--color-white);
        border-radius: $radius-lg $radius-lg 0 0;
        padding: $space-6;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $space-6;

        h2 {
            font-size: $text-xl;
            margin: 0;
        }

        .btn-close {
            width: $space-8;
            height: $space-8;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: var(--color-bg);
            border-radius: $radius-full;
            font-size: $text-lg;
            cursor: pointer;
            color: var(--color-text-muted);

            &:hover {
                background: var(--color-border-light);
            }
        }
    }

    &__apply {
        width: 100%;
        padding: $space-3;
        margin-top: $space-6;
        border: none;
        border-radius: $radius-sm;
        background: var(--color-primary);
        color: var(--color-white);
        font-size: $text-base;
        font-weight: $fw-semibold;
        font-family: $font-body;
        cursor: pointer;
        transition: $transition-fast;

        &:hover {
            background: var(--color-primary-dark);
        }
    }
}

@keyframes slideUp {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
}
</style>
