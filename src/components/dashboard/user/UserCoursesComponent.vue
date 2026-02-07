<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../../../stores/auth-store.js'
import { useProductStore } from '../../../stores/product-store.js'
import ProgressCardComponent from '../../common/cards/ProgressCardComponent.vue'
import { RouterLink } from 'vue-router'

const auth_store = useAuthStore()
const product_store = useProductStore()

onMounted(async () => {
    // Asegurar datos actualizados
    if (!auth_store.user_data) {
        await auth_store.refresh()
    }

    // Si no tiene cursos, cargamos sugerencias
    if (!auth_store.user_data.progress || auth_store.user_data.progress.length === 0) {
        // Pedimos solo cursos
        await product_store.fetch_products({ type: 'course', limit: 3 })
    }
})

// Ordenar cursos: en progreso primero, completados después
const sorted_courses = computed(() => {
    if (!auth_store.user_data?.progress) return { in_progress: [], completed: [] }

    const in_progress = auth_store.user_data.progress
        .filter(p => p.overall_progress_percentage < 100)
        .sort((a, b) => new Date(b.last_accessed) - new Date(a.last_accessed)) // Más recientes primero

    const completed = auth_store.user_data.progress
        .filter(p => p.overall_progress_percentage === 100)

    return { in_progress, completed }
})

// Sugerencia para CTA (el primer curso disponible en la tienda)
const suggested_course = computed(() => {
    if (!product_store.products.length) return null
    return product_store.products[0]
})

const user_name = computed(() => auth_store.user_data?.user?.name?.split(' ')[0] || 'Hola')
</script>

<template>
    <section class="user-courses">
        <h2 class="section-title">Mis Aprendizajes</h2>

        <div v-if="!auth_store.user_data.progress || auth_store.user_data.progress.length === 0" class="empty-state">
            <div class="empty-content">
                <span class="icon">🌱</span>
                <h3>Tu camino empieza hoy</h3>
                <p>
                    {{ user_name }}, aún no tienes cursos activos.
                    <span v-if="suggested_course">Te recomiendo empezar con <strong>{{ suggested_course.title
                            }}</strong>.</span>
                </p>

                <RouterLink v-if="suggested_course" :to="`/formaciones/${suggested_course.slug}`" class="btn-primary">
                    Descubrir este curso
                </RouterLink>
                <RouterLink v-else to="/formaciones" class="btn-primary">
                    Ver catálogo completo
                </RouterLink>
            </div>
        </div>

        <div v-else class="courses-list">

            <div v-if="sorted_courses.in_progress.length > 0">
                <h3 class="subsection-title">En curso</h3>
                <div class="courses-grid">
                    <ProgressCardComponent v-for="item in sorted_courses.in_progress" :key="item._id"
                        :progress="item" />
                </div>
            </div>

            <div v-if="sorted_courses.completed.length > 0" class="completed-section">
                <h3 class="subsection-title">Completados</h3>
                <div class="courses-grid">
                    <ProgressCardComponent v-for="item in sorted_courses.completed" :key="item._id" :progress="item" />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.user-courses {
    padding: 1rem;
}

.section-title {
    font-family: 'Title', serif;
    font-size: 2.2rem;
    color: var(--color-primary);
    margin-bottom: 2rem;
}

.subsection-title {
    font-size: 1.2rem;
    color: var(--color-text-muted);
    margin-bottom: 1rem;
    margin-top: 2rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.9rem;
    border-bottom: 1px solid var(--color-border-light);
    padding-bottom: 0.5rem;
}

.empty-state {
    background: var(--color-bg-card);
    border-radius: var(--radius-md);
    padding: 4rem 2rem;
    text-align: center;
    box-shadow: var(--shadow-sm);

    .icon {
        font-size: 3rem;
        display: block;
        margin-bottom: 1rem;
    }

    h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    p {
        color: var(--color-text-muted);
        margin-bottom: 2rem;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }

    .btn-primary {
        display: inline-block;
        padding: 0.8rem 2rem;
        background: var(--color-secondary);
        color: var(--color-white);
        text-decoration: none;
        border-radius: var(--radius-full);
        transition: transform 0.2s;

        &:hover {
            transform: translateY(-2px);
        }
    }
}

.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
}

.completed-section {
    opacity: 0.8; // Visualmente un poco menos destacado
}
</style>