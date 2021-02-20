require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./app/routes/routes")(app);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('*', (request, response) => {
    return response.status(404).json({
        error: 'Endpoint Not Found',
        message: "Please check our documentation here: https://ioasys-backend-test.herokuapp.com/api-docs/"
    })
});

module.exports = app

