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

    return { projects, isLoading, error, fetchProjects, addProject };
});