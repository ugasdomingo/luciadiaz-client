<template>
    <main class="legal-page">
        <div class="legal-page__container container">
            <div class="legal-page__header">
                <RouterLink to="/" class="legal-page__back">← Volver</RouterLink>
                <h1 class="legal-page__title">Política de Privacidad</h1>
                <p class="legal-page__updated">Última actualización: enero de 2025</p>
            </div>

            <div class="legal-page__body">
                <section>
                    <h2>1. Responsable del tratamiento</h2>
                    <ul>
                        <li><strong>Responsable:</strong> Lucía Díaz</li>
                        <li><strong>Número de colegiada:</strong> F.P.V - 16.657</li>
                        <li><strong>Correo electrónico:</strong> info@luciadiaz.es</li>
                        <li><strong>Teléfono:</strong> +34 624 72 18 96</li>
                    </ul>
                </section>

                <section>
                    <h2>2. Datos que recopilamos</h2>
                    <p>Recopilamos los siguientes datos personales en función de la relación que mantengas con nosotros:</p>
                    <ul>
                        <li><strong>Registro de cuenta:</strong> nombre, correo electrónico, contraseña (cifrada) y, en el caso de pacientes, número de teléfono.</li>
                        <li><strong>Uso de la plataforma:</strong> historial de acceso, progreso en formaciones y tests, y compras realizadas.</li>
                        <li><strong>Newsletter:</strong> dirección de correo electrónico para el envío de comunicaciones informativas.</li>
                        <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, sistema operativo y páginas visitadas, recogidos mediante cookies (ver Política de Cookies).</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Finalidades y base jurídica</h2>
                    <ul>
                        <li><strong>Prestación del servicio (art. 6.1.b RGPD):</strong> gestión de la cuenta de usuario, acceso a formaciones y seguimiento terapéutico contratado.</li>
                        <li><strong>Obligación legal (art. 6.1.c RGPD):</strong> cumplimiento de obligaciones fiscales, contables y colegiales.</li>
                        <li><strong>Interés legítimo (art. 6.1.f RGPD):</strong> seguridad de la plataforma y prevención del fraude.</li>
                        <li><strong>Consentimiento (art. 6.1.a RGPD):</strong> envío de newsletter y uso de cookies no esenciales. El consentimiento puede retirarse en cualquier momento sin que ello afecte a la licitud del tratamiento previo.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Conservación de los datos</h2>
                    <p>Los datos se conservarán durante el tiempo estrictamente necesario para la finalidad para la que fueron recabados y, en cualquier caso, durante los plazos legalmente exigidos. Los datos de pacientes se conservarán conforme a la legislación sanitaria aplicable (mínimo 5 años desde el último acto asistencial).</p>
                </section>

                <section>
                    <h2>5. Destinatarios</h2>
                    <p>Los datos no serán cedidos a terceros salvo obligación legal. Se utilizan los siguientes encargados del tratamiento:</p>
                    <ul>
                        <li><strong>Stripe, Inc.:</strong> procesamiento de pagos.</li>
                        <li><strong>Proveedor de hosting:</strong> alojamiento del sitio web y base de datos.</li>
                    </ul>
                    <p>Todos los encargados disponen de garantías adecuadas de protección conforme al RGPD.</p>
                </section>

                <section>
                    <h2>6. Derechos del interesado</h2>
                    <p>Puedes ejercer en cualquier momento los siguientes derechos enviando un correo a <strong>info@luciadiaz.es</strong> con copia de tu documento de identidad:</p>
                    <ul>
                        <li><strong>Acceso:</strong> conocer qué datos tenemos sobre ti.</li>
                        <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
                        <li><strong>Supresión:</strong> solicitar el borrado de tus datos.</li>
                        <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos.</li>
                        <li><strong>Limitación:</strong> solicitar la suspensión del tratamiento.</li>
                        <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado.</li>
                    </ul>
                    <p>También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en <strong>www.aepd.es</strong> si consideras que el tratamiento vulnera tus derechos.</p>
                </section>

                <section>
                    <h2>7. Seguridad</h2>
                    <p>Adoptamos las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales y evitar su pérdida, alteración, tratamiento o acceso no autorizado. Las contraseñas se almacenan de forma cifrada y las comunicaciones se realizan mediante protocolos seguros (HTTPS/TLS).</p>
                </section>
            </div>
        </div>
    </main>
</template>

<script setup>
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
</style>
