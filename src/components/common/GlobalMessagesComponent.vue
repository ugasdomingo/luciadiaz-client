<script setup>
import { onMounted } from 'vue';
import { useUtilStore } from '../../stores/util-store';

const util_store = useUtilStore()

onMounted(() => {
    setTimeout(() => {
        util_store.hide_message()
    }, 5000)
})
</script>

<template>
    <div class="global-message__content"  >
        <h3 class="global-message__content__text" :class="util_store.message_type">{{ util_store.message }}</h3>
    </div>
</template>

<style scoped lang="scss">
.global-message__content {
    width: 100%;
    padding: 0;
    margin: 0;
    color: var(--color-text);
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: $space-24;
    z-index: 100;

    @keyframes slide-in {
        from { transform: translateY(-100%); }
        to   { transform: translateY(0); }
    }
}

.global-message__content__text {
    width: fit-content;
    min-width: 30%;
    background-color: var(--color-soft-alert);
    padding: $space-2 $space-4;
    border-radius: $radius-sm;
    margin: 0;
    text-align: center;
    box-shadow: var(--shadow-sm);
    animation: slide-in 0.25s ease-in-out;
    opacity: 1;
    transition: all 0.5s;

    &.Approve { background-color: var(--color-approve-alert); }
    &.Reject  { background-color: var(--color-reject-alert); }
    &.Alert   { background-color: var(--color-soft-alert); }
}
</style>