/* eslint-disable no-undef */
import app from '../../server';

import supertest from 'supertest';

const request = supertest(app);

describe('Meals', () => {
    // it('should return meals', async () => {
        //     const res = await request.get('/meals');
        
        //     expect(res.status).toBe(200);
        //     expect(res.body[0]).toHaveProperty('id_meal');
        //     expect(res.body[0]).toHaveProperty('name');
        //     expect(res.body[0]).toHaveProperty('description');
        //     expect(res.body[0]).toHaveProperty('price');
        //     expect(res.body[0]).toHaveProperty('image');
        //     expect(res.body[0]).toHaveProperty('created_at');
        // })
        
        // it('Should create a new meal', async () => {
            //     const res = await request.post('/meals').send({
                //         name: 'Test Meal',
                //         description: 'Test description',
                //         price: '12.50',
                //         image: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                //     });
                
                //     expect(res.status).toBe(200);
                //     expect(res.body[0]).toHaveProperty('id_meal');
                //     expect(res.body[0]).toHaveProperty('name');
                //     expect(res.body[0]).toHaveProperty('description');
                //     expect(res.body[0]).toHaveProperty('price');
                //     expect(res.body[0]).toHaveProperty('image');
                //     expect(res.body[0]).toHaveProperty('created_at');
                // })
                it.todo('should update a meal');
            })