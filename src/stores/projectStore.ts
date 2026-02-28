import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Project } from '@/types';
import api from '@/api/axios';

export const useProjectStore = defineStore('projectStore', () => {
    const projects = ref<Project[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
        projects.value = JSON.parse(savedProjects);
    }

    watch(projects, (newVal) => {
        localStorage.setItem('projects', JSON.stringify(newVal));
    }, { deep: true });

    const fetchProjects = async () => {
        isLoading.value = true;
        try {
            const { data } = await api.get<Project[]>('/projects');
            projects.value = data;
        } catch (err: any) {
            error.value = err.message;
        } finally {
            isLoading.value = false;
        }
    };

    const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'taskCount' | 'status'>) => {
        const newProject: Omit<Project, 'id'> = {
            ...project,
            taskCount: 0,
            status: 'Active',
            createdAt: new Date().toISOString()
        };
        try {
            const { data } = await api.post<Project>('/projects', newProject);
            projects.value.push(data);
        } catch (err: any) {
            error.value = err.message;
        }
    };

    const updateProject = async (id: string, updates: Partial<Project>) => {
        try {
            const { data } = await api.patch<Project>(`/projects/${id}`, updates);
            const index = projects.value.findIndex(p => p.id === id);
            if (index !== -1) {
                projects.value[index] = { ...projects.value[index], ...data };
            }
        } catch (err: any) {
            error.value = err.message;
        }
    };

    const deleteProject = async (id: string) => {
        try {
            await api.delete(`/projects/${id}`);
            projects.value = projects.value.filter(p => p.id !== id);
        } catch (err: any) {
            error.value = err.message;
        }
    };

    return { projects, isLoading, error, fetchProjects, addProject, updateProject, deleteProject };
});