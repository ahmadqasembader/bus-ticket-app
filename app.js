import express from 'express';
import router from './routes/user_routes.js';

const app = express();
app.use(express.json());

app.get('/', router);
app.post('/login', router);
app.post('/signup', router);

app.listen(3000, () => {
    console.log("Server is running")
});