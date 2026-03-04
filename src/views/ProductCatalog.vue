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
                <button class="filters-toggle" @click="showMobileFilters = true">
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
            <div v-if="showMobileFilters" class="filters-modal">
                <div class="filters-modal__overlay" @click="showMobileFilters = false"></div>
                <div class="filters-modal__content">
                    <div class="filters-modal__header">
                        <h2>Filtros</h2>
                        <button @click="showMobileFilters = false" class="btn-close">✕</button>
                    </div>
                    <ProductFilters />
                    <button @click="showMobileFilters = false" class="filters-modal__apply">
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
const showMobileFilters = ref(false)

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
    padding-top: 6rem;
}

.catalog-header {
    text-align: center;
    margin-bottom: 2.5rem;

    h1 {
        margin: 0;
        padding: 0;
    }

    p {
        font-size: 1.05rem;
        color: var(--color-text-muted);
        max-width: 500px;
        margin: 0 auto;
    }
}

.catalog-layout {
    max-width: 1200px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    position: relative;
    margin: 0 auto;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}

.catalog-sidebar {
    width: 25%;
    position: absolute;
    z-index: 100;
    left: 0;
    top: 0;

    @media (max-width: 1024px) {
        display: none;
    }
}

.catalog-main {
    width: 70%;
    min-height: 400px;
}

.filters-toggle {
    display: none;
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1.5rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-white);
    font-size: 0.95rem;
    font-weight: 500;
    font-family: 'Montserrat', sans-serif;
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }

    @media (max-width: 1024px) {
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
    padding: 4rem 1rem;

    h3 {
        font-size: 1.25rem;
        margin: 0 0 0.75rem;
        color: var(--color-text);
    }

    p {
        font-size: 0.95rem;
        color: var(--color-text-muted);
        margin: 0 0 2rem;
    }

    .btn-clear {
        padding: 0.75rem 2rem;
        border: 1px solid var(--color-primary);
        border-radius: var(--radius-sm);
        background: transparent;
        color: var(--color-primary);
        font-size: 0.95rem;
        font-weight: 500;
        font-family: 'Montserrat', sans-serif;
        cursor: pointer;
        transition: all 0.25s ease;

        &:hover {
            background: var(--color-primary);
            color: var(--color-white);
        }
    }
}

.catalog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}

.catalog-count {
    text-align: center;
    font-size: 0.85rem;
    color: var(--color-text-muted);
    padding: 1.5rem;
}

// Modal de filtros móvil
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
        border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        padding: 1.5rem;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        h2 {
            font-size: 1.25rem;
            margin: 0;
        }

        .btn-close {
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: var(--color-bg);
            border-radius: 50%;
            font-size: 1.1rem;
            cursor: pointer;
            color: var(--color-text-muted);

            &:hover {
                background: var(--color-border-light);
            }
        }
    }

    &__apply {
        width: 100%;
        padding: 0.875rem;
        margin-top: 1.5rem;
        border: none;
        border-radius: var(--radius-sm);
        background: var(--color-primary);
        color: var(--color-white);
        font-size: 0.95rem;
        font-weight: 600;
        font-family: 'Montserrat', sans-serif;
        cursor: pointer;
        transition: background 0.25s ease;

        &:hover {
            background: var(--color-primary-dark);
        }
    }
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}
</style>
