const express = require('express')
const { logger } = require('../util');
const userService = require('../services/user')
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post("/", async (request, response) => {
    try {
        const data = await userService.createUser(request.body)
        logger.info(`[ USER | CREATE ] - New user - ${data.user._id}`)
        return response.status(201).send(data);
    } catch (err) {
        if (err.code)
            return response.status(err.code).send({ error: err.message })
        else {
            logger.error(`[ USER | CREATE ] - Create User Error`)
            return response.status(500).send({ error: "Internal server error" })
        }
    }
});

router.put("/", authMiddleware, async (request, response) => {
    const id = request.userId
    try {
        await userService.isActive(id)
        const user = await userService.update(id, request.body)
        logger.info(`[ USER | UPDATE ] - User: ${id}`)
        return response.json(user)
    } catch (err) {
        if (err.code)
            return response.status(err.code).send({ error: err.message })
        else {
            logger.error(`[ USER | UPDATE ] - User ${id}`)
            return response.status(500).send({ error: "Internal server error" })
        }
    }
});

router.delete("/", authMiddleware, async (request, response) => {
    const id = request.userId
    try {
        await userService.isActive(id)
        const user = await userService.delete(id)
        logger.info(`[ USER | DELETE ] - User: ${id}`)
        return response.json(user)
    } catch (err) {
        if (err.code)
            return response.status(err.code).send({ error: err.message })
        else {
            logger.error(`[ USER | DELETE ] - User: ${id}`)
            return response.status(500).send({ error: "Internal server error" })
        }
    }
});

module.exports = app => app.use('/users', router)