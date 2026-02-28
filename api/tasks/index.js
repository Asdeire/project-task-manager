import db from '../../db.json';

let tasks = db.tasks || [];

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'GET') {
        const { projectId } = req.query;

        if (projectId) {
            return res
                .status(200)
                .json(tasks.filter(t => t.projectId === projectId));
        }

        return res.status(200).json(tasks);
    }

    if (req.method === 'POST') {
        const newTask = {
            id: crypto.randomUUID(),
            ...req.body
        };

        tasks.push(newTask);
        return res.status(201).json(newTask);
    }

    return res.status(405).json({ message: 'Method not allowed' });
}