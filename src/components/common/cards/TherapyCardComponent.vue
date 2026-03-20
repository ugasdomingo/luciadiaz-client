<script setup>
defineProps({
    therapy: Object
})
</script>

<template>
    <article class="therapy__content__card">
        <img :src="therapy.image" :alt="`Imagen de ${therapy.title}`">
        <section class="content-overlay">
            <div class="content-overlay__title">
                <h3>{{ therapy.title }}</h3>
                <p class="price">${{ therapy.precio }}</p>
            </div>
            <p>{{ therapy.description }}</p>
            <a class="action-btn" :href="therapy.link" target="_blank">Reservar</a>
        </section>
    </article>
</template>

<style scoped lang="scss">
.therapy__content__card {
    width: 100%;
    max-width: 300px;
    min-height: 400px;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: end;
    border-radius: $radius-lg;
    position: relative;
    transition: $transition;
    box-sizing: border-box;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: $radius-lg;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }

    .content-overlay {
        width: 100%;
        max-width: 300px;
        position: relative;
        z-index: 3;
        padding: $space-4;
        border-radius: $radius-lg;
        box-sizing: border-box;

        &::before {
            content: '';
            position: absolute;
            height: calc(100% + $space-12);
            width: 100%;
            top: -$space-12;
            left: 0;
            border-radius: $radius-lg;
            background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.9) 100%);
            backdrop-filter: blur(4px) blur(10px);
            -webkit-backdrop-filter: blur(4px) blur(10px);
            mask: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.5) 15%, rgba(0, 0, 0, 0.7) 100%);
            -webkit-mask: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.5) 15%, rgba(0, 0, 0, 0.7) 100%);
            z-index: -1;
        }

        &__title {
            display: flex;
            justify-content: space-between;
            align-items: center;

            h3 {
                margin: 0;
                color: var(--color-white);
                text-shadow: 0 0 4px rgba(0, 0, 0, 0.9);
            }

            .price {
                margin: 0;
                padding: $space-1 $space-2;
                color: var(--color-white);
                background-color: rgb(from var(--color-black) r g b / 0.8);
                border-radius: $radius-sm;
            }
        }

        p {
            margin: $space-2 0;
            font-size: $text-sm;
            color: var(--color-white);
        }

        .action-btn {
            font-size: $text-sm;
            width: 100%;
            max-width: 200px;
        }
    }
}
</style>
