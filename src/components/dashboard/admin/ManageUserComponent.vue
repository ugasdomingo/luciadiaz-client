<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAdminStore } from '../../../stores/admin-store'
import { useUtilStore } from '../../../stores/util-store.js'
import { RouterLink } from 'vue-router'

const admin_store = useAdminStore()
const util_store = useUtilStore()
const users_to_show = ref([])
const text_filter = ref('')
const selected_user_id = ref(null)

onMounted(async () => {
    util_store.set_loading(true)
    await admin_store.get_all_users()
    users_to_show.value = admin_store.users
    util_store.set_loading(false)
})

watch(text_filter, () => {
    const filter = text_filter.value.toLowerCase()
    users_to_show.value = admin_store.users.filter(user =>
        (user.name || '').toLowerCase().includes(filter)
    )
    selected_user_id.value = null
})

const toggle_user = (id) => {
    selected_user_id.value = selected_user_id.value === id ? null : id
}
</script>

<template>
    <section class="manage-users">
        <h2>Buscar usuarios</h2>
        <input type="text" placeholder="Escribe el nombre de un usuario" v-model="text_filter" class="search-input" />

        <!-- Desktop: tabla completa -->
        <table class="users-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Historial Médico</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users_to_show" :key="user._id">
                    <td>{{ user.name }}</td>
                    <td>{{ user.role }}</td>
                    <td>{{ user.medical_record }}</td>
                    <td class="actions-cell">
                        <RouterLink :to="`/mi-espacio/user/${user._id}`" class="action-btn">Ver usuario</RouterLink>
                        <button @click="admin_store.role_to_patient(user._id)" class="nobg-btn">Convertir a paciente</button>
                        <button @click="admin_store.active_anamnesis_kids(user._id)" class="nobg-btn"
                            :class="{ active: user.anamnesis_kids }">Activar anamnesis</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Móvil: lista expandible -->
        <ul class="users-list">
            <li v-for="user in users_to_show" :key="user._id" class="user-item">
                <button class="user-row" @click="toggle_user(user._id)"
                    :class="{ 'user-row--open': selected_user_id === user._id }">
                    <span class="user-name">{{ user.name }}</span>
                    <span class="user-meta">
                        <span class="badge">{{ user.role }}</span>
                        <span class="hc">{{ user.medical_record || '—' }}</span>
                    </span>
                    <span class="chevron" :class="{ 'chevron--open': selected_user_id === user._id }">›</span>
                </button>
                <div v-if="selected_user_id === user._id" class="user-actions">
                    <RouterLink :to="`/mi-espacio/user/${user._id}`" class="action-btn">Ver usuario</RouterLink>
                    <button @click="admin_store.role_to_patient(user._id)" class="nobg-btn">Convertir a paciente</button>
                    <button @click="admin_store.active_anamnesis_kids(user._id)" class="nobg-btn"
                        :class="{ active: user.anamnesis_kids }">Activar anamnesis</button>
                </div>
            </li>
        </ul>
    </section>
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

/* ── Desktop table ── */
.users-table {
    width: 100%;
    border-collapse: collapse;

    th, td {
        padding: $space-2 $space-3;
        text-align: left;
        border-bottom: 1px solid var(--color-border);
    }

    th { background-color: var(--color-disable); }

    .actions-cell {
        display: flex;
        flex-wrap: wrap;
        gap: $space-2;

        .action-btn { max-width: fit-content; }
        .active { background-color: var(--color-primary); color: var(--color-white); }
    }
}

/* ── Mobile list ── */
.users-list { display: none; }

@media (max-width: $bp-md) {
    .users-table { display: none; }

    .users-list {
        display: flex;
        flex-direction: column;
        gap: 0;
        list-style: none;
        padding: 0;
        margin: 0;
        border: 1px solid var(--color-border);
        border-radius: $radius-md;
        overflow: hidden;
    }

    .user-item {
        border-bottom: 1px solid var(--color-border);

        &:last-child { border-bottom: none; }
    }

    .user-row {
        width: 100%;
        display: flex;
        align-items: center;
        gap: $space-3;
        padding: $space-3 $space-4;
        background: var(--color-bg-card);
        border: none;
        cursor: pointer;
        text-align: left;
        transition: $transition-fast;

        &:hover, &--open {
            background: var(--overlay-primary-06);
        }
    }

    .user-name {
        flex: 1;
        font-weight: $fw-medium;
        font-size: $text-sm;
        font-family: $font-body;
        color: var(--color-text);
    }

    .user-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: $space-1;
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

        &--open { transform: rotate(90deg); }
    }

    .user-actions {
        display: flex;
        flex-direction: column;
        gap: $space-2;
        padding: $space-3 $space-4;
        background: var(--color-bg);
        border-top: 1px solid var(--color-border-light);

        .action-btn, .nobg-btn {
            width: 100%;
            max-width: 100%;
            text-align: center;
        }

        .active {
            background-color: var(--color-primary);
            color: var(--color-white);
        }
    }
}
</style>
