<template>
    <section class="hero">
        <div class="hero__background">
            <img src="/public/img/fondo-lucia-cafe.webp" alt="Consulta Lucia Diaz" />
            <div class="hero__veil"></div>
        </div>

        <div class="hero__content">
            <p class="hero__greeting">Bienvenida a tu espacio</p>
            <h2>¿Por qué amar me genera tanta ansiedad?</h2>
            <p class="hero__body">Descubre cómo construir relaciones seguras desde el entendimiento y la calma. He
                preparado este espacio para ti.</p>

            <RouterLink to="/terapias" class="hero__cta">
                Agendar sesión
            </RouterLink>
        </div>

        <div class="hero__fade"></div>
    </section>
</template>

<script setup>
</script>

<style scoped lang="scss">
.hero {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    text-align: center;

    &__background {
        position: absolute;
        inset: 0;
        z-index: 0;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center 20%;
        }
    }

    // Velo luminoso — deja ver la imagen, no la ahoga
    &__veil {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.4) 40%,
            rgba(255, 255, 255, 0.75) 75%,
            rgba(255, 255, 255, 0.95) 100%
        );
    }

    // Transición suave al siguiente bloque
    &__fade {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 6rem;
        background: linear-gradient(to bottom, transparent, var(--color-white));
        z-index: 2;
    }

    &__content {
        position: relative;
        z-index: 1;
        max-width: 680px;
        padding: 0 2rem;
        margin-top: 4rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0;
    }

    &__greeting {
        font-family: 'Montserrat', sans-serif;
        font-size: 0.85rem;
        font-weight: 500;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--color-primary);
        opacity: 0.7;
        margin-bottom: 1rem;
    }

    &__content h2 {
        font-size: 3.25rem;
        color: var(--color-primary-dark);
        margin-bottom: 1.5rem;
        line-height: 1.15;
        text-shadow: none;
    }

    &__body {
        font-size: 1.15rem;
        color: var(--color-text);
        max-width: 520px;
        font-weight: 400;
        line-height: 1.7;
        margin-bottom: 2.5rem;
    }

    &__cta {
        display: inline-flex;
        align-items: center;
        padding: 0.875rem 2.25rem;
        background: var(--color-secondary);
        color: var(--color-white);
        font-family: 'Montserrat', sans-serif;
        font-size: 0.95rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        border-radius: var(--radius-sm);
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background: var(--color-secondary-dark);
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(212, 160, 23, 0.25);
        }
    }
}

@media screen and (max-width: 768px) {
    .hero {
        height: 90vh;

        &__content {
            margin-top: 2rem;
            padding: 0 1.5rem;

            h2 {
                font-size: 2.2rem;
            }
        }

        &__body {
            font-size: 1rem;
        }

        &__greeting {
            font-size: 0.75rem;
        }
    }
}
</style>
