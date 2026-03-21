<script setup>
defineProps({
    therapy: Object
})

const emit = defineEmits(['reserve'])
</script>

<template>
    <article class="therapy-card">
        <!-- Imagen con overlay -->
        <div class="therapy-card__image">
            <img :src="therapy.image" :alt="therapy.title" />
            <div class="therapy-card__image-overlay"></div>
            <div class="therapy-card__badges">
                <span class="therapy-card__duration">🕐 {{ therapy.duration }}</span>
            </div>
        </div>

        <!-- Cuerpo -->
        <div class="therapy-card__body">
            <p class="therapy-card__subtitle">{{ therapy.subtitle }}</p>
            <h3 class="therapy-card__title">{{ therapy.title }}</h3>
            <p class="therapy-card__description">{{ therapy.description }}</p>

            <ul class="therapy-card__highlights">
                <li v-for="h in therapy.highlights" :key="h">
                    <span class="therapy-card__check">✓</span> {{ h }}
                </li>
            </ul>
        </div>

        <!-- Footer -->
        <div class="therapy-card__footer">
            <div class="therapy-card__price">
                <span class="therapy-card__price-amount">{{ therapy.precio }}€</span>
                <span class="therapy-card__price-label">/ sesión</span>
            </div>
            <button class="action-btn" @click="emit('reserve', therapy)">
                Reservar sesión
            </button>
        </div>
    </article>
</template>

<style scoped lang="scss">
.therapy-card {
    width: 100%;
    background: var(--color-bg-card);
    border-radius: $radius-xl;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    transition: $transition-slow;
    border: 1px solid var(--color-border-light);

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.14);
    }

    &__image {
        position: relative;
        height: 180px;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        &-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(
                to bottom,
                rgba(74, 63, 143, 0.15) 0%,
                rgba(74, 63, 143, 0.55) 100%
            );
        }
    }

    &:hover &__image img {
        transform: scale(1.04);
    }

    &__badges {
        position: absolute;
        bottom: $space-3;
        left: $space-3;
        display: flex;
        gap: $space-2;
    }

    &__duration {
        background: rgba(255, 255, 255, 0.92);
        color: var(--color-primary);
        font-size: $text-xs;
        font-weight: $fw-semibold;
        padding: $space-1 $space-3;
        border-radius: $radius-full;
        backdrop-filter: blur(4px);
    }

    &__body {
        flex: 1;
        padding: $space-6;
    }

    &__subtitle {
        margin: 0 0 $space-1;
        font-size: $text-xs;
        font-weight: $fw-semibold;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--color-primary);
    }

    &__title {
        margin: 0 0 $space-3;
        font-size: $text-xl;
        font-weight: $fw-bold;
        color: var(--color-text-heading);
        line-height: 1.2;
    }

    &__description {
        margin: 0 0 $space-4;
        font-size: $text-sm;
        color: var(--color-text-muted);
        line-height: 1.65;
    }

    &__highlights {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: $space-2;
    }

    &__highlights li {
        font-size: $text-sm;
        color: var(--color-text);
        display: flex;
        align-items: center;
        gap: $space-2;
    }

    &__check {
        color: var(--color-success);
        font-weight: $fw-bold;
        flex-shrink: 0;
    }

    &__footer {
        padding: $space-4 $space-6;
        border-top: 1px solid var(--color-border-light);
        background: var(--color-bg);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: $space-4;
    }

    &__price {
        display: flex;
        align-items: baseline;
        gap: $space-1;
    }

    &__price-amount {
        font-size: $text-2xl;
        font-weight: $fw-bold;
        color: var(--color-secondary);
        line-height: 1;
    }

    &__price-label {
        font-size: $text-xs;
        color: var(--color-text-muted);
    }
}
</style>
