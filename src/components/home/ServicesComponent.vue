<script setup>
import { services } from '../../static/services.js'
import { use_scroll_reveal } from '../../composables/use-scroll-reveal.js'

use_scroll_reveal()
</script>
<template>
    <section class="services">
        <div class="services__intro" data-scroll-reveal="fade-up">
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
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 6rem 4rem 8rem;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    &__intro {
        text-align: center;
        margin-bottom: 3.5rem;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;

        &.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        h2 {
            margin-bottom: 0.75rem;
        }

        p {
            color: var(--color-text-muted);
            font-size: 1.05rem;
            max-width: 400px;
            margin: 0 auto;
        }
    }

    &__grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        box-sizing: border-box;
    }

    &__card {
        background: var(--color-white);
        border: 1px solid var(--color-border-light);
        border-radius: var(--radius-md);
        padding: 2rem 1.5rem 1.5rem;
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
            width: 3rem;
            height: 3rem;
            margin-bottom: 1.25rem;

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                transition: transform 0.3s ease;
            }
        }

        h4 {
            margin: 0 0 0.5rem;
            font-size: 1.1rem;
            color: var(--color-primary);
            line-height: 1.35;
        }

        p {
            font-size: 0.9rem;
            color: var(--color-text-muted);
            line-height: 1.55;
            margin: 0;
            flex: 1;
        }

        &__arrow {
            display: inline-block;
            margin-top: 1.25rem;
            font-size: 1.1rem;
            color: var(--color-primary);
            opacity: 0;
            transform: translateX(-4px);
            transition: all 0.3s ease;
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

@media screen and (max-width: 1024px) {
    .services {
        padding: 4rem 2rem 6rem;

        &__grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media screen and (max-width: 720px) {
    .services {
        padding: 4rem 1.25rem;

        &__grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        &__card {
            padding: 1.5rem 1.25rem 1.25rem;
        }
    }
}
</style>
