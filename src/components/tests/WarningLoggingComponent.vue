<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <div class="warning-page">
        <!-- Hero -->
        <div class="warning-hero">
            <div class="warning-hero__deco" />
            <div class="warning-hero__inner">
                <div class="warning-hero__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h1 class="warning-hero__title">Tests gratuitos</h1>
                <p class="warning-hero__sub">Accede a tests de autoconocimiento diseñados para ayudarte a entender tu mente y emociones.</p>
            </div>
        </div>

        <!-- Card principal -->
        <div class="warning-body">
            <div class="warning-card">

                <!-- Aviso -->
                <div class="warning-card__notice">
                    <div class="warning-card__notice-dot" />
                    <p>Para realizar los tests necesitas <strong>iniciar sesión</strong> o <strong>registrarte</strong>. Es gratuito y tus resultados quedan cifrados y seguros.</p>
                </div>

                <!-- Beneficios -->
                <div class="warning-card__benefits">
                    <h3 class="warning-card__benefits-title">¿Qué obtienes al registrarte?</h3>
                    <ul class="benefits-list">
                        <li class="benefits-list__item">
                            <div class="benefits-list__icon">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </div>
                            <span>Consulta tus resultados en cualquier momento</span>
                        </li>
                        <li class="benefits-list__item">
                            <div class="benefits-list__icon">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </div>
                            <span>Los tests se complementan entre sí para una visión más completa</span>
                        </li>
                        <li class="benefits-list__item">
                            <div class="benefits-list__icon benefits-list__icon--gold">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                            </div>
                            <span>Completa los 3 tests y recibe <strong>3 obsequios personalizados</strong></span>
                        </li>
                    </ul>
                </div>

                <!-- CTAs -->
                <div class="warning-card__actions">
                    <RouterLink to="/acceso" class="warning-card__btn warning-card__btn--primary">
                        Iniciar sesión
                    </RouterLink>
                    <RouterLink to="/acceso" class="warning-card__btn warning-card__btn--outline">
                        Crear cuenta gratis
                    </RouterLink>
                </div>

                <p class="warning-card__footer">Los tests son completamente gratuitos.</p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.warning-page {
    min-height: 80vh;
    background: var(--color-bg);
}

/* Hero */
.warning-hero {
    background: var(--blue-ink);
    padding: 64px 28px 56px;
    text-align: center;
    position: relative;
    overflow: hidden;

    &__deco {
        position: absolute;
        top: -160px; left: 50%;
        transform: translateX(-50%);
        width: 500px; height: 500px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(245,197,24,0.08), transparent 65%);
        pointer-events: none;
    }

    &__inner { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; }

    &__icon {
        width: 64px; height: 64px;
        background: rgba(245,197,24,0.15);
        border: 1px solid rgba(245,197,24,0.3);
        border-radius: $radius-full;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        color: var(--gold-light);
    }

    &__title {
        font-family: var(--font-title);
        font-size: clamp(28px, 5vw, 44px);
        font-weight: 700;
        color: white;
        margin: 0 0 14px;
    }

    &__sub {
        font-size: 16px;
        color: rgba(255,255,255,0.7);
        line-height: 1.7;
        margin: 0;
        font-family: var(--font-body);
    }
}

/* Body */
.warning-body {
    max-width: 560px;
    margin: 0 auto;
    padding: 40px 28px 80px;
    @media (max-width: $bp-sm) { padding: 28px 16px 60px; }
}

/* Card */
.warning-card {
    background: white;
    border-radius: var(--r-xl);
    border: 1.5px solid var(--border);
    padding: 36px;
    box-shadow: var(--shadow-md-new);

    @media (max-width: $bp-sm) { padding: 24px; }

    /* Aviso */
    &__notice {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        background: var(--blue-wash);
        border: 1px solid rgba(30,86,160,0.15);
        border-radius: var(--r-lg);
        padding: 14px 16px;
        margin-bottom: 28px;

        p {
            font-size: 14px;
            color: var(--blue-ink);
            line-height: 1.6;
            margin: 0;
            font-family: var(--font-body);
        }
    }

    &__notice-dot {
        width: 8px; height: 8px;
        border-radius: $radius-full;
        background: var(--color-primary);
        flex-shrink: 0;
        margin-top: 6px;
    }

    /* Beneficios */
    &__benefits-title {
        font-family: var(--font-title);
        font-size: 17px;
        color: var(--blue-ink);
        margin: 0 0 16px;
    }

    /* Acciones */
    &__actions {
        display: flex;
        gap: 10px;
        margin-top: 28px;
        flex-wrap: wrap;

        @media (max-width: $bp-sm) { flex-direction: column; }
    }

    &__btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 13px 20px;
        border-radius: $radius-full;
        font-size: 14px;
        font-weight: $fw-semibold;
        font-family: var(--font-body);
        text-decoration: none;
        transition: transform 0.2s var(--ease), box-shadow 0.2s, opacity 0.2s;
        text-align: center;

        &:hover { transform: translateY(-2px); opacity: 0.9; }

        &--primary {
            background: var(--gold-grad);
            color: white;
            box-shadow: var(--shadow-gold-new);
        }

        &--outline {
            background: transparent;
            color: var(--blue-ink);
            border: 1.5px solid var(--border);
            &:hover { border-color: var(--color-primary); color: var(--color-primary); }
        }
    }

    &__footer {
        font-size: 12px;
        color: var(--ink-faint);
        text-align: center;
        margin: 16px 0 0;
        font-family: var(--font-body);
    }
}

/* Beneficios lista */
.benefits-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 14px;
        color: var(--color-text);
        font-family: var(--font-body);
        line-height: 1.5;
    }

    &__icon {
        width: 22px; height: 22px;
        background: var(--blue-wash);
        border-radius: $radius-sm;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-primary);
        flex-shrink: 0;
        margin-top: 1px;

        &--gold {
            background: rgba(245,197,24,0.12);
            color: var(--gold);
        }
    }
}
</style>
