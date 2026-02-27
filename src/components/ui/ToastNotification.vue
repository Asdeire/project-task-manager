<template>
    <Transition name="toast">
        <div v-if="store.isVisible" class="toast" :class="store.type">
            {{ store.message }}
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore'
const store = useNotificationStore()
</script>

<style scoped lang="scss">
.toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 12px 24px;
    border-radius: 6px;
    color: white;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
}

.success {
    background-color: #2ecc71;
}

.error {
    background-color: #e74c3c;
}

.info {
    background-color: #3498db;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.toast-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>