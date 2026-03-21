<script setup>
import { computed } from 'vue'
import { useDateFormatter } from '../../../composables/useDateFormatter.js'
import { useImageFallback } from '../../../composables/useImageFallback.js'
import LikeButtonComponent from '../LikeButtonComponent.vue'

const props = defineProps({
    post: { type: Object, required: true }
})

const { format_date, reading_time } = useDateFormatter()
const { src: cover_src, on_error } = useImageFallback(
    () => props.post.post_cover?.secure_url,
    '/img/placeholder-post.jpg'
)

const category = computed(() => props.post.category || 'Psicología')
const time = computed(() => reading_time(props.post.content))
</script>

<template>
    <RouterLink :to="`/blog/${post._id}`" class="post-card">
        <div class="post-card__image">
            <img :src="cover_src" :alt="post.title" @error="on_error" />
            <span class="post-card__category badge badge--primary">{{ category }}</span>
        </div>
        <div class="post-card__body">
            <h3 class="post-card__title">{{ post.title }}</h3>
            <p class="post-card__excerpt" v-html="post.brief || post.content?.substring(0, 120) + '...'" />
            <div class="post-card__meta">
                <span class="post-card__date">{{ format_date(post.createdAt) }}</span>
                <span class="post-card__read-time">{{ time }} min lectura</span>
                <LikeButtonComponent v-if="post._id" item_type="Post" :item_id="post._id" />
            </div>
        </div>
    </RouterLink>
</template>

<style scoped lang="scss">
.post-card {
    display: flex;
    flex-direction: column;
    background: var(--color-white);
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--color-border-light);
    text-decoration: none;
    color: var(--color-text);
    transition: var(--transition-slow);
    box-sizing: border-box;

    &:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-md);
        border-color: var(--color-border);

        .post-card__image img {
            transform: scale(1.05);
        }
    }

    &__image {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        overflow: hidden;
        background: var(--color-bg);
        flex-shrink: 0;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
    }

    &__category {
        position: absolute;
        top: 0.75rem;
        left: 0.75rem;
        backdrop-filter: blur(4px);
        background: rgba(255, 255, 255, 0.92);
        color: var(--color-primary);
    }

    &__body {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        flex: 1;
    }

    &__title {
        font-family: 'Playfair Display', serif;
        font-size: var(--text-xl);
        font-weight: 700;
        color: var(--color-primary-dark);
        margin: 0;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    &__excerpt {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
        line-height: 1.6;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    &__meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        padding-top: 0.75rem;
        border-top: 1px solid var(--color-border-light);
        font-size: var(--text-xs);
        color: var(--color-text-muted);
        font-family: 'Montserrat', sans-serif;
    }

    &__read-time {
        font-weight: 500;
        color: var(--color-secondary-dark);
    }
}
</style>
