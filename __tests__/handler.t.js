const request = require('supertest');
const express = require('express');

const app = new express();
app.use('/', require('../controllers/ceremony'))

/* 
    Testing unit didn't work because of the user validation
    on the middleware of our endpoints, so we decides just to
    propose de unit testing with the description of each method.
*/

describe('GET /ceremonies', function () {

    test('responds to /ceremonnies', async() => {
        const res = await request(app).get('/ceremonies');
        expect(res.status).toBe(200);
    });

    test('responds to /ceremonies/:id', async() => {
        const res = await request(app).get('/ceremonies/62cdf636f058c0a6914a5663');
        expect(res.status).toBe(200);
    });

    test('responds to /ceremonies/edit/:id', async() => {
        const res = await request(app).get('/ceremonies/edit/62cdf636f058c0a6914a5663');
        expect(res.status).toBe(200);
    });
});

describe('GET /places', function () {

    test('responds to /places', async() => {
        const res = await request(app).get('/places');
        expect(res.status).toBe(200);
    });

    test('responds to /places/:id', async() => {
        const res = await request(app).get('/places/62d78a2ca83b9709971db1a2');
        expect(res.status).toBe(200);
    });

    test('responds to /places/edit/:id', async() => {
        const res = await request(app).get('/places/edit/62d78a2ca83b9709971db1a2');
        expect(res.status).toBe(200);
    });
});

