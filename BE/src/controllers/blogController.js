const { v4: uuidv4 } = require('uuid');
const db = require('../configs/db');

async function createBlog(req, res) {
    try {
        const { title, content, category, read_time } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let imageUrl = null;
        if (req.file) {
            imageUrl = req.file.path || req.file.filename;
        }

        

        const id = uuidv4();
        const createdAt = new Date();

        await db.query(
            'INSERT INTO blogs (id, title, content, category, read_time, image_url, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, title, content, category , read_time, imageUrl, createdAt]
        );

        res.status(201).json({ id, title, content, category, read_time, image: imageUrl, createdAt });
    } catch (error) {
        res.status(500).json({ message: 'Error creating blog', error: error.message });
    }
}

async function getAllBlogs(req, res) {
    try {
        const [rows] = await db.query('SELECT * FROM blogs ORDER BY date DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blogs', error: error.message });
    }
}

async function getBlogById(req, res) {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM blogs WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog', error: error.message });
    }
}

module.exports = { createBlog, getAllBlogs, getBlogById };