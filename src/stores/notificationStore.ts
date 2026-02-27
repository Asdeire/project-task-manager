import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
    const message = ref('');
    const type = ref<'success' | 'error' | 'info'>('success');
    const isVisible = ref(false);
    let timeoutId: ReturnType<typeof setTimeout>;

    const show = (msg: string, t: 'success' | 'error' | 'info' = 'success') => {
        message.value = msg;
        type.value = t;
        isVisible.value = true;

        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            isVisible.value = false;
        }, 3000);
    };

    return { message, type, isVisible, show };
});