/* eslint-disable no-undef */
import app from '../../server';
import knexfile from '../../app/knexfile';

import supertest from 'supertest';

const pg = knexfile;
const request = supertest(app);

const testUser2 = {
    email: "test@menu.com",
    passwd: "123325menu"
}

let token = null;
let idToDeleteUser = null;

afterAll(() => {
    pg.destroy();
});

describe('Menu right', () => {
    it('Should create a new user',async () => {
        const res = await request.post('/users/register').send(testUser2);

        expect(res.status).toBe(200);
        expect(res.body.msg).toBe('user created');
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body).toHaveProperty('token')
        token = res.body.token;
        idToDeleteUser = res.body.data.id_user;
    })

    it('Should create and return menu', async () => {
        const res = await request.post(`/menu/${idToDeleteUser}`).auth(token, {type: 'bearer'});

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('id_user_pref');
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body.data).toHaveProperty('menu_json');
        expect(res.body.data).toHaveProperty('created_at');
        expect(res.body.data).toHaveProperty('updated_at');
    })

    it('Should delete a user',async () => {
        const res = await request.delete('/users').auth(token, {type: 'bearer'}).send({ id_user: idToDeleteUser });

        expect(res.status).toBe(200);
    })
})