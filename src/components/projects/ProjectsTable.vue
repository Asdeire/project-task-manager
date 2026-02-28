<template>
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th v-for="col in columns" :key="col.key" :style="{ width: col.width + 'px' }"
                        @click="$emit('sort', col.key)">
                        {{ col.label }}
                        <span v-if="sortKey === col.key">{{ sortOrder === 'asc' ? ' ▲' : ' ▼' }}</span>
                        <div class="resizer" @mousedown.stop="startResize($event, col)"></div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="project in projects" :key="project.id" @click="$emit('row-click', project.id)"
                    style="cursor: pointer;">
                    <td>{{ project.id }}</td>
                    <td>{{ project.name }}</td>
                    <td>{{ project.taskCount }}</td>
                    <td>{{ project.status }}</td>
                    <td>{{ new Date(project.createdAt).toLocaleDateString() }}</td>
                    <td>
                        <div class="actions-cell">
                            <button class="btn-icon edit" @click.stop="$emit('edit', project)" title="Редагувати">
                                ✏️
                            </button>
                            <button class="btn-icon delete" @click.stop="$emit('delete', project.id)" title="Видалити">
                                🗑️
                            </button>
                        </div>
                    </td>
                </tr>
                <tr v-if="projects.length === 0">
                    <td colspan="5" class="empty-state">Проєкти не знайдено</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Project } from '@/types'

defineProps<{
    projects: Project[]
    sortKey: string
    sortOrder: 'asc' | 'desc'
}>()

defineEmits(['sort', 'row-click', 'edit', 'delete'])

const columns = ref([
    { key: 'id', label: 'ID', width: 80 },
    { key: 'name', label: 'Назва проєкту', width: 250 },
    { key: 'taskCount', label: 'Завдання', width: 120 },
    { key: 'status', label: 'Статус', width: 120 },
    { key: 'createdAt', label: 'Дата створення', width: 150 },
    { key: 'actions', label: 'Дії', width: 80 }
])

let startX = 0
let startWidth = 0
let activeCol: any = null

const startResize = (e: MouseEvent, col: any) => {
    startX = e.clientX
    startWidth = col.width
    activeCol = col
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (e: MouseEvent) => {
    if (activeCol) {
        const newWidth = startWidth + (e.clientX - startX)
        activeCol.width = Math.max(50, newWidth)
    }
}

const onMouseUp = () => {
    activeCol = null
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
}
</script>

<style lang="scss">
.btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    opacity: 0.6;
    transition: 0.2s;

    &:hover {
        opacity: 1;
    }
}
</style>