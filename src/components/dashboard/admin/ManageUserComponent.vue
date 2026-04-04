<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAdminStore } from '../../../stores/admin-store'
import { useUtilStore } from '../../../stores/util-store.js'
import { RouterLink } from 'vue-router'

const admin_store = useAdminStore()
const util_store = useUtilStore()
const text_filter = ref('')
const selected_user_id = ref(null)
const user_to_delete = ref(null) // { _id, name }

const confirm_delete = (user) => {
    user_to_delete.value = user
}

const handle_delete = async () => {
    const ok = await admin_store.delete_user(user_to_delete.value._id)
    if (ok) {
        if (selected_user_id.value === user_to_delete.value._id) {
            selected_user_id.value = null
        }
    }
    user_to_delete.value = null
}

const users_to_show = computed(() => {
    const f = text_filter.value.toLowerCase()
    return admin_store.users.filter(user => (user.name || '').toLowerCase().includes(f))
})

onMounted(async () => {
    util_store.set_loading(true)
    await admin_store.get_all_users()
    util_store.set_loading(false)
})

watch(text_filter, () => { selected_user_id.value = null })

const toggle_user = (id) => {
    selected_user_id.value = selected_user_id.value === id ? null : id
}
</script>

<template>
    <section class="manage-users">
        <h2>Buscar usuarios</h2>
        <input type="text" placeholder="Escribe el nombre de un usuario" v-model="text_filter" class="search-input" />

        <ul v-if="users_to_show.length > 0" class="users-list">
            <li class="users-list__header">
                <span>Nombre</span>
                <span>Rol</span>
                <span>HC</span>
                <span></span>
            </li>
            <li v-for="user in users_to_show" :key="user._id" class="user-item">
                <button class="user-row" @click="toggle_user(user._id)"
                    :class="{ 'user-row--open': selected_user_id === user._id }">
                    <span class="user-name">{{ user.name }}</span>
                    <span class="badge">{{ user.role }}</span>
                    <span class="hc">{{ user.medical_record || '—' }}</span>
                    <span class="chevron" :class="{ 'chevron--open': selected_user_id === user._id }">›</span>
                </button>
                <div v-if="selected_user_id === user._id" class="user-actions">
                    <RouterLink :to="`/mi-espacio/user/${user._id}`" class="action-btn">Ver usuario</RouterLink>
                    <button @click="admin_store.role_to_patient(user._id)" class="nobg-btn">Convertir a paciente</button>
                    <button @click="admin_store.active_anamnesis_kids(user._id)" class="nobg-btn"
                        :class="{ active: user.anamnesis_kids }">Activar anamnesis</button>
                    <button @click="confirm_delete(user)" class="nobg-btn danger-btn">Eliminar cuenta</button>
                </div>
            </li>
        </ul>

        <p v-else class="empty-msg">No se encontraron usuarios.</p>
    </section>

    <!-- Modal confirmación eliminar usuario -->
    <Teleport to="body">
        <div v-if="user_to_delete" class="delete-modal-overlay" @click.self="user_to_delete = null">
            <div class="delete-modal">
                <h2>¿Eliminar cuenta de usuario?</h2>
                <p class="delete-modal__warning">
                    Vas a eliminar la cuenta de <strong>{{ user_to_delete.name }}</strong>.
                    Esta acción es <strong>permanente e irreversible</strong>.
                </p>
                <p class="delete-modal__detail">
                    Se eliminarán todos sus datos: compras, historial clínico, tareas terapéuticas,
                    progreso en cursos y likes. No se puede deshacer.
                </p>
                <div class="delete-modal__actions">
                    <button class="btn-cancel" @click="user_to_delete = null">Cancelar</button>
                    <button class="btn-confirm-delete" @click="handle_delete">
                        He leído — quiero eliminar esta cuenta
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped lang="scss">
.manage-users {
    display: flex;
    flex-direction: column;
    gap: $space-4;

    h2 { margin: 0; }
}

.search-input {
    width: 100%;
    max-width: 100%;
}

