<template>
    <RouterLink :to="`/blog/${post._id}`" class="post-card">
        <div class="post-card__image-wrapper">
            <img :src="post.post_cover.secure_url" :alt="post.title" class="post-card__image">
        </div>

        <div class="post-card__content">
            <div class="post-card__meta">
                <span class="post-card__category">{{ post.category }}</span>
                <span class="post-card__date">{{ format_date(post.createdAt) }}</span>
            </div>

            <h3 class="post-card__title">{{ post.title }}</h3>

            <p class="post-card__excerpt" v-html="get_excerpt(post.content)"></p>

            <span class="post-card__cta">Leer artículo →</span>
        </div>
    </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
    post: Object
})

const format_date = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('es-ES', options)
}

const get_excerpt = (html) => {
    const temp = document.createElement('div')
    temp.innerHTML = html
    const text = temp.textContent || temp.innerText || ''
    return text.substring(0, 120) + (text.length > 120 ? '...' : '')
}
</script>

<style scoped lang="scss">
.post-card {
    display: flex;
    flex-direction: column;
    background: var(--color-white);
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--color-border-light);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-4px);
        border-color: var(--color-border);
        box-shadow: var(--shadow-sm);

        .post-card__image {
            transform: scale(1.04);
        }

        .post-card__cta {
            color: var(--color-secondary);
        }
    }

    &__image-wrapper {
        position: relative;
        width: 100%;
        height: 220px;
        overflow: hidden;
        background: var(--color-bg);
    }

    &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
    }

    &__content {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        flex: 1;
    }

    &__meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
    }

    &__category {
        padding: 0.2rem 0.625rem;
        background: rgba(30, 86, 160, 0.06);
        color: var(--color-primary);
        border-radius: var(--radius-full);
        font-weight: 500;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.75rem;
        text-transform: capitalize;
        letter-spacing: 0.02em;
    }

    &__date {
        color: var(--color-text-muted);
        font-family: 'Montserrat', sans-serif;
        font-size: 0.75rem;
    }

    &__title {
        margin: 0;
        font-size: 1.15rem;
        line-height: 1.4;
        color: var(--color-text-heading);
        font-family: 'Playfair Display', serif;
        font-weight: 600;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    &__excerpt {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.6;
        color: var(--color-text-muted);
        font-family: 'Montserrat', sans-serif;
        font-weight: 300;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    &__cta {
        margin-top: auto;
        padding-top: 0.5rem;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--color-primary);
        font-family: 'Montserrat', sans-serif;
        transition: color 0.25s ease;
    }
}

@media screen and (max-width: 768px) {
    .post-card {
        &__image-wrapper {
            height: 180px;
        }

        &__content {
            padding: 1.25rem;
        }

        &__title {
            font-size: 1.05rem;
        }

        &__excerpt {
            font-size: 0.85rem;
        }
    }
}
</style>
