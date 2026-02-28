<template>
    <div class="kanban-board">
        <div class="kanban-column" v-for="status in statuses" :key="status">
            <div class="column-header">
                <h3>{{ status }}</h3>
                <span class="task-count">{{ columns[status].length }}</span>
            </div>

            <draggable v-model="columns[status]" group="tasks" item-key="id" class="task-list" ghost-class="ghost-card"
                @change="onChange($event, status)">
                <template #item="{ element }">
                    <div class="kanban-card" @click="$emit('task-click', element)">
                        <div class="card-header">
                            <span class="task-id">#{{ element.id }}</span>
                            <span :class="['status-dot', element.status.replace(' ', '-').toLowerCase()]"></span>
                        </div>
                        <h4 class="task-title">{{ element.title }}</h4>
                        <div class="card-footer">
                            <span class="assignee">👤 {{ element.assignee || 'Не призначено' }}</span>
                            <span class="due-date" :class="{ overdue: isOverdue(element) }">
                                📅 {{ element.dueDate }}
                            </span>
                        </div>
                    </div>
                </template>
            </draggable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import type { Task, TaskStatus } from '@/types'

const props = defineProps<{
    tasks: Task[]
}>()

const emit = defineEmits(['task-click', 'update-tasks'])

const statuses: TaskStatus[] = ['To do', 'In progress', 'Done']

const columns = ref<Record<TaskStatus, Task[]>>({
    'To do': [],
    'In progress': [],
    'Done': []
})

watch(() => props.tasks, (newTasks) => {
    statuses.forEach(status => {
        columns.value[status] = newTasks
            .filter(t => t.status === status)
            .sort((a, b) => a.order - b.order)
    })
}, { immediate: true, deep: true })

const onChange = (event: any, newStatus: TaskStatus) => {
    if (event.added || event.moved) {
        const updatedTasks = columns.value[newStatus].map((task, index) => ({
            ...task,
            status: newStatus,
            order: index + 1
        }))

        emit('update-tasks', updatedTasks)
    }
}

const isOverdue = (task: Task) => {
    if (task.status === 'Done') return false
    return new Date(task.dueDate) < new Date(new Date().toDateString())
}
</script>

<style scoped lang="scss">
.kanban-board {
    display: flex;
    gap: 24px;
    overflow-x: auto;
    padding-bottom: 16px;
    min-height: 60vh;
}

.kanban-column {
    flex: 1;
    min-width: 300px;
    background: #f4f5f7;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
}

.column-header {
    padding: 16px;
    border-bottom: 2px solid #e1e4e8;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
        margin: 0;
        font-size: 16px;
        color: #172b4d;
    }

    .task-count {
        background: #dfe1e6;
        color: #172b4d;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
    }
}

.task-list {
    padding: 16px;
    flex: 1;
    min-height: 150px;
}

.kanban-card {
    background: white;
    padding: 16px;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    margin-bottom: 12px;
    cursor: pointer;
    transition: box-shadow 0.2s;

    &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
}

.ghost-card {
    opacity: 0.5;
    background: #e1e4e8;
}

.card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    .task-id {
        color: #888;
        font-size: 12px;
    }

    .status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }

    .to-do {
        background: #95a5a6;
    }

    .in-progress {
        background: #3498db;
    }

    .done {
        background: #2ecc71;
    }
}

.task-title {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 500;
    color: #333;

    word-break: break-word;
    overflow-wrap: break-word;
    white-space: normal;
    line-height: 1.4;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 12px;
    color: #666;
    gap: 8px;

    .assignee {
        word-break: break-word;
        overflow-wrap: break-word;
        flex: 1;
    }

    .due-date {
        white-space: nowrap;
    }

    .overdue {
        color: #e74c3c;
        font-weight: bold;
    }
}
</style>