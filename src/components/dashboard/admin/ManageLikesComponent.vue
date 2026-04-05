<script setup>
import { ref, onMounted } from 'vue'
import { useLikeStore } from '../../../stores/like-store.js'

const like_store = useLikeStore()

const loading = ref(false)
const likes_by_item = ref([])
const leads = ref([])

const type_label = {
    Post: 'Blog',
    Test: 'Test',
    Product: 'Producto',
    Video: 'Vídeo',
    Formation: 'Formación',
}

onMounted(async () => {
    loading.value = true
    try {
        const data = await like_store.fetch_admin_summary()
        likes_by_item.value = data.likes_by_item || []
        leads.value = data.leads || []
    } finally {
        loading.value = false
    }
})

const waitlist_leads = ref(false)
</script>

<template>
    <div class="manage-likes">
        <div v-if="loading" class="manage-likes__loading">Cargando...</div>

        <template v-else>
            <!-- Likes por contenido -->
            <section class="manage-likes__section">
                <h3>Likes por contenido</h3>
                <div v-if="likes_by_item.length === 0" class="manage-likes__empty">Sin likes aún.</div>
                <div v-else class="likes-table">
                    <div class="likes-table__header">
                        <span>Tipo</span>
                        <span>ID / Contenido</span>
                        <span class="likes-table__count">Likes</span>
                    </div>
                    <div v-for="item in likes_by_item" :key="`${item._id.item_type}-${item._id.item_id}`" class="likes-table__row">
                        <span class="likes-table__badge">{{ type_label[item._id.item_type] || item._id.item_type }}</span>
                        <span class="likes-table__id">
                            <span v-if="item.item_title" class="likes-table__title">{{ item.item_title }}</span>
                            <span class="likes-table__raw-id">{{ item._id.item_id }}</span>
                        </span>
                        <span class="likes-table__count likes-table__count--val">♥ {{ item.count }}</span>
                    </div>
                </div>
            </section>

            <!-- Leads (emails capturados) -->
            <section class="manage-likes__section">
                <div class="manage-likes__section-head">
                    <h3>Leads capturados ({{ leads.length }})</h3>
                    <button class="nobg-btn" @click="waitlist_leads = !waitlist_leads">
                        {{ waitlist_leads ? 'Ver todos' : 'Solo waitlist' }}
                    </button>
                </div>
                <div v-if="leads.length === 0" class="manage-likes__empty">Sin leads aún.</div>
                <div v-else class="leads-list">
                    <template v-for="lead in leads" :key="lead._id">
                        <div v-if="!waitlist_leads || lead.waitlist_products?.length > 0" class="lead-row">
                            <span class="lead-row__email">{{ lead.email }}</span>
                            <span class="lead-row__source badge" :class="`badge--${lead.source}`">{{ lead.source }}</span>
                            <span v-if="lead.converted" class="lead-row__converted">✓ registrado</span>
                            <span v-if="lead.waitlist_products?.length" class="lead-row__waitlist">
                                📋 {{ lead.waitlist_products.join(', ') }}
                            </span>
                            <span class="lead-row__date">{{ new Date(lead.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) }}</span>
                        </div>
                    </template>
                </div>
            </section>
        </template>
    </div>
</template>

<style scoped lang="scss">
.manage-likes {
    &__loading {
        padding: $space-8;
        text-align: center;
        color: var(--color-text-muted);
    }

    &__empty {
        padding: $space-6;
        text-align: center;
        color: var(--color-text-muted);
        background: var(--color-bg);
        border-radius: $radius-md;
    }

    &__section {
        margin-bottom: $space-10;

        h3 {
            font-size: $text-lg;
            font-weight: $fw-semibold;
            color: var(--color-text-heading);
            margin: 0 0 $space-4;
        }
    }

    &__section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: $space-4;

        h3 { margin: 0; }
    }
}

.likes-table {
    display: flex;
    flex-direction: column;
    gap: $space-1;

    &__header {
        display: grid;
        grid-template-columns: 90px 1fr 80px;
        gap: $space-4;
        padding: $space-2 $space-4;
        font-size: $text-xs;
        font-weight: $fw-semibold;
        color: var(--color-text-muted);
        text-transform: uppercase;
    }

    &__row {
        display: grid;
        grid-template-columns: 90px 1fr 80px;
        align-items: center;
        gap: $space-4;
        padding: $space-3 $space-4;
        background: var(--color-bg);
        border-radius: $radius-md;
        font-size: $text-sm;
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

    &__id {
        display: flex;
        flex-direction: column;
        gap: 2px;
        overflow: hidden;
    }

    &__title {
        font-size: $text-sm;
        font-weight: $fw-medium;
        color: var(--color-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__raw-id {
        font-size: $text-xs;
        color: var(--color-text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__count {
        text-align: right;
        font-size: $text-xs;
        color: var(--color-text-muted);

        &--val {
            font-weight: $fw-bold;
            color: #e05a6e;
            font-size: $text-sm;
        }
    }
}

.leads-list {
    display: flex;
    flex-direction: column;
    gap: $space-2;
}

.lead-row {
    display: flex;
    align-items: center;
    gap: $space-3;
    flex-wrap: wrap;
    padding: $space-3 $space-4;
    background: var(--color-bg);
    border-radius: $radius-md;
    font-size: $text-sm;

    &__email {
        font-weight: $fw-medium;
        flex: 1;
        min-width: 160px;
    }

    &__source {
        font-size: $text-xs;

        &.badge--like { background: rgba(224, 90, 110, 0.12); color: #e05a6e; }
        &.badge--waitlist { background: rgba(124, 111, 255, 0.12); color: #7c6fff; }
    }

    &__converted {
        font-size: $text-xs;
        color: var(--color-success);
        font-weight: $fw-semibold;
    }

    &__waitlist {
        font-size: $text-xs;
        color: var(--color-text-muted);
    }

    &__date {
        font-size: $text-xs;
        color: var(--color-text-muted);
        margin-left: auto;
        white-space: nowrap;
    }
}
</style>
