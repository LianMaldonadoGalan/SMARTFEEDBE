/* eslint-disable no-undef */
import app from '../../server';
import knexfile from '../../app/knexfile';

import supertest from 'supertest';
const pg = knexfile;
const request = supertest(app);

const testUser2 = {
    email: "test@testUserPref.com",
    passwd: "123325"
}
let idToDeleteUser = null;
let token = null;

// destroy connection after all tests
afterAll(() => {
    pg.destroy();
});

describe('Users pref right',() => {
    it('Should create a new user',async () => {
        const res = await request.post('/users/register').send(testUser2);

        expect(res.status).toBe(200);
        expect(res.body.msg).toBe('user created');
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body).toHaveProperty('token')
        token = res.body.token;
        idToDeleteUser = res.body.data.id_user;
    })

    it('Should get user preferences', async () => {
        const res = await request.get(`/userPref/${idToDeleteUser}`).auth(token, {type: 'bearer'});

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('id_user_pref');
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body.data).toHaveProperty('menu_json');
        expect(res.body.data).toHaveProperty('monday');
    })

    it('Should update user preferences', async () => {
        const res = await request.patch(`/userPref/${idToDeleteUser}`).auth(token, {type: 'bearer'}).send({
            menuJSON: '{"menu":{"monday":[1,3,5],"tuesday":[2,1,5],"wednesday":[1,5,1],"thursday":[2,5,6],"friday":[1,2,7],"saturday":[23,61,61],"sunday":[1,6,12]}}',
            monday: '1,3,5',
            tuesday: '2,1,5'
        });

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('id_user_pref');
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body.data).toHaveProperty('menu_json');
        expect(res.body.data).toHaveProperty('monday');
    })

    it('Should delete user', async () => {
        const res = await request.delete(`/users/`).auth(token, {type: 'bearer'}).send({ id_user: idToDeleteUser });

        expect(res.status).toBe(200);
    })
})