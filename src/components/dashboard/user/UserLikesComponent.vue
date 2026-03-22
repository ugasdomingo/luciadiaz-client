<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../../stores/auth-store.js'

const auth_store = useAuthStore()

const type_label = {
    Post: 'Blog',
    Test: 'Test',
    Product: 'Producto',
    Video: 'Vídeo',
    Formation: 'Formación',
}

const likes = computed(() => {
    const raw = auth_store.user_data?.likes || []
    return [...raw].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const get_link = (like) => {
    const slug = like.item_slug || like.item_id
    if (like.item_type === 'Post') return `/blog/${slug}`
    if (like.item_type === 'Test') return `/tests`
    if (like.item_type === 'Product') return `/productos/${slug}`
    return '/'
}
</script>

<template>
    <div class="user-likes">
        <h2 class="user-likes__title">Mis likes</h2>

        <div v-if="likes.length === 0" class="user-likes__empty">
            <p>Aún no has dado like a ningún contenido.</p>
        </div>

        <div v-else class="user-likes__list">
            <RouterLink
                v-for="like in likes"
                :key="like._id"
                :to="get_link(like)"
                class="like-row"
            >
                <span class="like-row__badge">{{ type_label[like.item_type] || like.item_type }}</span>
                <span class="like-row__name">{{ like.item_title || like.item_id }}</span>
                <span class="like-row__date">{{ new Date(like.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) }}</span>
                <span class="like-row__heart">♥</span>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped lang="scss">
.user-likes {
    &__title {
        font-size: $text-2xl;
        font-weight: $fw-bold;
        color: var(--color-text-heading);
        margin: 0 0 $space-6;
    }

    &__empty {
        padding: $space-10;
        text-align: center;
        color: var(--color-text-muted);
        background: var(--color-bg);
        border-radius: $radius-md;
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: $space-2;
    }
}

.like-row {
    display: grid;
    grid-template-columns: 90px 1fr auto auto;
    align-items: center;
    gap: $space-4;
    padding: $space-3 $space-5;
    background: var(--color-bg);
    border-radius: $radius-md;
    text-decoration: none;
    color: var(--color-text);
    transition: $transition;
    border: 1px solid transparent;

    &:hover {
        border-color: var(--color-border);
        background: var(--color-bg-card);
    }

    &__badge {
        font-size: $text-xs;
        font-weight: $fw-semibold;
        padding: $space-1 $space-2;
        border-radius: $radius-xs;
        background: var(--color-primary);
        color: var(--color-bg-card);
        text-align: center;
    }

    &__name {
        font-size: $text-sm;
        font-weight: $fw-medium;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__date {
        font-size: $text-xs;
        color: var(--color-text-muted);
        white-space: nowrap;
    }

    &__heart {
        color: #e05a6e;
        font-size: $text-base;
    }

    @media (max-width: $bp-sm) {
        grid-template-columns: 80px 1fr auto;

        &__date { display: none; }
    }
}
</style>
