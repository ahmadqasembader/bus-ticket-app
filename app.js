import express from 'express';
import {dirname} from 'path'
import { fileURLToPath } from 'url';

import router from './routes/user_routes.js';
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')

app.get('/', router);
app.get('/dashboard', router);
app.get('/logout', router);
app.post('/login', router);
app.get('/signup', router);
app.get('/create', router);

app.listen(3000, () => {
    console.log("Server is running")
});