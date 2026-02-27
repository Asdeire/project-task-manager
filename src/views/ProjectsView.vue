<template>
    <div class="projects-view">
        <div class="header">
            <h1>Проєкти</h1>
        </div>

        <div class="controls">
            <div class="filters">
                <input v-model="filters.name" type="text" placeholder="Пошук за назвою..." class="search-input" />
                <select v-model="filters.status" class="status-select">
                    <option value="">Всі статуси</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <button class="btn-primary" @click="isModalOpen = true">Додати проєкт</button>
        </div>

        <div v-if="projectStore.isLoading">Завантаження...</div>

        <ProjectsTable v-else :projects="filteredAndSortedProjects" :sort-key="sort.key" :sort-order="sort.order"
            @sort="handleSort" @row-click="goToProject" />

        <AddProjectModal v-if="isModalOpen" @close="isModalOpen = false" @save="handleSaveProject" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { useNotificationStore } from '@/stores/notificationStore'
import ProjectsTable from '@/components/projects/ProjectsTable.vue'
import AddProjectModal from '@/components/projects/AddProjectModal.vue'

import type { Project } from '@/types'

const router = useRouter()
const projectStore = useProjectStore()

const isModalOpen = ref(false)

const savedFilters = localStorage.getItem('projectsFilters')
const filters = ref(
    savedFilters ? JSON.parse(savedFilters) : { name: '', status: '' }
)

const savedSort = localStorage.getItem('projectsSort')
const sort = ref<{ key: keyof Project, order: 'desc' | 'asc' }>(
    savedSort ? JSON.parse(savedSort) : { key: 'id', order: 'desc' }
)

const notify = useNotificationStore()

const filteredAndSortedProjects = computed(() => {
    let result = projectStore.projects

    if (filters.value.name) {
        const query = filters.value.name.toLowerCase()
        result = result.filter(p => p.name.toLowerCase().includes(query))
    }
    if (filters.value.status) {
        result = result.filter(p => p.status === filters.value.status)
    }

    return [...result].sort((a, b) => {
        let valA = a[sort.value.key]
        let valB = b[sort.value.key]

        if (typeof valA === 'string') valA = valA.toLowerCase()
        if (typeof valB === 'string') valB = valB.toLowerCase()

        if (valA < valB) return sort.value.order === 'asc' ? -1 : 1
        if (valA > valB) return sort.value.order === 'asc' ? 1 : -1
        return 0
    })
})

const handleSort = (key: keyof Project) => {
    if (sort.value.key === key) {
        sort.value.order = sort.value.order === 'asc' ? 'desc' : 'asc'
    } else {
        sort.value.key = key
        sort.value.order = 'asc'
    }
}

const handleSaveProject = async (projectData: { name: string, description: string }) => {
    await projectStore.addProject(projectData)
    notify.show('Проєкт успішно створено!', 'success')
    isModalOpen.value = false
}

const goToProject = (id: string) => {
    router.push(`/project/${id}`)
}

watch(filters, (newVal) => {
    localStorage.setItem('projectsFilters', JSON.stringify(newVal))
}, { deep: true })

watch(sort, (newVal) => {
    localStorage.setItem('projectsSort', JSON.stringify(newVal))
}, { deep: true })

onMounted(() => {
    projectStore.fetchProjects()
})
</script>

<style scoped lang="scss">
.projects-view {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;

        .filters {
            display: flex;
            gap: 16px;

            input,
            select {
                padding: 10px;
                border: 1px solid $border-color;
                border-radius: 6px;
                min-width: 200px;
            }
        }
    }
}
</style>