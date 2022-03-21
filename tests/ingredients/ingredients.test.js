/* eslint-disable no-undef */
import app from '../../server';
import knexfile from '../../app/knexfile';

import supertest from 'supertest';

const pg = knexfile;
const request = supertest(app);

const testIngredient = {
    name: 'Test Ingredient',
    picture: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
}
const testUser2 = {
    email: "test@ingredients.com",
    passwd: "123325ingredients"
}
let idIngredient = null;
let token = null;
let deleteUser = null;

afterAll(() => {
    pg.destroy();
});

describe('Ingredients Right', () => {
    it('Should create a new user ingredients',async () => {
        const res = await request.post('/users/register').send(testUser2);
        expect(res.status).toBe(200);
        expect(res.body.msg).toBe('user created');
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body).toHaveProperty('token')
        token = res.body.token;
        deleteUser = res.body.data.id_user;
    })

    it('should insert ingredients', async () => {
        const res = await request.post('/ingredients').auth(token, {type: 'bearer'}).send(testIngredient);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('ingredient_id');
        expect(res.body.data).toHaveProperty('ingredient_name');
        expect(res.body.data).toHaveProperty('ingredient_picture');
        expect(res.body.data).toHaveProperty('created_at');
        idIngredient = res.body.data.ingredient_id;
    })

    it('should get all ingredients', async () => {
        const res = await request.get('/ingredients').auth(token, {type: 'bearer'});

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0]).toHaveProperty('ingredient_id');
        expect(res.body.data[0]).toHaveProperty('ingredient_name');
        expect(res.body.data[0]).toHaveProperty('ingredient_picture');
        expect(res.body.data[0]).toHaveProperty('created_at');
    })

    it('should return ingredients', async () => {
        const res = await request.get(`/ingredients/${idIngredient}`).auth(token, {type: 'bearer'});
        
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('ingredient_id');
        expect(res.body.data).toHaveProperty('ingredient_name');
        expect(res.body.data).toHaveProperty('ingredient_picture');
        expect(res.body.data).toHaveProperty('created_at');
        expect(res.body.data).toHaveProperty('updated_at');
    });

    it('should update ingredients', async () => {
        const res = await request.patch(`/ingredients/${idIngredient}`).auth(token, {type: 'bearer'}).send({
            name: 'Test Ingredient Updated',
            picture: 'https://www.akribis.info/web/wp-content/uploads/2017/12/Manzanas1.png'
        });

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('ingredient_id');
        expect(res.body.data).toHaveProperty('ingredient_name');
        expect(res.body.data).toHaveProperty('ingredient_picture');
        expect(res.body.data).toHaveProperty('updated_at');
    })

    it('should delete ingredients', async () => {
        const res = await request.delete(`/ingredients/${idIngredient}`).auth(token, {type: 'bearer'});
        
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('ingredient_id');
        expect(res.body.data).toHaveProperty('ingredient_name');
    })

    it('Should delete a user ingredients',async () => {
        const res = await request.delete('/users').auth(token, {type: 'bearer'}).send({ id_user: deleteUser });

        expect(res.status).toBe(200);
    })
})