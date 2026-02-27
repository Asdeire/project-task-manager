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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import ProjectsTable from '@/components/projects/ProjectsTable.vue'
import AddProjectModal from '@/components/projects/AddProjectModal.vue'
import type { Project } from '@/types'

const router = useRouter()
const projectStore = useProjectStore()

const isModalOpen = ref(false)

const filters = ref({ name: '', status: '' })
const sort = ref<{ key: keyof Project, order: 'asc' | 'desc' }>({ key: 'id', order: 'asc' })

onMounted(() => {
    projectStore.fetchProjects()
})

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
        sort.value.order = sort.value.order === 'desc' ? 'asc' : 'desc'
    } else {
        sort.value.key = key
        sort.value.order = 'asc'
    }
}

const handleSaveProject = async (projectData: { name: string, description: string }) => {
    await projectStore.addProject(projectData)
    isModalOpen.value = false
}

const goToProject = (id: string) => {
    router.push(`/project/${id}`)
}
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