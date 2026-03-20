<script setup>
import { ref, watch, defineAsyncComponent, markRaw } from 'vue'
import { useAuthStore } from '../../stores/auth-store'
import { useUtilStore } from '../../stores/util-store'

const auth_store = useAuthStore()
const util_store = useUtilStore()

const show_component = ref('')
const display_component = ref(null)
const component_cache = ref({})

const load_component = async (component_name) => {
    if (component_cache.value[component_name]) {
        return component_cache.value[component_name]
    }
    try {
        const component = defineAsyncComponent(() => import(`./admin/${component_name}.vue`))
        component_cache.value[component_name] = markRaw(component)
        return component_cache.value[component_name]
    } catch (error) {
        console.error(error)
        return null
    }
}

watch(() => show_component.value, async (new_value) => {
    util_store.set_loading(true)
    try {
        display_component.value = await load_component(new_value)
    } catch (error) {
        console.error(error)
    } finally {
        util_store.set_loading(false)
    }
})
</script>

<template>
    <section class="admin__dashboard">
        <h2>Hola Lucia, bienvenida a tu área privada</h2>
        <div class="admin__dashboard__actions">
            <button class="action-btn" @click="show_component = 'ManageUserComponent'">Buscar usuarios</button>
            <button class="action-btn" @click="show_component = 'ManagePostComponent'">Gestionar posts</button>
            <button class="action-btn" @click="show_component = 'ManageVideoComponent'">Gestionar videos</button>
            <button class="action-btn" @click="show_component = 'ManageOrdersComponent'">Gestionar
                pedidos</button>
            <button class="action-btn" @click="show_component = 'ManageProductComponent'">Gestionar
                productos</button>
            <button class="action-btn" @click="show_component = 'ManageLikesComponent'">Ver ultimos likes</button>
        </div>
        <div class="admin__dashboard__component__displayer" v-if="display_component">
            <Suspense>
                <template #default>
                    <component :is="display_component" />
                </template>
                <template #fallback>
                    <div class="loading">
                        <h2>Cargando...</h2>
                    </div>
                </template>
            </Suspense>
        </div>
    </section>
</template>


<style scoped lang="scss">
.admin__dashboard {
    h2 {
        margin: 0 0 $space-8;
        text-align: center;
    }

    &__actions {
        display: flex;
        gap: $space-4;
        flex-wrap: wrap;

        button {
            flex: 1;
            min-width: 140px;
        }
    }

    &__component__displayer {
        margin-top: $space-8;
    }

    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
}

@media screen and (max-width: $bp-md) {
    .admin__dashboard {
        &__actions {
            flex-direction: column;
            padding-bottom: $space-4;
            border-bottom: 2px solid var(--color-primary);
        }
    }
}
</style>
