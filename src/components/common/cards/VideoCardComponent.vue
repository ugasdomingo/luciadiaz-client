<script setup>
import { RouterLink } from 'vue-router'

defineProps({
    video: Object
})

const max_length = 150
const truncate = (text, max_length) => {
    return text.substring(0, max_length) + '... seguir leyendo'
}
</script>

<template>
    <RouterLink :to="`/video/${video._id}`" class="video-card">
        <div class="video-card__image">
            <img :src="video.video_cover?.secure_url || '/placeholder-video.jpg'" :alt="video.title">
        </div>
        <div class="video-card__body">
            <h4 class="video-card__title">{{ video.title }}</h4>
            <p class="video-card__brief" v-html="truncate(video.brief, max_length)"></p>
            <span class="video-card__cta">Ver video →</span>
        </div>
    </RouterLink>
</template>

<style scoped lang="scss">
.video-card {
    width: 100%;
    max-width: 300px;
    border-radius: var(--radius-md);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    color: var(--color-text);
    cursor: pointer;
    background: var(--color-white);
    border: 1px solid var(--color-border-light);
    transition: var(--transition-slow);
    text-decoration: none;

    &:hover {
        transform: translateY(-4px);
        border-color: var(--color-border);
        box-shadow: var(--shadow-sm);

        .video-card__image img {
            transform: scale(1.04);
        }

        .video-card__cta {
            color: var(--color-secondary);
        }
    }

    &__image {
        width: 100%;
        aspect-ratio: 16/9;
        overflow: hidden;
        background: var(--color-bg);

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
        }
    }

    &__body {
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
    }

    &__title {
        font-size: var(--text-base);
        margin: 0;
        color: var(--color-primary);
        line-height: 1.35;
        font-family: 'Playfair Display', serif;
    }

    &__brief {
        font-size: var(--text-sm);
        margin: 0;
        color: var(--color-text-muted);
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    &__cta {
        margin-top: 0.5rem;
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--color-primary);
        transition: color 0.25s ease;
    }
}
</style>
