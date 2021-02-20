const { readdirSync } = require('fs');
const { join, resolve } = require('path');

//Para adicionar automaticamente á nossa API os arquivos da pasta controllers/
const filename = join(__dirname, '../controllers/')

module.exports = app => {
    readdirSync(filename)
        .forEach(file => require(resolve(filename, file))(app));
};