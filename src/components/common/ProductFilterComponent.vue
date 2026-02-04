<template>
    <aside class="product-filters">
        <h3 class="filters__title">Filtrar productos</h3>

        <!-- Filtro por tipo -->
        <div class="filter-group">
            <label class="filter-label">Tipo</label>
            <select v-model="localFilters.type" @change="emitFilters" class="filter-select">
                <option value="">Todos</option>
                <option value="course">Formaciones</option>
                <option value="ebook">Guías</option>
                <option value="bundle">Packs</option>
                <option value="service">Servicios</option>
            </select>
        </div>

        <!-- Filtro por categoría -->
        <div class="filter-group" v-if="categories.length > 0">
            <label class="filter-label">Categoría</label>
            <select v-model="localFilters.category" @change="emitFilters" class="filter-select">
                <option value="">Todas</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                </option>
            </select>
        </div>

        <!-- Búsqueda por texto -->
        <div class="filter-group">
            <label class="filter-label">Buscar</label>
            <input v-model="localFilters.search" @input="debouncedEmit" type="text" placeholder="Buscar por título..."
                class="filter-input">
        </div>

        <!-- Ordenar por -->
        <div class="filter-group">
            <label class="filter-label">Ordenar por</label>
            <select v-model="localFilters.sort" @change="emitFilters" class="filter-select">
                <option value="date_asc">Próximas primero</option>
                <option value="date_desc">Más recientes</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
                <option value="title_asc">Título: A-Z</option>
            </select>
        </div>

        <!-- Botón para limpiar filtros -->
        <button v-if="hasActiveFilters" @click="clearFilters" class="filter-clear">
            Limpiar filtros
        </button>
    </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    filters: {
        type: Object,
        default: () => ({})
    },
    categories: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:filters'])

// Estado local de filtros
const localFilters = ref({
    type: props.filters.type || '',
    category: props.filters.category || '',
    search: props.filters.search || '',
    sort: props.filters.sort || 'date_asc'
})

// Verificar si hay filtros activos
const hasActiveFilters = computed(() => {
    return localFilters.value.type ||
        localFilters.value.category ||
        localFilters.value.search
})

// Emitir cambios
const emitFilters = () => {
    emit('update:filters', { ...localFilters.value })
}

// Debounce para la búsqueda (esperar 500ms después de que el usuario deje de escribir)
let searchTimeout = null
const debouncedEmit = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        emitFilters()
    }, 500)
}

// Limpiar todos los filtros
const clearFilters = () => {
    localFilters.value = {
        type: '',
        category: '',
        search: '',
        sort: 'date_asc'
    }
    emitFilters()
}

// Sincronizar con props si cambian desde el padre
watch(() => props.filters, (newFilters) => {
    if (newFilters) {
        localFilters.value = { ...newFilters }
    }
}, { deep: true })
</script>

<style scoped lang="scss">
.product-filters {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    @media (max-width: 768px) {
        padding: 16px;
    }
}

.filters__title {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 20px;
    color: #111;
}

.filter-group {
    margin-bottom: 20px;

    &:last-of-type {
        margin-bottom: 0;
    }
}

.filter-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.filter-select,
.filter-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    transition: border-color 0.2s ease;

    &:focus {
        outline: none;
        border-color: #6366f1;
    }
}

.filter-select {
    cursor: pointer;
}

.filter-input {
    &::placeholder {
        color: #999;
    }
}

.filter-clear {
    width: 100%;
    padding: 10px;
    margin-top: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    color: #666;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #f5f5f5;
        border-color: #999;
        color: #333;
    }
}
</style>