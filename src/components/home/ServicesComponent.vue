<script setup>
const items = [
    { id: 'terapias', path: '/terapias', title: 'Terapia', desc: 'Sesiones individuales, de pareja u orientación parental.', icon: '/icon/terapia.svg', tag: 'Desde 40€', bg: 'linear-gradient(135deg, #EEF4FC, #FFFFFF)', ring: 'var(--blue)' },
    { id: 'tests', path: '/tests', title: 'Tests', desc: 'Explora tu mundo interior en pequeños ejercicios guiados.', icon: '/icon/test.svg', tag: 'Gratis', bg: 'linear-gradient(135deg, #FFF8E1, #FFFFFF)', ring: 'var(--gold-bright)' },
    { id: 'formaciones', path: '/productos', title: 'Formaciones', desc: 'Cursos y guías para entender mejor tu mente y emociones.', icon: '/icon/formacion.svg', tag: 'A tu ritmo', bg: 'linear-gradient(135deg, #F2EAFF, #FFFFFF)', ring: '#7B5EBC' },
    { id: 'blog', path: '/blog', title: 'Artículos', desc: 'Lecturas breves con herramientas aplicables cada día.', icon: '/icon/post.svg', tag: 'Nuevo cada semana', bg: 'linear-gradient(135deg, #E8F5ED, #FFFFFF)', ring: '#4A9E6B' },
]
</script>

<template>
    <section class="services">
        <div class="container">
            <div class="services__header">
                <div class="eyebrow">Tu camino</div>
                <h2>¿Qué quieres hacer <em>hoy</em>?</h2>
                <p class="services__sub">Elige el camino que mejor se adapte a dónde estás ahora.</p>
            </div>

            <div class="services__grid">
                <RouterLink
                    v-for="item in items"
                    :key="item.id"
                    :to="item.path"
                    class="service-card"
                    :style="{ '--card-ring': item.ring }"
                >
                    <div class="service-card__icon" :style="{ background: item.bg }">
                        <img :src="item.icon" :alt="item.title" />
                    </div>
                    <h3 class="service-card__title">{{ item.title }}</h3>
                    <p class="service-card__desc">{{ item.desc }}</p>
                    <div class="service-card__footer">
                        <span class="pill-gold">{{ item.tag }}</span>
                        <span class="service-card__arrow">→</span>
                    </div>
                </RouterLink>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.services {
    padding: 120px 0;
    background: var(--cream);
    position: relative;
}

.container {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 0 28px;
}

.services__header {
    text-align: center; max-width: 620px;
    margin: 0 auto 72px;
}

.eyebrow {
    font-family: var(--font-body);
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--blue); margin-bottom: 18px;
}

h2 {
    font-family: var(--font-title);
    font-size: clamp(2rem, 4.2vw, 3.25rem);
    font-weight: 700; color: var(--blue-ink);
    line-height: 1.08; letter-spacing: -0.02em;
    margin: 0 0 18px;

    em { font-style: italic; color: var(--gold-deep); }
}

.services__sub {
    font-size: 18px; color: var(--ink-muted); margin: 0;
    font-weight: 300; line-height: 1.65;
}

.services__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
}

.service-card {
    background: var(--white);
    border-radius: 20px; padding: 28px;
    border: 1px solid var(--border-soft);
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    transition: transform .35s var(--ease), box-shadow .35s var(--ease), border-color .3s var(--ease);
    display: flex; flex-direction: column; min-height: 260px;
    position: relative; overflow: hidden;

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 40px rgba(7,30,77,0.10);
        border-color: var(--card-ring);

        .service-card__arrow {
            background: var(--gold-grad);
            color: var(--white);
            transform: translateX(4px);
        }
    }
}

.service-card__icon {
    width: 64px; height: 64px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 24px; border: 1px solid var(--border-soft);

    img { width: 28px; height: 28px; }
}

.service-card__title {
    font-family: var(--font-title);
    font-size: 22px; font-weight: 600;
    color: var(--blue-ink); margin: 0 0 8px;
}

.service-card__desc {
    font-size: 14px; color: var(--ink-muted);
    margin: 0 0 20px; flex: 1; line-height: 1.6;
}

.service-card__footer {
    display: flex; align-items: center; justify-content: space-between;
}

.pill-gold {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: var(--r-full);
    background: rgba(245,197,24,0.16); color: var(--gold-deep);
    border: 1px solid var(--border-gold);
    font-family: var(--font-body); font-size: 11px; font-weight: 600;
    letter-spacing: 0.04em;
}

.service-card__arrow {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--blue-wash); color: var(--blue);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700;
    transition: background .3s var(--ease), transform .3s var(--ease), color .3s var(--ease);
}

@media (max-width: 980px) {
    .services__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
    .services__grid { grid-template-columns: 1fr; }
}
</style>
