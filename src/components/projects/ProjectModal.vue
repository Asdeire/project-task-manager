<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <h2>{{ isEdit ? 'Редагувати проєкт' : 'Додати новий проєкт' }}</h2>
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

                <div class="form-group" v-if="isEdit">
                    <label for="status">Статус проєкту</label>
                    <select id="status" v-model="form.status">
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                    </select>
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
import { reactive, computed, onMounted } from 'vue'
import type { Project, ProjectStatus } from '@/types'

const props = defineProps<{
    project?: Project | null
}>()

const emit = defineEmits(['close', 'save'])

const isEdit = computed(() => !!props.project)

const form = reactive({
    name: '',
    description: '',
    status: 'Active' as ProjectStatus
})

const vErrors = reactive({
    name: false
})

onMounted(() => {
    if (props.project) {
        form.name = props.project.name
        form.description = props.project.description
        form.status = props.project.status 
    }
})

const submitForm = () => {
    if (!form.name.trim()) {
        vErrors.name = true
        return
    }
    vErrors.name = false
    emit('save', { ...form, id: props.project?.id })
}
</script>

<style lang="scss"></style>