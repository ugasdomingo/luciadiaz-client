<script setup>
import { useCommonStore } from '../../stores/common-store'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const common_store = useCommonStore()

const posts = computed(() => common_store.posts?.slice(0, 3) || [])

const get_img = (post) => post.post_cover?.secure_url || ''
const get_date = (post) => {
    if (!post.createdAt) return ''
    return new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}
</script>

<template>
    <section class="blog-preview">
        <div class="container">
            <div class="blog-preview__header">
                <div>
                    <div class="eyebrow">Últimas publicaciones</div>
                    <h2>Lecturas para <em>volver a ti</em>.</h2>
                </div>
                <RouterLink to="/blog" class="btn-ghost">Ver todo el blog →</RouterLink>
            </div>

            <div class="blog-preview__grid">
                <article
                    v-for="(post, i) in posts"
                    :key="post._id"
                    class="blog-card"
                    :class="{ 'blog-card--big': i === 0 }"
                    @click="router.push(`/blog/${post.slug}`)"
                >
                    <div class="blog-card__img-wrap" :class="{ 'blog-card__img-wrap--big': i === 0 }">
                        <img :src="get_img(post)" :alt="post.title" class="blog-card__img" />
                        <div class="blog-card__cat">{{ post.category }}</div>
                    </div>
                    <div class="blog-card__body" :class="{ 'blog-card__body--big': i === 0 }">
                        <h3 class="blog-card__title" :class="{ 'blog-card__title--big': i === 0 }">{{ post.title }}</h3>
                        <div class="blog-card__meta">
                            <span>{{ get_date(post) }}</span>
                            <span>{{ post.read_time || '5 min' }} de lectura</span>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.blog-preview {
    padding: 140px 0;
    background: var(--cream);
}

.container {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 0 28px;
}

.blog-preview__header {
    display: flex; justify-content: space-between;
    align-items: flex-end; margin-bottom: 56px;
    gap: 24px; flex-wrap: wrap;
}

.eyebrow {
    font-family: var(--font-body);
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--blue); margin-bottom: 14px;
}

h2 {
    font-family: var(--font-title);
    font-size: clamp(2rem, 4.2vw, 3.25rem);
    font-weight: 700; color: var(--blue-ink);
    line-height: 1.08; letter-spacing: -0.02em;
    margin: 0;
    em { font-style: italic; color: var(--gold-deep); }
}

.btn-ghost {
    font-family: var(--font-body); font-weight: 600;
    font-size: 14px; color: var(--blue);
    text-decoration: none; white-space: nowrap;
    transition: color .2s var(--ease);
    &:hover { color: var(--gold-deep); }
}

.blog-preview__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: 24px;
}

.blog-card {
    background: var(--white); border-radius: 20px;
    overflow: hidden; border: 1px solid var(--border-soft);
    display: flex; flex-direction: column;
    cursor: pointer;
    transition: transform .35s var(--ease), box-shadow .35s var(--ease), border-color .3s var(--ease);

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 18px 40px rgba(7,30,77,0.10);
        border-color: var(--border-gold);

        .blog-card__img { transform: scale(1.05); }
    }
}

.blog-card__img-wrap {
    position: relative; aspect-ratio: 16/10;
    overflow: hidden; background: var(--blue-wash);

    &--big { aspect-ratio: 16/11; }
}

.blog-card__img {
    width: 100%; height: 100%; object-fit: cover;
    display: block;
    transition: transform .7s var(--ease);
}

.blog-card__cat {
    position: absolute; top: 16px; left: 16px;
    background: var(--white); padding: 6px 12px; border-radius: 999px;
    font-family: var(--font-body);
    font-size: 11px; font-weight: 600; color: var(--blue-ink);
    letter-spacing: 0.04em; text-transform: uppercase;
}

.blog-card__body {
    padding: 24px; display: flex; flex-direction: column; flex: 1;
    &--big { padding: 32px; }
}

.blog-card__title {
    font-family: var(--font-title);
    font-size: 19px; line-height: 1.25;
    margin: 0 0 16px; color: var(--blue-ink); flex: 1; font-weight: 600;
    &--big { font-size: 26px; }
}

.blog-card__meta {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 16px; border-top: 1px solid var(--border-soft);
    font-family: var(--font-body);
    font-size: 12px; color: var(--ink-muted); letter-spacing: 0.04em;
}

@media (max-width: 980px) {
    .blog-preview__grid { grid-template-columns: 1fr; }
}
</style>
