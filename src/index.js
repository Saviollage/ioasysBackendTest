const app = require('./app.js')

const port = process.env.PORT || 3000;
app.listen(port);

console.log(`🎬 App running on http://localhost:${port}`)
console.log(`📃 Swagger running on http://localhost:${port}/api-docs`)
