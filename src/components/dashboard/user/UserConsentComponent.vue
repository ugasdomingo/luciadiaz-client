<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import SignaturePad from 'signature_pad'
import { useAuthStore } from '../../../stores/auth-store.js'
import { api } from '../../../service/axios.js'

const auth_store = useAuthStore()

// Estado principal
const step = ref('read')         // 'read' | 'form' | 'done'
const has_read = ref(false)
const submitting = ref(false)
const error_msg = ref('')

// Campos del formulario
const form = ref({
    full_name: '',
    document_id: '',
    modality: '',
    is_minor: false,
    guardian_name: '',
    guardian_document_id: '',
    guardian_role: 'padre',
    minor_name: '',
})

// Firma
const canvas_ref = ref(null)
let signature_pad = null

const already_signed = computed(() => !!auth_store.user_data?.user?.consent_signed)
const consent_date   = computed(() => {
    const d = auth_store.user_data?.user?.consent_signed_at
    return d ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
})

// Descargar PDF vía proxy del servidor (evita restricción de Cloudinary)
const downloading_pdf = ref(false)
const download_my_consent = async () => {
    downloading_pdf.value = true
    try {
        const res = await api.get('/consent/my-pdf', { responseType: 'blob' })
        const blob = new Blob([res.data], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
        setTimeout(() => URL.revokeObjectURL(url), 15000)
    } catch {
        alert('No se pudo obtener el PDF. Inténtalo más tarde.')
    } finally {
        downloading_pdf.value = false
    }
}

onMounted(() => {
    // Pre-rellenar nombre del usuario si está disponible
    if (auth_store.user_data?.user?.name) {
        form.value.full_name = auth_store.user_data.user.name
    }
    if (already_signed.value) step.value = 'done'
})

const init_signature_pad = () => {
    if (canvas_ref.value && !signature_pad) {
        signature_pad = new SignaturePad(canvas_ref.value, {
            backgroundColor: 'rgba(255,255,255,0)',
            penColor: '#1a1a2e',
            minWidth: 1.5,
            maxWidth: 3,
        })
        resize_canvas()
    }
}

const resize_canvas = () => {
    if (!canvas_ref.value || !signature_pad) return
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    const canvas = canvas_ref.value
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    canvas.getContext('2d').scale(ratio, ratio)
    signature_pad.clear()
}

const clear_signature = () => { if (signature_pad) signature_pad.clear() }

const proceed_to_form = () => {
    step.value = 'form'
    // Esperar al DOM para inicializar el canvas
    setTimeout(init_signature_pad, 100)
}

onBeforeUnmount(() => { if (signature_pad) signature_pad.off() })

const submit = async () => {
    error_msg.value = ''

    if (!form.value.full_name.trim()) { error_msg.value = 'El nombre completo es obligatorio'; return }
    if (!form.value.document_id.trim()) { error_msg.value = 'El número de documento es obligatorio'; return }
    if (!form.value.modality) { error_msg.value = 'Selecciona la modalidad de atención'; return }
    if (!signature_pad || signature_pad.isEmpty()) { error_msg.value = 'La firma es obligatoria'; return }
    if (form.value.is_minor) {
        if (!form.value.guardian_name.trim()) { error_msg.value = 'El nombre del tutor/a es obligatorio'; return }
        if (!form.value.guardian_document_id.trim()) { error_msg.value = 'El documento del tutor/a es obligatorio'; return }
        if (!form.value.minor_name.trim()) { error_msg.value = 'El nombre del menor es obligatorio'; return }
    }

    submitting.value = true
    try {
        await api.post('/consent/submit', {
            full_name: form.value.full_name.trim(),
            document_id: form.value.document_id.trim(),
            modality: form.value.modality,
            signature_base64: signature_pad.toDataURL('image/png'),
            is_minor: form.value.is_minor,
            guardian_name: form.value.guardian_name.trim(),
            guardian_document_id: form.value.guardian_document_id.trim(),
            guardian_role: form.value.guardian_role,
            minor_name: form.value.minor_name.trim(),
        })
        // Refrescar datos del usuario
        await auth_store.refresh()
        step.value = 'done'
    } catch (e) {
        error_msg.value = e?.response?.data?.message || 'Error al enviar el consentimiento. Inténtalo de nuevo.'
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <div class="user-consent">

        <!-- ── Ya firmado ──────────────────────────────────────────── -->
        <div v-if="step === 'done'" class="consent-done">
            <div class="consent-done__icon">✅</div>
            <h2 class="consent-done__title">Consentimiento firmado</h2>
            <p class="consent-done__date">Firmado el {{ consent_date }}</p>
            <p class="consent-done__sub">
                Tu consentimiento informado está guardado. Puedes descargarlo cuando quieras.
            </p>
            <div class="consent-done__actions">
                <button v-if="already_signed" @click="download_my_consent"
                    :disabled="downloading_pdf" class="action-btn">
                    {{ downloading_pdf ? 'Cargando...' : '📄 Ver / Descargar PDF' }}
                </button>
                <p class="consent-done__next">
                    ✅ Siguiente paso: <strong>completa tu historial clínico</strong> antes de tu primera sesión.
                </p>
            </div>
        </div>

        <!-- ── Paso 1: Leer el documento ──────────────────────────── -->
        <template v-else-if="step === 'read'">
            <div class="consent-header">
                <h2 class="consent-header__title">Consentimiento Informado</h2>
                <p class="consent-header__sub">
                    Lee el documento completo antes de proceder a firmarlo. Es obligatorio antes de tu primera sesión.
                </p>
            </div>

            <div class="consent-doc">
                <section class="consent-doc__section">
                    <h3>INFORMACIÓN SOBRE EL PROFESIONAL</h3>
                    <p>La atención psicológica será proporcionada por una psicóloga clínica colegiada, especializada en atención a adultos, parejas, niños y adolescentes. El trabajo terapéutico se fundamenta en las corrientes del psicoanálisis y cognitivo-conductual, utilizando como referencia los criterios diagnósticos del DSM-5 y CIE-10, así como evidencia científica actualizada de autores como Albert Bandura, Jean Piaget, Abraham Maslow y Sigmund Freud, entre otros.</p>
                </section>

                <section class="consent-doc__section">
                    <h3>SERVICIOS OFRECIDOS</h3>
                    <ul>
                        <li>Psicoterapia individual para adultos</li>
                        <li>Terapia de pareja</li>
                        <li>Evaluaciones psicológicas</li>
                        <li>Orientación a padres</li>
                        <li>Terapia infantil y de adolescentes (modalidad online)</li>
                    </ul>
                </section>

                <section class="consent-doc__section">
                    <h3>MODALIDAD DE ATENCIÓN</h3>
                    <p><strong>Presencial:</strong> Sesiones cara a cara en consulta ubicada en Madrid, España, regidas por la normativa española y el Código Deontológico del Colegio Oficial de Psicólogos de España.</p>
                    <p><strong>Online:</strong> Sesiones mediante plataformas de videollamada, regidas por la normativa venezolana y el Código de Ética Profesional del Psicólogo en Venezuela.</p>
                </section>

                <section class="consent-doc__section">
                    <h3>NATURALEZA DEL PROCESO TERAPÉUTICO</h3>
                    <p>El proceso terapéutico es un trabajo colaborativo entre el/la paciente y el/la terapeuta. Los resultados dependen de múltiples factores, incluyendo la motivación, la asistencia regular a las sesiones, la honestidad en la comunicación y el compromiso con el proceso terapéutico.</p>
                    <p>No se pueden garantizar resultados específicos, aunque el trabajo terapéutico basado en evidencia científica ha demostrado ser efectivo para el tratamiento de diversas problemáticas psicológicas.</p>
                </section>

                <section class="consent-doc__section">
                    <h3>CONFIDENCIALIDAD</h3>
                    <p>La información compartida durante las sesiones es estrictamente confidencial y está protegida por el secreto profesional. La confidencialidad solo podrá ser quebrantada en situaciones excepcionales:</p>
                    <ol>
                        <li>Cuando exista riesgo inminente de daño para la vida o integridad física del/la paciente</li>
                        <li>Cuando exista riesgo inminente de daño para terceras personas</li>
                        <li>Cuando sea requerido por mandato judicial</li>
                    </ol>
                </section>

                <section class="consent-doc__section">
                    <h3>ALMACENAMIENTO Y PROTECCIÓN DE DATOS</h3>
                    <p>Los datos clínicos serán almacenados de forma segura en un sistema encriptado. El/la paciente tiene derecho a acceder a su información clínica, solicitar rectificación de datos incorrectos y solicitar la eliminación de sus datos una vez finalizado el tratamiento.</p>
                </section>

                <section class="consent-doc__section">
                    <h3>DERECHOS DEL/LA PACIENTE</h3>
                    <ul>
                        <li>Recibir información clara sobre su diagnóstico, pronóstico y tratamiento propuesto</li>
                        <li>Hacer preguntas sobre cualquier aspecto del tratamiento</li>
                        <li>Participar activamente en las decisiones sobre su proceso terapéutico</li>
                        <li>Interrumpir el tratamiento en cualquier momento</li>
                        <li>Solicitar un segundo profesional u opinión externa</li>
                        <li>Recibir atención profesional respetuosa y sin discriminación</li>
                    </ul>
                </section>

                <section class="consent-doc__section">
                    <h3>RESPONSABILIDADES DEL/LA PACIENTE</h3>
                    <ul>
                        <li>Asistir puntualmente a las sesiones programadas</li>
                        <li>Participar activamente y con honestidad en el proceso terapéutico</li>
                        <li>Comunicar cualquier inquietud o dificultad durante el tratamiento</li>
                        <li>Informar sobre cualquier cambio significativo en su situación vital o de salud</li>
                        <li>Respetar los límites del encuadre terapéutico</li>
                    </ul>
                </section>

                <section class="consent-doc__section consent-doc__section--minor">
                    <h3>CONSENTIMIENTO PARA MENORES DE EDAD</h3>
                    <p>En el caso de atención a niños, niñas o adolescentes menores de 18 años, se requiere la autorización de al menos uno de los padres o tutores legales. Los padres/tutores recibirán información general sobre el progreso del tratamiento, respetando siempre el derecho a la confidencialidad del/la menor.</p>
                </section>
            </div>

            <!-- Confirmación de lectura -->
            <div class="consent-confirm">
                <label class="consent-confirm__check">
                    <input type="checkbox" v-model="has_read" />
                    <span>He leído y comprendido todo el documento anterior</span>
                </label>
                <button class="action-btn" :disabled="!has_read" @click="proceed_to_form">
                    Proceder a firmar el consentimiento →
                </button>
            </div>
        </template>

        <!-- ── Paso 2: Formulario + firma ─────────────────────────── -->
        <template v-else-if="step === 'form'">
            <div class="consent-form-header">
                <button class="nobg-btn" @click="step = 'read'">← Volver a leer</button>
                <h2>Declaración de Consentimiento</h2>
                <p>Completa tus datos y firma para finalizar</p>
            </div>

            <form class="consent-form" @submit.prevent="submit">

                <!-- Datos personales -->
                <div class="consent-form__group">
                    <label>Nombre completo <span class="req">*</span></label>
                    <input v-model="form.full_name" type="text" placeholder="Tu nombre completo" required />
                </div>
                <div class="consent-form__group">
                    <label>Número de documento (DNI / Pasaporte / Cédula) <span class="req">*</span></label>
                    <input v-model="form.document_id" type="text" placeholder="Ej: 12345678A" required />
                </div>

                <!-- Modalidad -->
                <div class="consent-form__group">
                    <label>Modalidad de atención <span class="req">*</span></label>
                    <div class="consent-form__radios">
                        <label class="radio-option">
                            <input type="radio" v-model="form.modality" value="presencial" />
                            <span>🏢 Presencial (Madrid)</span>
                        </label>
                        <label class="radio-option">
                            <input type="radio" v-model="form.modality" value="online" />
                            <span>💻 Online (videollamada)</span>
                        </label>
                    </div>
                </div>

                <!-- Declaraciones -->
                <div class="consent-form__declarations">
                    <p class="consent-form__declarations-title">Declaro que:</p>
                    <div v-for="(item, i) in [
                        'He leído y comprendido la información de este documento',
                        'He tenido la oportunidad de hacer preguntas y mis dudas han sido aclaradas',
                        'Comprendo la naturaleza del tratamiento psicológico y sus limitaciones',
                        'Comprendo los límites de la confidencialidad',
                        'Autorizo el almacenamiento de mis datos clínicos en sistema encriptado',
                        'Consiento voluntariamente recibir atención psicológica',
                    ]" :key="i" class="consent-form__decl-item">
                        <span class="check-icon">✓</span> {{ item }}
                    </div>
                </div>

                <!-- Sección menor -->
                <div class="consent-form__group">
                    <label class="consent-form__toggle">
                        <input type="checkbox" v-model="form.is_minor" />
                        <span>La sesión es para un/a menor de edad (requiere autorización del tutor/a)</span>
                    </label>
                </div>

                <div v-if="form.is_minor" class="consent-form__minor">
                    <div class="consent-form__group">
                        <label>Nombre del padre / madre / tutor/a <span class="req">*</span></label>
                        <input v-model="form.guardian_name" type="text" placeholder="Nombre completo del tutor/a" />
                    </div>
                    <div class="consent-form__group">
                        <label>Documento del tutor/a <span class="req">*</span></label>
                        <input v-model="form.guardian_document_id" type="text" placeholder="DNI / Pasaporte" />
                    </div>
                    <div class="consent-form__group">
                        <label>Relación con el menor <span class="req">*</span></label>
                        <div class="consent-form__radios">
                            <label class="radio-option" v-for="r in ['padre', 'madre', 'tutor']" :key="r">
                                <input type="radio" v-model="form.guardian_role" :value="r" />
                                <span>{{ r.charAt(0).toUpperCase() + r.slice(1) }}</span>
                            </label>
                        </div>
                    </div>
                    <div class="consent-form__group">
                        <label>Nombre del menor <span class="req">*</span></label>
                        <input v-model="form.minor_name" type="text" placeholder="Nombre completo del menor" />
                    </div>
                </div>

                <!-- Firma digital -->
                <div class="consent-form__group">
                    <label>Firma digital <span class="req">*</span></label>
                    <p class="consent-form__sig-hint">Dibuja tu firma en el recuadro:</p>
                    <div class="signature-wrap">
                        <canvas ref="canvas_ref" class="signature-canvas"></canvas>
                    </div>
                    <button type="button" class="nobg-btn signature-clear" @click="clear_signature">
                        ✕ Borrar firma
                    </button>
                </div>

                <!-- Error -->
                <p v-if="error_msg" class="consent-form__error">⚠ {{ error_msg }}</p>

                <!-- Submit -->
                <button type="submit" class="action-btn consent-form__submit" :disabled="submitting">
                    {{ submitting ? 'Generando documento...' : '✅ Firmar y enviar consentimiento' }}
                </button>

                <p class="consent-form__legal">
                    Al enviar este formulario se generará un PDF con tu firma que quedará guardado de forma segura.
                </p>
            </form>
        </template>

    </div>
</template>

<style scoped lang="scss">
.user-consent {
    max-width: 760px;
}

// ── Done ────────────────────────────────────────────────────────────
.consent-done {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: $space-12 $space-6;
    gap: $space-4;

    &__icon { font-size: 52px; line-height: 1; }

    &__title {
        font-size: $text-2xl;
        font-weight: $fw-bold;
        color: var(--color-text-heading);
        margin: 0;
    }

    &__date {
        font-size: $text-sm;
        color: var(--color-text-muted);
        margin: 0;
    }

    &__sub {
        font-size: $text-base;
        color: var(--color-text-muted);
        max-width: 480px;
        line-height: 1.6;
        margin: 0;
    }

    &__actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $space-5;
        margin-top: $space-4;
    }

    &__next {
        font-size: $text-sm;
        color: var(--color-text-muted);
        padding: $space-3 $space-5;
        background: var(--color-bg);
        border-radius: $radius-md;
        margin: 0;
    }
}

// ── Header ──────────────────────────────────────────────────────────
.consent-header {
    margin-bottom: $space-6;

    &__title {
        font-size: $text-2xl;
        font-weight: $fw-bold;
        color: var(--color-text-heading);
        margin: 0 0 $space-2;
    }

    &__sub {
        font-size: $text-base;
        color: var(--color-text-muted);
        margin: 0;
        line-height: 1.6;
    }
}

// ── Documento ───────────────────────────────────────────────────────
.consent-doc {
    background: var(--color-bg);
    border: 1px solid var(--color-border-light);
    border-radius: $radius-lg;
    padding: $space-8;
    margin-bottom: $space-6;
    max-height: 520px;
    overflow-y: auto;

    @media (max-width: $bp-md) {
        padding: $space-5;
        max-height: 400px;
    }

    &__section {
        margin-bottom: $space-6;

        &:last-child { margin-bottom: 0; }

        h3 {
            font-size: $text-xs;
            font-weight: $fw-bold;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--color-primary);
            margin: 0 0 $space-3;
            padding-bottom: $space-2;
            border-bottom: 1px solid var(--color-border-light);
        }

        p {
            font-size: $text-sm;
            color: var(--color-text);
            line-height: 1.7;
            margin: 0 0 $space-3;

            &:last-child { margin-bottom: 0; }
        }

        ul, ol {
            margin: 0;
            padding-left: $space-5;

            li {
                font-size: $text-sm;
                color: var(--color-text);
                line-height: 1.8;
            }
        }

        &--minor {
            background: var(--color-bg-card);
            border-radius: $radius-md;
            padding: $space-4;
            border-left: 3px solid var(--color-primary);
        }
    }
}

