<template>
    <div class="product-catalog">
        <div class="catalog-container">
            <!-- Header -->
            <header class="catalog-header">
                <h1 class="catalog-title">{{ pageTitle }}</h1>
                <p class="catalog-subtitle">{{ pageSubtitle }}</p>
            </header>

            <div class="catalog-layout">
                <!-- Sidebar con filtros (Desktop) -->
                <aside class="catalog-sidebar">
                    <ProductFilters :filters="filters" :categories="categories" @update:filters="handleFiltersChange" />
                </aside>

                <!-- Contenido principal -->
                <main class="catalog-main">
                    <!-- Botón de filtros móvil -->
                    <button class="filters-toggle" @click="showMobileFilters = true">
                        🔍 Filtros
                    </button>

                    <!-- Resultados -->
                    <div v-if="loading" class="catalog-loading">
                        <LoadingComponent />
                    </div>

                    <div v-else-if="filteredProducts.length === 0" class="catalog-empty">
                        <div class="empty-icon">🔍</div>
                        <h3>No se encontraron productos</h3>
                        <p>Intenta ajustar los filtros o busca otro término</p>
                        <button @click="clearFilters" class="btn-clear">
                            Limpiar filtros
                        </button>
                    </div>

                    <div v-else class="catalog-grid">
                        <ProductCard v-for="product in sortedProducts" :key="product._id" :product="product" />
                    </div>

                    <!-- Contador de resultados -->
                    <div v-if="filteredProducts.length > 0" class="catalog-count">
                        Mostrando {{ filteredProducts.length }} producto{{ filteredProducts.length !== 1 ? 's' : '' }}
                    </div>
                </main>
            </div>
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
                    <ProductFilters :filters="filters" :categories="categories" @update:filters="handleFiltersChange" />
                    <button @click="showMobileFilters = false" class="filters-modal__apply">
                        Aplicar filtros
                    </button>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/product-store'
import ProductCard from '../components/common/cards/ProductCardComponent.vue'
import ProductFilters from '../components/common/ProductFilterComponent.vue'
import LoadingComponent from '../components/common/LoadingComponent.vue'

const route = useRoute()
const product_store = useProductStore()

// State
const loading = ref(false)
const showMobileFilters = ref(false)
const filters = ref({
    type: '',
    category: '',
    search: '',
    sort: 'date_asc'
})

// Mapeo de rutas a tipos de producto
const routeTypeMap = {
    'formaciones': 'course',
    'guias': 'ebook',
    'productos': '' // Todos
}

// Títulos y subtítulos según ruta
const pageTitle = computed(() => {
    const titles = {
        'formaciones': 'Formaciones Online',
        'guias': 'Guías Digitales',
        'productos': 'Todos los Productos'
    }
    return titles[route.params.productType] || 'Productos'
})

const pageSubtitle = computed(() => {
    const subtitles = {
        'formaciones': 'Cursos y programas para tu desarrollo personal y profesional',
        'guias': 'Recursos descargables para aplicar desde hoy',
        'productos': 'Explora toda nuestra oferta de contenidos'
    }
    return subtitles[route.params.productType] || ''
})

// Cargar productos
const loadProducts = async () => {
    loading.value = true

    // Aplicar filtro de tipo según la ruta
    const routeType = routeTypeMap[route.params.productType]
    const queryFilters = { ...filters.value }

    if (routeType) {
        queryFilters.type = routeType
    }

    await product_store.fetch_products(queryFilters)
    loading.value = false
}

// Productos filtrados
const filteredProducts = computed(() => {
    return product_store.products || []
})

// Productos ordenados
const sortedProducts = computed(() => {
    const products = [...filteredProducts.value]

    switch (filters.value.sort) {
        case 'date_asc':
            // Próximas formaciones primero (por start_date)
            return products.sort((a, b) => {
                const dateA = a.start_date ? new Date(a.start_date) : new Date(a.createdAt)
                const dateB = b.start_date ? new Date(b.start_date) : new Date(b.createdAt)
                return dateA - dateB
            })

        case 'date_desc':
            return products.sort((a, b) => {
                const dateA = new Date(a.createdAt)
                const dateB = new Date(b.createdAt)
                return dateB - dateA
            })

        case 'price_asc':
            return products.sort((a, b) => a.price - b.price)

        case 'price_desc':
            return products.sort((a, b) => b.price - a.price)

        case 'title_asc':
            return products.sort((a, b) => a.title.localeCompare(b.title))

        default:
            return products
    }
})

