<script setup>
import { ref, onMounted } from 'vue';
import { useUtilStore } from '../../stores/util-store';

const util_store = useUtilStore()
const show_whatsapp_link = ref(false)

onMounted(() => {
    addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            show_whatsapp_link.value = true
        } else if (!util_store.is_home) {
            show_whatsapp_link.value = true
        } else {
            show_whatsapp_link.value = false
        }
    })
})

</script>

<template>
    <footer>
        <p>© {{ new Date().getFullYear() }} Lucia Diaz. Todos los derechos reservados.</p>

        <a class="whatsapp-link" href="https://wa.me/34624721896" target="_blank" v-if="show_whatsapp_link">
            <img src="/icon/icon-whatsapp.svg" alt="whatsapp">
        </a>
    </footer>

</template>

<style scoped lang="scss">
footer {
    width: 100%;
    height: $space-8;
    padding: 0 $space-4;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    .whatsapp-link {
        position: fixed;
        bottom: $space-12;
        right: $space-8;
        width: $space-12;
        height: $space-12;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;

        :hover {
            scale: 1.3;
        }
    }
}
</style>