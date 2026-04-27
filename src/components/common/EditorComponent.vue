<script setup>
import Editor from '@tinymce/tinymce-vue'
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const editor_ref = ref(null)

// Padre → Editor: solo cuando el padre cambia el contenido externamente
// (ej. el usuario hace clic en "Editar" otro post/producto mientras el editor ya está montado)
// NO se activa durante la escritura normal porque editor.getContent() === val en ese caso
watch(() => props.modelValue, (val) => {
    if (!editor_ref.value) return
    if (editor_ref.value.getContent() !== val) {
        editor_ref.value.setContent(val || '')
    }
})
</script>

<template>
    <div class="editor-wrapper">
        <Editor
            :initial-value="props.modelValue"
            api-key="hgq60faxr9cutw0vi6tjcs6h4w4bwlbyhp5hp71rteepokoy"
            :init="{
                toolbar_mode: 'sliding',
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                setup: (editor) => {
                    editor.on('init', () => {
                        editor_ref.value = editor
                        // Red de seguridad: si modelValue llegó después de que el editor montara
                        const content = props.modelValue || ''
                        if (content && editor.getContent() !== content) {
                            editor.setContent(content)
                        }
                    })
                    // Editor → Padre: solo eventos de usuario, setContent() NO dispara estos eventos
                    editor.on('change input', () => {
                        emit('update:modelValue', editor.getContent())
                    })
                }
            }"
        />
    </div>
</template>

<style scoped lang="scss">
</style>
