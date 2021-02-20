const express = require("express");
const { logger } = require('../util');
const userService = require('../services/user')
const router = express.Router();




router.post("/", async (request, response) => {
    const { email, password } = request.body
    try {
        const data = await userService.authenticate(email, password)
        return response.send(data);
    } catch (err) {
        if (err.code)
            return response.status(err.code).send({ error: err.message })
        else {
            logger.error(`[ AUTHENTICATE ] - Error`)
            return response.status(500).send({ error: "Internal server error" })
        }
    }
});

module.exports = app => app.use("/authenticate", router);