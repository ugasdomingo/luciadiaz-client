<script setup>
import Editor from '@tinymce/tinymce-vue'
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const editor_ref = ref(null)

// v-model interno: se inicializa con el valor actual del padre
const internal_value = ref(props.modelValue)

// Padre → Editor: cuando se carga un post/producto existente
watch(() => props.modelValue, (val) => {
    if (editor_ref.value) {
        // El editor ya está listo: actualizamos directamente
        if (val !== editor_ref.value.getContent()) {
            editor_ref.value.setContent(val || '')
        }
    } else {
        // El editor aún no se inicializó: actualizamos el valor interno
        // para que lo tome al montar
        internal_value.value = val
    }
})

// Editor → Padre
watch(internal_value, (val) => {
    emit('update:modelValue', val)
})
</script>

<template>
    <div class="editor-wrapper">
        <Editor
            v-model="internal_value"
            api-key="hgq60faxr9cutw0vi6tjcs6h4w4bwlbyhp5hp71rteepokoy"
            :init="{
                toolbar_mode: 'sliding',
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                setup: (editor) => {
                    editor.on('init', () => {
                        editor_ref.value = editor
                        // Garantiza que el contenido se cargue aunque v-model llegue tarde
                        const content = props.modelValue || ''
                        if (content && editor.getContent() !== content) {
                            editor.setContent(content)
                        }
                    })
                }
            }"
        />
    </div>
</template>

<style scoped lang="scss">
</style>
