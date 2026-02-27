<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <h2>Додати новий проєкт</h2>
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="name">Назва проєкту *</label>
                    <input id="name" v-model="form.name" type="text" :class="{ error: vErrors.name }"
                        placeholder="Введіть назву" />
                    <span v-if="vErrors.name" class="error-text">Назва є обов'язковою</span>
                </div>

                <div class="form-group">
                    <label for="description">Опис</label>
                    <textarea id="description" v-model="form.description" rows="3"
                        placeholder="Короткий опис проєкту"></textarea>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn-cancel" @click="$emit('close')">Скасувати</button>
                    <button type="submit" class="btn-submit">Зберегти</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits(['close', 'save'])

const form = reactive({
    name: '',
    description: ''
})

const vErrors = reactive({
    name: false
})

const submitForm = () => {
    if (!form.name.trim()) {
        vErrors.name = true
        return
    }
    vErrors.name = false
    emit('save', { ...form })
}
</script>

<style lang="scss">
</style>