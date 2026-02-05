<template>
    <div class="manage-products">
        <header class="manage-header">
            <h2 class="manage-title">Gestión de Productos</h2>
            <button @click="openCreateModal" class="btn-primary">
                ➕ Crear Producto
            </button>
        </header>

        <!-- Filtros -->
        <div class="manage-filters">
            <select v-model="filters.type" @change="loadProducts" class="filter-select">
                <option value="">Todos los tipos</option>
                <option value="course">Cursos</option>
                <option value="ebook">Guías</option>
                <option value="bundle">Packs</option>
                <option value="service">Servicios</option>
            </select>

            <select v-model="filters.status" @change="loadProducts" class="filter-select">
                <option value="active">Activos</option>
                <option value="draft">Borradores</option>
                <option value="archived">Archivados</option>
                <option value="">Todos los estados</option>
            </select>

            <input v-model="filters.search" @input="debounceSearch" type="text" placeholder="Buscar por título..."
                class="filter-input">
        </div>

        <!-- Loading -->
        <LoadingComponent v-if="loading" />

        <!-- Tabla de productos -->
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
                    <tr v-for="product in products" :key="product._id" class="product-row">
                        <td class="product-info">
                            <div class="product-image">
                                <img :src="getProductImage(product)" :alt="product.title"
                                    @error="(e) => e.target.src = '/placeholder-product.jpg'">
                            </div>
                            <div class="product-details">
                                <h4 class="product-name">{{ product.title }}</h4>
                                <span class="product-slug">{{ product.slug }}</span>
                            </div>
                        </td>
                        <td>
                            <span class="type-badge" :class="`type-badge--${product.type}`">
                                {{ getTypeLabel(product.type) }}
                            </span>
                        </td>
                        <td class="product-price">{{ formatPrice(product.price) }}</td>
                        <td>
                            <span class="status-badge" :class="`status-badge--${product.status}`">
                                {{ getStatusLabel(product.status) }}
                            </span>
                        </td>
                        <td class="product-date">
                            {{ product.start_date ? formatDate(product.start_date) : '-' }}
                        </td>
                        <td class="product-actions">
                            <button @click="openEditModal(product)" class="btn-action btn-action--edit" title="Editar">
                                ✏️
                            </button>
                            <button @click="confirmDelete(product)" class="btn-action btn-action--delete"
                                title="Eliminar">
                                🗑️
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Estado vacío -->
        <div v-else class="empty-state">
            <div class="empty-icon">📦</div>
            <h3>No hay productos</h3>
            <p>Crea tu primer producto para empezar</p>
            <button @click="openCreateModal" class="btn-primary">
                Crear Producto
            </button>
        </div>

        <!-- Modal: Crear/Editar Producto -->
        <Teleport to="body">
            <div v-if="showModal" class="modal-overlay" @click="closeModal">
                <div class="modal-content" @click.stop>
                    <div class="modal-header">
                        <h2 class="modal-title">{{ isEditing ? 'Editar Producto' : 'Crear Producto' }}</h2>
                        <button @click="closeModal" class="modal-close">✕</button>
                    </div>

                    {{ formData }}

                    <form @submit.prevent="handleSubmit" class="product-form">
                        <!-- Título -->
                        <div class="form-group">
                            <label class="form-label">Título *</label>
                            <input v-model="formData.title" type="text" required class="form-input"
                                placeholder="Nombre del producto">
                        </div>

                        <!-- Slug -->
                        <div class="form-group">
                            <label class="form-label">Slug *</label>
                            <input v-model="formData.slug" type="text" required pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                                class="form-input" placeholder="nombre-del-producto">
                            <span class="form-hint">Solo minúsculas y guiones (ej: curso-mindfulness)</span>
                        </div>

                        <!-- Tipo y Precio -->
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Tipo *</label>
                                <select v-model="formData.type" required class="form-select">
                                    <option value="">Seleccionar...</option>
                                    <option value="course">Curso</option>
                                    <option value="ebook">Guía/Ebook</option>
                                    <option value="bundle">Pack</option>
                                    <option value="service">Servicio</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Precio (€) *</label>
                                <input v-model.number="formData.price" type="number" min="0" step="0.01" required
                                    class="form-input" placeholder="0.00">
                            </div>
                        </div>

                        <!-- Descripción -->
                        <div class="form-group">
                            <label class="form-label">Descripción *</label>
                            <textarea v-model="formData.description" required rows="4" class="form-textarea"
                                placeholder="Describe el producto..."></textarea>
                        </div>

                        <!-- Categoría y Estado -->
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Categoría</label>
                                <input v-model="formData.category" type="text" class="form-input"
                                    placeholder="Ej: Salud Mental">
                            </div>

                            <div class="form-group">
                                <label class="form-label">Estado</label>
                                <select v-model="formData.status" class="form-select">
                                    <option value="active">Activo</option>
                                    <option value="draft">Borrador</option>
                                    <option value="archived">Archivado</option>
                                </select>
                            </div>
                        </div>

                        <!-- Fecha de inicio (solo para cursos) -->
                        <div v-if="formData.type === 'course'" class="form-group">
                            <label class="form-label">Fecha de inicio</label>
                            <input v-model="formData.start_date" type="datetime-local" class="form-input">
                        </div>

                        <!-- URL de descarga (para ebooks) -->
                        <div v-if="formData.type === 'ebook'" class="form-group">
                            <label class="form-label">URL de descarga</label>
                            <input v-model="formData.download_url" type="url" class="form-input"
                                placeholder="https://...">
                        </div>

                        <!-- Imagen de portada -->
                        <div class="form-group">
                            <label class="form-label">Imagen de portada</label>

                            <div class="image-upload">
                                <input type="file" ref="imageInput" accept="image/*" @change="handleImageUpload"
                                    class="image-input">

                                <div v-if="imagePreview" class="image-preview">
                                    <img :src="imagePreview" alt="Preview">
                                    <button @click="removeImage" type="button" class="btn-remove-image">
                                        🗑️ Eliminar
                                    </button>
                                </div>

                                <div v-else class="image-placeholder" @click="triggerImageInput">
                                    <div class="placeholder-icon">🖼️</div>
                                    <p>Haz clic para subir imagen</p>
                                </div>
                            </div>
                        </div>

                        <!-- Curriculum (solo para cursos) -->
                        <div v-if="formData.type === 'course'" class="form-group">
                            <label class="form-label">Curriculum</label>

                            <div class="curriculum-editor">
                                <div v-for="(lesson, index) in formData.curriculum" :key="index"
                                    class="curriculum-item">
                                    <div class="lesson-header">
                                        <span class="lesson-number">{{ index + 1 }}</span>
                                        <input v-model="lesson.title" type="text" placeholder="Título de la lección"
                                            class="lesson-input">
                                        <button @click="removeLesson(index)" type="button" class="btn-remove-lesson">
                                            ✕
                                        </button>
                                    </div>

                                    <input v-model="lesson.video_url" type="url" placeholder="URL del video (opcional)"
                                        class="lesson-input-small">

                                    <textarea v-model="lesson.notes" placeholder="Notas de la lección (opcional)"
                                        rows="2" class="lesson-textarea"></textarea>

                                    <label class="lesson-checkbox">
                                        <input v-model="lesson.is_free_preview" type="checkbox">
                                        <span>Vista previa gratuita</span>
                                    </label>
                                </div>

                                <button @click="addLesson" type="button" class="btn-add-lesson">
                                    ➕ Añadir lección
                                </button>
                            </div>
                        </div>

                        <!-- Botones de acción -->
                        <div class="form-actions">
                            <button type="button" @click="closeModal" class="btn-secondary">
                                Cancelar
                            </button>
                            <button type="submit" :disabled="submitting" class="btn-primary">
                                {{ submitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Modal: Confirmar eliminación -->
        <Teleport to="body">
            <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
                <div class="modal-content modal-content--small" @click.stop>
                    <div class="modal-header">
                        <h2 class="modal-title">⚠️ Confirmar eliminación</h2>
                        <button @click="showDeleteModal = false" class="modal-close">✕</button>
                    </div>

                    <div class="modal-body">
                        <p>¿Estás seguro de que quieres eliminar este producto?</p>
                        <p><strong>{{ productToDelete?.title }}</strong></p>
                        <p class="warning-text">
                            Esta acción no se puede deshacer. Si el producto tiene órdenes o progreso asociado,
                            no podrá eliminarse.
                        </p>
                    </div>

                    <div class="modal-footer">
                        <button @click="showDeleteModal = false" class="btn-secondary">
                            Cancelar
                        </button>
                        <button @click="handleDelete" :disabled="deleting" class="btn-danger">
                            {{ deleting ? 'Eliminando...' : 'Sí, eliminar' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '../../../stores/product-store'
import LoadingComponent from '../../common/LoadingComponent.vue'

const product_store = useProductStore()

// State
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const products = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const productToDelete = ref(null)
const imageInput = ref(null)
const imagePreview = ref(null)
const imageFile = ref(null)

// Filtros
const filters = ref({
    type: '',
    status: 'active',
    search: ''
})

// Form data
const formData = ref({
    title: '',
    slug: '',
    type: '',
    price: 0,
    description: '',
    category: '',
    status: 'active',
    start_date: '',
    download_url: '',
    curriculum: []
})

// Cargar productos
const loadProducts = async () => {
    loading.value = true
    const result = await product_store.fetch_all_products_admin(filters.value)
    products.value = result || []
    loading.value = false
}

// Debounce para búsqueda
let searchTimeout = null
const debounceSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        loadProducts()
    }, 500)
}

// Abrir modal crear
const openCreateModal = () => {
    isEditing.value = false
    resetForm()
    showModal.value = true
}

// Abrir modal editar
const openEditModal = (product) => {
    isEditing.value = true
    formData.value = {
        _id: product._id,
        title: product.title,
        slug: product.slug,
        type: product.type,
        price: product.price,
        description: product.description,
        category: product.category || '',
        status: product.status,
        start_date: product.start_date ? new Date(product.start_date).toISOString().slice(0, 16) : '',
        download_url: product.download_url || '',
        curriculum: product.curriculum ? [...product.curriculum] : []
    }

    // Preview de imagen existente
    if (product.cover_image) {
        imagePreview.value = typeof product.cover_image === 'string'
            ? product.cover_image
            : product.cover_image.secure_url
    }

    showModal.value = true
}

// Cerrar modal
const closeModal = () => {
    showModal.value = false
    resetForm()
}

// Reset form
const resetForm = () => {
    formData.value = {
        title: '',
        slug: '',
        type: '',
        price: 0,
        description: '',
        category: '',
        status: 'active',
        start_date: '',
        download_url: '',
        curriculum: []
    }
    imagePreview.value = null
    imageFile.value = null
}

// Manejar subida de imagen
const triggerImageInput = () => {
    imageInput.value?.click()
}

const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validar tipo y tamaño
    if (!file.type.startsWith('image/')) {
        alert('Solo se aceptan imágenes')
        return
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar 5MB')
        return
    }

    imageFile.value = file

    // Preview
    const reader = new FileReader()
    reader.onload = (e) => {
        imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
}

const removeImage = () => {
    imagePreview.value = null
    imageFile.value = null
    if (imageInput.value) {
        imageInput.value.value = ''
    }
}

// Curriculum
const addLesson = () => {
    formData.value.curriculum.push({
        title: '',
        video_url: '',
        notes: '',
        is_free_preview: false
    })
}

const removeLesson = (index) => {
    formData.value.curriculum.splice(index, 1)
}

// Submit form
const handleSubmit = async () => {
    submitting.value = true

    try {
        const submitData = new FormData()

        // Campos básicos
        Object.keys(formData.value).forEach(key => {
            if (key !== '_id' && key !== 'curriculum' && formData.value[key] !== '') {
                submitData.append(key, formData.value[key])
            }
        })

        // Curriculum (como JSON)
        if (formData.value.curriculum.length > 0) {
            submitData.append('curriculum', JSON.stringify(formData.value.curriculum))
        }

        // Imagen
        if (imageFile.value) {
            submitData.append('cover_image', imageFile.value)
        }

        let result
        if (isEditing.value) {
            result = await product_store.update_product(formData.value._id, submitData)
        } else {
            result = await product_store.create_product(submitData)
        }

        if (result) {
            closeModal()
            await loadProducts()
        }
    } catch (error) {
        console.error('Error submit:', error)
    } finally {
        submitting.value = false
    }
}

// Confirmar eliminación
const confirmDelete = (product) => {
    productToDelete.value = product
    showDeleteModal.value = true
}

// Eliminar producto
const handleDelete = async () => {
    if (!productToDelete.value) return

    deleting.value = true

    const success = await product_store.delete_product(productToDelete.value._id)

    if (success) {
        showDeleteModal.value = false
        productToDelete.value = null
        await loadProducts()
    }

    deleting.value = false
}

// Helpers
const getProductImage = (product) => {
    if (typeof product.cover_image === 'string') {
        return product.cover_image
    }
    return product.cover_image?.secure_url || '/placeholder-product.jpg'
}

const getTypeLabel = (type) => {
    const labels = {
        'course': 'Curso',
        'ebook': 'Guía',
        'bundle': 'Pack',
        'service': 'Servicio'
    }
    return labels[type] || type
}

const getStatusLabel = (status) => {
    const labels = {
        'active': 'Activo',
        'draft': 'Borrador',
        'archived': 'Archivado'
    }
    return labels[status] || status
}

const formatPrice = (price) => {
    if (price === 0) return 'Gratis'
    return `${price}€`
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

// Cargar al montar
onMounted(() => {
    loadProducts()
})
</script>

<style scoped lang="scss">
.manage-products {
    background: var(--color-background);
    min-height: 100vh;
    padding: 40px 20px;
}

// HEADER
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

// FILTROS
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

    &:focus {
        outline: none;
        border-color: var(--color-primary);
    }
}

.filter-select {
    cursor: pointer;
}

// TABLA
.products-table-wrapper {
    background: var(--color-white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.products-table {
    width: 100%;
    border-collapse: collapse;

    @media (max-width: 968px) {
        display: block;
        overflow-x: auto;
    }

    thead {
        background: var(--color-background);

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
        tr {
            border-bottom: 1px solid var(--color-border);
            transition: background 0.2s ease;

            &:hover {
                background: var(--color-background);
            }

            &:last-child {
                border-bottom: none;
            }
        }

        td {
            padding: 16px;
            font-size: 14px;
            color: var(--color-text);
            vertical-align: middle;
        }
    }
}

.product-info {
    display: flex;
    gap: 12px;
    align-items: center;
    min-width: 250px;
}

.product-image {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.product-details {
    flex: 1;
    min-width: 0;
}

.product-name {
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 4px;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.product-slug {
    font-size: 12px;
    color: var(--color-text-light);
}

.type-badge,
.status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
}

.type-badge {
    &--course {
        background: #dbeafe;
        color: #1e40af;
    }

    &--ebook {
        background: #fef3c7;
        color: #92400e;
    }

    &--bundle {
        background: #ede9fe;
        color: #6d28d9;
    }

    &--service {
        background: #f3f4f6;
        color: #374151;
    }
}

.status-badge {
    &--active {
        background: var(--color-approve-alert);
        color: #065f46;
    }

    &--draft {
        background: #fef3c7;
        color: #92400e;
    }

    &--archived {
        background: #f3f4f6;
        color: #6b7280;
    }
}

.product-price {
    font-weight: 600;
    color: var(--color-text);
    white-space: nowrap;
}

.product-date {
    color: var(--color-text-light);
    white-space: nowrap;
}

.product-actions {
    display: flex;
    gap: 8px;
    white-space: nowrap;
}

.btn-action {
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    background: var(--color-background);
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        transform: scale(1.1);
    }

    &--edit:hover {
        background: #dbeafe;
    }

    &--delete:hover {
        background: #fee2e2;
    }
}

// ESTADO VACÍO
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
        color: var(--color-text-light);
    }
}

// MODAL
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
    overflow-y: auto;
}

