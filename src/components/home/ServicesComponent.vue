<script setup>
import { services } from '../../static/services.js'
import { use_scroll_reveal } from '../../composables/use-scroll-reveal.js'

use_scroll_reveal()
</script>

<template>
    <section class="section-container services">
        <div class="section-container__header" data-scroll-reveal="fade-up">
            <h2>¿Qué quieres hacer hoy?</h2>
            <p>Elige el camino que mejor se adapte a donde estás ahora</p>
        </div>
        <div class="services__grid">
            <RouterLink class="services__card" v-for="(service, index) in services" :key="service.id"
                :to="service.route" data-scroll-reveal :style="{ '--delay': `${0.2 + index * 0.1}s` }">
                <div class="services__card__icon">
                    <img :src="service.icon" :alt="service.title">
                </div>
                <h4>{{ service.title }}</h4>
                <p>{{ service.description }}</p>
                <span class="services__card__arrow">→</span>
            </RouterLink>
        </div>
    </section>
</template>


<style scoped lang="scss">
.services {
    &__grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: $space-6;
        box-sizing: border-box;
    }

    &__card {
        background: var(--color-white);
        border: 1px solid var(--color-border-light);
        border-radius: $radius-md;
        padding: $space-8 $space-6 $space-6;
        display: flex;
        flex-direction: column;
        color: var(--color-text);
        cursor: pointer;
        position: relative;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        transition-delay: var(--delay, 0s);

        &.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        &__icon {
            width: $space-12;
            height: $space-12;
            margin-bottom: $space-5;

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                transition: $transition;
            }
        }

        h4 {
            margin: 0 0 $space-2;
            font-size: $text-lg;
            color: var(--color-primary);
            line-height: 1.35;
        }

        p {
            font-size: $text-sm;
            color: var(--color-text-muted);
            line-height: 1.55;
            margin: 0;
            flex: 1;
        }

        &__arrow {
            display: inline-block;
            margin-top: $space-5;
            font-size: $text-lg;
            color: var(--color-primary);
            opacity: 0;
            transform: translateX(-4px);
            transition: $transition;
        }

        &:hover {
            transform: translateY(-4px);
            border-color: var(--color-border);
            box-shadow: var(--shadow-sm);

            .services__card__icon img {
                transform: scale(1.08);
            }

            .services__card__arrow {
                opacity: 1;
                transform: translateX(0);
            }
        }
    }
}

@media screen and (max-width: $bp-lg) {
    .services__grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media screen and (max-width: $bp-md) {
    .services__grid {
        grid-template-columns: 1fr;
        gap: $space-4;
    }

    .services__card {
        padding: $space-6 $space-5 $space-5;
    }
}
</style>
