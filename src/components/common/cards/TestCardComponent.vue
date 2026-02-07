<script setup>
defineProps({
    test: Object
})
</script>

<template>
    <RouterLink :to="test.link" class="test__card">
        <div class="test__card__image">
            <img :src="test.image" :alt="test.name">
        </div>
        <div class="test__card__body">
            <h4>{{ test.name }}</h4>
            <p>{{ test.brief }}</p>
            <span class="test__card__cta">Realizar test →</span>
        </div>
    </RouterLink>
</template>

<style scoped lang="scss">
.test__card {
    width: 100%;
    max-width: 22rem;
    border-radius: var(--radius-md);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    color: var(--color-text);
    cursor: pointer;
    background: var(--color-white);
    border: 1px solid var(--color-border-light);
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(20px);
    transition-delay: var(--delay, 0s);

    &.is-visible {
        opacity: 1;
        transform: translateY(0);
    }

    &:hover {
        transform: translateY(-4px);
        border-color: var(--color-border);
        box-shadow: var(--shadow-sm);

        .test__card__image img {
            transform: scale(1.04);
        }

        .test__card__cta {
            color: var(--color-secondary);
        }
    }

    &__image {
        width: 100%;
        aspect-ratio: 1;
        overflow: hidden;
        background: var(--color-bg);

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
        }
    }

    &__body {
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
    }

    h4 {
        font-size: 1.05rem;
        margin: 0;
        color: var(--color-primary);
        line-height: 1.35;
    }

    p {
        font-size: 0.875rem;
        margin: 0;
        color: var(--color-text-muted);
        line-height: 1.5;
    }

    &__cta {
        margin-top: 0.5rem;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--color-primary);
        transition: color 0.25s ease;
    }
}
</style>
