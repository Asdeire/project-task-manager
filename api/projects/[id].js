let projects = [];

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { id } = req.query;
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Not found' });
    }

    if (req.method === 'PATCH') {
        projects[index] = {
            ...projects[index],
            ...req.body
        };
        return res.status(200).json(projects[index]);
    }

    if (req.method === 'DELETE') {
        projects = projects.filter(p => p.id !== id);
        return res.status(204).end();
    }

    return res.status(405).json({ message: 'Method not allowed' });
}