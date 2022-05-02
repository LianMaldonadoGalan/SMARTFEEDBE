/* eslint-disable no-undef */
import app from '../../server';
import knexfile from '../../app/knexfile';

import supertest from 'supertest';

const pg = knexfile;
const request = supertest(app);

const testUser2 = {
    email: "test@testCart.com",
    passwd: "123325"
}

let idToDeleteUser = null;
let token = null;

afterAll(() => {
    pg.destroy();
});

describe('Menu right', () => {
    it('Should create a new user',async () => {
        const res = await request.post('/users/register').send(testUser2);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('user created');
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body).toHaveProperty('token')
        token = res.body.token;
        idToDeleteUser = res.body.data.id_user;
    })

    it('Should update user data',async () => {
        const res = await request.patch(`/userData/${idToDeleteUser}`).auth(token, {type: 'bearer'}).send({
            profilePicture: 'https://www.seekpng.com/png/detail/966-9665317_placeholder-image-person-jpg.png',
            name: 'test',
            birthDate: '2000-01-01',
            bmi: 20,
            height: 180,
            weight: 80,
            physicalActivity: '2',
            isVegetarian: 'F',
            sex: 'M',
            goal: '1',
            mealsQty: '3'
        })

        expect(res.status).toBe(200);
    })

    it('Should create and return menu', async () => {
        const res = await request.get(`/menu/${idToDeleteUser}`).auth(token, {type: 'bearer'});
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('id_user_pref');
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body.data).toHaveProperty('menu_json');
        expect(res.body.data).toHaveProperty('created_at');
        expect(res.body.data).toHaveProperty('updated_at');
    })

    it('Should return the list of ingredients for the menu', async () => {
        const res = await request.get(`/menu/cart/${idToDeleteUser}`).auth(token, {type: 'bearer'});

        expect(res.status).toBe(200);
    })

    it('Should delete a user',async () => {
        const res = await request.delete('/users').auth(token, {type: 'bearer'}).send({ id_user: idToDeleteUser });

        expect(res.status).toBe(200);
    })
})