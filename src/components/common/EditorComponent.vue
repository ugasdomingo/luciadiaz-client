<script setup>
  import Editor from '@tinymce/tinymce-vue'

  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const handle_change = (content) => {
    emit('update:modelValue', content)
  }
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
