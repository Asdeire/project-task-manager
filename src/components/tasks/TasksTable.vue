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
            <draggable v-model="localTasks" tag="tbody" item-key="id" handle=".drag-handle" @end="onDragEnd">
                <template #item="{ element }">
                    <tr @click="$emit('row-click', element)" style="cursor: pointer;">
                        <td><span class="drag-handle">☰</span> {{ element.id }}</td>
                        <td>{{ element.title }}</td>
                        <td>{{ element.assignee || 'Не призначено' }}</td>
                        <td>
                            <span :class="['status-badge', element.status.replace(' ', '-').toLowerCase()]">
                                {{ element.status }}
                            </span>
                        </td>
                        <td>{{ element.dueDate }}</td>
                    </tr>
                </template>
            </draggable>
        </table>
        <div v-if="tasks.length === 0" class="empty-state">Завдань не знайдено</div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import type { Task } from '@/types'

const props = defineProps<{
    tasks: Task[]
    sortKey: string
    sortOrder: 'asc' | 'desc'
}>()

const emit = defineEmits(['sort', 'update-order', 'row-click'])

const localTasks = ref<Task[]>([])

watch(() => props.tasks, (newVal) => {
    localTasks.value = [...newVal]
}, { immediate: true })

const onDragEnd = () => {
    emit('update-order', localTasks.value)
}

const columns = ref([
    { key: 'id', label: 'ID', width: 80 },
    { key: 'title', label: 'Назва', width: 300 },
    { key: 'assignee', label: 'Виконавець', width: 150 },
    { key: 'status', label: 'Статус', width: 120 },
    { key: 'dueDate', label: 'Термін', width: 120 }
])

let startX = 0, startWidth = 0, activeCol: any = null
const startResize = (e: MouseEvent, col: any) => { startX = e.clientX; startWidth = col.width; activeCol = col; document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); }
const onMouseMove = (e: MouseEvent) => { if (activeCol) activeCol.width = Math.max(50, startWidth + (e.clientX - startX)) }
const onMouseUp = () => { activeCol = null; document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); }
</script>

<style lang="scss">
.drag-handle {
    cursor: grab;
    margin-right: 8px;
    color: #999;
}

.status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
}

.to-do {
    background: #e0e0e0;
    color: #333;
}

.in-progress {
    background: #cce5ff;
    color: #004085;
}

.done {
    background: #d4edda;
    color: #155724;
}
</style>