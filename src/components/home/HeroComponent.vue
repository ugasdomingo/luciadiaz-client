<template>
    <section class="hero">
        <div class="hero__image">
            <img src="/img/nuevo-fondo.jpg" alt="Consulta Lucia Diaz" />
            <div class="hero__veil"></div>
        </div>

        <div class="hero__content">
            <p class="hero__greeting">Bienvenida(o) a tu espacio</p>
            <h2>¿Ya tienes tu café?</h2>
            <p class="hero__body">Busca tu bebida favorita y acompañame a sumergirnos en lo marivillosa y poderosa que
                es tu mente.</p>

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
    justify-content: space-between;
    align-items: center;
    position: relative;
    gap: 0;
    overflow: hidden;
    text-align: center;

    &__image {
        width: 50%;
        height: 100%;
        inset: 0;
        z-index: 0;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center 25%;
        }
    }

    &__veil {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg,
                rgba(255, 255, 255, 0.0) 0%,
                rgba(255, 255, 255, 0.0) 40%,
                rgba(255, 255, 255, 0.2) 75%,
                rgba(255, 255, 255, 0.3) 100%);
    }

    &__fade {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: $space-24;
        background: linear-gradient(to bottom, transparent, var(--color-white));
        z-index: 2;
    }

    &__content {
        position: relative;
        z-index: 1;
        max-width: 50%;
        padding: 0 $space-16;
        margin-top: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 0;
    }

    &__greeting {
        font-family: $font-body;
        font-size: $text-sm;
        font-weight: $fw-medium;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--color-primary);
        opacity: 0.7;
        margin-bottom: $space-4;
    }

    &__content h2 {
        font-size: clamp(1.75rem, 3.5vw, 3.25rem);
        color: var(--color-primary-dark);
        margin-bottom: $space-6;
        line-height: 1.15;
        text-shadow: none;
    }

    &__body {
        font-size: $text-lg;
        color: var(--color-text);
        max-width: 520px;
        font-weight: $fw-regular;
        line-height: 1.7;
        margin-bottom: $space-10;
    }

    &__cta {
        display: inline-flex;
        align-items: center;
        padding: $space-3 $space-10;
        background: var(--color-secondary);
        color: var(--color-white);
        font-family: $font-body;
        font-size: $text-base;
        font-weight: $fw-semibold;
        letter-spacing: 0.02em;
        border-radius: $radius-sm;
        border: none;
        cursor: pointer;
        transition: $transition-slow;

        &:hover {
            background: var(--color-secondary-dark);
            transform: translateY(-2px);
            box-shadow: var(--shadow-gold);
        }
    }
}

@media screen and (max-width: $bp-lg) {
    .hero {
        height: auto;
        min-height: 100svh;
        flex-direction: column;
        justify-content: flex-end;

        &__image {
            width: 100%;
            height: 55vh;
            position: absolute;
            top: 0;
            left: 0;
        }

        &__content {
            position: relative;
            z-index: 2;
            max-width: 100%;
            width: 100%;
            padding: $space-8 $space-6 $space-16;
            margin-top: 0;
            background: linear-gradient(to bottom, transparent, var(--color-white) 15%);
        }

        &__body {
            font-size: $text-base;
            max-width: 100%;
        }

        &__greeting {
            font-size: $text-xs;
        }
    }
}

@media screen and (max-width: $bp-xs) {
    .hero {
        &__image {
            height: 48vh;
        }

        &__content {
            padding: $space-8 $space-5 $space-12;
        }
    }
}
</style>
