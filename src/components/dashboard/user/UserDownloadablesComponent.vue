<script setup>
import { useProgressStore } from '../../../stores/progress-store'

const props = defineProps({
    formation: {
        type: Object,
        required: true
    },
    formation_id: {
        type: String,
        required: true
    }
})

const progress_store = useProgressStore()

// Descargar archivo individual
const download_file = async (downloadable) => {
    // Registrar descarga
    await progress_store.register_download(props.formation_id, null)

    // Abrir en nueva pestaña
    window.open(downloadable.file_url, '_blank')
}

// Descargar todos (uno por uno)
const download_all = async () => {
    for (const downloadable of props.formation.downloadables) {
        await download_file(downloadable)
        // Pequeño delay para no saturar el navegador
        await new Promise(resolve => setTimeout(resolve, 500))
    }
}

// Ícono según tipo de archivo
const get_file_icon = (file_type) => {
    const icons = {
        'pdf': '📄',
        'docx': '📝',
        'xlsx': '📊',
        'pptx': '📽️',
        'zip': '📦',
        'jpg': '🖼️',
        'png': '🖼️',
        'mp3': '🎵',
        'mp4': '🎥'
    }
    return icons[file_type?.toLowerCase()] || '📎'
}
</script>

<template>
    <div class="downloadables">
        <div class="downloadables__header">
            <h2>Material descargable</h2>
            <button v-if="formation.downloadables.length > 1" @click="download_all" class="download-all-btn">
                📥 Descargar todos
            </button>
        </div>

        <p class="downloadables__description">
            Aquí encontrarás todo el material complementario del curso. Puedes descargarlo cuando lo necesites.
        </p>

        <!-- Lista de descargables -->
        <div class="downloadables__list">
            <div v-for="(downloadable, index) in formation.downloadables" :key="index" class="downloadable-item"
                @click="download_file(downloadable)">
                <div class="downloadable-item__icon">
                    {{ get_file_icon(downloadable.file_type) }}
                </div>

                <div class="downloadable-item__info">
                    <h4 class="downloadable-item__name">{{ downloadable.file_name }}</h4>
                    <p v-if="downloadable.file_description" class="downloadable-item__description">
                        {{ downloadable.file_description }}
                    </p>
                    <div class="downloadable-item__meta">
                        <span v-if="downloadable.file_type" class="meta-tag">
                            {{ downloadable.file_type.toUpperCase() }}
                        </span>
                        <span v-if="downloadable.file_size" class="meta-size">
                            {{ downloadable.file_size }}
                        </span>
                    </div>
                </div>

                <div class="downloadable-item__action">
                    <button class="download-btn">
                        ⬇️ Descargar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.downloadables {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: $space-8;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: $space-4;
        flex-wrap: wrap;

        h2 {
            margin: 0;
            font-size: $space-8;
            color: var(--color-primary);
        }
    }

    &__description {
        margin: 0;
        font-size: $text-base;
        color: var(--color-text-dark);
        line-height: 1.6;
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: $space-4;
    }
}

.download-all-btn {
    padding: $space-3 $space-6;
    background: var(--color-primary);
    color: var(--color-white);
    border: none;
    border-radius: $space-3;
    font-family: 'Text';
    font-size: $text-base;
    font-weight: $fw-semibold;
    cursor: pointer;
    transition: $transition-slow;

    &:hover {
        background: var(--color-secondary);
        transform: translateY(-2px);
        box-shadow: var(--shadow-gold);
    }
}

.downloadable-item {
    display: grid;
    grid-template-columns: 60px 1fr auto;
    gap: $space-6;
    padding: $space-6;
    background: var(--color-white);
    border: 2px solid var(--color-disable);
    border-radius: $space-4;
    cursor: pointer;
    transition: $transition-slow;
    align-items: center;

    &:hover {
        border-color: var(--color-primary);
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);

        .download-btn {
            background: var(--color-primary);
            color: var(--color-white);
        }
    }

    &__icon {
        font-size: $space-12;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__info {
        display: flex;
        flex-direction: column;
        gap: $space-2;
    }

    &__name {
        margin: 0;
        font-size: $text-xl;
        color: var(--color-black);
        font-family: 'Text';
        font-weight: $fw-semibold;
        line-height: 1.3;
    }

    &__description {
        margin: 0;
        font-size: 0.95rem;
        color: var(--color-text-dark);
        line-height: 1.4;
    }

    &__meta {
        display: flex;
        gap: $space-3;
        flex-wrap: wrap;

        .meta-tag,
        .meta-size {
            padding: $space-1 $space-3;
            background: var(--color-border-light);
            color: var(--color-text-dark);
            border-radius: $space-2;
            font-family: 'Text';
            font-size: $text-xs;
            font-weight: $fw-semibold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    }

    &__action {
        display: flex;
        align-items: center;
    }
}

.download-btn {
    padding: $space-3 $space-6;
    background: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
    border-radius: $space-3;
    font-family: 'Text';
    font-size: 0.95rem;
    font-weight: $fw-semibold;
    cursor: pointer;
    transition: $transition-slow;
    white-space: nowrap;

    &:hover {
        transform: scale(1.05);
    }
}

@media screen and (max-width: $bp-md) {
    .downloadables {
        &__header {
            flex-direction: column;
            align-items: flex-start;

            h2 {
                font-size: 1.6rem;
            }
        }
    }

    .download-all-btn {
        width: 100%;
    }

    .downloadable-item {
        grid-template-columns: 50px 1fr;
        gap: $space-4;
        padding: $space-4;

        &__icon {
            font-size: $space-10;
        }

        &__action {
            grid-column: 1 / -1;
            width: 100%;

            .download-btn {
                width: 100%;
            }
        }
    }
}
</style>