<script setup>
import { useCommonStore } from '../../stores/common-store'
import PostCardComponent from '../common/cards/PostCardComponent.vue'
import { use_scroll_reveal } from '../../composables/use-scroll-reveal.js'

use_scroll_reveal()
const common_store = useCommonStore()
</script>

<template>
    <section class="post">
        <div class="post__intro" data-scroll-reveal>
            <h2>Últimas publicaciones</h2>
            <p>Reflexiones y herramientas para entenderte mejor cada día</p>
        </div>
        <div class="post__content">
            <PostCardComponent v-for="(post, index) in common_store.posts" :key="post.id" :post="post"
                data-scroll-reveal :style="{ '--delay': `${0.2 + index * 0.12}s` }" />
        </div>
        <RouterLink to="/blog" class="post__link" data-scroll-reveal>
            Ver todas las publicaciones →
        </RouterLink>
    </section>
</template>


<style scoped lang="scss">
.post {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 6rem 4rem 8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    box-sizing: border-box;

    &__intro {
        text-align: center;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;

        &.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        h2 {
            margin-bottom: 0.75rem;
        }

        p {
            color: var(--color-text-muted);
            font-size: 1.05rem;
            max-width: 400px;
            margin: 0 auto;
        }
    }

    &__content {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        box-sizing: border-box;
    }

    &__link {
        display: inline-block;
        padding: 0.75rem 1.75rem;
        color: var(--color-primary);
        font-family: 'Montserrat', sans-serif;
        font-size: 0.95rem;
        font-weight: 500;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px);

        &.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        &:hover {
            border-color: var(--color-primary);
            box-shadow: var(--shadow-sm);
            transform: translateY(-2px);
        }
    }
}

@media screen and (max-width: 1024px) {
    .post {
        &__content {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media screen and (max-width: 720px) {
    .post {
        padding: 4rem 1.25rem;

        &__content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
    }
}
</style>
