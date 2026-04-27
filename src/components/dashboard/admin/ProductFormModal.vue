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
const guide_input = ref(null)
const guide_file = ref(null)
const guide_filename = ref('')

// PDFs por módulo: { [index]: File }
const lesson_guide_files = ref({})
const lesson_guide_names = ref({})

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
    dates: [],
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
            dates: props.product.dates
                ? props.product.dates.map(d => ({
                    date: new Date(d.date).toISOString().slice(0, 16),
                    price: d.price,
                }))
                : [],
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
        guide_file.value = null
        guide_filename.value = ''
        lesson_guide_files.value = {}
        lesson_guide_names.value = {}
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

const handle_guide_upload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') { alert('Solo se aceptan archivos PDF'); return }
    if (file.size > 50 * 1024 * 1024) { alert('El archivo no debe superar 50MB'); return }
    guide_file.value = file
    guide_filename.value = file.name
}

const remove_guide = () => {
    guide_file.value = null
    guide_filename.value = ''
    if (guide_input.value) guide_input.value.value = ''
}


const handle_lesson_guide = (index, event) => {
    const file = event.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') { alert('Solo se aceptan archivos PDF'); return }
    if (file.size > 50 * 1024 * 1024) { alert('El archivo no debe superar 50MB'); return }
    lesson_guide_files.value = { ...lesson_guide_files.value, [index]: file }
    lesson_guide_names.value = { ...lesson_guide_names.value, [index]: file.name }
}

const remove_lesson_guide = (index) => {
    const { [index]: _f, ...rest_f } = lesson_guide_files.value
    const { [index]: _n, ...rest_n } = lesson_guide_names.value
    lesson_guide_files.value = rest_f
    lesson_guide_names.value = rest_n
}

const add_date = () => {
    form_data.value.dates.push({ date: '', price: 0 })
}

const remove_date = (index) => {
    form_data.value.dates.splice(index, 1)
}

const add_lesson = () => {
    form_data.value.curriculum.push({ title: '', video_url: '', notes: '', lesson_pdf_url: '', is_free_preview: false })
}

const remove_lesson = (index) => {
    form_data.value.curriculum.splice(index, 1)
    // Remap file indices: shift down entries above removed index
    const new_files = {}
    const new_names = {}
    Object.entries(lesson_guide_files.value).forEach(([i, file]) => {
        const num = parseInt(i)
        if (num < index) { new_files[num] = file; new_names[num] = lesson_guide_names.value[i] }
        else if (num > index) { new_files[num - 1] = file; new_names[num - 1] = lesson_guide_names.value[i] }
    })
    lesson_guide_files.value = new_files
    lesson_guide_names.value = new_names
}

