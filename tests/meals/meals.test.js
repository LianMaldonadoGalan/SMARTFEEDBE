/* eslint-disable no-undef */
import app from '../../server';

import supertest from 'supertest';

const request = supertest(app);

const mealTest = {
    mealPhoto: 'https://saborgourmet.com//wp-content/uploads/meal-prep-hamburguesas-brocoli-istock.jpg',
    mealName: 'Hamburguesa con brocoli',
    mealDescription: 'Deliciosa Hamburguesa',
    mealType: false,
    mealCost: 3,
    mealProtein: 2,
    mealCalories: 200,
    mealCarbohydrates: 2,
    mealFats: 1
}

let mealIdTest = 0;
describe('Meals', () => {
    it.skip('Should create a new meal', async () => {
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

    it.skip('should return meals', async () => {
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
    
    it.skip('should update a meal', async () => {
        const res = await request.put(`/meals/${mealIdTest}`).send({
            mealPhoto: 'https://saborgourmet.com//wp-content/uploads/meal-prep-hamburguesas-brocoli-istock.jpg',
            mealName: 'Hamburguesa con zanahoria',
            mealDescription: 'Deliciosa Hamburguesa con zanahorias de acompañamiento',
            mealType: false,
            mealCost: 2,
            mealProtein: 20,
            mealCalories: 190,
            mealCarbohydrates: 2,
            mealFats: 1
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

    it.skip('should delete a meal', async () => {
        const res = await request.delete(`/meals/${mealIdTest}`);
    
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id_meal');
        expect(res.body[0]).toHaveProperty('meal_name');
    })
})