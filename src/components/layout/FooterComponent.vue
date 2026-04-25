<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
    <footer class="footer">
        <div class="footer__gold-line" />
        <div class="footer__deco-circle" />

        <div class="footer__container container">
            <div class="footer__grid">
                <!-- Brand column -->
                <div>
                    <div class="footer__brand">
                        <div class="footer__brand-logo">
                            <img src="/logo.png" alt="Lucía Díaz" />
                        </div>
                        <div>
                            <div class="footer__brand-name">Lucía Díaz</div>
                            <div class="footer__brand-tag">Psicóloga colegiada</div>
                        </div>
                    </div>
                    <p class="footer__tagline">
                        Acompaño a personas a conocerse, sostenerse y transformar lo que les duele.
                        Consulta online y presencial en Madrid.
                    </p>
                </div>

                <!-- Nav column -->
                <div>
                    <h4 class="footer__col-title">Navega</h4>
                    <ul class="footer__list">
                        <li><RouterLink to="/" class="footer__link">Inicio</RouterLink></li>
                        <li><RouterLink to="/terapias" class="footer__link">Terapias</RouterLink></li>
                        <li><RouterLink to="/tests" class="footer__link">Tests gratuitos</RouterLink></li>
                        <li><RouterLink to="/productos" class="footer__link">Formaciones</RouterLink></li>
                        <li><RouterLink to="/blog" class="footer__link">Blog</RouterLink></li>
                    </ul>
                </div>

                <!-- Contact column -->
                <div>
                    <h4 class="footer__col-title">Contacto</h4>
                    <ul class="footer__list">
                        <li><span class="footer__link">hola@luciadiaz.es</span></li>
                        <li><span class="footer__link">+34 600 000 000</span></li>
                        <li><span class="footer__link">Calle Serrano, Madrid</span></li>
                        <li><span class="footer__link">L–V · 10:00 — 20:00</span></li>
                    </ul>
                </div>

                <!-- Newsletter column -->
                <div>
                    <h4 class="footer__col-title">Carta quincenal</h4>
                    <p class="footer__newsletter-desc">Reflexiones sobre el interior, sin ruido.</p>
                    <div class="footer__newsletter-form">
                        <input type="email" placeholder="tu@correo.es" class="footer__newsletter-input" />
                        <button class="footer__newsletter-btn">Enviar</button>
                    </div>
                </div>
            </div>

            <div class="footer__bottom">
                <div class="footer__copy">
                    © {{ new Date().getFullYear() }} Lucía Díaz · Col. M-00000 · Todos los derechos reservados
                </div>
                <div class="footer__legal">
                    <a href="#" class="footer__legal-link">Aviso legal</a>
                    <a href="#" class="footer__legal-link">Privacidad</a>
                    <a href="#" class="footer__legal-link">Cookies</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- WhatsApp FAB -->
    <a href="https://wa.me/34624721896" target="_blank" rel="noopener" class="whatsapp-fab" aria-label="WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
    </a>
</template>

<style scoped lang="scss">
.footer {
    background: var(--blue-ink);
    color: rgba(255,255,255,0.75);
    padding-top: 96px; padding-bottom: 48px;
    position: relative;
    overflow: hidden;
}

.footer__gold-line {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--gold-grad);
}

.footer__deco-circle {
    position: absolute; top: -200px; right: -200px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(245,197,24,0.10), transparent 70%);
    pointer-events: none;
}

.container {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 0 28px;
    position: relative;
}

.footer__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 48px;
    padding-bottom: 64px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
}

.footer__brand {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 20px;
}

.footer__brand-logo {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--white);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;

    img { width: 36px; height: 36px; object-fit: contain; }
}

.footer__brand-name {
    font-family: var(--font-title);
    font-size: 22px; font-weight: 700;
    color: var(--white); letter-spacing: -0.01em;
}

.footer__brand-tag {
    font-size: 10px; letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold-light); margin-top: 2px;
    font-family: var(--font-body);
}

.footer__tagline {
    font-size: 14px; line-height: 1.7;
    max-width: 340px;
    color: rgba(255,255,255,0.7);
    margin: 0;
}

.footer__col-title {
    color: var(--white);
    margin-bottom: 18px;
    font-family: var(--font-title);
    font-size: 16px; font-weight: 600;
    margin-top: 0;
}

.footer__list {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column; gap: 10px;
}

.footer__link {
    font-size: 13px;
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    transition: color .2s var(--ease);
    font-family: var(--font-body);

    &:hover { color: var(--gold-light); }
}

.footer__newsletter-desc {
    font-size: 13px; color: rgba(255,255,255,0.65);
    margin-bottom: 16px; line-height: 1.6; margin-top: 0;
}

.footer__newsletter-form {
    display: flex; gap: 0;
    background: rgba(255,255,255,0.08);
    border-radius: 999px; padding: 4px;
    border: 1px solid rgba(245,197,24,0.2);
}

.footer__newsletter-input {
    flex: 1; background: transparent; border: none;
    color: var(--white); padding: 8px 16px;
    font-size: 13px; font-family: var(--font-body);
    outline: none;

    &::placeholder { color: rgba(255,255,255,0.4); }
}

.footer__newsletter-btn {
    padding: 8px 18px;
    background: var(--gold-bright);
    color: var(--white);
    border: none; border-radius: 999px;
    font-size: 11px; font-weight: 700;
    font-family: var(--font-body);
    cursor: pointer;
    transition: background .2s var(--ease);

    &:hover { background: var(--gold-light); }
}

.footer__bottom {
    display: flex;
    justify-content: space-between; align-items: center;
    padding-top: 32px;
    flex-wrap: wrap; gap: 16px;
}

.footer__copy {
    font-size: 12px; color: rgba(255,255,255,0.5);
    letter-spacing: 0.05em;
}

.footer__legal {
    display: flex; gap: 24px;
}

.footer__legal-link {
    font-size: 12px; color: rgba(255,255,255,0.5);
    text-decoration: none;
    transition: color .2s var(--ease);
    &:hover { color: rgba(255,255,255,0.8); }
}

/* WhatsApp FAB */
.whatsapp-fab {
    position: fixed; right: 24px; bottom: 24px; z-index: 50;
    width: 58px; height: 58px; border-radius: 50%;
    background: #25D366;
    box-shadow: 0 10px 30px rgba(37,211,102,0.4);
    display: flex; align-items: center; justify-content: center;
    transition: transform .25s var(--ease), box-shadow .25s var(--ease);

    &:hover {
        transform: scale(1.08);
        box-shadow: 0 14px 40px rgba(37,211,102,0.55);
    }
}

@media (max-width: 980px) {
    .footer__grid { grid-template-columns: 1fr 1fr !important; }
}

@media (max-width: 600px) {
    .footer__grid { grid-template-columns: 1fr !important; }
    .footer__bottom { flex-direction: column; align-items: flex-start; }
}
</style>