const handle_submit = async () => {
    submitting.value = true
    try {
        const submit_data = new FormData()
        Object.keys(form_data.value).forEach(key => {
            if (key !== '_id' && key !== 'curriculum' && key !== 'dates' && form_data.value[key] !== '') {
                submit_data.append(key, form_data.value[key])
            }
        })
        if (form_data.value.curriculum.length > 0) {
            submit_data.append('curriculum', JSON.stringify(form_data.value.curriculum))
        }
        if (form_data.value.dates.length > 0) {
            submit_data.append('dates', JSON.stringify(form_data.value.dates))
        }
        if (image_file.value) {
            submit_data.append('cover_image', image_file.value)
        }
        if (guide_file.value) {
            submit_data.append('guide_file', guide_file.value)
        }
        // PDFs por módulo
        Object.entries(lesson_guide_files.value).forEach(([index, file]) => {
            submit_data.append(`lesson_guide_${index}`, file)
        })
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
                                <option value="formation">Formación</option>
                                <option value="formation_presencial">Formación Presencial</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Precio ($) *</label>
                            <input v-model.number="form_data.price" type="number" min="0" step="0.01" required
                                class="form-input" placeholder="0.00" />
                        </div>
                    </div>

                    <!-- Precio de pre-venta (siempre visible) -->
                    <div class="form-group">
                        <label class="form-label">Precio de pre-venta (€)</label>
                        <input v-model.number="form_data.presale_price" type="number" min="0" step="0.01"
                            class="form-input" placeholder="Dejar vacío si no aplica" />
                        <span class="form-hint">Si el producto está en pre-venta, se cobrará este precio en lugar del precio normal.</span>
                    </div>

                    <!-- Descripción -->
                    <div class="form-group">
                        <label class="form-label">Descripción *</label>
                        <EditorComponent v-model="form_data.description" :key="`desc-${props.product?._id ?? 'new'}`" />
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

                    <!-- Fechas con precio propio (solo formaciones) -->
                    <div v-if="form_data.type === 'formation' || form_data.type === 'formation_presencial'" class="form-group">
                        <label class="form-label">Fechas de formación</label>
                        <div class="dates-editor">
                            <div v-for="(item, index) in form_data.dates" :key="index" class="date-item">
                                <span class="date-item__num">{{ index + 1 }}</span>
                                <input v-model="item.date" type="datetime-local" class="date-item__date" required />
                                <input v-model.number="item.price" type="number" min="0" step="0.01"
                                    class="date-item__price" placeholder="Precio €" required />
                                <button type="button" class="date-item__remove" @click="remove_date(index)">✕</button>
                            </div>
                            <button type="button" class="btn-add-date" @click="add_date">
                                ➕ Añadir fecha
                            </button>
                        </div>
                        <span class="form-hint">Cada fecha puede tener su propio precio. Los usuarios elegirán al hacer el pedido.</span>
                    </div>

                    <!-- PDF descargable (ebook / bundle) -->
                    <div v-if="form_data.type === 'ebook' || form_data.type === 'bundle'" class="form-group">
                        <label class="form-label">Archivo PDF descargable</label>
                        <input type="file" ref="guide_input" accept="application/pdf"
                            @change="handle_guide_upload" class="image-input" />
                        <div v-if="guide_filename" class="guide-current">
                            <span>📄 {{ guide_filename }}</span>
                            <button type="button" class="btn-remove-image" @click="remove_guide">✕</button>
                        </div>
                        <button v-else type="button" class="btn-upload-guide" @click="guide_input?.click()">
                            📤 Seleccionar PDF
                        </button>
                        <span v-if="form_data.download_url && !guide_file" class="form-hint" style="color:var(--color-success)">
                            ✅ Ya tiene PDF subido. Selecciona uno nuevo solo si quieres reemplazarlo.
                        </span>
                        <span v-else class="form-hint">El PDF se sube de forma segura. Los usuarios lo descargan a través de tu servidor.</span>
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
                                <div class="lesson-editor-label">Descripción del módulo (opcional)</div>
                                <EditorComponent v-model="lesson.notes" :key="`notes-${props.product?._id ?? 'new'}-${index}`" />
                                <!-- PDF del módulo -->
                                <div class="lesson-pdf-section">
                                    <span class="lesson-pdf-label">PDF descargable del módulo (opcional)</span>
                                    <div v-if="lesson_guide_names[index]" class="lesson-pdf-current">
                                        <span>📄 {{ lesson_guide_names[index] }}</span>
                                        <button type="button" class="lesson-pdf-remove" @click="remove_lesson_guide(index)">✕</button>
                                    </div>
                                    <div v-else-if="lesson.lesson_pdf_url" class="lesson-pdf-existing">
                                        <span>✅ PDF subido</span>
                                        <input type="file" :id="`lesson_guide_${index}`" accept="application/pdf"
                                            style="display:none"
                                            @change="handle_lesson_guide(index, $event)" />
                                        <label :for="`lesson_guide_${index}`" class="lesson-pdf-replace">Reemplazar</label>
                                    </div>
                                    <div v-else>
                                        <input type="file" :id="`lesson_guide_${index}`" accept="application/pdf"
                                            style="display:none"
                                            @change="handle_lesson_guide(index, $event)" />
                                        <label :for="`lesson_guide_${index}`" class="lesson-pdf-upload">
                                            📤 Subir PDF
                                        </label>
                                    </div>
                                </div>
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

// GUIDE UPLOAD
.guide-current {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-3;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: $radius-md;
    padding: $space-2 $space-4;
    font-size: $text-sm;
}

.btn-upload-guide {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-5;
    background: var(--color-bg);
    border: 1px dashed var(--color-border);
    border-radius: $radius-md;
    font-size: $text-sm;
    cursor: pointer;
    color: var(--color-text-muted);
    transition: $transition-fast;

    &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }
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

.lesson-editor-label {
    font-size: 12px;
    font-weight: $fw-semibold;
    color: var(--color-text-muted);
    margin-bottom: $space-1;
}

.lesson-pdf-section {
    margin: $space-3 0;
}

.lesson-pdf-label {
    display: block;
    font-size: 12px;
    font-weight: $fw-semibold;
    color: var(--color-text-muted);
    margin-bottom: $space-1;
}

.lesson-pdf-current, .lesson-pdf-existing {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: 12px;
    color: var(--color-success);
}

.lesson-pdf-remove {
    background: none;
    border: none;
    color: var(--color-error);
    cursor: pointer;
    font-size: 12px;
    padding: 0 $space-1;
}

.lesson-pdf-upload, .lesson-pdf-replace {
    display: inline-block;
    padding: $space-1 $space-3;
    border: 1px dashed var(--color-border);
    border-radius: $radius-xs;
    font-size: 12px;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: $transition-fast;

    &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }
}

.lesson-pdf-replace {
    border-style: solid;
    font-size: 11px;
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

// DATES EDITOR
.dates-editor {
    display: flex;
    flex-direction: column;
    gap: $space-3;
}

.date-item {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-3;
    border: 1px solid var(--color-border);
    border-radius: $radius-md;
    background: var(--color-bg);

    &__num {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: var(--color-primary);
        color: var(--color-white);
        border-radius: 50%;
        font-size: $text-xs;
        font-weight: $fw-bold;
        flex-shrink: 0;
    }

    &__date {
        flex: 2;
        padding: $space-2 $space-3;
        border: 1px solid var(--color-border);
        border-radius: $radius-xs;
        font-size: $text-sm;
        font-family: inherit;
        box-sizing: border-box;

        &:focus {
            outline: none;
            border-color: var(--color-primary);
        }
    }

    &__price {
        flex: 1;
        padding: $space-2 $space-3;
        border: 1px solid var(--color-border);
        border-radius: $radius-xs;
        font-size: $text-sm;
        font-family: inherit;
        box-sizing: border-box;

        &:focus {
            outline: none;
            border-color: var(--color-primary);
        }
    }

    &__remove {
        width: 28px;
        height: 28px;
        border: none;
        background: var(--color-error);
        color: var(--color-white);
        border-radius: 50%;
        font-size: $text-sm;
        cursor: pointer;
        flex-shrink: 0;
        transition: opacity $transition;

        &:hover {
            opacity: 0.8;
        }
    }
}

.btn-add-date {
    padding: $space-2 $space-5;
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
