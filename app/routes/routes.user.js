import app from '../../server';

import { searchUsers } from './app/controllers/controller.users';

app.get('/users', searchUsers);