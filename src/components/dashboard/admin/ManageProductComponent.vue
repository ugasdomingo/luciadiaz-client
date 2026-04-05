<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '../../../stores/product-store.js'
import { useModalState } from '../../../composables/useModalState.js'
import LoadingComponent from '../../common/LoadingComponent.vue'
import ProductTableRow from './ProductTableRow.vue'
import ProductFormModal from './ProductFormModal.vue'

const selected_product_id = ref(null)
const toggle_product = (id) => {
    selected_product_id.value = selected_product_id.value === id ? null : id
}

const product_store = useProductStore()
const { is_open, mode, selected, open_create, open_edit, close } = useModalState()

const loading = ref(false)
const deleting = ref(false)
const loading_edit = ref(false)

// Carga el producto completo (con curriculum.notes, video_url, etc.) antes de abrir el modal
const handle_edit = async (product) => {
    loading_edit.value = true
    const full_product = await product_store.fetch_product_for_edit(product._id)
    loading_edit.value = false
    if (full_product) open_edit(full_product)
}
const products = ref([])
const show_delete_modal = ref(false)
const product_to_delete = ref(null)

const filters = ref({
    type: '',
    status: '',
    search: ''
})

const load_products = async () => {
    loading.value = true
    const result = await product_store.fetch_all_products_admin(filters.value)
    products.value = result || []
    loading.value = false
}

let search_timeout = null
const debounce_search = () => {
    clearTimeout(search_timeout)
    search_timeout = setTimeout(() => load_products(), 500)
}

const confirm_delete = (product) => {
    product_to_delete.value = product
    show_delete_modal.value = true
}

const handle_delete = async () => {
    if (!product_to_delete.value) return
    deleting.value = true
    const success = await product_store.delete_product(product_to_delete.value._id)
    if (success) {
        show_delete_modal.value = false
        product_to_delete.value = null
        await load_products()
    }
    deleting.value = false
}

onMounted(() => load_products())
</script>

