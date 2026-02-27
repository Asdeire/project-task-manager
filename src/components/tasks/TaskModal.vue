<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <h2>{{ isEdit ? 'Редагувати завдання' : 'Додати нове завдання' }}</h2>
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label>Назва завдання *</label>
                    <input v-model="form.title" type="text" :class="{ error: vErrors.title }"
                        placeholder="Введіть назву (3-120 символів)" />
                    <span v-if="vErrors.title" class="error-text">Назва має бути від 3 до 120 символів</span>
                </div>

                <div class="form-group">
                    <label>Виконавець</label>
                    <select v-model="form.assignee">
                        <option value="">Не призначено</option>
                        <option value="Іван Іванов">Іван Іванов</option>
                        <option value="Петро Петров">Петро Петров</option>
                        <option value="Олена Оленко">Олена Оленко</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Статус *</label>
                    <select v-model="form.status">
                        <option value="To do">To do</option>
                        <option value="In progress">In progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Термін виконання *</label>
                    <input v-model="form.dueDate" type="date" :min="isEdit ? '' : today"
                        :class="{ error: vErrors.dueDate }" />
                    <span v-if="vErrors.dueDate" class="error-text">Оберіть коректну дату</span>
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
import type { Task, TaskStatus } from '@/types'

const props = defineProps<{
    task?: Task | null 
}>()

const emit = defineEmits(['close', 'save'])

const today: string = new Date().toISOString().split('T')[0] ?? ''

const isEdit = computed(() => !!props.task)

const form = reactive({
    title: '',
    assignee: '',
    status: 'To do' as TaskStatus,
    dueDate: today
})

const vErrors = reactive({
    title: false,
    dueDate: false
})

onMounted(() => {
    if (props.task) {
        form.title = props.task.title
        form.assignee = props.task.assignee || ''
        form.status = props.task.status
        form.dueDate = props.task.dueDate
    }
})

const submitForm = () => {
    vErrors.title = form.title.length < 3 || form.title.length > 120
    vErrors.dueDate = !form.dueDate || (!isEdit.value && form.dueDate < today)

    if (vErrors.title || vErrors.dueDate) return

    emit('save', { ...form, id: props.task?.id })
}
</script>

<style lang="scss">
</style>