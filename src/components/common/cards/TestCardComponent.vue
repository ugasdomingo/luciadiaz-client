<script setup>
import LikeButtonComponent from '../LikeButtonComponent.vue'

defineProps({
    test: { type: Object, required: true },
    index: { type: Number, default: 0 }
})

const palette = [
    { bg: 'rgba(124, 111, 255, 0.08)', accent: '#7c6fff', icon: '🧠' },
    { bg: 'rgba(52, 211, 153, 0.08)', accent: '#059669', icon: '🌡️' },
    { bg: 'rgba(212, 160, 23, 0.08)', accent: '#b8860b', icon: '✉️' },
]
</script>

<template>
    <RouterLink :to="test.link" class="test-card" :style="{ '--card-bg': palette[index % 3].bg, '--card-accent': palette[index % 3].accent }">
        <div class="test-card__icon-area">
            <span class="test-card__emoji">{{ palette[index % 3].icon }}</span>
        </div>
        <div class="test-card__body">
            <h3 class="test-card__title">{{ test.name }}</h3>
            <p class="test-card__brief">{{ test.brief }}</p>
            <p class="test-card__desc">{{ test.description }}</p>
        </div>
        <div class="test-card__footer">
            <span class="test-card__cta">Comenzar test →</span>
            <LikeButtonComponent item_type="Test" :item_id="test.id" />
        </div>
    </RouterLink>
</template>

<style scoped lang="scss">
.test-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: var(--radius-lg);
    overflow: hidden;
    text-decoration: none;
    color: var(--color-text);
    background: var(--card-bg, rgba(30, 86, 160, 0.06));
    border: 1px solid transparent;
    transition: var(--transition-slow);
    box-sizing: border-box;

    &:hover {
        border-color: var(--card-accent, var(--color-primary));
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

        .test-card__cta {
            color: var(--card-accent, var(--color-primary));
            gap: 0.5rem;
        }
    }

    &__icon-area {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2.5rem 1rem 1.5rem;
        background: var(--card-bg, rgba(30, 86, 160, 0.04));
    }

    &__emoji {
        font-size: 3.5rem;
        line-height: 1;
        filter: saturate(1.2);
    }

    &__body {
        padding: 1.25rem 1.5rem 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
    }

    &__title {
        font-family: 'Playfair Display', serif;
        font-size: var(--text-xl);
        font-weight: 700;
        color: var(--color-primary-dark);
        margin: 0;
        line-height: 1.25;
    }

    &__brief {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--card-accent, var(--color-primary));
        margin: 0;
        font-family: 'Montserrat', sans-serif;
    }

    &__desc {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
        line-height: 1.55;
        margin: 0;
    }

    &__footer {
        padding: 1rem 1.5rem 1.5rem;
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
    }

    &__cta {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--color-primary);
        font-family: 'Montserrat', sans-serif;
        transition: var(--transition);
    }
}
</style>
