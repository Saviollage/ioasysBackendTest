const express = require('express')
const { logger, filterQuery } = require('../util');
const movieService = require('../services/movie')
const userService = require('../services/user');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();


router.get('/', authMiddleware, async (request, response) => {
    try {
        await userService.isActive(request.userId)
        const { filter, pagination } = filterQuery(request.query)
        const movies = await movieService.findAll(filter, pagination)
        logger.info(`[ MOVIES | LIST ] - User [${request.userId}] - List all movies`)
        return response.json(movies)
    } catch (err) {
        console.log(err)
        if (err.code)
            return response.status(err.code).send({ error: err.message })
        else {
            logger.error(`[ MOVIES | LIST ] - Error on request all movies`)
            return response.status(500).send({ error: "Internal server error" })
        }
    }
})

router.get('/:id', authMiddleware, async (request, response) => {
    const id = request.params.id
    try {
        await userService.isActive(request.userId)
        const movie = await movieService.findById(id)
        logger.info(`[ MOVIES | DETAIL ] - User [${request.userId}] - Detail movie: ${id}`)
        movie.totalVotes = undefined
        return response.json(movie)
    } catch (err) {
        if (err.code)
            return response.status(err.code).send({ error: err.message })
        else {
            logger.error(`[ MOVIES | DETAIL ] - Movie: ${id}`)
            return response.status(500).send({ error: "Internal server error" })
        }
    }
})

router.post("/", authMiddleware, async (request, response) => {
    try {
        await userService.isActiveAdmin(request.userId)
        const data = await movieService.createMovie(request.body)
        logger.info(`[ MOVIES | CREATE ] - User [${request.userId}] Create Movie [${data._id}]`)
        return response.status(201).send(data);
    } catch (err) {
        if (err.code)
            return response.status(err.code).send({ error: err.message })
        else {
            logger.error(`[ MOVIES | CREATE ] - Create Movie Error`)
            return response.status(500).send({ error: "Internal server error" })
        }
    }
});

router.post('/vote', authMiddleware, async (request, response) => {
    try {
        await userService.isActiveUser(request.userId)
        const { movieId, vote } = request.body
        const data = await movieService.vote(movieId, vote)
        logger.info(`[ MOVIES | VOTE ] - User [${request.userId}] Vote [${vote}] on Movie [${movieId}]`)
        return response.status(200).send(data);
    } catch (err) {
        console.log(err)
        if (err.code)
            return response.status(err.code).send({ error: err.message })
        else {
            logger.error(`[ MOVIES | VOTE ] - Vote Movie Error`)
            return response.status(500).send({ error: "Internal server error" })
        }
    }
})

module.exports = app => app.use('/movies', router)