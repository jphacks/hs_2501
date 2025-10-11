import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const router = express.Router();

const dataDir = path.resolve(process.cwd(), 'src', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const usersFile = path.join(dataDir, 'users.json');
const sessionsFile = path.join(dataDir, 'sessions.json');

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

const hashPassword = (pw, salt) => {
  return crypto.createHmac('sha256', salt).update(pw).digest('hex');
};

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const users = readJson(usersFile, []);
  if (users.find(u => u.username === username)) return res.status(409).json({ error: 'user_exists' });

  const salt = crypto.randomBytes(8).toString('hex');
  const hashed = hashPassword(password, salt);
  const user = { id: crypto.randomUUID(), username, password: hashed, salt, createdAt: new Date().toISOString() };
  users.push(user);
  writeJson(usersFile, users);

  const sessions = readJson(sessionsFile, {});
  const token = crypto.randomUUID();
  sessions[token] = { userId: user.id, createdAt: new Date().toISOString() };
  writeJson(sessionsFile, sessions);

  res.json({ token, user: { id: user.id, username: user.username } });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const users = readJson(usersFile, []);
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });

  const hashed = hashPassword(password, user.salt);
  if (hashed !== user.password) return res.status(401).json({ error: 'invalid_credentials' });

  const sessions = readJson(sessionsFile, {});
  const token = crypto.randomUUID();
  sessions[token] = { userId: user.id, createdAt: new Date().toISOString() };
  writeJson(sessionsFile, sessions);

  res.json({ token, user: { id: user.id, username: user.username } });
});

export const authMiddleware = (req, res, next) => {
  const token = req.headers['x-auth-token'] || req.query.token;
  if (!token) return res.status(401).json({ error: 'no_token' });
  const sessions = readJson(sessionsFile, {});
  const s = sessions[token];
  if (!s) return res.status(401).json({ error: 'invalid_token' });
  const users = readJson(usersFile, []);
  const user = users.find(u => u.id === s.userId);
  if (!user) return res.status(401).json({ error: 'user_not_found' });
  req.user = { id: user.id, username: user.username };
  next();
};

export default router;
