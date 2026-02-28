let tasks = [];

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { id } = req.query;
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Not found' });
    }

    if (req.method === 'PATCH') {
        tasks[index] = {
            ...tasks[index],
            ...req.body
        };
        return res.status(200).json(tasks[index]);
    }

    if (req.method === 'DELETE') {
        tasks = tasks.filter(t => t.id !== id);
        return res.status(204).end();
    }

    return res.status(405).json({ message: 'Method not allowed' });
}