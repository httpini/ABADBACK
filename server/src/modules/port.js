let path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, `../../.env`),
})
let PORT = process.env.PORT || 8020

// console.log('port', PORT);
module.exports = {
    port: PORT,
    callback: function () {
        console.log(`Abriendo el servidor ${process.env.URL}`)
    }
}