import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json'
    }
});

if (import.meta.env.PROD) {
    api.interceptors.request.use((config) => {
        config.adapter = async (cfg) => {
            await new Promise(resolve => setTimeout(resolve, 300));

            const url = cfg.url || '';
            const method = cfg.method?.toLowerCase();
            let responseData = null;

            if (method === 'get') {
                if (url.includes('/projects')) {
                    responseData = JSON.parse(localStorage.getItem('projects') || '[]');
                } else if (url.includes('/tasks')) {
                    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
                    const match = url.match(/projectId=([^&]+)/);
                    if (match) {
                        responseData = allTasks.filter((t: any) => t.projectId === match[1]);
                    } else {
                        responseData = allTasks;
                    }
                }
            }
            else if (method === 'post') {
                const body = JSON.parse(cfg.data);
                responseData = { ...body, id: Date.now().toString() };
            }
            else if (method === 'patch' || method === 'put') {
                responseData = JSON.parse(cfg.data);
            }
            else if (method === 'delete') {
                responseData = {};
            }

            return {
                data: responseData,
                status: method === 'post' ? 201 : 200,
                statusText: 'OK',
                headers: {},
                config: cfg,
                request: {}
            };
        };
        return config;
    });
}

export default api;