<template>
    <main class="legal-page">
        <div class="legal-page__container container">
            <div class="legal-page__header">
                <RouterLink to="/" class="legal-page__back">← Volver</RouterLink>
                <h1 class="legal-page__title">Aviso Legal</h1>
                <p class="legal-page__updated">Última actualización: enero de 2025</p>
            </div>

            <div class="legal-page__body">
                <section>
                    <h2>1. Datos identificativos del titular</h2>
                    <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSICE), se informa de los datos identificativos del responsable del sitio web:</p>
                    <ul>
                        <li><strong>Titular:</strong> Lucía Díaz</li>
                        <li><strong>Número de colegiada:</strong> F.P.V - 16.657</li>
                        <li><strong>Correo electrónico:</strong> info@luciadiaz.es</li>
                        <li><strong>Teléfono:</strong> +34 624 72 18 96</li>
                        <li><strong>Actividad:</strong> Servicios de psicología online</li>
                    </ul>
                </section>

                <section>
                    <h2>2. Objeto y ámbito de aplicación</h2>
                    <p>El presente Aviso Legal regula el acceso y uso del sitio web <strong>luciadiaz.es</strong> (en adelante, «el Sitio»), así como los servicios disponibles a través del mismo. Al acceder y navegar por el Sitio, el usuario acepta quedar vinculado por las condiciones aquí establecidas.</p>
                    <p>El titular se reserva el derecho a modificar el presente Aviso Legal en cualquier momento. Dichas modificaciones entrarán en vigor desde su publicación en el Sitio.</p>
                </section>

                <section>
                    <h2>3. Propiedad intelectual e industrial</h2>
                    <p>Todos los contenidos del Sitio (textos, imágenes, gráficos, logotipos, iconos, código fuente, diseños y cualquier otro elemento) son propiedad de Lucía Díaz o de sus licenciantes y están protegidos por la legislación española e internacional sobre propiedad intelectual e industrial.</p>
                    <p>Queda expresamente prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra forma de explotación, total o parcial, de dichos contenidos sin la autorización previa y por escrito del titular.</p>
                </section>

                <section>
                    <h2>4. Responsabilidad</h2>
                    <p>El titular no garantiza la ausencia de virus u otros elementos que puedan causar daños en los sistemas informáticos de los usuarios. Tampoco se hace responsable de los daños y perjuicios que pudieran derivarse del acceso al Sitio o del uso de la información contenida en él.</p>
                    <p>Los contenidos del Sitio tienen carácter meramente informativo y en ningún caso sustituyen el asesoramiento profesional individualizado. El uso de los materiales publicados (artículos, test, guías) no establece ninguna relación terapéutica entre el usuario y la titular.</p>
                </section>

                <section>
                    <h2>5. Legislación aplicable y jurisdicción</h2>
                    <p>El presente Aviso Legal se rige por la legislación española. Para la resolución de cualquier controversia que pudiera surgir en relación con el acceso o uso del Sitio, las partes se someten, con renuncia expresa a cualquier otro fuero, a los Juzgados y Tribunales competentes según la normativa vigente.</p>
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
                margin: 0;

                li { margin-bottom: 6px; }
            }
        }
    }
}
</style>
