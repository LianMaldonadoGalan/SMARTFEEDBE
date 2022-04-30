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
    fats: 1,
}

const testIngredient = {
    name: 'Test Ingredient',
    picture: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
}

const testUser2 = {
    email: "test@recipe.com",
    passwd: "123325RECIPE"
}

let mealId = 0;
let idRecipe = 0;
let token = null;
let idToDeleteUser = null;
let idIngredient = 0;
let idIngredient2 = 0;

afterAll(() => {
    pg.destroy();
});

describe('Recipes right', () => {
    it('Should create a new user',async () => {
        const res = await request.post('/users/register').send(testUser2);

        expect(res.status).toBe(200);
        expect(res.body.msg).toBe('user created');
        expect(res.body.data).toHaveProperty('id_user');
        expect(res.body).toHaveProperty('token')
        token = res.body.token;
        idToDeleteUser = res.body.data.id_user;
    })

    it('Should insert a meal for the recipe', async () => {
        const res = await request.post('/meals').auth(token, {type: 'bearer'}).send(testMeal);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('id_meal');
        mealId = res.body.data.id_meal;
    })

    it('Should insert ingredient for the recipe', async () => {
        const res = await request.post('/ingredients').auth(token, {type: 'bearer'}).send(testIngredient);

        expect(res.status).toBe(200);
        idIngredient = res.body.data.ingredient_id;
    })

    it('should insert recipes', async () => {
        const res = await request.post('/recipes').auth(token, {type: 'bearer'}).send(
            {
                mealId,
                mealIngredients: JSON.stringify([idIngredient]),
                mealRecipe: "Esta receta esta con amor",
                mealPrepTime: 90
            }
        );

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('recipe_id');
        expect(res.body.data).toHaveProperty('id_meal');
        expect(res.body.data).toHaveProperty('meal_ingredients');
        expect(res.body.data).toHaveProperty('meal_recipe');
        expect(res.body.data).toHaveProperty('meal_prep_time');
        expect(res.body.data).toHaveProperty('created_at');
        expect(res.body.data).toHaveProperty('updated_at');
        idRecipe = res.body.data.recipe_id;
    });

    it('should get a recipe', async () => {
        const res = await request.get(`/recipes/${idRecipe}`).auth(token, {type: 'bearer'});

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('recipe_id');
        expect(res.body.data).toHaveProperty('id_meal');
        expect(res.body.data).toHaveProperty('meal_ingredients');
        expect(res.body.data).toHaveProperty('meal_recipe');
        expect(res.body.data).toHaveProperty('meal_prep_time');
        expect(res.body.data).toHaveProperty('created_at');
        expect(res.body.data).toHaveProperty('updated_at');
    });

    it('Should insert second ingredient for the recipe', async () => {
        const res = await request.post('/ingredients').auth(token, {type: 'bearer'}).send(testIngredient);

        expect(res.status).toBe(200);
        idIngredient2 = res.body.data.ingredient_id;
    })

    it('should update a recipe', async () => {
        const res = await request.patch(`/recipes/${idRecipe}`).auth(token, {type: 'bearer'}).send({
            mealIngredients: JSON.stringify([idIngredient2]),
            mealRecipe: "Esta receta esta con mucho mucho amor",
            mealPrepTime: 80
        });

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('recipe_id');
        expect(res.body.data).toHaveProperty('id_meal');
        expect(res.body.data).toHaveProperty('meal_ingredients');
        expect(res.body.data).toHaveProperty('meal_recipe');
        expect(res.body.data).toHaveProperty('meal_prep_time');
        expect(res.body.data).toHaveProperty('updated_at');
    });

    it('should delete a recipe', async () => {
        const res = await request.delete(`/recipes/${idRecipe}`).auth(token, {type: 'bearer'});

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('recipe_id');
    });

    it('Should delete a user ingredients',async () => {
        const res = await request.delete('/users').auth(token, {type: 'bearer'}).send({ id_user: idToDeleteUser });

        expect(res.status).toBe(200);
    })
})