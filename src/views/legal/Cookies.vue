<template>
    <main class="legal-page">
        <div class="legal-page__container container">
            <div class="legal-page__header">
                <RouterLink to="/" class="legal-page__back">← Volver</RouterLink>
                <h1 class="legal-page__title">Política de Cookies</h1>
                <p class="legal-page__updated">Última actualización: enero de 2025</p>
            </div>

            <div class="legal-page__body">
                <section>
                    <h2>1. ¿Qué son las cookies?</h2>
                    <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en el dispositivo del usuario cuando este los visita. Su función es recordar información sobre la visita para facilitar la navegación, personalizar la experiencia y, en algunos casos, recopilar estadísticas anónimas de uso.</p>
                </section>

                <section>
                    <h2>2. Cookies que utilizamos</h2>

                    <h3>Cookies estrictamente necesarias</h3>
                    <p>Son imprescindibles para el funcionamiento del sitio web y no pueden desactivarse. No almacenan información personal identificable.</p>
                    <table class="cookies-table">
                        <thead>
                            <tr>
                                <th>Cookie</th>
                                <th>Finalidad</th>
                                <th>Duración</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>cookies_consent</code></td>
                                <td>Guarda la preferencia de aceptación de cookies</td>
                                <td>1 año</td>
                            </tr>
                            <tr>
                                <td><code>refresh_token</code></td>
                                <td>Mantiene la sesión del usuario autenticado</td>
                                <td>Sesión / 30 días</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Cookies analíticas (opcionales)</h3>
                    <p>Nos ayudan a entender cómo interactúan los usuarios con el sitio para mejorar su funcionamiento. Solo se activan si el usuario da su consentimiento.</p>
                    <table class="cookies-table">
                        <thead>
                            <tr>
                                <th>Cookie</th>
                                <th>Proveedor</th>
                                <th>Finalidad</th>
                                <th>Duración</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>_ga</code></td>
                                <td>Google Analytics</td>
                                <td>Distingue usuarios únicos</td>
                                <td>2 años</td>
                            </tr>
                            <tr>
                                <td><code>_ga_*</code></td>
                                <td>Google Analytics</td>
                                <td>Mantiene el estado de sesión analítica</td>
                                <td>2 años</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section>
                    <h2>3. Gestión del consentimiento</h2>
                    <p>Al visitar el sitio web por primera vez, se muestra un banner informativo donde puedes aceptar o rechazar las cookies no esenciales. Tu elección quedará guardada para futuras visitas.</p>
                    <p>Si deseas modificar tu consentimiento, puedes hacerlo borrando las cookies de tu navegador y volviendo a visitar el sitio, o configurando directamente las preferencias desde tu navegador.</p>
                    <button class="reset-btn" @click="reset_consent">
                        Restablecer preferencias de cookies
                    </button>
                </section>

                <section>
                    <h2>4. Cómo gestionar las cookies desde el navegador</h2>
                    <p>Puedes configurar tu navegador para bloquear o eliminar cookies en cualquier momento. A continuación encontrarás instrucciones para los navegadores más habituales:</p>
                    <ul>
                        <li><strong>Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios.</li>
                        <li><strong>Mozilla Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio.</li>
                        <li><strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos del sitio web.</li>
                        <li><strong>Microsoft Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies.</li>
                    </ul>
                    <p>Ten en cuenta que bloquear las cookies necesarias puede afectar al funcionamiento del sitio web.</p>
                </section>

                <section>
                    <h2>5. Más información</h2>
                    <p>Para cualquier consulta sobre el uso de cookies puedes contactar en <strong>info@luciadiaz.es</strong>. Para ampliar información sobre cookies y tu privacidad puedes visitar el sitio de la <strong>Agencia Española de Protección de Datos</strong> en <strong>www.aepd.es</strong>.</p>
                </section>
            </div>
        </div>
    </main>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const reset_consent = () => {
    localStorage.removeItem('cookies_consent')
    router.push('/')
}
</script>

<style scoped lang="scss">
.legal-page {
    min-height: 80vh;
    padding: 80px 0 120px;
    background: var(--color-bg);

    &__container {
        max-width: 760px;
        margin: 0 auto;
        padding: 0 28px;
    }

    &__header {
        margin-bottom: 48px;
    }

    &__back {
        display: inline-block;
        font-size: 14px;
        color: var(--color-primary);
        text-decoration: none;
        margin-bottom: 24px;
        transition: opacity 0.2s;

        &:hover { opacity: 0.7; }
    }

    &__title {
        font-family: var(--font-title);
        font-size: clamp(28px, 5vw, 42px);
        font-weight: 700;
        color: var(--blue-ink);
        margin: 0 0 8px;
    }

    &__updated {
        font-size: 13px;
        color: var(--color-text-muted);
        margin: 0;
    }

    &__body {
        section {
            margin-bottom: 40px;

            h2 {
                font-family: var(--font-title);
                font-size: 20px;
                font-weight: 600;
                color: var(--blue-ink);
                margin: 0 0 16px;
            }

            h3 {
                font-family: var(--font-title);
                font-size: 16px;
                font-weight: 600;
                color: var(--blue-ink);
                margin: 24px 0 12px;
            }

            p {
                font-size: 15px;
                line-height: 1.8;
                color: var(--color-text);
                margin: 0 0 14px;

                &:last-child { margin-bottom: 0; }
            }

            ul {
                font-size: 15px;
                line-height: 1.8;
                color: var(--color-text);
                padding-left: 24px;
                margin: 0 0 14px;

                li { margin-bottom: 6px; }
            }
        }
    }
}

.cookies-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    margin-bottom: 24px;

    th, td {
        text-align: left;
        padding: 10px 14px;
        border-bottom: 1px solid var(--color-border-light, rgba(0,0,0,0.08));
    }

    th {
        font-weight: 600;
        color: var(--blue-ink);
        background: rgba(0,0,0,0.02);
    }

    code {
        font-size: 12px;
        background: rgba(0,0,0,0.05);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: monospace;
    }
}

.reset-btn {
    margin-top: 8px;
    padding: 10px 20px;
    background: transparent;
    border: 1.5px solid var(--color-primary, #b08a3e);
    color: var(--color-primary, #b08a3e);
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;

    &:hover {
        background: var(--color-primary, #b08a3e);
        color: white;
    }
}
</style>