<template>
    <div class="manage-products">
        <header class="manage-header">
            <h2 class="manage-title">Gestión de Productos</h2>
            <button @click="open_create" class="btn-primary">
                ➕ Crear Producto
            </button>
        </header>

        <!-- Filtros -->
        <div class="manage-filters">
            <select v-model="filters.type" @change="load_products" class="filter-select">
                <option value="">Todos los tipos</option>
                <option value="course">Cursos</option>
                <option value="ebook">Guías</option>
                <option value="bundle">Packs</option>
                <option value="service">Servicios</option>
            </select>

            <select v-model="filters.status" @change="load_products" class="filter-select">
                <option value="active">Activos</option>
                <option value="pre_sale">Pre-venta</option>
                <option value="coming_soon">Próximamente</option>
                <option value="draft">Borradores</option>
                <option value="archived">Archivados</option>
                <option value="">Todos los estados</option>
            </select>

            <input v-model="filters.search" @input="debounce_search" type="text"
                placeholder="Buscar por título..." class="filter-input" />
        </div>

        <!-- Loading -->
        <LoadingComponent v-if="loading" />

        <template v-else-if="products.length > 0">
            <!-- Desktop: tabla -->
            <div class="products-table-wrapper">
                <table class="products-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Tipo</th>
                            <th>Precio</th>
                            <th>Estado</th>
                            <th>Fecha inicio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <ProductTableRow
                            v-for="product in products"
                            :key="product._id"
                            :product="product"
                            @edit="handle_edit"
                            @delete="confirm_delete"
                        />
                    </tbody>
                </table>
            </div>

            <!-- Móvil: lista expandible -->
            <ul class="products-list">
                <li v-for="product in products" :key="product._id" class="product-item">
                    <button class="product-row" @click="toggle_product(product._id)"
                        :class="{ 'product-row--open': selected_product_id === product._id }">
                        <img :src="product.cover_image?.secure_url || product.cover_image || '/img/placeholder-product.jpg'"
                            :alt="product.title" class="product-thumb"
                            @error="(e) => e.target.src = '/img/placeholder-product.jpg'" />
                        <span class="product-name">{{ product.title }}</span>
                        <span class="product-price">{{ product.price === 0 ? 'Gratis' : `${product.price}$` }}</span>
                        <span class="chevron" :class="{ 'chevron--open': selected_product_id === product._id }">›</span>
                    </button>
                    <div v-if="selected_product_id === product._id" class="product-actions">
                        <div class="product-meta">
                            <span class="meta-item"><strong>Tipo:</strong> {{ product.type }}</span>
                            <span class="meta-item"><strong>Estado:</strong> {{ product.status }}</span>
                            <span v-if="product.start_date" class="meta-item">
                                <strong>Inicio:</strong> {{ new Date(product.start_date).toLocaleDateString('es-ES') }}
                            </span>
                        </div>
                        <div class="product-btns">
                            <button @click="handle_edit(product)" class="btn-primary">
                                {{ loading_edit ? '...' : '✏️ Editar' }}
                            </button>
                            <button @click="confirm_delete(product)" class="btn-danger">🗑️ Eliminar</button>
                        </div>
                    </div>
                </li>
            </ul>
        </template>

        <!-- Estado vacío -->
        <div v-else class="empty-state">
            <div class="empty-icon">📦</div>
            <h3>No hay productos</h3>
            <p>Crea tu primer producto para empezar</p>
            <button @click="open_create" class="btn-primary">Crear Producto</button>
        </div>

        <!-- Modal crear / editar -->
        <ProductFormModal
            :is_open="is_open"
            :mode="mode"
            :product="selected"
            @close="close"
            @saved="load_products"
        />

        <!-- Modal confirmar eliminación -->
        <Teleport to="body">
            <div v-if="show_delete_modal" class="modal-overlay" @click="show_delete_modal = false">
                <div class="modal-content modal-content--small" @click.stop>
                    <div class="modal-header">
                        <h2 class="modal-title">⚠️ Confirmar eliminación</h2>
                        <button @click="show_delete_modal = false" class="modal-close">✕</button>
                    </div>

                    <div class="modal-body">
                        <p>¿Estás seguro de que quieres eliminar este producto?</p>
                        <p><strong>{{ product_to_delete?.title }}</strong></p>
                        <p class="warning-text">
                            Esta acción no se puede deshacer. Si el producto tiene órdenes o progreso asociado,
                            no podrá eliminarse.
                        </p>
                    </div>

                    <div class="modal-footer">
                        <button @click="show_delete_modal = false" class="btn-secondary">Cancelar</button>
                        <button @click="handle_delete" :disabled="deleting" class="btn-danger">
                            {{ deleting ? 'Eliminando...' : 'Sí, eliminar' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped lang="scss">
.manage-products {
    background: var(--color-bg);
    min-height: 100vh;
}

/* ── Mobile list ── */
.products-list { display: none; }

.manage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-8;

    @media (max-width: $bp-md) {
        flex-direction: column;
        gap: $space-4;
        align-items: stretch;
    }
}

.manage-title {
    font-size: $text-4xl;
    font-weight: $fw-extrabold;
    margin: 0;
    color: var(--color-text);

    @media (max-width: $bp-md) {
        font-size: $text-2xl;
    }
}

.manage-filters {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $space-4;
    margin-bottom: $space-8;

    @media (max-width: $bp-md) {
        grid-template-columns: 1fr;
    }
}

.filter-select,
.filter-input {
    padding: $space-3 $space-4;
    border: 2px solid var(--color-border);
    border-radius: $radius-sm;
    font-size: $text-sm;
    background: var(--color-white);
    transition: border-color $transition;
    width: 100%;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: var(--color-primary);
    }
}

.filter-select {
    cursor: pointer;
}

.products-table-wrapper {
    background: var(--color-white);
    border-radius: $radius-md;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
}

.products-table {
    width: 100%;
    border-collapse: collapse;

    @media (max-width: 968px) {
        display: block;
        overflow-x: auto;
    }

    thead {
        background: var(--color-bg);

        th {
            padding: $space-4;
            text-align: left;
            font-size: $text-sm;
            font-weight: $fw-bold;
            color: var(--color-text);
            white-space: nowrap;
        }
    }

    tbody {
        :deep(tr) {
            border-bottom: 1px solid var(--color-border);
            transition: background $transition;

            &:hover {
                background: var(--color-bg);
            }

            &:last-child {
                border-bottom: none;
            }
        }

        :deep(td) {
            padding: $space-4;
            font-size: $text-sm;
            color: var(--color-text);
            vertical-align: middle;
        }
    }
}

