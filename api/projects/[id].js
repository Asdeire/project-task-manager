import { readDB, writeDB } from '../lib/db';

export default function handler(req, res) {
    const { id } = req.query;
    const db = readDB();

    const index = db.projects.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Not found' });
    }

    if (req.method === 'PATCH') {
        db.projects[index] = {
            ...db.projects[index],
            ...req.body
        };

        writeDB(db);
        return res.status(200).json(db.projects[index]);
    }

    if (req.method === 'DELETE') {
        db.projects = db.projects.filter(p => p.id !== id);
        writeDB(db);
        return res.status(204).end();
    }

    res.status(405).end();
}