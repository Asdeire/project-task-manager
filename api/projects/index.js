let projects = [];

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        return res.status(200).json(projects);
    }

    if (req.method === 'POST') {
        const newProject = {
            id: crypto.randomUUID(),
            ...req.body
        };

        projects.push(newProject);
        return res.status(201).json(newProject);
    }

    return res.status(405).json({ message: 'Method not allowed' });
}