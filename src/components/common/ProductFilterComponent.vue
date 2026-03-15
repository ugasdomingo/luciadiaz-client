<template>
    <aside class="product-filters">
        <h3 class="filters__title">Filtrar productos</h3>

        <!-- Filtro por tipo -->
        <div class="filter-group">
            <label class="filter-label">Tipo</label>
            <select :value="product_store.filters.type" @change="product_store.set_filter('type', $event.target.value)"
                class="filter-select">
                <option value="">Todos</option>
                <option value="course">Formaciones</option>
                <option value="ebook">Guías</option>
                <option value="bundle">Packs</option>
                <option value="service">Servicios</option>
            </select>
        </div>

        <!-- Filtro por categoría -->
        <div class="filter-group" v-if="product_store.categories.length > 0">
            <label class="filter-label">Categoría</label>
            <select :value="product_store.filters.category"
                @change="product_store.set_filter('category', $event.target.value)" class="filter-select">
                <option value="">Todas</option>
                <option v-for="cat in product_store.categories" :key="cat" :value="cat">
                    {{ cat }}
                </option>
            </select>
        </div>

        <!-- Búsqueda por texto -->
        <div class="filter-group">
            <label class="filter-label">Buscar</label>
            <input :value="product_store.filters.search" @input="handle_search($event.target.value)" type="text"
                placeholder="Buscar por título..." class="filter-input">
        </div>

        <!-- Ordenar por -->
        <div class="filter-group">
            <label class="filter-label">Ordenar por</label>
            <select :value="product_store.filters.sort" @change="product_store.set_filter('sort', $event.target.value)"
                class="filter-select">
                <option value="date_asc">Próximas primero</option>
                <option value="date_desc">Más recientes</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
                <option value="title_asc">Título: A-Z</option>
            </select>
        </div>

        <!-- Botón para limpiar filtros -->
        <button v-if="has_active_filters" @click="product_store.clear_filters()" class="filter-clear">
            Limpiar filtros
        </button>
    </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useProductStore } from '../../stores/product-store'

const product_store = useProductStore()

const has_active_filters = computed(() => {
    return product_store.filters.type ||
        product_store.filters.category ||
        product_store.filters.search
})

// Debounce para la búsqueda
let search_timeout = null
const handle_search = (value) => {
    clearTimeout(search_timeout)
    search_timeout = setTimeout(() => {
        product_store.set_filter('search', value)
    }, 300)
}
</script>

<style scoped lang="scss">
.product-filters {
    background: var(--color-white);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border-light);
}

.filters__title {
    font-size: 1.1rem;
    margin: 0 0 1.25rem;
    color: var(--color-text-heading);
}

.filter-group {
    margin-bottom: 1.25rem;

    &:last-of-type {
        margin-bottom: 0;
    }
}

.filter-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: 'Montserrat', sans-serif;
    color: var(--color-text);
    margin-bottom: 0.5rem;
}

.filter-select,
.filter-input {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    font-family: 'Montserrat', sans-serif;
    background: var(--color-white);
    transition: border-color 0.25s ease;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: var(--color-primary);
    }
}

.filter-select {
    cursor: pointer;
}

.filter-input {
    &::placeholder {
        color: var(--color-text-muted);
    }
}

.filter-clear {
    width: 100%;
    padding: 0.625rem;
    margin-top: 1.25rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--color-text-muted);
    font-size: 0.85rem;
    font-weight: 500;
    font-family: 'Montserrat', sans-serif;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }
}
</style>
