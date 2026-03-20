<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <section role="note" aria-labelledby="aviso-titulo" class="warning__container">
        <h2 id="aviso-titulo">🔔 Un aviso importante para ti</h2>

        <p>
            Tu salud mental y tranquilidad es lo primero, y por eso gestiono cuidadosamente tu información.
        </p>

        <p>
            Aunque los tests son totalmente <strong>gratuitos</strong>, para realizarlos necesito que
            <strong>inicies sesión</strong> o <strong>te registres</strong>. De esa manera puedo cifrarlos
            para tu tranquilidad y seguridad.
        </p>

        <h3>✨ Beneficios de registrarte</h3>
        <ul>
            <li>Consulta tus resultados en cualquier momento.</li>
            <li>Obtén una visión más completa: los tests se complementan entre sí.</li>
            <li>
                Si completas todos los tests, recibirás <strong>3 obsequios personalizados</strong> a tu elección.
            </li>
        </ul>

        <RouterLink to="/acceso" class="nobg-btn">Iniciar sesión</RouterLink>
    </section>

</template>

<style scoped lang="scss">
.warning__container {
    width: 60%;
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    padding: $space-8;
    border-radius: $radius-lg;
    margin: 0 auto;

    h2 {
        padding: 0;
        margin-top: 0;
        color: var(--color-text);
    }

    p {
        padding: 0;
        font-size: $text-xl;
    }

    ul {
        padding: 0;
        text-align: left;
        color: var(--color-text);
    }

    li {
        margin: 0;
        padding: 0;
    }

    .warning__actions {
        display: flex;
        justify-content: center;
        gap: $space-4;
    }

    .nobg-btn {
        width: fit-content;
    }
}
</style>
