/* eslint-disable no-undef */
import app from '../../server';
import knexfile from '../../app/knexfile';

import supertest from 'supertest';

const pg = knexfile;
const request = supertest(app);

const testMeal = {
    photo: 'https://saborgourmet.com//wp-content/uploads/meal-prep-hamburguesas-brocoli-istock.jpg',
    name: 'hotdog con queso',
    description: 'Deliciosa hot dog',
    type: "C",
    cost: 2,
    protein: 56,
    calories: 220,
    carbohydrates: 2,
    fats: 1
}

const testRecipe = {
    mealIngredients: JSON.stringify([1, 3, 6, 8]),
    mealRecipe: "Esta receta esta con amor",
    mealPrepTime: "1:30"
}

let mealId = 0;
let idRecipe = 0;

afterAll(() => {
    pg.destroy();
});

describe('Recipes right', () => {
    it('Should insert a meal for the recipe', async () => {
        const res = await request.post('/meals').send(testMeal);

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id_meal');
        mealId = res.body[0].id_meal;
    })

    it('should insert recipes', async () => {
        const res = await request.post('/recipes').send({...testRecipe, mealId});

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('recipe_id');
        expect(res.body[0]).toHaveProperty('id_meal');
        expect(res.body[0]).toHaveProperty('meal_ingredients');
        expect(res.body[0]).toHaveProperty('meal_recipe');
        expect(res.body[0]).toHaveProperty('meal_prep_time');
        expect(res.body[0]).toHaveProperty('created_at');
        expect(res.body[0]).toHaveProperty('updated_at');
        idRecipe = res.body[0].recipe_id;
    });

    it('should get a recipe', async () => {
        const res = await request.get(`/recipes/${idRecipe}`);

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('recipe_id');
        expect(res.body[0]).toHaveProperty('id_meal');
        expect(res.body[0]).toHaveProperty('meal_ingredients');
        expect(res.body[0]).toHaveProperty('meal_recipe');
        expect(res.body[0]).toHaveProperty('meal_prep_time');
        expect(res.body[0]).toHaveProperty('created_at');
        expect(res.body[0]).toHaveProperty('updated_at');
    });

    it('should update a recipe', async () => {
        const res = await request.patch(`/recipes/${idRecipe}`).send({
            mealIngredients: JSON.stringify([1, 3, 6, 8, 9]),
            mealRecipe: "Esta receta esta con mucho mucho amor"
        });

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('recipe_id');
        expect(res.body[0]).toHaveProperty('id_meal');
        expect(res.body[0]).toHaveProperty('meal_ingredients');
        expect(res.body[0]).toHaveProperty('meal_recipe');
        expect(res.body[0]).toHaveProperty('meal_prep_time');
        expect(res.body[0]).toHaveProperty('updated_at');
    });

    it('should delete a recipe', async () => {
        const res = await request.delete(`/recipes/${idRecipe}`);

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('recipe_id');
    });
})