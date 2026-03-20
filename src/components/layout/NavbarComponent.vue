<script setup>
import { useUtilStore } from '../../stores/util-store';

const util_store = useUtilStore()

const links = [
    {
        name: 'Mi espacio',
        path: '/mi-espacio'
    },
    {
        name: 'Terapias',
        path: '/terapias'
    },
    {
        name: 'Blog',
        path: '/blog'
    },
    {
        name: 'Formaciones',
        path: '/formaciones'
    },
    {
        name: 'Productos',
        path: '/productos'
    },
]
</script>

<template>
    <nav>
        <ul>
            <li v-for="link in links" :key="link.name">
                <RouterLink :to="link.path" @click="util_store.toggle_navbar">{{ link.name }}</RouterLink>
            </li>
        </ul>
    </nav>
</template>

<style scoped lang="scss">
nav {
    width: max-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
    position: fixed;
    top: 4.25rem;
    right: $space-8;
    z-index: 100;
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    border-radius: $radius-lg;

    ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        padding: $space-2 $space-4;
        margin: 0;
        gap: $space-4;

        li {
            padding: 0;
            margin: 0;

            &:first-child a {
                color: var(--color-soft-alert);
                text-decoration: underline;
            }

            a {
                display: inline-block;
                text-decoration: none;
                color: var(--color-white);
                padding: $space-2 $space-6;
                margin: 0;
                border-radius: $radius-lg;
                transition: $transition;

                &:hover {
                    scale: 1.15;
                    color: var(--color-secondary-light);
                }
            }
        }
    }
}
</style>