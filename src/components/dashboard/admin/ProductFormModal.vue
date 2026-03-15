<script setup>
import { ref, watch } from 'vue'
import { useProductStore } from '../../../stores/product-store.js'

const props = defineProps({
    is_open: { type: Boolean, required: true },
    mode: { type: String, default: 'create' }, // 'create' | 'edit'
    product: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])

const product_store = useProductStore()
const submitting = ref(false)
const image_input = ref(null)
const image_preview = ref(null)
const image_file = ref(null)

const default_form = () => ({
    title: '',
    slug: '',
    type: '',
    price: 0,
    description: '',
    category: '',
    status: 'active',
    start_date: '',
    download_url: '',
    curriculum: [],
})

const form_data = ref(default_form())

// Sync form when product or mode changes
watch(() => [props.is_open, props.product, props.mode], ([open]) => {
    if (!open) return
    if (props.mode === 'edit' && props.product) {
        form_data.value = {
            _id: props.product._id,
            title: props.product.title,
            slug: props.product.slug,
            type: props.product.type,
            price: props.product.price,
            description: props.product.description,
            category: props.product.category || '',
            status: props.product.status,
            start_date: props.product.start_date
                ? new Date(props.product.start_date).toISOString().slice(0, 16)
                : '',
            download_url: props.product.download_url || '',
            curriculum: props.product.curriculum ? [...props.product.curriculum] : [],
        }
        if (props.product.cover_image) {
            image_preview.value = typeof props.product.cover_image === 'string'
                ? props.product.cover_image
                : props.product.cover_image.secure_url
        }
    } else {
        form_data.value = default_form()
        image_preview.value = null
        image_file.value = null
    }
}, { immediate: true })

const trigger_image_input = () => image_input.value?.click()

const handle_image_upload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Solo se aceptan imágenes'); return }
    if (file.size > 5 * 1024 * 1024) { alert('La imagen no debe superar 5MB'); return }

    image_file.value = file
    const reader = new FileReader()
    reader.onload = (e) => { image_preview.value = e.target.result }
    reader.readAsDataURL(file)
}

const remove_image = () => {
    image_preview.value = null
    image_file.value = null
    if (image_input.value) image_input.value.value = ''
}

const add_lesson = () => {
    form_data.value.curriculum.push({ title: '', video_url: '', notes: '', is_free_preview: false })
}

const remove_lesson = (index) => form_data.value.curriculum.splice(index, 1)

