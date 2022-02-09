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

let idIngredient = null;

afterAll(() => {
    pg.destroy();
});

describe('Ingredients Right', () => {
    it('should insert ingredients', async () => {
        const res = await request.post('/ingredients').send(testIngredient);

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('ingredient_id');
        expect(res.body[0]).toHaveProperty('ingredient_name');
        expect(res.body[0]).toHaveProperty('ingredient_picture');
        expect(res.body[0]).toHaveProperty('created_at');
        idIngredient = res.body[0].ingredient_id;
    })

    it('should return ingredients', async () => {
        const res = await request.get(`/ingredients/${idIngredient}`);
        
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('ingredient_id');
        expect(res.body[0]).toHaveProperty('ingredient_name');
        expect(res.body[0]).toHaveProperty('ingredient_picture');
        expect(res.body[0]).toHaveProperty('created_at');
        expect(res.body[0]).toHaveProperty('updated_at');
    });

    it('should update ingredients', async () => {
        const res = await request.patch(`/ingredients/${idIngredient}`).send({
            name: 'Test Ingredient Updated',
            picture: 'https://www.akribis.info/web/wp-content/uploads/2017/12/Manzanas1.png'
        });

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('ingredient_id');
        expect(res.body[0]).toHaveProperty('ingredient_name');
        expect(res.body[0]).toHaveProperty('ingredient_picture');
        expect(res.body[0]).toHaveProperty('updated_at');
    })

    it('should delete ingredients', async () => {
        const res = await request.delete(`/ingredients/${idIngredient}`);
        
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('ingredient_id');
        expect(res.body[0]).toHaveProperty('ingredient_name');
    })
})