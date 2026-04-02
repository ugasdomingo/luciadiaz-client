<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '../stores/order-store';

const route = useRoute();
const router = useRouter();
const order_store = useOrderStore();

onMounted(async () => {
    const session_id = route.query.session_id;

    if (!session_id) {
        router.replace('/productos');
        return;
    }

    const success = await order_store.confirm_stripe_payment(session_id);

    if (success) {
        router.replace('/mi-espacio');
    } else {
        router.replace('/productos');
    }
});
</script>

<template>
    <main class="pages stripe-return">
        <div class="stripe-return__loader">
            <p>Confirmando tu pago...</p>
        </div>
    </main>
</template>

<style scoped lang="scss">
.stripe-return {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;

    &__loader {
        text-align: center;
        opacity: 0.7;

        p {
            font-size: $text-lg;
        }
    }
}
</style>