const handle_submit = async () => {
    submitting.value = true
    try {
        const submit_data = new FormData()
        Object.keys(form_data.value).forEach(key => {
            if (key !== '_id' && key !== 'curriculum' && form_data.value[key] !== '') {
                submit_data.append(key, form_data.value[key])
            }
        })
        if (form_data.value.curriculum.length > 0) {
            submit_data.append('curriculum', JSON.stringify(form_data.value.curriculum))
        }
        if (image_file.value) {
            submit_data.append('cover_image', image_file.value)
        }

        let result
        if (props.mode === 'edit') {
            result = await product_store.update_product(form_data.value._id, submit_data)
        } else {
            result = await product_store.create_product(submit_data)
        }

        if (result) {
            emit('saved')
            emit('close')
        }
    } catch (error) {
        console.error('Error submit:', error)
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <Teleport to="body">
        <div v-if="is_open" class="modal-overlay" @click="$emit('close')">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h2 class="modal-title">{{ mode === 'edit' ? 'Editar Producto' : 'Crear Producto' }}</h2>
                    <button @click="$emit('close')" class="modal-close">✕</button>
                </div>

                <form @submit.prevent="handle_submit" class="product-form">
                    <!-- Título -->
                    <div class="form-group">
                        <label class="form-label">Título *</label>
                        <input v-model="form_data.title" type="text" required class="form-input"
                            placeholder="Nombre del producto" />
                    </div>

                    <!-- Slug -->
                    <div class="form-group">
                        <label class="form-label">Slug *</label>
                        <input v-model="form_data.slug" type="text" required
                            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$" class="form-input"
                            placeholder="nombre-del-producto" />
                        <span class="form-hint">Solo minúsculas y guiones (ej: curso-mindfulness)</span>
                    </div>

                    <!-- Tipo y Precio -->
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Tipo *</label>
                            <select v-model="form_data.type" required class="form-select">
                                <option value="">Seleccionar...</option>
                                <option value="course">Curso</option>
                                <option value="ebook">Guía/Ebook</option>
                                <option value="bundle">Pack</option>
                                <option value="service">Servicio</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Precio ($) *</label>
                            <input v-model.number="form_data.price" type="number" min="0" step="0.01" required
                                class="form-input" placeholder="0.00" />
                        </div>
                    </div>

                    <!-- Descripción -->
                    <div class="form-group">
                        <label class="form-label">Descripción *</label>
                        <textarea v-model="form_data.description" required rows="4" class="form-textarea"
                            placeholder="Describe el producto..." />
                    </div>

                    <!-- Categoría y Estado -->
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Categoría</label>
                            <input v-model="form_data.category" type="text" class="form-input"
                                placeholder="Ej: Salud Mental" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Estado</label>
                            <select v-model="form_data.status" class="form-select">
                                <option value="active">Activo</option>
                                <option value="draft">Borrador</option>
                                <option value="archived">Archivado</option>
                                <option value="coming_soon">Próximamente</option>
                            </select>
                        </div>
                    </div>

                    <!-- Fecha de inicio (solo cursos) -->
                    <div v-if="form_data.type === 'course'" class="form-group">
                        <label class="form-label">Fecha de inicio</label>
                        <input v-model="form_data.start_date" type="datetime-local" class="form-input" />
                    </div>

                    <!-- URL de descarga (solo ebooks) -->
                    <div v-if="form_data.type === 'ebook'" class="form-group">
                        <label class="form-label">URL de descarga</label>
                        <input v-model="form_data.download_url" type="url" class="form-input"
                            placeholder="https://..." />
                    </div>

                    <!-- Imagen de portada -->
                    <div class="form-group">
                        <label class="form-label">Imagen de portada</label>
                        <div class="image-upload">
                            <input type="file" ref="image_input" accept="image/*"
                                @change="handle_image_upload" class="image-input" />

                            <div v-if="image_preview" class="image-preview">
                                <img :src="image_preview" alt="Preview" />
                                <button @click="remove_image" type="button" class="btn-remove-image">
                                    🗑️ Eliminar
                                </button>
                            </div>
                            <div v-else class="image-placeholder" @click="trigger_image_input">
                                <div class="placeholder-icon">🖼️</div>
                                <p>Haz clic para subir imagen</p>
                            </div>
                        </div>
                    </div>

                    <!-- Curriculum (solo cursos) -->
                    <div v-if="form_data.type === 'course'" class="form-group">
                        <label class="form-label">Curriculum</label>
                        <div class="curriculum-editor">
                            <div v-for="(lesson, index) in form_data.curriculum" :key="index"
                                class="curriculum-item">
                                <div class="lesson-header">
                                    <span class="lesson-number">{{ index + 1 }}</span>
                                    <input v-model="lesson.title" type="text" placeholder="Título de la lección"
                                        class="lesson-input" />
                                    <button @click="remove_lesson(index)" type="button" class="btn-remove-lesson">
                                        ✕
                                    </button>
                                </div>
                                <input v-model="lesson.video_url" type="url"
                                    placeholder="URL del video (opcional)" class="lesson-input-small" />
                                <textarea v-model="lesson.notes" placeholder="Notas de la lección (opcional)"
                                    rows="2" class="lesson-textarea" />
                                <label class="lesson-checkbox">
                                    <input v-model="lesson.is_free_preview" type="checkbox" />
                                    <span>Vista previa gratuita</span>
                                </label>
                            </div>
                            <button @click="add_lesson" type="button" class="btn-add-lesson">
                                ➕ Añadir lección
                            </button>
                        </div>
                    </div>

                    <!-- Acciones -->
                    <div class="form-actions">
                        <button type="button" @click="$emit('close')" class="btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" :disabled="submitting" class="btn-primary">
                            {{ submitting ? 'Guardando...' : (mode === 'edit' ? 'Actualizar' : 'Crear') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </Teleport>
</template>

<style scoped lang="scss">
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
    background: var(--color-bg);
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: var(--color-border);
    }
}

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
    box-sizing: border-box;

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
    color: var(--color-text-muted);
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
        background: var(--color-bg);
    }

    .placeholder-icon {
        font-size: 48px;
        margin-bottom: 12px;
    }

    p {
        font-size: 14px;
        margin: 0;
        color: var(--color-text-muted);
    }
}

// CURRICULUM
.curriculum-editor {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.curriculum-item {
    padding: 16px;
    border: 2px solid var(--color-border);
    border-radius: 12px;
    background: var(--color-bg);
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
    box-sizing: border-box;

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
    box-sizing: border-box;

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
    box-sizing: border-box;

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
        background: var(--color-bg);
    }
}

// ACTIONS
.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--color-border);
}

.btn-primary,
.btn-secondary {
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
</style>
