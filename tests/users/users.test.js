/* eslint-disable no-undef */
import app from '../../server';
import {terminateConnection} from '../../app/services/service.users.js';

import supertest from 'supertest';

const request = supertest(app);

const testUser = {
    email: "nombro@1234.com",
    passwd: "1233"
}
const testUser2 = {
    email: "test@test1234.com",
    passwd: "123325"
}
let idToDelete = null;
const userStringified = JSON.stringify(testUser);

describe('User', () => {
    it('should return user', async () => {
        const res = await request.get('/users').send(testUser);

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('email');
        expect(res.body[0]).not.toHaveProperty('passwd');
        expect(res.body[0]).toHaveProperty('id_user');
        expect(res.body[0]).toHaveProperty('is_administrator');
    })

    it('Should create a new user',async () => {
        const res = await request.post('/users').send(testUser2);
        
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id_user');
        expect(res.body[0]).toHaveProperty('email');
        expect(res.body[0]).toHaveProperty('created_at');
        expect(res.body[0]).toHaveProperty('is_administrator');
        expect(res.body[0]).not.toHaveProperty('passwd');
        idToDelete = res.body[0].id_user;
    })

    it('Should update a user',async () => {
        const res = await request.patch('/users').send({
            id_user: idToDelete,
            email: testUser2.email,
            passwd: testUser2.passwd
        })

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id_user');
        expect(res.body[0]).toHaveProperty('email');
        expect(res.body[0]).toHaveProperty('is_administrator');    
    })

    it('Should delete a user',async () => {
        const res = await request.delete('/users').send({ id_user: idToDelete });

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id_user');
        expect(res.body[0]).toHaveProperty('email');
    })

    it('Should stop pg connection',async () => {
        await terminateConnection()
    })
})
