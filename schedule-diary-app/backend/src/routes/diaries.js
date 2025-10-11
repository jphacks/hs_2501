import express from 'express';
import fs from 'fs';
import path from 'path';
import { authMiddleware } from './auth.js';

const router = express.Router();

const dataDir = path.resolve(process.cwd(), 'src', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const diariesFile = path.join(dataDir, 'diaries.json');

const readJson = (file, defaultValue) => {
  try {
    if (!fs.existsSync(file)) return defaultValue;
    return JSON.parse(fs.readFileSync(file, 'utf8') || 'null') || defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const writeJson = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

router.get('/', authMiddleware, (req, res) => {
  const diaries = readJson(diariesFile, []);
  const userDiaries = diaries.filter(d => d.userId === req.user.id);
  res.json({ diaries: userDiaries });
});

router.post('/', authMiddleware, (req, res) => {
  const { title, content, image } = req.body;
  if (!content) return res.status(400).json({ error: 'content_required' });
  const diaries = readJson(diariesFile, []);
  const entry = {
    id: cryptoRandom(),
    userId: req.user.id,
    title: title || '',
    content,
    image: image || null,
    createdAt: new Date().toISOString()
  };
  diaries.push(entry);
  writeJson(diariesFile, diaries);
  res.json({ diary: entry });
});

const cryptoRandom = () => {
  return [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
};

export default router;