.modal-content {
    background: var(--color-white);
    border-radius: 16px;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
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

    @media (max-width: 768px) {
        padding: 20px;
    }
}

.modal-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: var(--color-text);

    @media (max-width: 768px) {
        font-size: 20px;
    }
}

.modal-close {
    width: 36px;
    height: 36px;
    border: none;
    background: var(--color-background);
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

    @media (max-width: 768px) {
        padding: 20px;
    }

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
    color: var(--color-text-light);
    font-style: italic;
}

.modal-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding: 24px 32px;
    border-top: 1px solid var(--color-border);

    @media (max-width: 768px) {
        padding: 20px;
    }
}

// FORM
.product-form {
    padding: 32px;

    @media (max-width: 768px) {
        padding: 20px;
    }
}

.form-group {
    margin-bottom: 24px;

    &:last-child {
        margin-bottom: 0;
    }
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
}

.form-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--color-text);
}

.form-input,
.form-select,
.form-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid var(--color-border);
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    background: var(--color-white);
    transition: border-color 0.2s ease;

    &:focus {
        outline: none;
        border-color: var(--color-primary);
    }
}

.form-select {
    cursor: pointer;
}

.form-textarea {
    resize: vertical;
}

.form-hint {
    display: block;
    font-size: 12px;
    color: var(--color-text-light);
    margin-top: 4px;
}

