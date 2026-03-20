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
        if (product_store.all_products.length === 0) {
            await product_store.fetch_products()
        }
    }
})

// Ordenar cursos: en progreso primero, completados después
const sorted_courses = computed(() => {
    if (!auth_store.user_data?.progress) return { in_progress: [], completed: [], algo: 'Algo' }

    const in_progress = auth_store.user_data.progress
        .filter(p => p.percentage < 100)
        .sort((a, b) => new Date(b.last_accessed) - new Date(a.last_accessed)) // Más recientes primero

    const completed = auth_store.user_data.progress
        .filter(p => p.percentage === 100)

    return { in_progress, completed }
})

// Sugerencia para CTA (el primer curso disponible en la tienda)
const suggested_course = computed(() => {
    const courses = product_store.all_products.filter(p => p.type === 'course')
    if (!courses.length) return null
    return courses[0]
})

const user_name = computed(() => auth_store.user_data?.user?.name?.split(' ')[0] || 'Hola')
</script>

<template>
    <section class="user-courses">
        <h2 class="section-title">Mis Aprendizajes</h2>

        <div v-if="!auth_store.user_data.progress" class="empty-state">
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
    padding: $space-4;
}

.section-title {
    font-family: 'Title', serif;
    font-size: 2.2rem;
    color: var(--color-primary);
    margin-bottom: $space-8;
}

.subsection-title {
    font-size: 1.2rem;
    color: var(--color-text-muted);
    margin-bottom: $space-4;
    margin-top: $space-8;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.9rem;
    border-bottom: 1px solid var(--color-border-light);
    padding-bottom: $space-2;
}

.empty-state {
    background: var(--color-bg-card);
    border-radius: var(--radius-md);
    padding: $space-16 $space-8;
    text-align: center;
    box-shadow: var(--shadow-sm);

    .icon {
        font-size: $space-12;
        display: block;
        margin-bottom: $space-4;
    }

    h3 {
        font-size: $text-2xl;
        margin-bottom: $space-4;
    }

    p {
        color: var(--color-text-muted);
        margin-bottom: $space-8;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }

    .btn-primary {
        display: inline-block;
        padding: 0.8rem $space-8;
        background: var(--color-secondary);
        color: var(--color-white);
        text-decoration: none;
        border-radius: var(--radius-full);
        transition: transform $transition;

        &:hover {
            transform: translateY(-2px);
        }
    }
}

.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: $space-8;
}

.completed-section {
    opacity: 0.8; // Visualmente un poco menos destacado
}
</style>