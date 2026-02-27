<template>
    <div class="project-details">
        <div class="header">
            <h1>Проєкт: {{ project?.name || 'Завантаження...' }}</h1>
            <button class="btn-back" @click="router.push('/')">← Назад до проєктів</button>
        </div>

        <div class="controls">
            <div class="view-toggle">
                <button :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'">Таблиця</button>
                <button :class="{ active: viewMode === 'kanban' }" @click="viewMode = 'kanban'">Канбан</button>
            </div>

            <div class="filters" v-if="viewMode === 'table'">
                <input v-model="filters.assignee" type="text" placeholder="Фільтр за виконавцем..." />
                <select v-model="filters.status">
                    <option value="">Всі статуси</option>
                    <option value="To do">To do</option>
                    <option value="In progress">In progress</option>
                    <option value="Done">Done</option>
                </select>
                <button class="btn-primary" @click="openCreateModal">Додати завдання</button>
            </div>
            <div class="filters" v-else>
                <button class="btn-primary" @click="openCreateModal">Додати завдання</button>
            </div>
        </div>

        <div v-if="taskStore.isLoading">Завантаження завдань...</div>

        <template v-else>
            <TasksTable v-if="viewMode === 'table'" :tasks="filteredAndSortedTasks" :sort-key="sort.key"
                :sort-order="sort.order" @sort="handleSort" @update-order="handleUpdateOrder"
                @row-click="openEditModal" />

            <KanbanBoard v-else :tasks="filteredAndSortedTasks" @task-click="openEditModal"
                @update-tasks="handleKanbanTasksUpdate" />
        </template>

        <TaskModal v-if="isModalOpen" :task="selectedTask" @close="isModalOpen = false" @save="handleSaveTask" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { useProjectStore } from '@/stores/projectStore'
import { useNotificationStore } from '@/stores/notificationStore'
import TasksTable from '@/components/tasks/TasksTable.vue'
import TaskModal from '@/components/tasks/TaskModal.vue'
import KanbanBoard from '@/components/tasks/KanbanBoard.vue'
import type { Task } from '@/types'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const projectStore = useProjectStore()

const projectId = route.params.id as string
const project = computed(() => projectStore.projects.find(p => p.id === projectId))

const viewMode = ref(localStorage.getItem('viewMode') || 'table')
watch(viewMode, (newVal) => localStorage.setItem('viewMode', newVal))

const isModalOpen = ref(false)
const selectedTask = ref<Task | null>(null)

const filters = ref({ assignee: '', status: '' })
const sort = ref<{ key: keyof Task, order: 'asc' | 'desc' }>({ key: 'order', order: 'asc' })

const notify = useNotificationStore()

onMounted(async () => {
    if (projectStore.projects.length === 0) {
        await projectStore.fetchProjects()
    }
    await taskStore.fetchTasks(projectId)
})

const filteredAndSortedTasks = computed(() => {
    let result = taskStore.tasks.filter(t => t.projectId === projectId)

    if (filters.value.assignee) {
        const query = filters.value.assignee.toLowerCase()
        result = result.filter(t => t.assignee?.toLowerCase().includes(query))
    }
    if (filters.value.status) {
        result = result.filter(t => t.status === filters.value.status)
    }

    return result.slice().sort((a, b) => {
        let valA = a[sort.value.key]
        let valB = b[sort.value.key]
        if (valA === undefined) valA = ''
        if (valB === undefined) valB = ''

        if (valA < valB) return sort.value.order === 'asc' ? -1 : 1
        if (valA > valB) return sort.value.order === 'asc' ? 1 : -1
        return 0
    })
})

const handleSort = (key: keyof Task) => {
    if (sort.value.key === key) {
        sort.value.order = sort.value.order === 'asc' ? 'desc' : 'asc'
    } else {
        sort.value.key = key
        sort.value.order = 'asc'
    }
}

const openCreateModal = () => {
    selectedTask.value = null
    isModalOpen.value = true
}

const openEditModal = (task: Task) => {
    selectedTask.value = task
    isModalOpen.value = true
}

const handleSaveTask = async (taskData: any) => {
    if (taskData.id) {
        const { id, ...updates } = taskData
        await taskStore.updateTask(id, updates)
        notify.show('Завдання успішно оновлено!', 'success')
    } else {
        const newTask = {
            ...taskData,
            projectId,
            order: taskStore.tasks.length + 1
        }
        await taskStore.addTask(newTask)
        notify.show('Завдання успішно створено!', 'success')
    }
    isModalOpen.value = false
}

const handleUpdateOrder = (newOrderedTasks: Task[]) => {
    newOrderedTasks.forEach((task, index) => {
        if (task.order !== index + 1) {
            taskStore.updateTask(task.id, { order: index + 1 })
        }
    })
    sort.value = { key: 'order', order: 'asc' }
}

const handleKanbanTasksUpdate = (updatedTasks: Task[]) => {
    updatedTasks.forEach(task => {
        taskStore.updateTask(task.id, {
            status: task.status,
            order: task.order
        })
    })
}
</script>

<style lang="scss">
.project-details {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;


        .view-toggle {
            display: flex;
            border: 1px solid $primary-color;
            border-radius: 6px;
            overflow: hidden;


            button {
                padding: 8px 16px;
                border: none;
                background: white;
                color: $primary-color;
                cursor: pointer;
            }

            button.active {
                background: $primary-color;
                color: white;
            }
        }

        .filters {
            display: flex;
            gap: 16px;

            input,
            select {
                padding: 8px;
                border: 1px solid $border-color;
                border-radius: 4px;
            }
        }
    }
}
</style>