/* eslint-disable no-undef */
import app from '../../server';
import knexfile from '../../app/knexfile';

import supertest from 'supertest';

const pg = knexfile;
const request = supertest(app);

const testUser2 = {
    email: "test@testUserData.com",
    passwd: "123325"
}

let idUser = null;
let token = null;

afterAll(() => {
    pg.destroy();
});

describe('User data right', () => {
    it('Should create a new user',async () => {
        const res = await request.post('/users/register').send(testUser2);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('user created');
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body).toHaveProperty('token')
        token = res.body.token;
        idUser = res.body.data.id_user;
    })

    it('Should return user data', async () => {
        const res = await request.get(`/userData/${idUser}`).auth(token, {type: 'bearer'});

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body.data).toHaveProperty('id_user_data');
        expect(res.body.data).toHaveProperty('profile_picture');
        expect(res.body.data).toHaveProperty('name');
        expect(res.body.data).toHaveProperty('birth_date');
        expect(res.body.data).toHaveProperty('sex');
        expect(res.body.data).toHaveProperty('weight');
        expect(res.body.data).toHaveProperty('physical_activity');
        expect(res.body.data).toHaveProperty('height');
        expect(res.body.data).toHaveProperty('bmi');
        expect(res.body.data).toHaveProperty('is_vegetarian');
        expect(res.body.data).toHaveProperty('goal');
        expect(res.body.data).toHaveProperty('meals_qty');
    })

    it('Should update a user data',async () => {
        const res = await request.patch(`/userData/${idUser}`).auth(token, {type: 'bearer'}).send({
            profilePicture: 'https://www.seekpng.com/png/detail/966-9665317_placeholder-image-person-jpg.png',
            name: 'test',
            birthDate: '2020-01-01',
            bmi: 20,
            height: 180,
            weight: 80,
            physicalActivity: '2',
            isVegetarian: 'T',
        })

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body.data).toHaveProperty('id_user_data');
        expect(res.body.data).toHaveProperty('profile_picture');
        expect(res.body.data).toHaveProperty('name');
        expect(res.body.data).toHaveProperty('birth_date');
    })

    it('Should delete user', async () => {
        const res = await request.delete(`/users/`).auth(token, {type: 'bearer'}).send({ id_user: idUser });

        expect(res.status).toBe(200);
    })
})