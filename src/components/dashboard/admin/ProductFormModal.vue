<script setup>
import { ref, watch } from 'vue'
import { useProductStore } from '../../../stores/product-store.js'
import EditorComponent from '../../common/EditorComponent.vue'


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
    presale_price: '',
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
            presale_price: props.product.presale_price ?? '',
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

                    <!-- Precio de pre-venta -->
                    <div v-if="form_data.status === 'pre_sale'" class="form-group">
                        <label class="form-label">Precio de pre-venta ($)</label>
                        <input v-model.number="form_data.presale_price" type="number" min="0" step="0.01"
                            class="form-input" placeholder="0.00" />
                        <span class="form-hint">Se cobrará este precio en lugar del precio normal mientras el producto esté en pre-venta.</span>
                    </div>

                    <!-- Descripción -->
                    <div class="form-group">
                        <label class="form-label">Descripción *</label>
                        <EditorComponent v-model="form_data.description" />
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
                                <option value="pre_sale">Pre-venta</option>
                                <option value="coming_soon">Próximamente</option>
                                <option value="draft">Borrador</option>
                                <option value="archived">Archivado</option>
                            </select>
                        </div>
                    </div>

                    <!-- Fecha de inicio (solo cursos) -->
                    <div v-if="form_data.type === 'course'" class="form-group">
                        <label class="form-label">Fecha de inicio</label>
                        <input v-model="form_data.start_date" type="datetime-local" class="form-input" />
                    </div>

                    <!-- URL del PDF descargable (ebook / bundle) -->
                    <div v-if="form_data.type === 'ebook' || form_data.type === 'bundle'" class="form-group">
                        <label class="form-label">URL del PDF (Cloudinary)</label>
                        <input v-model="form_data.download_url" type="url" class="form-input"
                            placeholder="https://res.cloudinary.com/..." />
                        <span class="form-hint">Sube el PDF a Cloudinary y pega aquí la URL completa. El archivo se servirá de forma protegida a través de tu servidor.</span>
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
    padding: $space-5;
    overflow-y: auto;
}

.modal-content {
    background: var(--color-white);
    border-radius: $radius-lg;
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
    padding: $space-6 $space-8;
    border-bottom: 1px solid var(--color-border);

    @media (max-width: $bp-md) {
        padding: $space-5;
    }
}

.modal-title {
    font-size: $text-2xl;
    font-weight: $fw-bold;
    margin: 0;
    color: var(--color-text);

    @media (max-width: $bp-md) {
        font-size: $text-xl;
    }
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

.product-form {
    padding: $space-8;

    @media (max-width: $bp-md) {
        padding: $space-5;
    }
}

.form-group {
    margin-bottom: $space-6;

    &:last-child {
        margin-bottom: 0;
    }
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-4;

    @media (max-width: $bp-md) {
        grid-template-columns: 1fr;
    }
}

.form-label {
    display: block;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    margin-bottom: $space-2;
    color: var(--color-text);
}

.form-input,
.form-select,
.form-textarea {
    width: 100%;
    padding: $space-3 $space-4;
    border: 2px solid var(--color-border);
    border-radius: $radius-sm;
    font-size: $text-sm;
    font-family: inherit;
    background: var(--color-white);
    transition: border-color $transition;
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
    font-size: $text-xs;
    color: var(--color-text-muted);
    margin-top: $space-1;
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
    border-radius: $radius-md;
    overflow: hidden;

    img {
        width: 100%;
        height: auto;
        display: block;
    }
}

.btn-remove-image {
    position: absolute;
    top: $space-3;
    right: $space-3;
    padding: $space-2 $space-4;
    border: none;
    border-radius: $radius-sm;
    background: var(--color-error);
    color: var(--color-white);
    font-size: $text-sm;
    font-weight: $fw-semibold;
    cursor: pointer;
    transition: opacity $transition;

    &:hover {
        opacity: 0.8;
    }
}

.image-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px $space-5;
    border: 2px dashed var(--color-border);
    border-radius: $radius-md;
    cursor: pointer;
    transition: $transition;

    &:hover {
        border-color: var(--color-primary);
        background: var(--color-bg);
    }

    .placeholder-icon {
        font-size: $text-4xl;
        margin-bottom: $space-3;
    }

    p {
        font-size: $text-sm;
        margin: 0;
        color: var(--color-text-muted);
    }
}

// CURRICULUM
.curriculum-editor {
    display: flex;
    flex-direction: column;
    gap: $space-4;
}

.curriculum-item {
    padding: $space-4;
    border: 2px solid var(--color-border);
    border-radius: $radius-md;
    background: var(--color-bg);
}

.lesson-header {
    display: flex;
    gap: $space-3;
    align-items: center;
    margin-bottom: $space-3;
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
    font-size: $text-sm;
    font-weight: $fw-bold;
    flex-shrink: 0;
}

.lesson-input {
    flex: 1;
    padding: $space-2 $space-3;
    border: 1px solid var(--color-border);
    border-radius: $radius-xs;
    font-size: $text-sm;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: var(--color-primary);
    }
}

.lesson-input-small {
    width: 100%;
    padding: $space-2 $space-3;
    border: 1px solid var(--color-border);
    border-radius: $radius-xs;
    font-size: 13px;
    margin-bottom: $space-2;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: var(--color-primary);
    }
}

.lesson-textarea {
    width: 100%;
    padding: $space-2 $space-3;
    border: 1px solid var(--color-border);
    border-radius: $radius-xs;
    font-size: 13px;
    font-family: inherit;
    resize: vertical;
    margin-bottom: $space-2;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: var(--color-primary);
    }
}

.lesson-checkbox {
    display: flex;
    align-items: center;
    gap: $space-2;
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
    font-size: $text-base;
    cursor: pointer;
    flex-shrink: 0;
    transition: opacity $transition;

    &:hover {
        opacity: 0.8;
    }
}

.btn-add-lesson {
    padding: $space-3 $space-6;
    border: 2px dashed var(--color-border);
    background: transparent;
    border-radius: $radius-sm;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    color: var(--color-primary);
    cursor: pointer;
    transition: $transition;

    &:hover {
        border-color: var(--color-primary);
        background: var(--color-bg);
    }
}

// ACTIONS
.form-actions {
    display: flex;
    gap: $space-3;
    justify-content: flex-end;
    margin-top: $space-8;
    padding-top: $space-6;
    border-top: 1px solid var(--color-border);
}

.btn-primary,
.btn-secondary {
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
</style>
