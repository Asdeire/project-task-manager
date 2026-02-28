<template>
    <div class="statistics-panel">
        <h3>Статистика завдань</h3>

        <div v-if="totalTasks === 0" class="no-data">Немає завдань для відображення</div>

        <div v-else class="chart-container">
            <div class="progress-bar">
                <div class="segment to-do" :style="{ width: percent(stats['To do']) + '%' }" title="To do"></div>
                <div class="segment in-progress" :style="{ width: percent(stats['In progress']) + '%' }"
                    title="In progress"></div>
                <div class="segment done" :style="{ width: percent(stats['Done']) + '%' }" title="Done"></div>
            </div>

            <div class="legend">
                <div class="legend-item"><span class="dot to-do"></span> To do: {{ stats['To do'] }}</div>
                <div class="legend-item"><span class="dot in-progress"></span> In progress: {{ stats['In progress'] }}
                </div>
                <div class="legend-item"><span class="dot done"></span> Done: {{ stats['Done'] }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import type { TaskStatus } from '@/types'

const taskStore = useTaskStore()

onMounted(() => {
    if (taskStore.tasks.length === 0) taskStore.fetchTasks()
})

const stats = computed(() => {
    const counts: Record<TaskStatus, number> = { 'To do': 0, 'In progress': 0, 'Done': 0 }
    taskStore.tasks.forEach(task => {
        if (counts[task.status] !== undefined) counts[task.status]++
    })
    return counts
})

const totalTasks = computed(() => stats.value['To do'] + stats.value['In progress'] + stats.value['Done'])

const percent = (count: number) => {
    return totalTasks.value === 0 ? 0 : (count / totalTasks.value) * 100
}
</script>

<style scoped lang="scss">
.statistics-panel {
    background: white;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #ccc;
    margin-bottom: 24px;

    h3 {
        margin-top: 0;
        margin-bottom: 16px;
        color: #333;
    }
}

.no-data {
    color: #888;
    font-style: italic;
}

.progress-bar {
    display: flex;
    height: 24px;
    border-radius: 12px;
    overflow: hidden;
    background: #eee;
    margin-bottom: 16px;
}

.segment {
    transition: width 0.5s ease;
}

.segment.to-do {
    background-color: #95a5a6;
}

.segment.in-progress {
    background-color: #3498db;
}

.segment.done {
    background-color: #2ecc71;
}

.legend {
    display: flex;
    gap: 24px;
    font-size: 14px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.dot.to-do {
    background-color: #95a5a6;
}

.dot.in-progress {
    background-color: #3498db;
}

.dot.done {
    background-color: #2ecc71;
}
</style>