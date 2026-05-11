<template>
    <main class="legal-page">
        <div class="legal-page__container container">
            <div class="legal-page__header">
                <RouterLink to="/" class="legal-page__back">← Volver</RouterLink>
                <h1 class="legal-page__title">Términos y Condiciones</h1>
                <p class="legal-page__updated">Última actualización: enero de 2025</p>
            </div>

            <div class="legal-page__body">
                <section>
                    <h2>1. Aceptación de los términos</h2>
                    <p>El acceso y uso de los servicios ofrecidos en <strong>luciadiaz.es</strong> implica la aceptación plena y sin reservas de los presentes Términos y Condiciones. Si no estás de acuerdo con alguno de los puntos establecidos, te rogamos que no utilices la plataforma.</p>
                </section>

                <section>
                    <h2>2. Descripción del servicio</h2>
                    <p>A través de esta plataforma se ofrecen los siguientes servicios:</p>
                    <ul>
                        <li><strong>Sesiones de psicología online:</strong> consultas individuales a través de videollamada con Lucía Díaz, colegiada F.P.V - 16.657.</li>
                        <li><strong>Formaciones y guías digitales:</strong> productos descargables y/o de acceso en plataforma sobre bienestar emocional y psicología.</li>
                        <li><strong>Tests psicológicos de orientación:</strong> cuestionarios gratuitos con fines informativos, sin valor diagnóstico clínico.</li>
                        <li><strong>Blog y contenidos:</strong> artículos y materiales divulgativos de acceso libre.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Registro y cuenta de usuario</h2>
                    <p>Para acceder a determinados servicios es necesario crear una cuenta. El usuario se compromete a:</p>
                    <ul>
                        <li>Proporcionar datos verídicos, exactos y actualizados.</li>
                        <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
                        <li>Notificar de inmediato cualquier uso no autorizado de su cuenta.</li>
                        <li>No ceder ni compartir el acceso a su cuenta con terceros.</li>
                    </ul>
                    <p>El titular se reserva el derecho de suspender o cancelar cuentas que incumplan estos términos.</p>
                </section>

                <section>
                    <h2>4. Contratación y pagos</h2>
                    <p>Los precios de los servicios son los indicados en cada momento en la plataforma e incluyen los impuestos aplicables. El pago se realiza de forma segura a través de <strong>Stripe</strong>. Una vez completada la compra, recibirás la confirmación por correo electrónico.</p>
                    <p>Las sesiones de psicología son servicios personales prestados en base a una cita previa confirmada. La contratación implica la aceptación expresa de que el servicio comienza a prestarse en la fecha acordada.</p>
                </section>

                <section>
                    <h2>5. Política de cancelación y devoluciones</h2>
                    <p><strong>Sesiones de terapia:</strong> podrás cancelar o reprogramar sin coste hasta 24 horas antes del inicio de la sesión. Las cancelaciones con menos de 24 horas de antelación no darán derecho a devolución.</p>
                    <p><strong>Productos digitales (formaciones, guías):</strong> dada la naturaleza digital del producto y el acceso inmediato al contenido, no se admiten devoluciones una vez iniciada la descarga o el acceso, de conformidad con el art. 103.m) del Real Decreto Legislativo 1/2007.</p>
                    <p>Para cualquier incidencia relacionada con pagos, contacta en <strong>info@luciadiaz.es</strong>.</p>
                </section>

                <section>
                    <h2>6. Uso adecuado de la plataforma</h2>
                    <p>El usuario se compromete a no utilizar la plataforma para fines ilícitos, difamatorios, abusivos o que vulneren derechos de terceros. Queda prohibido:</p>
                    <ul>
                        <li>Reproducir, distribuir o comercializar los contenidos sin autorización.</li>
                        <li>Intentar acceder a sistemas o datos de otros usuarios.</li>
                        <li>Interferir en el funcionamiento técnico de la plataforma.</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Limitación de responsabilidad</h2>
                    <p>Los tests y contenidos del blog tienen carácter exclusivamente divulgativo y no constituyen diagnóstico clínico ni sustituto de atención psicológica profesional. El titular no se hace responsable de las decisiones que el usuario tome basándose en dichos contenidos.</p>
                </section>

                <section>
                    <h2>8. Modificaciones</h2>
                    <p>El titular se reserva el derecho de modificar los presentes Términos en cualquier momento. Los cambios entrarán en vigor desde su publicación. El uso continuado de la plataforma tras la publicación de cambios implica la aceptación de los términos actualizados.</p>
                </section>

                <section>
                    <h2>9. Legislación aplicable</h2>
                    <p>Los presentes Términos se rigen por la legislación española. Cualquier disputa se someterá a los tribunales competentes según lo establecido en la normativa vigente.</p>
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
