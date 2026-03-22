<template>
    <main class="pages">
        <aside class="basic__info">
            <h2>Información del usuario</h2>
            <ul>
                <li>
                    <strong> Nombre: </strong> {{ user_info?.user?.name }}
                </li>
                <li>
                    <strong> Correo: </strong> {{ user_info?.user?.email }}
                    <img src="/icon/icon-mail.svg" alt="checked verified email"
                        v-if="user_info?.user?.email_verified">
                </li>
                <li>
                    <strong> Teléfono: </strong> {{ user_info?.user?.phone }}
                </li>
                <li>
                    <strong> Rol: </strong> {{ user_info?.user?.role }}
                </li>
                <li>
                    <strong> Historial Médico: </strong> {{ user_info?.user?.medical_record }}
                </li>
                <li>
                    <strong> Fecha de alta en web: </strong> {{ new
                        Date(user_info?.user?.createdAt).toLocaleDateString() }}
                </li>
                <li>
                    <strong>Consentimiento: </strong>
                    <span v-if="user_info?.user?.consent_signed" style="color: var(--color-success);">
                        ✓ Firmado
                    </span>
                    <span v-else style="color: var(--color-text-muted);">Pendiente</span>
                    <button
                        v-if="user_info?.user?.consent_signed"
                        @click="view_consent_pdf"
                        :disabled="loading_pdf"
                        class="nobg-btn"
                        style="margin-left: 8px; font-size: 0.75rem; padding: 2px 8px;">
                        {{ loading_pdf ? '...' : '📄 Ver PDF' }}
                    </button>
                </li>
            </ul>
        </aside>
        <section class="content">
            <div class="content__navegation">
                <button class="nobg-btn" @click="show_component = 'medical'">
                    Historial
                </button>
                <button class="nobg-btn" @click="show_component = 'notes'">Notas</button>
                <button class="nobg-btn" @click="show_component = 'tasks'">
                    Tareas
                </button>
                <button class="nobg-btn" @click="show_component = 'results'">Tests</button>
                <button class="nobg-btn" @click="show_component = 'courses'">Cursos</button>
                <button class="nobg-btn" @click="show_component = 'likes'">Likes</button>
            </div>
            <div class="content__component">
                <InfoUserHistoryComponent v-if="show_component === 'medical'" :user_history="user_info?.history" />
                <InfoUserNotesComponent v-if="show_component === 'notes'" :user_notes="user_info?.therapy_notes"
                    :user_id="route.params.user_id" />
                <InfoUserTaskComponent v-if="show_component === 'tasks'" :user_tasks="user_info?.therapy_tasks"
                    :user_id="route.params.user_id" />
                <InfoUserTestComponent v-if="show_component === 'results'" :user_tests="user_info?.test_results"
                    :user_name="user_info?.user?.name" />
                <InfoUserFormationComponent v-if="show_component === 'courses'"
                    :user_formation="user_info?.enrollments" />
                <InfoUserLikeComponent v-if="show_component === 'likes'" :user_likes="user_info?.likes" />
            </div>
        </section>
    </main>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router';
import { useAdminStore } from '../../stores/admin-store';
import { api } from '../../service/axios';

//Import components
import InfoUserHistoryComponent from '../../components/dashboard/admin/info-user/InfoUserHistoryComponent.vue'
import InfoUserTaskComponent from '../../components/dashboard/admin/info-user/InfoUserTaskComponent.vue'
import InfoUserTestComponent from '../../components/dashboard/admin/info-user/InfoUserTestComponent.vue'
import InfoUserFormationComponent from '../../components/dashboard/admin/info-user/InfoUserFormationComponent.vue'
import InfoUserLikeComponent from '../../components/dashboard/admin/info-user/InfoUserLikeComponent.vue'
import InfoUserNotesComponent from '../../components/dashboard/admin/info-user/InfoUserNotesComponent.vue'

const route = useRoute()
const admin_store = useAdminStore()
const user_info = computed(() => admin_store.user)
const show_component = ref('tasks')
const loading_pdf = ref(false)

const view_consent_pdf = async () => {
    loading_pdf.value = true
    try {
        const res = await api.get(`/consent/pdf/${route.params.user_id}`)
        window.open(res.data.data.consent_form_url, '_blank')
    } catch {
        alert('No se pudo obtener el PDF del consentimiento.')
    } finally {
        loading_pdf.value = false
    }
}

onMounted(async () => {
    await admin_store.get_user_by_id(route.params.user_id)
})

</script>

<style scoped lang="scss">
.pages {
    .basic__info {
        width: 35%;
        display: flex;
        flex-direction: column;
        gap: $space-4;
        position: absolute;
        top: $space-16;
        left: $space-16;

        h2 {
            margin-bottom: 0;
        }

        ul {
            list-style: none;
            margin: 0;
            padding: 0;

            li {
                display: flex;
                align-items: center;
                gap: $space-4;
                margin: 0;

                img {
                    width: $space-8;
                }
            }
        }
    }

    .content {
        width: 65%;
        display: flex;
        flex-direction: column;
        gap: $space-4;
        margin: 0 0 0 auto;

        .content__navegation {
            display: flex;
            flex-wrap: wrap;
            gap: $space-2;
            justify-content: center;
        }
    }
}

@media screen and (max-width: $bp-md) {
    .pages {
        .basic__info {
            width: 100%;
            position: static;
        }

        .content {
            width: 100%;
            padding-top: $space-8;

            .content__navegation {
                justify-content: center;
            }

            .content__component {
                overflow-x: auto;
            }
        }
    }
}
</style>