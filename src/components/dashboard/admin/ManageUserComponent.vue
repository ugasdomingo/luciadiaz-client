<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAdminStore } from '../../../stores/admin-store'
import { useUtilStore } from '../../../stores/util-store.js'
import { RouterLink } from 'vue-router'

const admin_store = useAdminStore()
const util_store = useUtilStore()
const users_to_show = ref([])
const text_filter = ref('')

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
})

</script>

<template>
    <section class="manage__users__container">
        <h2>Buscar usuarios</h2>
        <section class="actions__container">
            <input type="text" placeholder="Escribe el nombre de un usuario" v-model="text_filter">
        </section>
        <section class="component__displayer">
            <table>
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
                        <td class="actions">
                            <RouterLink :to="`/mi-espacio/user/${user._id}`" class="action-btn">
                                Ver usuario
                            </RouterLink>
                            <button @click="admin_store.role_to_patient(user._id)" class="nobg-btn">
                                Convertir a paciente
                            </button>
                            <button @click="admin_store.active_anamnesis_kids(user._id)" class="nobg-btn"
                                :class="user.anamnesis_kids ? 'active' : ''">
                                Activar anamnesis
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </section>
</template>

<style scoped lang="scss">
.manage__users__container {
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: $space-8;
    }

    th,
    td {
        padding: $space-2;
        text-align: left;
        border-bottom: 1px solid var(--color-disable);
    }

    th {
        background-color: var(--color-disable);
    }

    .actions {
        display: flex;
        gap: $space-2;

        .action-btn {
            max-width: fit-content;
        }

        .active {
            background-color: var(--color-primary);
            color: var(--color-white);
        }
    }
}

@media screen and (max-width: $bp-md) {
    .manage__users__container {
        h2 {
            text-align: center;
        }

        .actions__container {
            input {
                width: 100%;
            }
        }

        .component__displayer {
            overflow-x: auto;
        }
    }
}
</style>