// Categorías únicas (extraídas de los productos)
const categories = computed(() => {
    const cats = filteredProducts.value
        .map(p => p.category)
        .filter(Boolean)
    return [...new Set(cats)]
})

// Manejar cambio de filtros
const handleFiltersChange = async (newFilters) => {
    filters.value = { ...newFilters }
    await loadProducts()
}

// Limpiar filtros
const clearFilters = () => {
    filters.value = {
        type: '',
        category: '',
        search: '',
        sort: 'date_asc'
    }
    loadProducts()
}

// Watch cambios de ruta
watch(() => route.params.productType, () => {
    loadProducts()
})

// Cargar al montar
onMounted(() => {
    loadProducts()
})
</script>

<style scoped lang="scss">
.product-catalog {
    min-height: 80vh;
    background: var(--color-bg);
    padding: 40px 0;

    @media (max-width: 768px) {
        padding: 20px 0;
    }
}

.catalog-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;

    @media (max-width: 768px) {
        padding: 0 16px;
    }
}

.catalog-header {
    text-align: center;
    margin-bottom: 60px;

    @media (max-width: 768px) {
        margin-bottom: 32px;
    }
}

.catalog-title {
    font-size: 42px;
    font-weight: 800;
    margin: 0 0 16px;
    color: var(--color-text-heading);

    @media (max-width: 768px) {
        font-size: 32px;
    }
}

.catalog-subtitle {
    font-size: 18px;
    color: var(--color-text-muted);
    margin: 0;
    max-width: 600px;
    margin: 0 auto;

    @media (max-width: 768px) {
        font-size: 16px;
    }
}

.catalog-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 40px;
    align-items: start;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 24px;
    }
}

.catalog-sidebar {
    position: sticky;
    top: 100px;

    @media (max-width: 1024px) {
        display: none; // Ocultar en móvil, usar modal
    }
}

.catalog-main {
    min-height: 500px;
}

.filters-toggle {
    display: none;
    width: 100%;
    padding: 14px;
    margin-bottom: 24px;
    border: 2px solid var(--color-border);
    border-radius: 10px;
    background: var(--color-bg-card);
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.2s ease;

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
    min-height: 400px;
}

.catalog-empty {
    text-align: center;
    padding: 80px 20px;

    .empty-icon {
        font-size: 64px;
        margin-bottom: 20px;
    }

    h3 {
        font-size: 24px;
        font-weight: 700;
        margin: 0 0 12px;
        color: var(--color-text);
    }

    p {
        font-size: 16px;
        color: var(--color-text-muted);
        margin: 0 0 32px;
    }

    .btn-clear {
        padding: 12px 32px;
        border: 2px solid var(--color-primary);
        border-radius: 10px;
        background: var(--color-bg-card);
        color: var(--color-primary);
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            background: var(--color-primary);
            color: var(--color-bg-card);
        }
    }
}

.catalog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    margin-bottom: 32px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 16px;
    }
}

.catalog-count {
    text-align: center;
    font-size: 14px;
    color: var(--color-text-muted);
    padding: 20px;
}

// Modal de filtros móvil
.filters-modal {
    position: fixed;
    inset: 0;
    z-index: 1000;

    &__overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }

    &__content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        max-height: 85vh;
        background: var(--color-bg-card);
        border-radius: 24px 24px 0 0;
        padding: 24px;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        h2 {
            font-size: 20px;
            font-weight: 700;
            margin: 0;
            color: var(--color-text-heading);
        }

        .btn-close {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: var(--color-bg);
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            color: var(--color-text-muted);

            &:hover {
                background: var(--color-border-light);
            }
        }
    }

    &__apply {
        width: 100%;
        padding: 14px;
        margin-top: 24px;
        border: none;
        border-radius: 10px;
        background: var(--color-primary);
        color: var(--color-bg-card);
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;

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