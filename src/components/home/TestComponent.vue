<script setup>
import { useRouter } from 'vue-router'
import { test_info } from '../../static/test-info.js'
import TestDisclaimerComponent from '../tests/TestDisclaimerComponent.vue'

const router = useRouter()

const tests = [
    { ...test_info[0], emoji: '🧠', count: '12 preguntas', color: '#EEF4FC', ring: 'var(--blue)' },
    { ...test_info[1], emoji: '🌡️', count: '18 preguntas', color: '#FFF8E1', ring: 'var(--gold)' },
    { ...test_info[2], emoji: '✉️', count: '6 preguntas',  color: '#F2EAFF', ring: '#7B5EBC' },
]
</script>

<template>
    <section class="tests-preview">
        <div class="tests-preview__deco" />

        <div class="container">
            <div class="tests-preview__header">
                <div class="eyebrow--gold">Gratuitos</div>
                <h2>
                    Pequeñas ventanas hacia<br />
                    tu <em>mundo interior</em>.
                </h2>
                <p class="tests-preview__sub">Sin costo, sin compromiso. Recibirás tus resultados en el correo.</p>
            </div>

            <div class="tests-preview__grid">
                <div
                    v-for="(t, i) in tests"
                    :key="i"
                    class="test-card"
                    :style="{ '--ring': t.ring, '--blob': t.color }"
                    @click="router.push(t.link)"
                >
                    <div class="test-card__blob" />
                    <div class="test-card__content">
                        <div class="test-card__emoji">{{ t.emoji }}</div>
                        <h3 class="test-card__title">{{ t.name }}</h3>
                        <p class="test-card__desc">{{ t.brief }}</p>
                        <div class="test-card__footer">
                            <span class="test-card__count">{{ t.count }}</span>
                            <span class="test-card__cta">Comenzar test →</span>
                        </div>
                    </div>
                </div>
            </div>

            <TestDisclaimerComponent class="tests-preview__disclaimer" />
        </div>
    </section>
</template>

<style scoped lang="scss">
.tests-preview {
    padding: 140px 0;
    background: linear-gradient(180deg, #FDFBF5 0%, #FFFFFF 100%);
    position: relative; overflow: hidden;
}

.tests-preview__deco {
    position: absolute; top: 10%; right: -8%;
    width: 440px; height: 440px; border-radius: 50%;
    background: radial-gradient(circle, rgba(245,197,24,0.12), transparent 70%);
    pointer-events: none;
}

.container {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 0 28px;
    position: relative;
}

.tests-preview__header {
    text-align: center; max-width: 620px;
    margin: 0 auto 72px;
}

.eyebrow--gold {
    font-family: var(--font-body);
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--gold-deep); margin-bottom: 18px;
}

h2 {
    font-family: var(--font-title);
    font-size: clamp(2rem, 4.2vw, 3.25rem);
    font-weight: 700; color: var(--blue-ink);
    line-height: 1.08; letter-spacing: -0.02em;
    margin: 0 0 18px;
    em { font-style: italic; color: var(--blue); }
}

.tests-preview__sub {
    font-size: 18px; color: var(--ink-muted);
    margin: 0; font-weight: 300; line-height: 1.65;
}

.tests-preview__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
}

.test-card {
    background: var(--white);
    border-radius: 24px; padding: 36px;
    border: 1px solid var(--border-soft);
    cursor: pointer;
    transition: transform .35s var(--ease), box-shadow .35s var(--ease), border-color .3s var(--ease);
    position: relative; overflow: hidden;

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 40px rgba(7,30,77,0.12);
        border-color: var(--ring);

        .test-card__blob { transform: scale(1.2); }
        .test-card__cta { color: var(--gold-deep); }
    }
}

.test-card__blob {
    position: absolute; top: -40px; right: -40px;
    width: 180px; height: 180px; border-radius: 50%;
    background: var(--blob); z-index: 0;
    transition: transform .5s var(--ease);
}

.test-card__content { position: relative; z-index: 1; }

.test-card__emoji {
    font-size: 64px; margin-bottom: 20px; line-height: 1;
}

.test-card__title {
    font-family: var(--font-title);
    font-size: 26px; font-weight: 600;
    color: var(--blue-ink); margin: 0 0 12px;
}

.test-card__desc {
    font-size: 15px; color: var(--ink-muted);
    margin: 0 0 28px; line-height: 1.6;
}

.test-card__footer {
    display: flex; align-items: center; justify-content: space-between;
}

.test-card__count {
    font-family: var(--font-body);
    font-size: 12px; font-weight: 600;
    color: var(--ink-muted); letter-spacing: 0.06em;
}

.test-card__cta {
    font-family: var(--font-body);
    font-size: 13px; font-weight: 700;
    color: var(--blue); display: flex; align-items: center; gap: 6px;
    transition: color .25s var(--ease);
}

.tests-preview__disclaimer {
    margin-top: 40px;
}

@media (max-width: 980px) {
    .tests-preview__grid { grid-template-columns: 1fr; }
}
</style>
