<script setup>
import Editor from '@tinymce/tinymce-vue'
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])

const editor_ref = ref(null)

const handle_change = (content) => {
    emit('update:modelValue', content)
}

// Cuando el modelValue cambia desde fuera (ej: cargar post para editar),
// actualizamos el contenido del editor si ya está inicializado
watch(() => props.modelValue, (new_val) => {
    if (editor_ref.value && new_val !== editor_ref.value.getContent()) {
        editor_ref.value.setContent(new_val || '')
    }
})
</script>

<template>
    <div class="editor-wrapper">
        <Editor
            :value="props.modelValue"
            @input="handle_change"
            api-key="hgq60faxr9cutw0vi6tjcs6h4w4bwlbyhp5hp71rteepokoy"
            :init="{
                toolbar_mode: 'sliding',
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                setup: (editor) => {
                    editor.on('init', () => {
                        editor_ref.value = editor
                        // Carga el contenido existente al inicializar
                        if (props.modelValue) {
                            editor.setContent(props.modelValue)
                        }
                    })
                    editor.on('change keyup', () => {
                        handle_change(editor.getContent())
                    })
                }
            }"
        />
    </div>
</template>

<style scoped lang="scss">
</style>