.empty-msg {
    color: var(--color-text-muted);
    font-size: $text-sm;
    margin: 0;
}

/* ── List (todos los tamaños) ── */
.users-list {
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid var(--color-border);
    border-radius: $radius-md;
    overflow: hidden;

    &__header {
        display: grid;
        grid-template-columns: 1fr 120px 120px 32px;
        padding: $space-2 $space-4;
        background: var(--color-disable);
        font-size: $text-xs;
        font-weight: $fw-semibold;
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.04em;

        @media (max-width: $bp-md) {
            grid-template-columns: 1fr auto auto 24px;
            font-size: 0.6rem;
        }
    }
}

.user-item {
    border-bottom: 1px solid var(--color-border);

    &:last-child { border-bottom: none; }
}

.user-row {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 120px 120px 32px;
    align-items: center;
    padding: $space-3 $space-4;
    background: var(--color-bg-card);
    border: none;
    cursor: pointer;
    text-align: left;
    transition: $transition-fast;

    &:hover, &--open {
        background: var(--overlay-primary-06);
    }

    @media (max-width: $bp-md) {
        grid-template-columns: 1fr auto auto 24px;
        padding: $space-3;
    }
}

.user-name {
    font-weight: $fw-medium;
    font-size: $text-sm;
    font-family: $font-body;
    color: var(--color-text);
}

.badge {
    font-size: $text-xs;
    color: var(--color-text-muted);
    font-family: $font-body;
}

.hc {
    font-size: $text-xs;
    color: var(--color-primary);
    font-family: $font-body;
    font-weight: $fw-medium;
}

.chevron {
    font-size: $text-xl;
    color: var(--color-text-muted);
    transition: transform 0.2s ease;
    line-height: 1;
    text-align: right;

    &--open { transform: rotate(90deg); }
}

.user-actions {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
    padding: $space-3 $space-4;
    background: var(--color-bg);
    border-top: 1px solid var(--color-border-light);

    .action-btn {
        width: auto;
        max-width: fit-content;
    }

    .active {
        background-color: var(--color-primary);
        color: var(--color-white);
    }

    .danger-btn {
        color: #dc2626;
        margin-left: auto;

        &:hover {
            background: rgba(220, 38, 38, 0.08);
            border-color: #dc2626;
        }
    }

    @media (max-width: $bp-md) {
        flex-direction: column;

        .action-btn, .nobg-btn {
            width: 100%;
            max-width: 100%;
            text-align: center;
        }
    }
}

// Modal
.delete-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $space-4;
}

.delete-modal {
    background: var(--color-bg-card);
    border-radius: $radius-lg;
    padding: $space-10;
    max-width: 480px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);

    h2 {
        font-size: $text-xl;
        margin: 0 0 $space-4;
        color: #dc2626;
    }

    &__warning {
        font-size: $text-base;
        margin: 0 0 $space-3;
    }

    &__detail {
        font-size: $text-sm;
        color: var(--color-text-muted);
        margin: 0 0 $space-8;
        line-height: 1.6;
    }

    &__actions {
        display: flex;
        gap: $space-3;
        flex-wrap: wrap;

        @media (max-width: $bp-sm) { flex-direction: column-reverse; }
    }
}

.btn-cancel {
    flex: 1;
    padding: $space-3 $space-6;
    border: 1px solid var(--color-border);
    border-radius: $radius-sm;
    background: none;
    font-family: $font-body;
    font-size: $text-sm;
    cursor: pointer;
    color: var(--color-text-muted);
    transition: $transition-fast;

    &:hover { background: var(--color-bg); }
}

.btn-confirm-delete {
    flex: 2;
    padding: $space-3 $space-6;
    border: none;
    border-radius: $radius-sm;
    background: #dc2626;
    color: #fff;
    font-family: $font-body;
    font-size: $text-sm;
    font-weight: $fw-semibold;
    cursor: pointer;
    transition: $transition-fast;

    &:hover { background: #b91c1c; }
}
</style>
