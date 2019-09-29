import express from 'express';
import path from 'path';

const front = path.join(__dirname, '../../', 'node_modules/anna-web/dist');
const routes = express.Router();

routes.get('*', (req, res) => res.sendFile(path.join(front, 'index.html')));

export default [express.static(front), routes];
