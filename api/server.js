const db = require('../db.json');

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const url = req.url || '';

    if (url.includes('/projects')) {
        if (req.method === 'GET') return res.status(200).json(db.projects || []);
        if (req.method === 'POST') return res.status(201).json({ id: Date.now().toString(), ...req.body });
        return res.status(200).json(req.body || {}); // Для PATCH/DELETE
    }

    if (url.includes('/tasks')) {
        if (req.method === 'GET') return res.status(200).json(db.tasks || []);
        if (req.method === 'POST') return res.status(201).json({ id: Date.now().toString(), ...req.body });
        return res.status(200).json(req.body || {}); // Для PATCH/DELETE
    }

    res.status(404).json({ error: 'Endpoint not found' });
};