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
    fats: 1,
    mainType: '{breakfast: false, lunch: false, dinner: false, snack: true}'
}

const testUser2 = {
    email: "test@meals.com",
    passwd: "123325MEALS"
}

let token = null;
let idToDeleteUser = null;
let mealIdTest = 0;

afterAll(() => {
    pg.destroy();
});


describe('Meals right', () => {
    it('Should create a new user',async () => {
        const res = await request.post('/users/register').send(testUser2);

        expect(res.status).toBe(200);
        expect(res.body.msg).toBe('user created');
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body).toHaveProperty('token')
        token = res.body.token;
        idToDeleteUser = res.body.data.id_user;
    })

    it('Should create a new meal', async () => {
        const res = await request.post('/meals').auth(token, {type: 'bearer'}).send(mealTest);
        
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('id_meal');
        expect(res.body.data).toHaveProperty('meal_photo');
        expect(res.body.data).toHaveProperty('meal_name');
        expect(res.body.data).toHaveProperty('meal_description');
        expect(res.body.data).toHaveProperty('meal_main_type');
        expect(res.body.data).toHaveProperty('meal_type');
        expect(res.body.data).toHaveProperty('meal_cost');
        expect(res.body.data).toHaveProperty('meal_protein');
        expect(res.body.data).toHaveProperty('meal_calories');
        expect(res.body.data).toHaveProperty('meal_carbohydrates');
        expect(res.body.data).toHaveProperty('meal_fats');
        expect(res.body.data).toHaveProperty('created_at');
        mealIdTest = res.body.data.id_meal;
    })

    it('Should get all meals', async () => {
        const res = await request.get('/meals?limit=10&page=0').auth(token, {type: 'bearer'});

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0]).toHaveProperty('id_meal');
        expect(res.body.data[0]).toHaveProperty('meal_photo');
        expect(res.body.data[0]).toHaveProperty('meal_name');
        expect(res.body.data[0]).toHaveProperty('meal_description');
        expect(res.body.data[0]).toHaveProperty('meal_main_type');
        expect(res.body.data[0]).toHaveProperty('meal_type');
        expect(res.body.data[0]).toHaveProperty('meal_cost');
        expect(res.body.data[0]).toHaveProperty('meal_protein');
        expect(res.body.data[0]).toHaveProperty('meal_calories');
        expect(res.body.data[0]).toHaveProperty('meal_carbohydrates');
        expect(res.body.data[0]).toHaveProperty('meal_fats');
        expect(res.body.data[0]).toHaveProperty('created_at');
        expect(res.body.data[0]).toHaveProperty('updated_at');
    })

    it('should return meals', async () => {
        const res = await request.get(`/meals/${mealIdTest}`).auth(token, {type: 'bearer'});
    
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('id_meal');
        expect(res.body.data).toHaveProperty('meal_photo');
        expect(res.body.data).toHaveProperty('meal_name');
        expect(res.body.data).toHaveProperty('meal_description');
        expect(res.body.data).toHaveProperty('meal_main_type');
        expect(res.body.data).toHaveProperty('meal_type');
        expect(res.body.data).toHaveProperty('meal_cost');
        expect(res.body.data).toHaveProperty('meal_protein');
        expect(res.body.data).toHaveProperty('meal_calories');
        expect(res.body.data).toHaveProperty('meal_carbohydrates');
        expect(res.body.data).toHaveProperty('meal_fats');
        expect(res.body.data).toHaveProperty('created_at');
        expect(res.body.data).toHaveProperty('updated_at');
    })
    
    it('should update a meal', async () => {
        const res = await request.patch(`/meals/${mealIdTest}`).auth(token, {type: 'bearer'}).send({
            photo: 'https://saborgourmet.com//wp-content/uploads/meal-prep-hamburguesas-brocoli-istock.jpg',
            name: 'Hamburguesa con zanahoria',
            description: 'Deliciosa Hamburguesa con zanahorias de acompañamiento',
            type: "V",
            cost: 2,
            calories: 190,
            carbohydrates: 2,
            fats: 1,
            mainType: '{breakfast: false, lunch: false, dinner: true, snack: false}'
        });
    
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('id_meal');
        expect(res.body.data).toHaveProperty('meal_photo');
        expect(res.body.data).toHaveProperty('meal_name');
        expect(res.body.data).toHaveProperty('meal_description');
        expect(res.body.data).toHaveProperty('meal_main_type');
        expect(res.body.data).toHaveProperty('meal_type');
        expect(res.body.data).toHaveProperty('meal_cost');
        expect(res.body.data).toHaveProperty('meal_protein');
        expect(res.body.data).toHaveProperty('meal_calories');
        expect(res.body.data).toHaveProperty('meal_carbohydrates');
        expect(res.body.data).toHaveProperty('meal_fats');
        expect(res.body.data).toHaveProperty('updated_at');
    });

    it('should delete a meal', async () => {
        const res = await request.delete(`/meals/${mealIdTest}`).auth(token, {type: 'bearer'});
    
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('id_meal');
        expect(res.body.data).toHaveProperty('meal_name');
    })

    it('Should delete a user ingredients',async () => {
        const res = await request.delete('/users').auth(token, {type: 'bearer'}).send({ id_user: idToDeleteUser });

        expect(res.status).toBe(200);
    })
})