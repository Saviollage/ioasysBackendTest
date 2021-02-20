const { describe, it, before } = require('mocha')
const { expect } = require('chai')
const request = require('supertest');
const app = require('../src/app')

describe('MOVIES', () => {
    describe('#MSimple vote case', () => {
        let token
        let movieId = '602fde12d91ecb33fcb2fe6b'

        it('Should log user', async () => {
            const response = await request(app)
                .post('/authenticate')
                .set('Accept', 'application/json')
                .send({
                    "email": "default_user@email.com",
                    "password": "123456"
                })
            token = response.body.token
            expect(response.statusCode).to.equal(200);
        })

        it('Should get a list of movies', async () => {
            const response = await request(app)
                .get('/movies')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            movies = response.body.movies

            expect(response.statusCode).to.equal(200);
        })

        it(`Should detail movie ${movieId}`, async () => {
            const response = await request(app)
                .get(`/movies/${movieId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            movies = response.body.movies

            expect(response.statusCode).to.equal(200);
        })

        it(`Should vote for movie ${movieId}`, async () => {
            const response = await request(app)
                .post(`/movies/vote`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "moveId": movieId,
                    "vote": 4
                })
            expect(response.statusCode).to.equal(200);
        })
    })
})