.empty-state {
    background: var(--color-white);
    border-radius: $radius-md;
    padding: $space-20 $space-10;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .empty-icon {
        font-size: $text-4xl;
        margin-bottom: $space-4;
    }

    h3 {
        font-size: $text-2xl;
        font-weight: $fw-bold;
        margin: 0 0 $space-2;
        color: var(--color-text);
    }

    p {
        font-size: $text-base;
        margin: 0 0 $space-8;
        color: var(--color-text-muted);
    }
}

// Confirm delete modal
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: $space-5;
}

.modal-content {
    background: var(--color-white);
    border-radius: $radius-lg;
    width: 100%;
    max-width: 800px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

    &--small {
        max-width: 500px;
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-6 $space-8;
    border-bottom: 1px solid var(--color-border);
}

.modal-title {
    font-size: $text-2xl;
    font-weight: $fw-bold;
    margin: 0;
    color: var(--color-text);
}

.modal-close {
    width: 36px;
    height: 36px;
    border: none;
    background: var(--color-bg);
    border-radius: 50%;
    font-size: $text-xl;
    cursor: pointer;
    transition: background $transition;

    &:hover {
        background: var(--color-border);
    }
}

.modal-body {
    padding: $space-8;

    p {
        margin: 0 0 $space-4;
        color: var(--color-text);

        &:last-child {
            margin-bottom: 0;
        }
    }
}

.warning-text {
    font-size: $text-sm;
    color: var(--color-text-muted);
    font-style: italic;
}

.modal-footer {
    display: flex;
    gap: $space-3;
    justify-content: flex-end;
    padding: $space-6 $space-8;
    border-top: 1px solid var(--color-border);
}

.btn-primary,
.btn-secondary,
.btn-danger {
    padding: $space-3 $space-6;
    border: none;
    border-radius: $radius-sm;
    font-size: $text-base;
    font-weight: $fw-semibold;
    cursor: pointer;
    transition: $transition;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.btn-primary {
    background: var(--color-primary);
    color: var(--color-white);

    &:hover:not(:disabled) {
        background: var(--color-primary-dark);
    }
}

.btn-secondary {
    background: var(--color-white);
    color: var(--color-text);
    border: 2px solid var(--color-border);

    &:hover:not(:disabled) {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }
}

.btn-danger {
    background: var(--color-error);
    color: var(--color-white);

    &:hover:not(:disabled) {
        opacity: 0.8;
    }
}

@media (max-width: $bp-md) {
    .products-table-wrapper { display: none; }

    .products-list {
        display: flex;
        flex-direction: column;
        gap: 0;
        list-style: none;
        padding: 0;
        margin: 0;
        border: 1px solid var(--color-border);
        border-radius: $radius-md;
        overflow: hidden;
        background: var(--color-bg-card);
    }

    .product-item {
        border-bottom: 1px solid var(--color-border);
        &:last-child { border-bottom: none; }
    }

    .product-row {
        width: 100%;
        display: flex;
        align-items: center;
        gap: $space-3;
        padding: $space-3;
        background: var(--color-bg-card);
        border: none;
        cursor: pointer;
        text-align: left;
        transition: $transition-fast;

        &:hover, &--open { background: var(--overlay-primary-06); }
    }

    .product-thumb {
        width: 48px;
        height: 48px;
        border-radius: $radius-sm;
        object-fit: cover;
        flex-shrink: 0;
    }

    .product-name {
        flex: 1;
        font-size: $text-sm;
        font-weight: $fw-medium;
        font-family: $font-body;
        color: var(--color-text);
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .product-price {
        font-size: $text-sm;
        font-weight: $fw-semibold;
        color: var(--color-primary);
        font-family: $font-body;
        white-space: nowrap;
    }

    .chevron {
        font-size: $text-xl;
        color: var(--color-text-muted);
        transition: transform 0.2s ease;
        line-height: 1;
        flex-shrink: 0;
        &--open { transform: rotate(90deg); }
    }

    .product-actions {
        display: flex;
        flex-direction: column;
        gap: $space-3;
        padding: $space-3;
        background: var(--color-bg);
        border-top: 1px solid var(--color-border-light);
    }

    .product-meta {
        display: flex;
        flex-wrap: wrap;
        gap: $space-2 $space-4;
    }

    .meta-item {
        font-size: $text-xs;
        color: var(--color-text-muted);
        font-family: $font-body;
    }

    .product-btns {
        display: flex;
        gap: $space-3;

        .btn-primary, .btn-danger {
            flex: 1;
            text-align: center;
        }
    }
}
</style>
