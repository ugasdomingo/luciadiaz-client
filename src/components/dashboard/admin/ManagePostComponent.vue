<script setup>
import { ref, onBeforeMount } from 'vue'
import { usePostStore } from '../../../stores/post-store.js'
import EditorComponent from '../../common/EditorComponent.vue'
import { useAuthStore } from '../../../stores/auth-store.js'

const auth_store = useAuthStore()
const post_store = usePostStore()

const show_create_post = ref(false)
const post_to_update = ref(null)

const toggle_create_post = () => {
    show_create_post.value = !show_create_post.value
}

const toggle_update_post = () => {
    if (post_store.posts.length === 0) {
        post_store.get_all_posts()
    }
}

// Formdata
const title = ref('')
const slug = ref('')
const content = ref('')
const category = ref('')
const tags = ref('')
const post_cover = ref()
const status = ref('draft')

const handle_submit = async () => {
    const form_data = new FormData()
    form_data.append('title', title.value)
    form_data.append('slug', slug.value)
    form_data.append('content', content.value)
    form_data.append('category', category.value)
    form_data.append('tags', tags.value)
    form_data.append('post_cover', post_cover.value)
    form_data.append('status', status.value)

    await post_store.create_post(form_data)

    title.value = ''
    slug.value = ''
    content.value = ''
    category.value = ''
    tags.value = ''
    status.value = 'draft'
    post_cover.value = null
}

const handle_file_change = (event) => {
    const file = event.target.files[0]
    if (file) post_cover.value = file
}

const prepare_post_to_update = (post) => {
    post_to_update.value = post
    show_create_post.value = true
    title.value = post.title
    slug.value = post.slug
    content.value = post.content
    category.value = post.category
    tags.value = post.tags
    status.value = post.status || 'draft'
}

const handle_update = async () => {
    const form_data = new FormData()
    form_data.append('title', title.value)
    form_data.append('slug', slug.value)
    form_data.append('content', content.value)
    form_data.append('category', category.value)
    form_data.append('tags', tags.value)
    form_data.append('status', status.value)
    if (post_cover.value instanceof File) {
        form_data.append('post_cover', post_cover.value)
    }

    await post_store.update_post(post_to_update.value._id, form_data)

    title.value = ''
    slug.value = ''
    content.value = ''
    category.value = ''
    tags.value = ''
    status.value = 'draft'
    post_cover.value = null
    post_to_update.value = null
    show_create_post.value = false
}

const cancel_edit = () => {
    post_to_update.value = null
    show_create_post.value = false
    title.value = ''
    slug.value = ''
    content.value = ''
    category.value = ''
    tags.value = ''
    status.value = 'draft'
    post_cover.value = null
}

const get_cover = (post) => {
    if (!post.post_cover) return null
    if (typeof post.post_cover === 'string') return post.post_cover
    return post.post_cover?.secure_url || null
}

const status_label = { draft: 'Borrador', published: 'Publicado' }

onBeforeMount(() => {
    if (post_store.posts.length === 0) post_store.get_all_posts()
})
</script>

