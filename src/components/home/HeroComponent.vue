<template>
    <section class="hero">
        <!-- Decorative blobs -->
        <div class="hero__blob-blue" />
        <div class="hero__blob-gold" />

        <div class="container hero__grid">
            <!-- Left: copy -->
            <div class="hero__copy">
                <div class="hero__eyebrow">
                    <span class="eyebrow-line eyebrow--gold">Bienvenida(o) a tu espacio</span>
                </div>

                <h1 class="hero__title">
                    Tu mente es <em>maravillosa</em>,<br />
                    <span class="hero__swash">poderosa</span> y<br />
                    más amable de lo que crees.
                </h1>

                <p class="hero__sub">
                    Soy <strong>Lucía Díaz</strong>, psicóloga. Acompaño procesos de autoconocimiento
                    y terapia desde un lugar cálido, sin prisas, con herramientas que uso cada día en consulta.
                </p>

                <div class="hero__ctas">
                    <RouterLink to="/terapias" class="btn-gold">Reservar sesión →</RouterLink>
                    <RouterLink to="/tests" class="btn-outline-gold">Hacer un test gratis</RouterLink>
                </div>

                <div class="hero__trust">
                    <div class="trust-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-deep)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                        <span>Online + Madrid</span>
                    </div>
                    <div class="trust-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-deep)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                        <span>Psicóloga colegiada</span>
                    </div>
                    <div class="trust-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-deep)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                        <span>Sin compromiso</span>
                    </div>
                </div>
            </div>

            <!-- Right: image composition -->
            <div class="hero__image-col">
                <div class="hero__img-wrap">
                    <img src="/lucia.jpg" alt="Lucía Díaz" class="hero__img" />
                    <div class="hero__img-veil" />
                </div>
                <div class="hero__frame-accent" />

                <div class="hero__quote-card">
                    <div class="hero__stars">
                        <svg v-for="i in 5" :key="i" width="14" height="14" viewBox="0 0 24 24" fill="#E8B923">
                            <path d="M12 2l2.76 7.92L23 11.27l-5.91 5.12L18.55 23 12 19.27 5.45 23l1.46-6.61L1 11.27l8.24-1.35z"/>
                        </svg>
                    </div>
                    <p class="hero__quote-text">"Lucía me ayudó a entenderme sin juicio. El espacio más honesto en el que he estado."</p>
                    <div class="hero__quote-author">— María, 34</div>
                </div>

                <div class="hero__pill">
                    <span class="hero__pill-dot" />
                    Citas disponibles esta semana
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.hero {
    position: relative;
    padding-top: calc(var(--header-h) + 40px);
    padding-bottom: 120px;
    overflow: hidden;
    background: linear-gradient(180deg, #FFFFFF 0%, #FDFBF5 60%, #FFFFFF 100%);
}

.container {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 0 28px;
    position: relative;
}

.hero__blob-blue {
    position: absolute; top: -120px; right: -160px;
    width: 640px; height: 640px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, rgba(30,86,160,0.10), rgba(30,86,160,0.02) 60%, transparent 72%);
    pointer-events: none;
}

.hero__blob-gold {
    position: absolute; bottom: 80px; left: -120px;
    width: 360px; height: 360px; border-radius: 50%;
    background: radial-gradient(circle, rgba(245,197,24,0.14), transparent 65%);
    pointer-events: none;
}

.hero__grid {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 80px;
    align-items: center;
}

.hero__eyebrow { margin-bottom: 28px; }

.eyebrow-line {
    display: inline-flex; align-items: center; gap: 14px;
    font-family: var(--font-body);
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.22em; text-transform: uppercase;

    &::before {
        content: '';
        width: 32px; height: 1px;
        background: currentColor; opacity: 0.6;
    }
}

.eyebrow--gold { color: var(--gold-deep); }

.hero__title {
    font-family: var(--font-title);
    font-size: clamp(2.75rem, 6.5vw, 5.5rem);
    font-weight: 800; letter-spacing: -0.03em;
    color: var(--blue-ink); line-height: 1.08;
    margin: 0 0 28px;

    em { font-style: italic; font-weight: 700; color: var(--blue); }
}

.hero__swash {
    display: inline-block; position: relative;

    &::after {
        content: '';
        position: absolute; left: 0; right: 0; bottom: -0.08em;
        height: 0.22em;
        background: var(--gold-grad);
        border-radius: 999px; z-index: -1; opacity: 0.55;
    }
}

