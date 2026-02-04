<template>
    <div class="product-detail">
        <LoadingComponent v-if="loading" />

        <div v-else-if="product">
            <!-- Vista según estado del usuario -->
            <component :is="currentView" :product="product" />
        </div>

        <div v-else class="product-error">
            <h2>Producto no encontrado</h2>
            <p>El producto que buscas no existe o ha sido eliminado.</p>
            <RouterLink to="/productos" class="btn-back">
                Ver todos los productos
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/product-store'
import { useAuthStore } from '../stores/auth-store'
import ProductPublicView from '../components/products/ProductPublic.vue'
import ProductPrivateView from '../components/products/ProductPrivate.vue'
import ProductPendingView from '../components/products/ProductPending.vue'
import LoadingComponent from '../components/common/LoadingComponent.vue'

const route = useRoute()
const router = useRouter()
const product_store = useProductStore()
const auth_store = useAuthStore()

// State
const loading = ref(false)
const product = ref(null)

// Determinar qué componente mostrar según acceso
const currentView = computed(() => {
    const slug = route.params.slug

    // Si no está logueado, mostrar vista pública
    if (!auth_store.user_data) {
        return ProductPublicView
    }

    // Verificar si tiene orden pendiente
    const has_pending = product_store.has_pending_order(slug)
    if (has_pending) {
        return ProductPendingView
    }

    // Verificar si tiene acceso (comprado)
    const has_access = product_store.has_access(slug)
    if (has_access) {
        return ProductPrivateView
    }

    // Si está logueado pero no compró, mostrar vista pública
    return ProductPublicView
})

// Cargar producto
const loadProduct = async () => {
    loading.value = true
    const slug = route.params.slug

    product.value = await product_store.fetch_product_by_slug(slug)

    loading.value = false
}

// Watch cambios en la ruta (cuando navega entre productos)
watch(() => route.params.slug, () => {
    if (route.name === 'ProductDetail') {
        loadProduct()
    }
})

// Watch cambios en user_data (después de login/refresh)
watch(() => auth_store.user_data, () => {
    // El componente reactivo se actualizará automáticamente
}, { deep: true })

// Cargar al montar
onMounted(() => {
    loadProduct()
})
</script>

<style scoped lang="scss">
.product-detail {
    min-height: 80vh;
}

.product-error {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px 20px;

    h2 {
        font-size: 32px;
        font-weight: 800;
        margin: 0 0 16px;
        color: #111;
    }

    p {
        font-size: 18px;
        color: #666;
        margin: 0 0 32px;
    }

    .btn-back {
        display: inline-block;
        padding: 14px 32px;
        border-radius: 10px;
        background: #6366f1;
        color: white;
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s ease;

        &:hover {
            background: #4f46e5;
            transform: translateY(-2px);
        }
    }
}
</style>