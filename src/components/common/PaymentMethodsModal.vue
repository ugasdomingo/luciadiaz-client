<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
                <div class="modal-panel">
                    <header class="modal-header">
                        <h2>Métodos de pago disponibles</h2>
                        <button class="modal-close" @click="$emit('close')" aria-label="Cerrar">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" />
                            </svg>
                        </button>
                    </header>

                    <p class="modal-intro">
                        Selecciona el método de pago según tu país o región. Una vez realizado el pago,
                        vuelve aquí para adjuntar tu comprobante.
                    </p>

                    <div class="methods-list">
                        <div v-for="method in methods" :key="method.id" class="method-card"
                            :class="{ 'method-card--active': selectedMethod === method.id }"
                            @click="selectMethod(method.id)">

                            <div class="method-card__header">
                                <span class="method-card__icon">{{ method.icon }}</span>
                                <div>
                                    <h3 class="method-card__name">{{ method.name }}</h3>
                                    <span class="method-card__region">{{ method.region }}</span>
                                </div>
                            </div>

                            <Transition name="expand">
                                <div v-if="selectedMethod === method.id" class="method-card__details">
                                    <div v-for="(detail, i) in method.details" :key="i" class="detail-row">
                                        <span class="detail-label">{{ detail.label }}</span>
                                        <span class="detail-value">
                                            {{ detail.value }}
                                            <button class="btn-copy" @click.stop="copyToClipboard(detail.value)"
                                                :title="'Copiar ' + detail.label">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <rect x="9" y="9" width="13" height="13" rx="2"
                                                        stroke="currentColor" stroke-width="2" />
                                                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                                                        stroke="currentColor" stroke-width="2" />
                                                </svg>
                                            </button>
                                        </span>
                                    </div>

                                    <div class="detail-row detail-row--concept">
                                        <span class="detail-label">Concepto</span>
                                        <span class="detail-value detail-value--concept">{{ productTitle }}</span>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>

                    <p class="modal-footer-note">
                        Incluye el nombre del producto como concepto del pago para que podamos identificarlo rápidamente.
                    </p>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { paymentMethods } from '../../static/payment-methods'
import { useUtilStore } from '../../stores/util-store'

const props = defineProps({
    show: { type: Boolean, default: false },
    productTitle: { type: String, default: '' }
})

defineEmits(['close'])

const util_store = useUtilStore()
const methods = paymentMethods
const selectedMethod = ref(null)

const selectMethod = (id) => {
    selectedMethod.value = selectedMethod.value === id ? null : id
}

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        util_store.set_message('Copiado al portapapeles', 'success')
    } catch {
        util_store.set_message('No se pudo copiar', 'error')
    }
}
</script>

<style scoped lang="scss">
/* ── Overlay ── */
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

/* ── Panel ── */
.modal-panel {
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    width: 100%;
    max-width: 520px;
    max-height: 85vh;
    overflow-y: auto;
    padding: 32px;

    @media (max-width: 600px) {
        padding: 24px 20px;
        max-height: 90vh;
    }
}

/* ── Header ── */
.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    h2 {
        font-size: 20px;
        font-weight: 700;
        color: var(--color-text-heading);
        margin: 0;
    }
}

.modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: var(--color-bg);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
        background: var(--color-border-light);
        color: var(--color-text);
    }
}

.modal-intro {
    font-size: 14px;
    color: var(--color-text-muted);
    line-height: 1.6;
    margin: 0 0 24px;
}

/* ── Method Cards ── */
.methods-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.method-card {
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 16px 20px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--color-primary-light);
    }

    &--active {
        border-color: var(--color-primary);
        background: rgba(30, 86, 160, 0.03);
    }

    &__header {
        display: flex;
        align-items: center;
        gap: 14px;
    }

    &__icon {
        font-size: 28px;
        line-height: 1;
    }

    &__name {
        font-size: 15px;
        font-weight: 700;
        color: var(--color-text);
        margin: 0;
    }

    &__region {
        font-size: 13px;
        color: var(--color-text-muted);
    }

    &__details {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--color-border-light);
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}

/* ── Detail Rows ── */
.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    gap: 12px;

    &--concept {
        margin-top: 6px;
        padding-top: 10px;
        border-top: 1px dashed var(--color-border);
    }
}

.detail-label {
    color: var(--color-text-muted);
    font-weight: 500;
    flex-shrink: 0;
}

.detail-value {
    color: var(--color-text);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    text-align: right;

    &--concept {
        font-weight: 500;
        font-style: italic;
        color: var(--color-primary);
    }
}

.btn-copy {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    border-radius: 6px;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;

    &:hover {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: var(--color-white);
    }
}

/* ── Footer Note ── */
.modal-footer-note {
    margin: 20px 0 0;
    font-size: 13px;
    color: var(--color-text-muted);
    line-height: 1.5;
    text-align: center;
}

/* ── Transitions ── */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.25s ease;

    .modal-panel {
        transition: transform 0.25s ease, opacity 0.25s ease;
    }
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;

    .modal-panel {
        transform: translateY(12px) scale(0.97);
        opacity: 0;
    }
}

.expand-enter-active,
.expand-leave-active {
    transition: all 0.2s ease;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    opacity: 0;
    max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
    max-height: 300px;
}
</style>
