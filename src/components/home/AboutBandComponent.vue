<template>
    <section class="about-band">
        <div class="about-band__deco-gold" />
        <div class="about-band__deco-white" />

        <div class="container about-band__grid">
            <!-- Image -->
            <div class="about-band__image-col">
                <div class="about-band__img-wrap">
                    <img
                        src="/lucia-about.png"
                        alt="Lucía Díaz"
                        class="about-band__img"
                    />
                </div>
            </div>

            <!-- Copy -->
            <div class="about-band__copy">
                <div class="eyebrow-gold">Sobre mí</div>
                <h2>
                    No es teoría de libros. Es <em>lo que uso</em> en consulta y
                    funciona.
                </h2>
                <p>
                    Llevo más de siete años acompañando a personas a entenderse
                    mejor. Laboro desde un enfoque integrador — cuerpo, emoción
                    y relato — con una mirada cálida y sin juicio.
                </p>
                <p>
                    Mi propósito: que salgas de consulta con herramientas, no
                    con más dudas.
                </p>

                <div class="about-band__stats">
                    <div class="stat">
                        <div class="stat__num">8</div>
                        <div class="stat__label">años de experiencia</div>
                    </div>
                    <div class="stat">
                        <div class="stat__num">100%</div>
                        <div class="stat__label">confidencialidad</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.about-band {
    padding: 120px 0;
    background: linear-gradient(
        135deg,
        var(--blue-deep) 0%,
        var(--blue) 55%,
        var(--blue-bright) 110%
    );
    color: var(--white);
    position: relative;
    overflow: hidden;
}

.about-band__deco-gold {
    position: absolute;
    top: -30%;
    left: -10%;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(
        circle,
        rgba(245, 197, 24, 0.16),
        transparent 60%
    );
    pointer-events: none;
}

.about-band__deco-white {
    position: absolute;
    bottom: -40%;
    right: -10%;
    width: 700px;
    height: 700px;
    border-radius: 50%;
    background: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.08),
        transparent 65%
    );
    pointer-events: none;
}

.container {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 0 28px;
    position: relative;
}

.about-band__grid {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 80px;
    align-items: center;
}

.about-band__image-col {
    position: relative;
    max-width: 440px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}

.about-band__img-wrap {
    aspect-ratio: 4/5;
    border-radius: 20px;
    overflow: hidden;
    border: 3px solid var(--gold-bright);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
}

.about-band__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.about-band__badge {
    position: absolute;
    bottom: -24px;
    right: -24px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: var(--gold-grad);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--blue-ink);
    box-shadow: 0 14px 30px rgba(232, 185, 35, 0.5);
    font-family: var(--font-title);
    transform: rotate(-8deg);
}

.about-band__badge-since {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
}

.about-band__badge-year {
    font-size: 32px;
    font-weight: 800;
    line-height: 1;
}

.about-band__badge-sub {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    opacity: 0.8;
}

.eyebrow-gold {
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold-light);
    margin-bottom: 20px;
}

h2 {
    font-family: var(--font-title);
    font-size: clamp(2rem, 4.2vw, 3.25rem);
    font-weight: 700;
    color: var(--white);
    line-height: 1.08;
    letter-spacing: -0.02em;
    margin: 0 0 28px;
    em {
        font-style: italic;
        color: var(--gold-bright);
    }
}

p {
    font-size: 17px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.85);
    margin: 0 0 20px;
    font-weight: 300;
}

.about-band__stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    padding-top: 32px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    margin-top: 20px;
}

.stat__num {
    font-family: var(--font-title);
    font-size: 44px;
    font-weight: 800;
    color: var(--gold-bright);
    line-height: 1;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
}

.stat__label {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.75);
    letter-spacing: 0.04em;
    font-family: var(--font-body);
}

@media (max-width: 980px) {
    .about-band__grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .about-band__image-col {
        max-width: 380px;
        margin: 0 auto;
    }
    .about-band__badge {
        right: 0;
        bottom: 0;
    }
}
</style>
