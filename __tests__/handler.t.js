const request = require('supertest');
const express = require('express');

const app = new express();
app.use('/', require('../controllers/ceremony'))

describe('GET /', function () {

    test('responds to /', async() => {
        const res = await request(app).get('/test/04');
        expect(res.status).toBe(200);
    });
});