<script setup>
import CourseLanding from './CourseLanding.vue'
import { courses } from '../../static/courses.js'

defineProps({
    formation: { type: Object, required: true }
})
</script>

<template>
    <CourseLanding :course="courses.apego" :formation="formation" />
</template>
