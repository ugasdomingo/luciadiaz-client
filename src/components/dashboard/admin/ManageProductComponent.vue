<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '../../../stores/product-store.js'
import { useModalState } from '../../../composables/useModalState.js'
import LoadingComponent from '../../common/LoadingComponent.vue'
import ProductTableRow from './ProductTableRow.vue'
import ProductFormModal from './ProductFormModal.vue'

const product_store = useProductStore()
const { is_open, mode, selected, open_create, open_edit, close } = useModalState()

const loading = ref(false)
const deleting = ref(false)
const products = ref([])
const show_delete_modal = ref(false)
const product_to_delete = ref(null)

const filters = ref({
    type: '',
    status: 'coming_soon',
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
                <option value="draft">Borradores</option>
                <option value="archived">Archivados</option>
                <option value="coming_soon">Próximamente</option>
                <option value="">Todos los estados</option>
            </select>

            <input v-model="filters.search" @input="debounce_search" type="text"
                placeholder="Buscar por título..." class="filter-input" />
        </div>

        <!-- Loading -->
        <LoadingComponent v-if="loading" />

        <!-- Tabla -->
        <div v-else-if="products.length > 0" class="products-table-wrapper">
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
                        @edit="open_edit"
                        @delete="confirm_delete"
                    />
                </tbody>
            </table>
        </div>

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
    padding: 40px 20px;
}

.manage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }
}

.manage-title {
    font-size: 32px;
    font-weight: 800;
    margin: 0;
    color: var(--color-text);

    @media (max-width: 768px) {
        font-size: 24px;
    }
}

.manage-filters {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 32px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
}

.filter-select,
.filter-input {
    padding: 12px 16px;
    border: 2px solid var(--color-border);
    border-radius: 8px;
    font-size: 14px;
    background: var(--color-white);
    transition: border-color 0.2s ease;
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
    border-radius: 12px;
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
            padding: 16px;
            text-align: left;
            font-size: 14px;
            font-weight: 700;
            color: var(--color-text);
            white-space: nowrap;
        }
    }

    tbody {
        :deep(tr) {
            border-bottom: 1px solid var(--color-border);
            transition: background 0.2s ease;

            &:hover {
                background: var(--color-bg);
            }

            &:last-child {
                border-bottom: none;
            }
        }

        :deep(td) {
            padding: 16px;
            font-size: 14px;
            color: var(--color-text);
            vertical-align: middle;
        }
    }
}

.empty-state {
    background: var(--color-white);
    border-radius: 12px;
    padding: 80px 40px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
    }

    h3 {
        font-size: 24px;
        font-weight: 700;
        margin: 0 0 8px;
        color: var(--color-text);
    }

    p {
        font-size: 16px;
        margin: 0 0 32px;
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
    padding: 20px;
}

.modal-content {
    background: var(--color-white);
    border-radius: 16px;
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
    padding: 24px 32px;
    border-bottom: 1px solid var(--color-border);
}

.modal-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: var(--color-text);
}

.modal-close {
    width: 36px;
    height: 36px;
    border: none;
    background: var(--color-bg);
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: var(--color-border);
    }
}

.modal-body {
    padding: 32px;

    p {
        margin: 0 0 16px;
        color: var(--color-text);

        &:last-child {
            margin-bottom: 0;
        }
    }
}

.warning-text {
    font-size: 14px;
    color: var(--color-text-muted);
    font-style: italic;
}

.modal-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding: 24px 32px;
    border-top: 1px solid var(--color-border);
}

.btn-primary,
.btn-secondary,
.btn-danger {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

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
</style>
