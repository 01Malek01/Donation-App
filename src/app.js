import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import OrderRouter from './routes/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(bodyParser.json());

// Serve static files from the src/public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/orders', OrderRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/index.html'));
});

export default app;