.hero__sub {
    font-size: 19px; line-height: 1.7; color: var(--ink-soft);
    max-width: 520px; margin: 0 0 40px; font-weight: 300;
    strong { font-weight: 600; color: var(--blue-ink); }
}

.hero__ctas {
    display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 48px;
}

.btn-gold {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 16px 32px; border-radius: var(--r-full);
    background: var(--gold-grad); color: var(--white);
    font-family: var(--font-body); font-weight: 700; font-size: 13px;
    letter-spacing: 0.06em; text-transform: uppercase;
    text-decoration: none; border: none; cursor: pointer;
    box-shadow: var(--shadow-gold-new);
    transition: background .25s var(--ease), transform .25s var(--ease), box-shadow .3s var(--ease), color .25s var(--ease);

    &:hover { background: var(--gold-grad-hover); transform: translateY(-2px); box-shadow: var(--shadow-gold-glow); color: var(--blue-ink); }
}

.btn-outline-gold {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 14px 28px; border-radius: var(--r-full);
    background: transparent; color: var(--gold-deep); border: 1.5px solid var(--gold);
    font-family: var(--font-body); font-weight: 600; font-size: 14px;
    text-decoration: none; cursor: pointer;
    transition: background .25s var(--ease), color .25s var(--ease), border-color .25s var(--ease), box-shadow .25s var(--ease);

    &:hover { background: var(--gold-grad); color: var(--white); border-color: transparent; box-shadow: var(--shadow-gold-new); }
}

.hero__trust {
    display: flex; gap: 36px; align-items: center;
    padding-top: 28px; border-top: 1px solid var(--border-soft); flex-wrap: wrap;
}

.trust-item {
    display: flex; align-items: center; gap: 10px;
    span { font-family: var(--font-body); font-size: 13px; color: var(--ink-soft); font-weight: 500; }
}

.hero__image-col {
    position: relative; min-height: 560px; max-width: 460px;
    width: 100%; margin-left: auto; margin-right: auto;
}

.hero__img-wrap {
    position: relative; width: 100%; aspect-ratio: 3/4;
    border-radius: 24px; overflow: hidden;
    box-shadow: 0 30px 60px rgba(7,30,77,0.18), 0 10px 30px rgba(7,30,77,0.10);
}

.hero__img {
    width: 100%; height: 100%; object-fit: cover;
    filter: saturate(1.05) brightness(1.02); display: block;
}

.hero__img-veil {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 0%, transparent 55%, rgba(11,59,140,0.25) 100%);
}

.hero__frame-accent {
    position: absolute; top: -18px; right: -18px;
    width: 120px; height: 120px;
    border: 3px solid var(--gold-bright); border-radius: 24px;
    box-shadow: 0 10px 30px rgba(232,185,35,0.35); pointer-events: none;
}

.hero__quote-card {
    position: absolute; bottom: -32px; left: -40px; width: 280px;
    background: var(--white); border-radius: 20px; padding: 24px;
    box-shadow: 0 20px 40px rgba(7,30,77,0.14); border: 1px solid var(--border-soft);
}

.hero__stars { display: flex; align-items: center; gap: 4px; margin-bottom: 10px; }

.hero__quote-text {
    font-family: var(--font-title); font-style: italic;
    font-size: 14px; color: var(--blue-ink); line-height: 1.5; margin: 0; font-weight: 400;
}

.hero__quote-author {
    font-size: 11px; font-weight: 600; color: var(--gold-deep);
    letter-spacing: 0.1em; text-transform: uppercase; margin-top: 12px; font-family: var(--font-body);
}

.hero__pill {
    position: absolute; top: 40px; left: -24px;
    background: var(--blue-ink); color: var(--white);
    padding: 12px 18px; border-radius: 999px;
    font-family: var(--font-body); font-size: 12px; font-weight: 500;
    letter-spacing: 0.06em; box-shadow: 0 10px 24px rgba(7,30,77,0.25);
    display: flex; align-items: center; gap: 8px;
}

.hero__pill-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--gold-bright); box-shadow: 0 0 0 4px rgba(245,197,24,0.3); flex-shrink: 0;
}

@media (max-width: 980px) {
    .hero__grid { grid-template-columns: 1fr; gap: 40px; }
    .hero__image-col { max-width: 380px; margin: 0 auto; min-height: 400px; }
    .hero__quote-card { left: 0; width: 240px; font-size: 13px; }
    .hero__pill { left: 0; }
    .hero__frame-accent { display: none; }
}
</style>
