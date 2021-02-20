const { verify } = require("jsonwebtoken");
const { key } = require('../util')


const authMiddleware = (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) return response.status(403).send({ error: "No token provided" });
    const parts = authHeader.split(" ");
    if (!parts.length === 2)
        return response.status(403).send({ error: "Token error" });
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return response.status(403).send({ error: "Token malformatted" });
    }
    verify(token, key, (err, decoded) => {
        if (err) return response.status(403).send({ error: "Token invalid" });
        request.userId = decoded.id;
        request.userLevel = decoded.level;
        return next();
    });
};

module.exports = authMiddleware 