// IMAGE UPLOAD
.image-upload {
    position: relative;
}

.image-input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.image-preview {
    position: relative;
    width: 100%;
    max-width: 400px;
    border-radius: 12px;
    overflow: hidden;

    img {
        width: 100%;
        height: auto;
        display: block;
    }
}

.btn-remove-image {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    background: var(--color-error);
    color: var(--color-white);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.8;
    }
}

.image-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    border: 2px dashed var(--color-border);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--color-primary);
        background: var(--color-background);
    }

    .placeholder-icon {
        font-size: 48px;
        margin-bottom: 12px;
    }

    p {
        font-size: 14px;
        margin: 0;
        color: var(--color-text-light);
    }
}

// CURRICULUM EDITOR
.curriculum-editor {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.curriculum-item {
    padding: 16px;
    border: 2px solid var(--color-border);
    border-radius: 12px;
    background: var(--color-background);
}

.lesson-header {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
}

.lesson-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--color-primary);
    color: var(--color-white);
    border-radius: 50%;
    font-size: 14px;
    font-weight: 700;
    flex-shrink: 0;
}

.lesson-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 14px;

    &:focus {
        outline: none;
        border-color: var(--color-primary);
    }
}

.lesson-input-small {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 13px;
    margin-bottom: 8px;

    &:focus {
        outline: none;
        border-color: var(--color-primary);
    }
}

.lesson-textarea {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 13px;
    font-family: inherit;
    resize: vertical;
    margin-bottom: 8px;

    &:focus {
        outline: none;
        border-color: var(--color-primary);
    }
}

.lesson-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--color-text);
    cursor: pointer;

    input {
        cursor: pointer;
    }
}

.btn-remove-lesson {
    width: 32px;
    height: 32px;
    border: none;
    background: var(--color-error);
    color: var(--color-white);
    border-radius: 50%;
    font-size: 16px;
    cursor: pointer;
    flex-shrink: 0;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.8;
    }
}

.btn-add-lesson {
    padding: 12px 24px;
    border: 2px dashed var(--color-border);
    background: transparent;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--color-primary);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--color-primary);
        background: var(--color-background);
    }
}

// FORM ACTIONS
.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--color-border);
}

// BOTONES
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