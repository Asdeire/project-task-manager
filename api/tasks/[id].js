import { readDB, writeDB } from '../lib/db';

export default function handler(req, res) {
    const { id } = req.query;
    const db = readDB();

    const index = db.tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Not found' });
    }

    if (req.method === 'PATCH') {
        db.tasks[index] = {
            ...db.tasks[index],
            ...req.body
        };

        writeDB(db);
        return res.status(200).json(db.tasks[index]);
    }

    if (req.method === 'DELETE') {
        db.tasks = db.tasks.filter(t => t.id !== id);
        writeDB(db);
        return res.status(204).end();
    }

    return res.status(405).json({ message: 'Method not allowed' });
}