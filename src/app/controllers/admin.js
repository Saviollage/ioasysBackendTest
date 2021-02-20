const express = require('express')
const { logger } = require('../util');
const userService = require('../services/user')
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, async (request, response) => {
    try {
        await userService.isActiveAdmin(request.userId)
        const users = await userService.findAll()
        logger.info('[ ADMIN | LIST ] - Requesting all users')
        return response.json(users)
    } catch (error) {
        if (err.code)
            return response.status(err.code).send({ error: err.message })
        else {
            logger.error(`[ ADMIN | LIST ] - Error on request all users`)
            return response.status(500).send({ error: "Internal server error" })
        }
    }
})

router.get('/:id', authMiddleware, async (request, response) => {
    const id = request.params.id
    try {
        await userService.isActiveAdmin(request.userId)
        const user = await userService.findById(id)
        logger.info(`[ ADMIN | DETAIL ] - User: ${id}`)
        return response.json(user)
    } catch (err) {
        if (err.code)
            return response.status(err.code).send({ error: err.message })
        else {
            logger.error(`[ ADMIN | DETAIL ] - User: ${id}`)
            return response.status(500).send({ error: "Internal server error" })
        }
    }
})

router.post("/", authMiddleware, async (request, response) => {
    try {
        await userService.isActiveAdmin(request.userId)
        const data = await userService.createAdmin(request.body)
        logger.info(`[ ADMIN | CREATE ADMIN ] - New admin - ${data.user._id}`)
        return response.status(201).send(data);
    } catch (err) {
        if (err.code)
            return response.status(err.code).send({ error: err.message })
        else {
            logger.error(`[ ADMIN | CREATE ADMIN ] - Create Admin Error`)
            return response.status(500).send({ error: "Internal server error" })
        }
    }
});

router.put("/:id", authMiddleware, async (request, response) => {
    const id = request.params.id
    try {
        await userService.isActiveAdmin(request.userId)
        const user = await userService.update(id, request.body)
        logger.info(`[ ADMIN | UPDATE ] - User: ${id}`)
        return response.json(user)
    } catch (err) {
        if (err.code)
            return response.status(err.code).send({ error: err.message })
        else {
            logger.error(`[ ADMIN | UPDATE ] - User ${id}`)
            return response.status(500).send({ error: "Internal server error" })
        }
    }
});

router.delete("/:id", authMiddleware, async (request, response) => {
    const id = request.params.id
    try {
        await userService.isActiveAdmin(request.userId)
        const user = await userService.delete(id)
        logger.info(`[ ADMIN | DELETE ] - User: ${id}`)
        return response.json(user)
    } catch (err) {
        if (err.code)
            return response.status(err.code).send({ error: err.message })
        else {
            logger.error(`[ ADMIN | DELETE ] - User: ${id}`)
            return response.status(500).send({ error: "Internal server error" })
        }
    }
});

module.exports = app => app.use('/admin', router)