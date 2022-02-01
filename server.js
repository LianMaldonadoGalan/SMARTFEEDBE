import express from 'express';

import { searchUsers, insertUserController } from './app/controllers/controller.users';

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {
    // Todo: add middleware
    next();
});

app.get('/users', searchUsers);

app.post('/users', insertUserController);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);