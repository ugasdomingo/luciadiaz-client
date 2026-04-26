<script setup>
import { useCommonStore } from '../../stores/common-store';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const common_store = useCommonStore();

const products = computed(() => common_store.products?.slice(0, 4) || []);

const type_label = (type) => {
    const labels = {
        course: 'Formación',
        ebook: 'Guía',
        bundle: 'Pack',
        service: 'Servicio',
        formation: 'Formación',
        formation_presencial: 'Formación Presencial'
    };
    return labels[type] || 'Formación';
};

const format_price = (p) => `${p}€`;
</script>

<template>
    <section class="formations">
        <div class="container">
            <div class="formations__header">
                <div>
                    <div class="eyebrow">Herramientas</div>
                    <h2>Formaciones</h2>
                    <p class="formations__sub">
                        Lo que uso en consulta, ordenado en materiales que
                        puedes llevar a tu ritmo.
                    </p>
                </div>
                <RouterLink to="/productos" class="btn-ghost"
                    >Ver todas las herramientas →</RouterLink
                >
            </div>

            <div class="formations__grid">
                <div
                    v-for="product in products"
                    :key="product._id"
                    class="formation-card"
                    @click="router.push(`/productos/${product.slug}`)"
                >
                    <div class="formation-card__img-wrap">
                        <img
                            :src="product.cover_image?.secure_url"
                            :alt="product.title"
                            class="formation-card__img"
                        />
                        <div class="formation-card__tag">
                            {{ type_label(product.type) }}
                        </div>
                    </div>
                    <div class="formation-card__body">
                        <h4 class="formation-card__title">
                            {{ product.title }}
                        </h4>
                        <div class="formation-card__price-row">
                            <span class="formation-card__price">{{
                                format_price(
                                    product.presale_price ?? product.price
                                )
                            }}</span>
                            <span
                                v-if="product.presale_price"
                                class="formation-card__old"
                                >{{ format_price(product.price) }}</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.formations {
    padding: 120px 0;
    background: var(--white);
}

.container {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 0 28px;
}

.formations__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 56px;
    gap: 24px;
    flex-wrap: wrap;
}

.eyebrow {
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--blue);
    margin-bottom: 14px;
}

h2 {
    font-family: var(--font-title);
    font-size: clamp(2rem, 4.2vw, 3.25rem);
    font-weight: 700;
    color: var(--blue-ink);
    line-height: 1.08;
    letter-spacing: -0.02em;
    margin: 0 0 12px;
    max-width: 520px;
    em {
        font-style: italic;
        color: var(--gold-deep);
    }
}

.formations__sub {
    font-size: 17px;
    color: var(--ink-muted);
    max-width: 480px;
    margin: 0;
    font-weight: 300;
}

.btn-ghost {
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 14px;
    color: var(--blue);
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.2s var(--ease);
    &:hover {
        color: var(--gold-deep);
    }
}

.formations__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.formation-card {
    border-radius: 16px;
    overflow: hidden;
    background: var(--white);
    border: 1px solid var(--border-soft);
    cursor: pointer;
    transition:
        transform 0.35s var(--ease),
        box-shadow 0.35s var(--ease),
        border-color 0.3s var(--ease);

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 36px rgba(7, 30, 77, 0.1);
        border-color: var(--border-gold);

        .formation-card__img {
            transform: scale(1.06);
        }
    }
}

.formation-card__img-wrap {
    position: relative;
    aspect-ratio: 3/4;
    overflow: hidden;
    background: var(--blue-wash);
}

.formation-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s var(--ease);
}

.formation-card__tag {
    position: absolute;
    top: 14px;
    left: 14px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(6px);
    padding: 6px 12px;
    border-radius: 999px;
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 600;
    color: var(--blue-ink);
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.formation-card__body {
    padding: 20px;
}

.formation-card__title {
    font-family: var(--font-title);
    font-size: 17px;
    font-weight: 600;
    color: var(--blue-ink);
    line-height: 1.25;
    margin: 0 0 12px;
}

.formation-card__price-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
}

.formation-card__price {
    font-family: var(--font-title);
    font-size: 22px;
    font-weight: 700;
    color: var(--gold-deep);
}

.formation-card__old {
    font-size: 13px;
    color: var(--ink-faint);
    text-decoration: line-through;
}

@media (max-width: 980px) {
    .formations__grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .formations__grid {
        grid-template-columns: 1fr;
    }
}
</style>
