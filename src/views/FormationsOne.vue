<template>
    <div class="page-container" v-if="product">
        <div class="product-hero"
            :style="{ backgroundImage: `url(${product.cover_image || '/img/background-individual.webp'})` }">
            <div class="hero-overlay">
                <div class="container hero-content">
                    <span class="badge">{{ product.category || 'Formación' }}</span>
                    <h1>{{ product.title }}</h1>
                    <p class="subtitle" v-if="product.subtitle">{{ product.subtitle }}</p>
                </div>
            </div>
        </div>

        <div class="container product-body">
            <div class="row">
                <div class="col-md-8 content-column">
                    <div class="description-section">
                        <h3>Sobre esta formación</h3>
                        <div class="html-content" v-html="product.description"></div>
                    </div>

                    <div class="modules-preview" v-if="product.modules && product.modules.length">
                        <h3>Contenido del curso</h3>
                        <div class="modules-list">
                            <div v-for="(module, index) in product.modules" :key="index" class="module-item">
                                <div class="module-header">
                                    <span class="module-number">{{ index + 1 }}</span>
                                    <span class="module-title">{{ module.title }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 sidebar-column">
                    <div class="action-card sticky-top">
                        <div class="price-tag">
                            <span v-if="product.price > 0">{{ product.price }}€</span>
                            <span v-else>Gratuito</span>
                        </div>

                        <div class="action-buttons">
                            <router-link v-if="has_access"
                                :to="{ name: 'FormationsDashboard', params: { formation_slug: product.slug } }"
                                class="btn-primary full-width">
                                Acceder al Taller
                            </router-link>

                            <router-link v-else :to="{ name: 'Enrollment', params: { formation_slug: product.slug } }"
                                class="btn-primary full-width">
                                {{ product.price > 0 ? 'Inscribirme ahora' : 'Acceder gratis' }}
                            </router-link>
                        </div>

                        <div class="features-list">
                            <ul>
                                <li><img src="/icon/icon-clock.svg" alt="Clock"> Duración flexible</li>
                                <li><img src="/icon/icon-post.svg" alt="Access"> Acceso de por vida</li>
                                <li v-if="product.certificate"><img src="/icon/icon-formacion.svg" alt="Cert">
                                    Certificado incluido</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <LoadingComponent v-else />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/product-store'
import { useAuthStore } from '../stores/auth-store'
import LoadingComponent from '../components/common/LoadingComponent.vue'

const route = useRoute()
const product_store = useProductStore()
const auth_store = useAuthStore()

const product = ref(null)

// Verificar si el usuario ya tiene acceso (comprado)
const has_access = computed(() => {
    if (!auth_store.user_data) return false

    // Admin siempre tiene acceso
    if (auth_store.user_data.role === 'admin') return true

    // Verificar en el progreso (lista de cursos activos del usuario)
    // Nota: El backend en 'get_login_user_data' devuelve 'progress' populado
    const user_courses = auth_store.user_data.progress || []

    // Buscamos si el ID del producto actual está en los cursos del usuario
    // (Aseguramos comparación de strings por si acaso)
    return user_courses.some(p => {
        const p_id = typeof p.product_id === 'object' ? p.product_id._id : p.product_id
        return p_id === product.value?._id
    })
})

onMounted(async () => {
    // Obtenemos producto por SLUG
    const slug = route.params.formation_slug
    product.value = await product_store.fetch_product_by_slug(slug)
})
</script>

<style lang="scss" scoped>
.page-container {
    padding-bottom: 4rem;
}

.product-hero {
    height: 400px;
    background-size: cover;
    background-position: center;
    position: relative;

    .hero-overlay {
        background: rgba(0, 0, 0, 0.4);
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: white;
    }

    h1 {
        font-family: 'Cormorant Garamond', serif;
        font-size: 3.5rem;
        margin-bottom: 0.5rem;
    }

    .badge {
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 50px;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 1px;
        margin-bottom: 1rem;
        display: inline-block;
    }
}

.product-body {
    margin-top: -3rem; // Efecto de solapamiento
    position: relative;
    z-index: 10;
}

.content-column {
    background: white;
    padding: 3rem;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.sidebar-column {
    padding-left: 2rem;

    @media(max-width: 768px) {
        padding-left: 0.75rem; // Corrección bootstrap padding
        margin-top: 2rem;
    }
}

.action-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    text-align: center;

    .price-tag {
        font-size: 2.5rem;
        font-weight: bold;
        color: var(--primary-color);
        font-family: 'Cormorant Garamond', serif;
        margin-bottom: 1.5rem;
    }

    .btn-primary {
        display: block;
        padding: 1rem;
        font-size: 1.1rem;
        text-decoration: none;
        border-radius: 4px;
        transition: all 0.3s;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
    }

    .features-list {
        margin-top: 2rem;
        text-align: left;
        border-top: 1px solid #eee;
        padding-top: 1rem;

        ul {
            list-style: none;
            padding: 0;

            li {
                margin-bottom: 0.8rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #666;

                img {
                    width: 20px;
                    opacity: 0.7;
                }
            }
        }
    }
}

.sticky-top {
    position: sticky;
    top: 2rem;
}
</style>