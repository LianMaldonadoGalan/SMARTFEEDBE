/* eslint-disable no-undef */
import app from '../../server';
import knexfile from '../../app/knexfile';

import supertest from 'supertest';
const pg = knexfile;
const request = supertest(app);

const testUser2 = {
    email: "test@test1234.com",
    passwd: "123325"
}
let idToDelete = null;

// destroy connection after all tests
afterAll(() => {
    pg.destroy();
});

describe('User right', () => {
    it('Should create a new user',async () => {
        const res = await request.post('/users/register').send(testUser2);

        expect(res.status).toBe(200);
        expect(res.body.msg).toBe('user created');
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body.data).toHaveProperty('id_user_pref');
        expect(res.body.data).toHaveProperty('id_user_data');
        expect(res.body.data).toHaveProperty('email');
        expect(res.body.data).toHaveProperty('created_at');
        expect(res.body.data).toHaveProperty('is_administrator');
        expect(res.body.data).not.toHaveProperty('passwd');
        expect(res.body.data.email).toBe(testUser2.email);
        idToDelete = res.body.data.id_user;
    })

    it('should return user', async () => {
        const res = await request.post('/users/login').send(testUser2);

        expect(res.status).toBe(200);
        expect(res.body.msg).toBe('user found');
        expect(res.body.data).toHaveProperty('email');
        expect(res.body.data).not.toHaveProperty('passwd');
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body.data).toHaveProperty('is_administrator');
    })
    
    it('Should update a user',async () => {
        const res = await request.patch('/users').send({
            id_user: idToDelete,
            email: testUser2.email,
            passwd: testUser2.passwd
        })

        expect(res.status).toBe(200);
        expect(res.body.msg).toBe('user updated');
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body.data).toHaveProperty('email');
        expect(res.body.data).toHaveProperty('is_administrator');    
    })

    it('Should delete a user',async () => {
        const res = await request.delete('/users').send({ id_user: idToDelete });

        expect(res.status).toBe(200);
        expect(res.body.msg).toBe('user deleted');
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body.data).toHaveProperty('email');
    })
})
