import { readDB, writeDB } from '../lib/db';

export default function handler(req, res) {
    const db = readDB();

    if (req.method === 'GET') {
        return res.status(200).json(db.projects);
    }

    if (req.method === 'POST') {
        const newProject = {
            id: Date.now().toString(),
            ...req.body
        };

        db.projects.push(newProject);
        writeDB(db);

        return res.status(201).json(newProject);
    }

    res.status(405).end();
}