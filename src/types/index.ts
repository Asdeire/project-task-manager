export type ProjectStatus = 'Active' | 'Completed';
export type TaskStatus = 'To do' | 'In progress' | 'Done';

export interface Project {
    id: string;
    name: string;
    description: string;
    taskCount: number;
    status: ProjectStatus;
    createdAt: string;
}

export interface Task {
    id: string;
    projectId: string;
    title: string;
    assignee?: string;
    status: TaskStatus;
    dueDate: string;
    order: number;
}