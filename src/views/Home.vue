<template>
    <main class="home__page">
        <HeroComponent />
        <ServicesComponent />
        <AboutBandComponent />
        <FormationComponent />
        <TestComponent />
        <PostComponent />
        <CtaBandComponent />
    </main>
</template>

<script setup>
import { useCommonStore } from '../stores/common-store'
import { onBeforeMount } from 'vue'

import HeroComponent from '../components/home/HeroComponent.vue'
import ServicesComponent from '../components/home/ServicesComponent.vue'
import AboutBandComponent from '../components/home/AboutBandComponent.vue'
import FormationComponent from '../components/home/FormationComponent.vue'
import TestComponent from '../components/home/TestComponent.vue'
import PostComponent from '../components/home/PostComponent.vue'
import CtaBandComponent from '../components/home/CtaBandComponent.vue'

const common_store = useCommonStore()

onBeforeMount(() => {
    common_store.get_common()
})
</script>

<style scoped lang="scss">
.home__page {
    width: 100%;
    min-height: 100vh;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    box-sizing: border-box;
}
</style>
