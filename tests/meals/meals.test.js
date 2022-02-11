/* eslint-disable no-undef */
import app from '../../server';
import knexfile from '../../app/knexfile';

import supertest from 'supertest';

const pg = knexfile;
const request = supertest(app);

const mealTest = {
    photo: 'https://saborgourmet.com//wp-content/uploads/meal-prep-hamburguesas-brocoli-istock.jpg',
    name: 'Hamburguesa con brocoli',
    description: 'Deliciosa Hamburguesa',
    type: "C",
    cost: 3,
    protein: 2,
    calories: 200,
    carbohydrates: 2,
    fats: 1
}

afterAll(() => {
    pg.destroy();
});

let mealIdTest = 0;

describe('Meals right', () => {
    it('Should create a new meal', async () => {
        const res = await request.post('/meals').send(mealTest);
        
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id_meal');
        expect(res.body[0]).toHaveProperty('meal_photo');
        expect(res.body[0]).toHaveProperty('meal_name');
        expect(res.body[0]).toHaveProperty('meal_description');
        expect(res.body[0]).toHaveProperty('meal_type');
        expect(res.body[0]).toHaveProperty('meal_cost');
        expect(res.body[0]).toHaveProperty('meal_protein');
        expect(res.body[0]).toHaveProperty('meal_calories');
        expect(res.body[0]).toHaveProperty('meal_carbohydrates');
        expect(res.body[0]).toHaveProperty('meal_fats');
        expect(res.body[0]).toHaveProperty('created_at');
        mealIdTest = res.body[0].id_meal;
    })

    it('Should get all meals', async () => {
        const res = await request.get('/meals');

        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id_meal');
        expect(res.body[0]).toHaveProperty('meal_photo');
        expect(res.body[0]).toHaveProperty('meal_name');
        expect(res.body[0]).toHaveProperty('meal_description');
        expect(res.body[0]).toHaveProperty('meal_type');
        expect(res.body[0]).toHaveProperty('meal_cost');
        expect(res.body[0]).toHaveProperty('meal_protein');
        expect(res.body[0]).toHaveProperty('meal_calories');
        expect(res.body[0]).toHaveProperty('meal_carbohydrates');
        expect(res.body[0]).toHaveProperty('meal_fats');
        expect(res.body[0]).toHaveProperty('created_at');
        expect(res.body[0]).toHaveProperty('updated_at');
    })

    it('should return meals', async () => {
        const res = await request.get(`/meals/${mealIdTest}`);
    
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id_meal');
        expect(res.body[0]).toHaveProperty('meal_photo');
        expect(res.body[0]).toHaveProperty('meal_name');
        expect(res.body[0]).toHaveProperty('meal_description');
        expect(res.body[0]).toHaveProperty('meal_type');
        expect(res.body[0]).toHaveProperty('meal_cost');
        expect(res.body[0]).toHaveProperty('meal_protein');
        expect(res.body[0]).toHaveProperty('meal_calories');
        expect(res.body[0]).toHaveProperty('meal_carbohydrates');
        expect(res.body[0]).toHaveProperty('meal_fats');
        expect(res.body[0]).toHaveProperty('created_at');
        expect(res.body[0]).toHaveProperty('updated_at');
    })
    
    it('should update a meal', async () => {
        const res = await request.patch(`/meals/${mealIdTest}`).send({
            photo: 'https://saborgourmet.com//wp-content/uploads/meal-prep-hamburguesas-brocoli-istock.jpg',
            name: 'Hamburguesa con zanahoria',
            description: 'Deliciosa Hamburguesa con zanahorias de acompañamiento',
            type: "V",
            cost: 2,
            calories: 190,
            carbohydrates: 2,
            ats: 1
        });
    
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id_meal');
        expect(res.body[0]).toHaveProperty('meal_photo');
        expect(res.body[0]).toHaveProperty('meal_name');
        expect(res.body[0]).toHaveProperty('meal_description');
        expect(res.body[0]).toHaveProperty('meal_type');
        expect(res.body[0]).toHaveProperty('meal_cost');
        expect(res.body[0]).toHaveProperty('meal_protein');
        expect(res.body[0]).toHaveProperty('meal_calories');
        expect(res.body[0]).toHaveProperty('meal_carbohydrates');
        expect(res.body[0]).toHaveProperty('meal_fats');
        expect(res.body[0]).toHaveProperty('updated_at');
    });

    it('should delete a meal', async () => {
        const res = await request.delete(`/meals/${mealIdTest}`);
    
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id_meal');
        expect(res.body[0]).toHaveProperty('meal_name');
    })
})