<template>
    <section class="manage-posts">

        <!-- Crear Post -->
        <h2 @click="toggle_create_post" class="section-toggle">
            Crear Post <span>{{ show_create_post && !post_to_update ? '−' : '+' }}</span>
        </h2>

        <form @submit.prevent="post_to_update ? handle_update() : handle_submit()"
            v-if="show_create_post" class="post-form">
            <input type="text" placeholder="Título" v-model="title" required>
            <input type="text" placeholder="Slug" v-model="slug" required>
            <EditorComponent v-model="content" />
            <input type="text" placeholder="Categoría" v-model="category" required>
            <input type="text" placeholder="Tags" v-model="tags" required>
            <input type="file" accept="image/*" @change="handle_file_change">
            <select v-model="status">
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
            </select>
            <div class="post-form__actions">
                <button type="submit" class="action-btn">
                    {{ post_to_update ? 'Guardar cambios' : 'Crear Post' }}
                </button>
                <button v-if="post_to_update" type="button" class="nobg-btn" @click="cancel_edit">
                    Cancelar
                </button>
            </div>
        </form>

        <!-- Lista de Posts -->
        <h2 @click="toggle_update_post" class="section-toggle">
            Posts <span>{{ post_store.posts.length }}</span>
        </h2>

        <ul v-if="post_store.posts.length > 0" class="posts-list">
            <li v-for="post in post_store.posts" :key="post._id" class="post-row">
                <div class="post-row__thumb">
                    <img v-if="get_cover(post)" :src="get_cover(post)" :alt="post.title">
                    <div v-else class="post-row__thumb--empty">✍</div>
                </div>
                <div class="post-row__info">
                    <span class="post-row__title">{{ post.title }}</span>
                    <span class="post-row__meta">
                        {{ post.category }} ·
                        <span :class="`status-dot status-dot--${post.status}`">
                            {{ status_label[post.status] || post.status }}
                        </span>
                    </span>
                </div>
                <div v-if="auth_store.user_data.user.role === 'Admin'" class="post-row__actions">
                    <button @click="post_store.update_post(post._id, { status: 'published' })"
                        class="action-btn">Publicar</button>
                    <button @click="prepare_post_to_update(post)" class="nobg-btn">Editar</button>
                    <button @click="post_store.delete_post(post._id)" class="nobg-btn nobg-btn--danger">Eliminar</button>
                </div>
            </li>
        </ul>

        <p v-else class="empty-msg">No hay posts aún.</p>

    </section>
</template>

<style scoped lang="scss">
.manage-posts {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.section-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    padding: $space-5 $space-2;
    cursor: pointer;
    transition: color $transition-fast;

    &:hover { color: var(--color-primary); }

    span {
        font-size: $text-xl;
        font-weight: $fw-regular;
        color: var(--color-text-muted);
    }
}

.post-form {
    display: flex;
    flex-direction: column;
    gap: $space-4;
    padding: $space-4 0 $space-6;

    input, select { max-width: 100%; }

    &__actions {
        display: flex;
        gap: $space-3;
        flex-wrap: wrap;

        .action-btn { width: auto; max-width: fit-content; }
    }
}

/* ── Posts list ── */
.posts-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--color-border);
    border-radius: $radius-md;
    overflow: hidden;
}

.post-row {
    display: flex;
    align-items: center;
    gap: $space-4;
    padding: $space-3 $space-4;
    border-bottom: 1px solid var(--color-border);
    transition: background $transition-fast;

    &:last-child { border-bottom: none; }
    &:hover { background: var(--overlay-primary-06); }

    &__thumb {
        width: 52px;
        height: 52px;
        border-radius: $radius-sm;
        overflow: hidden;
        flex-shrink: 0;
        background: var(--color-border-light);
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        &--empty {
            font-size: $text-xl;
            color: var(--color-text-muted);
        }
    }

    &__info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: $space-1;
    }

    &__title {
        font-size: $text-sm;
        font-weight: $fw-semibold;
        color: var(--color-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__meta {
        font-size: $text-xs;
        color: var(--color-text-muted);
    }

    &__actions {
        display: flex;
        gap: $space-2;
        flex-shrink: 0;
        flex-wrap: wrap;

        .action-btn, .nobg-btn {
            width: auto;
            max-width: fit-content;
        }

        @media (max-width: $bp-md) {
            flex-direction: column;
            gap: $space-1;

            .action-btn, .nobg-btn {
                width: 100%;
                max-width: 100%;
                text-align: center;
            }
        }
    }
}

.status-dot {
    &--published { color: var(--color-success); }
    &--draft     { color: var(--color-text-muted); }
}

.nobg-btn--danger {
    border-color: var(--color-error);
    color: var(--color-error);

    &:hover {
        background-color: var(--color-error);
        color: var(--color-white);
    }
}

.empty-msg {
    color: var(--color-text-muted);
    font-size: $text-sm;
    padding: $space-4 $space-2;
    margin: 0;
}
</style>
