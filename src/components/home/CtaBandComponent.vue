<template>
    <section class="cta-band">
        <div class="cta-band__deco" />
        <div class="container">
            <div class="cta-band__card">
                <div class="cta-band__card-deco" />

                <div class="cta-band__copy">
                    <div class="eyebrow--gold">¿Lista(o) para empezar?</div>
                    <h2>El primer paso suele ser el <em>más valiente</em>.</h2>
                    <p>
                        Una sesión inicial de 20 minutos para vernos y decidir si tiene sentido seguir.
                    </p>
                </div>

                <div class="cta-band__actions">
                    <RouterLink to="/terapias" class="btn-gold btn-full">
                        Reservar primera sesión →
                    </RouterLink>
                    <RouterLink to="/tests" class="btn-outline-gold btn-full">
                        Prefiero empezar con un test
                    </RouterLink>
                    <p class="cta-band__note">Plazas limitadas · Respuesta en 24h</p>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.cta-band {
    padding: 100px 0;
    background: var(--cream-warm);
    position: relative; overflow: hidden;
}

.cta-band__deco {
    position: absolute; top: -80px; right: -80px;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(245,197,24,0.3), transparent 65%);
    pointer-events: none;
}

.container {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 0 28px;
    position: relative;
}

.cta-band__card {
    background: var(--white);
    border-radius: 32px; padding: 72px 64px;
    box-shadow: 0 30px 60px rgba(7,30,77,0.10);
    border: 1px solid var(--border-soft);
    display: grid; grid-template-columns: 1.2fr 1fr;
    gap: 48px; align-items: center;
    position: relative; overflow: hidden;
}

.cta-band__card-deco {
    position: absolute; top: -60px; left: -60px;
    width: 180px; height: 180px;
    background: var(--gold-grad); border-radius: 50%;
    opacity: 0.1; pointer-events: none;
}

.eyebrow--gold {
    font-family: var(--font-body);
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--gold-deep); margin-bottom: 18px;
}

h2 {
    font-family: var(--font-title);
    font-size: clamp(1.75rem, 3vw, 2.5rem);
    font-weight: 700; color: var(--blue-ink);
    line-height: 1.08; letter-spacing: -0.02em;
    margin: 0 0 20px;
    em { font-style: italic; color: var(--gold-deep); }
}

p {
    font-size: 17px; color: var(--ink-muted);
    margin: 0; max-width: 460px;
    font-weight: 300; line-height: 1.65;
}

.cta-band__actions {
    display: flex; flex-direction: column;
    gap: 14px; align-items: stretch;
}

.btn-gold {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 20px 32px; border-radius: var(--r-full);
    background: var(--gold-grad); color: var(--white);
    font-family: var(--font-body); font-weight: 700; font-size: 14px;
    letter-spacing: 0.06em; text-transform: uppercase;
    text-decoration: none; border: none; cursor: pointer;
    box-shadow: var(--shadow-gold-new);
    transition: background .25s var(--ease), transform .25s var(--ease), box-shadow .3s var(--ease), color .25s var(--ease);

    &:hover { background: var(--gold-grad-hover); transform: translateY(-2px); box-shadow: var(--shadow-gold-glow); color: var(--blue-ink); }
}

.btn-outline-gold {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 18px 32px; border-radius: var(--r-full);
    background: transparent; color: var(--gold-deep); border: 1.5px solid var(--gold);
    font-family: var(--font-body); font-weight: 600; font-size: 14px;
    text-decoration: none; cursor: pointer;
    transition: background .25s var(--ease), color .25s var(--ease), border-color .25s var(--ease), box-shadow .25s var(--ease);

    &:hover { background: var(--gold-grad); color: var(--white); border-color: transparent; box-shadow: var(--shadow-gold-new); }
}

.btn-full { width: 100%; }

.cta-band__note {
    font-size: 12px; color: var(--ink-muted);
    text-align: center; margin: 0; font-weight: 400;
}

@media (max-width: 980px) {
    .cta-band__card {
        grid-template-columns: 1fr;
        padding: 48px 32px;
    }
}
</style>
