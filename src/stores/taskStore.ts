import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Task } from '@/types';
import api from '@/api/axios';

export const useTaskStore = defineStore('taskStore', () => {
    const tasks = ref<Task[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks.value = JSON.parse(savedTasks);
    }

    watch(tasks, (newVal) => {
        localStorage.setItem('tasks', JSON.stringify(newVal));
    }, { deep: true });

    const fetchTasks = async (projectId?: string) => {
        isLoading.value = true;
        try {
            const url = projectId ? `/tasks?projectId=${projectId}` : '/tasks';
            const { data } = await api.get<Task[]>(url);
            tasks.value = data;
        } catch (err: any) {
            error.value = err.message;
        } finally {
            isLoading.value = false;
        }
    };

    const addTask = async (task: Omit<Task, 'id'>) => {
        try {
            const { data } = await api.post<Task>('/tasks', task);
            tasks.value.push(data);
        } catch (err: any) {
            error.value = err.message;
        }
    };

    const updateTask = async (taskId: string, updates: Partial<Task>) => {
        try {
            const { data } = await api.patch<Task>(`/tasks/${taskId}`, updates);
            const index = tasks.value.findIndex(t => t.id === taskId);
            if (index !== -1) {
                tasks.value[index] = { ...tasks.value[index], ...data };
            }
        } catch (err: any) {
            error.value = err.message;
        }
    };

    return { tasks, isLoading, error, fetchTasks, addTask, updateTask };
});