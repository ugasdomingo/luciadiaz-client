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
        <div class="section-header">
            <h2 class="section-header__title">Mis Likes</h2>
            <p class="section-header__sub">Contenido que has guardado como favorito.</p>
        </div>

        <div v-if="likes.length === 0" class="dash-empty">
            <div class="dash-empty__icon">♥</div>
            <h3 class="dash-empty__title">Aún no tienes favoritos</h3>
            <p class="dash-empty__desc">Dale like a posts, tests o productos para encontrarlos aquí rápidamente.</p>
        </div>

        <div v-else class="likes-list">
            <RouterLink v-for="like in likes" :key="like._id" :to="get_link(like)" class="like-row">
                <span class="like-row__badge" :data-type="like.item_type">
                    {{ type_label[like.item_type] || like.item_type }}
                </span>
                <span class="like-row__name">{{ like.item_title || like.item_id }}</span>
                <span class="like-row__date">
                    {{ new Date(like.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                </span>
                <span class="like-row__heart">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#e05a6e" stroke="#e05a6e" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                </span>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped lang="scss">
.user-likes { padding: 0; }

/* Header */
.section-header {
    margin-bottom: 36px;

    &__title {
        font-family: var(--font-title);
        font-size: clamp(26px, 4vw, 36px);
        font-weight: 700;
        color: var(--blue-ink);
        margin: 0 0 8px;
        position: relative;
        display: inline-block;

        &::after {
            content: '';
            position: absolute;
            bottom: -6px; left: 0;
            width: 48px; height: 3px;
            background: var(--gold-grad);
            border-radius: $radius-full;
        }
    }

    &__sub {
        font-size: 14px;
        color: var(--color-text-muted);
        margin: 16px 0 0;
    }
}

/* Empty */
.dash-empty {
    background: white;
    border-radius: var(--r-xl);
    padding: 64px 32px;
    text-align: center;
    border: 1.5px solid var(--border);
    box-shadow: var(--shadow-sm-new);

    &__icon {
        font-size: 40px;
        display: block;
        margin-bottom: 16px;
        color: #e05a6e;
    }

    &__title {
        font-family: var(--font-title);
        font-size: 22px;
        color: var(--blue-ink);
        margin: 0 0 10px;
    }

    &__desc {
        font-size: 14px;
        color: var(--color-text-muted);
        margin: 0;
        line-height: 1.7;
        max-width: 380px;
        margin: 0 auto;
    }
}

/* Lista */
.likes-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.like-row {
    display: grid;
    grid-template-columns: 80px 1fr auto auto;
    align-items: center;
    gap: 16px;
    padding: 14px 20px;
    background: white;
    border-radius: var(--r-lg);
    border: 1.5px solid var(--border);
    text-decoration: none;
    color: var(--color-text);
    box-shadow: var(--shadow-xs);
    transition: border-color 0.2s var(--ease), box-shadow 0.2s, transform 0.2s;

    &:hover {
        border-color: rgba(224,90,110,0.3);
        box-shadow: var(--shadow-sm-new);
        transform: translateX(4px);
    }

    &__badge {
        font-size: 11px;
        font-weight: $fw-semibold;
        font-family: var(--font-body);
        padding: 4px 10px;
        border-radius: $radius-full;
        text-align: center;
        white-space: nowrap;
        background: var(--blue-wash);
        color: var(--color-primary);

        &[data-type="Post"]      { background: rgba(99,102,241,.1); color: #6366f1; }
        &[data-type="Test"]      { background: rgba(16,185,129,.1); color: var(--color-success); }
        &[data-type="Product"],
        &[data-type="Formation"] { background: rgba(245,197,24,.1); color: var(--gold-deep); }
        &[data-type="Video"]     { background: rgba(239,68,68,.1);  color: var(--color-error); }
    }

    &__name {
        font-size: 14px;
        font-weight: $fw-medium;
        color: var(--blue-ink);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__date {
        font-size: 12px;
        color: var(--ink-muted);
        white-space: nowrap;
    }

    &__heart {
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }

    @media (max-width: $bp-sm) {
        grid-template-columns: 70px 1fr auto;
        &__date { display: none; }
    }
}
</style>
