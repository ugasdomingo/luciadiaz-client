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
                <li class="consent-row">
                    <strong>Consentimiento: </strong>
                    <span v-if="user_info?.user?.consent_signed" style="color: var(--color-success);">✓ Firmado</span>
                    <span v-else style="color: var(--color-text-muted);">Pendiente</span>
                    <button v-if="user_info?.user?.consent_signed"
                        @click="view_consent_pdf" :disabled="loading_pdf"
                        class="nobg-btn" style="font-size:0.75rem;">
                        {{ loading_pdf ? '...' : '📄 Ver PDF' }}
                    </button>
                </li>
                <!-- Subir consentimiento manualmente (admin) -->
                <li>
                    <button class="nobg-btn consent-upload-toggle" @click="show_upload_consent = !show_upload_consent">
                        {{ show_upload_consent ? '✕ Cancelar' : '📤 Subir consentimiento' }}
                    </button>
                </li>
                <li v-if="show_upload_consent" class="consent-upload-panel">
                    <input type="file" ref="consent_file_input" accept="application/pdf"
                        @change="handle_consent_file" style="display:none" />
                    <div class="consent-upload-inner">
                        <button class="nobg-btn" @click="consent_file_input?.click()">
                            {{ consent_file_name || '📎 Seleccionar PDF' }}
                        </button>
                        <button class="action-btn" :disabled="!consent_file || uploading_consent"
                            @click="upload_consent_pdf_admin">
                            {{ uploading_consent ? 'Subiendo...' : 'Guardar' }}
                        </button>
                    </div>
                    <p v-if="consent_upload_msg" class="consent-upload-msg">{{ consent_upload_msg }}</p>
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

// Ver PDF del consentimiento — proxy blob para evitar restricciones de Cloudinary
const loading_pdf = ref(false)
const view_consent_pdf = async () => {
    loading_pdf.value = true
    try {
        const res = await api.get(`/consent/pdf/${route.params.user_id}`, { responseType: 'blob' })
        const blob = new Blob([res.data], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
        setTimeout(() => URL.revokeObjectURL(url), 15000)
    } catch {
        alert('No se pudo obtener el PDF del consentimiento.')
    } finally {
        loading_pdf.value = false
    }
}

// Subida manual de consentimiento por admin
const show_upload_consent = ref(false)
const consent_file_input = ref(null)
const consent_file = ref(null)
const consent_file_name = ref('')
const uploading_consent = ref(false)
const consent_upload_msg = ref('')

const handle_consent_file = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (f.type !== 'application/pdf') { alert('Solo se aceptan archivos PDF'); return }
    consent_file.value = f
    consent_file_name.value = f.name
    consent_upload_msg.value = ''
}

const upload_consent_pdf_admin = async () => {
    if (!consent_file.value) return
    uploading_consent.value = true
    consent_upload_msg.value = ''
    try {
        const form = new FormData()
        form.append('consent_pdf', consent_file.value)
        await api.post(`/consent/admin-upload/${route.params.user_id}`, form)
        consent_upload_msg.value = '✓ Consentimiento guardado correctamente'
        consent_file.value = null
        consent_file_name.value = ''
        show_upload_consent.value = false
        // Recargar datos del usuario para reflejar el cambio
        await admin_store.get_user_by_id(route.params.user_id)
    } catch {
        consent_upload_msg.value = '✗ Error al subir el archivo. Inténtalo de nuevo.'
    } finally {
        uploading_consent.value = false
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

            .consent-row {
                flex-wrap: wrap;
            }

            .consent-upload-panel {
                flex-direction: column;
                align-items: flex-start;
                gap: $space-2;
                padding: $space-3;
                background: var(--color-bg);
                border: 1px dashed var(--color-border);
                border-radius: $radius-md;
                width: 100%;
            }

            .consent-upload-inner {
                display: flex;
                gap: $space-3;
                align-items: center;
                flex-wrap: wrap;
            }

            .consent-upload-msg {
                font-size: $text-xs;
                color: var(--color-success);
                margin: 0;
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