// ── Confirmación ────────────────────────────────────────────────────
.consent-confirm {
    display: flex;
    flex-direction: column;
    gap: $space-4;
    align-items: flex-start;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: $radius-lg;
    padding: $space-6;

    &__check {
        display: flex;
        align-items: center;
        gap: $space-3;
        cursor: pointer;
        font-size: $text-sm;
        font-weight: $fw-medium;
        color: var(--color-text);

        input[type="checkbox"] {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
            accent-color: var(--color-primary);
            cursor: pointer;
        }
    }

    .action-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
}

// ── Formulario ──────────────────────────────────────────────────────
.consent-form-header {
    margin-bottom: $space-8;

    h2 {
        font-size: $text-2xl;
        font-weight: $fw-bold;
        color: var(--color-text-heading);
        margin: $space-4 0 $space-1;
    }

    p {
        color: var(--color-text-muted);
        font-size: $text-sm;
        margin: 0;
    }
}

.consent-form {
    display: flex;
    flex-direction: column;
    gap: $space-6;

    &__group {
        display: flex;
        flex-direction: column;
        gap: $space-2;

        label {
            font-size: $text-sm;
            font-weight: $fw-semibold;
            color: var(--color-text);
        }

        input[type="text"], input[type="email"] {
            padding: $space-3 $space-4;
            border: 1px solid var(--color-border);
            border-radius: $radius-md;
            background: var(--color-bg);
            color: var(--color-text);
            font-size: $text-sm;
            font-family: $font-body;
            transition: $transition-fast;

            &:focus {
                outline: none;
                border-color: var(--color-primary);
                box-shadow: 0 0 0 3px var(--overlay-primary-10);
            }
        }
    }

    &__radios {
        display: flex;
        gap: $space-4;
        flex-wrap: wrap;
    }

    &__declarations {
        background: var(--color-bg);
        border-radius: $radius-md;
        padding: $space-5;
        display: flex;
        flex-direction: column;
        gap: $space-3;
    }

    &__declarations-title {
        font-size: $text-sm;
        font-weight: $fw-semibold;
        color: var(--color-text-heading);
        margin: 0 0 $space-1;
    }

    &__decl-item {
        font-size: $text-sm;
        color: var(--color-text);
        line-height: 1.5;
    }

    &__toggle {
        display: flex;
        align-items: flex-start;
        gap: $space-3;
        cursor: pointer;
        font-size: $text-sm;
        color: var(--color-text);

        input[type="checkbox"] {
            width: 18px;
            height: 18px;
            flex-shrink: 0;
            margin-top: 2px;
            accent-color: var(--color-primary);
        }
    }

    &__minor {
        background: var(--color-bg);
        border-radius: $radius-md;
        padding: $space-5;
        border-left: 3px solid var(--color-primary);
        display: flex;
        flex-direction: column;
        gap: $space-5;
    }

    &__sig-hint {
        font-size: $text-xs;
        color: var(--color-text-muted);
        margin: 0;
    }

    &__error {
        color: var(--color-error);
        font-size: $text-sm;
        background: rgba(239, 68, 68, 0.06);
        border-radius: $radius-md;
        padding: $space-3 $space-4;
        margin: 0;
    }

    &__submit {
        align-self: flex-start;

        @media (max-width: $bp-sm) { align-self: stretch; }
    }

    &__legal {
        font-size: $text-xs;
        color: var(--color-text-muted);
        margin: 0;
        line-height: 1.6;
    }
}

.radio-option {
    display: flex;
    align-items: center;
    gap: $space-2;
    cursor: pointer;
    font-size: $text-sm;
    color: var(--color-text);

    input[type="radio"] {
        accent-color: var(--color-primary);
        width: 16px;
        height: 16px;
    }
}

.check-icon {
    color: var(--color-success);
    font-weight: $fw-bold;
    margin-right: $space-2;
}

.req { color: var(--color-error); }

// ── Canvas firma ─────────────────────────────────────────────────────
.signature-wrap {
    border: 2px dashed var(--color-border);
    border-radius: $radius-md;
    background: var(--color-bg-card);
    overflow: hidden;
    height: 140px;
    cursor: crosshair;
    transition: $transition-fast;

    &:hover { border-color: var(--color-primary); }
}

.signature-canvas {
    width: 100%;
    height: 100%;
    touch-action: none;
}

.signature-clear {
    font-size: $text-xs;
    margin-top: $space-1;
}
</style>
