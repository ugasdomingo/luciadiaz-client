<template>
    <main class="blog-page">
        <div class="blog-page__header">
            <h1>Blog</h1>
            <p class="blog-page__subtitle">Aprende a usar la psicología en tu día a día</p>
        </div>

        <div class="blog-page__grid">
            <PostCardComponent v-for="(post, index) in post_store.posts" :key="post._id" :post="post"
                :style="{ '--delay': index * 0.1 + 's' }" />
        </div>
    </main>
</template>

<script setup>
import PostCardComponent from '../components/common/cards/PostCardComponent.vue'
import { usePostStore } from '../stores/post-store'
import { onBeforeMount } from 'vue'

const post_store = usePostStore()

onBeforeMount(async () => {
    if (post_store.posts.length === 0) {
        await post_store.get_all_posts()
    }
})
</script>

<style scoped lang="scss">
.blog-page {
    width: 100%;
    min-height: 100vh;
    padding: $space-32 $space-16 $space-16;
    margin: 0;
    box-sizing: border-box;

    &__header {
        text-align: center;
        margin-bottom: $space-16;

        h1 {
            margin: 0 0 $space-4;
        }
    }

    &__subtitle {
        font-size: $text-lg;
        color: var(--color-text-dark);
        font-weight: $fw-light;
        margin: 0;
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: $space-10;
        max-width: $max-width;
        margin: 0 auto;
    }
}

@media screen and (max-width: $bp-lg) {
    .blog-page {
        padding: $space-28 $space-8 $space-12;

        &__grid {
            grid-template-columns: repeat(2, 1fr);
            gap: $space-8;
        }
    }
}

@media screen and (max-width: $bp-md) {
    .blog-page {
        padding: $space-24 $space-4 $space-8;

        &__header {
            margin-bottom: $space-12;
        }

        &__subtitle {
            font-size: $text-base;
        }

        &__grid {
            grid-template-columns: 1fr;
            gap: $space-6;
        }
    }
}
</style>