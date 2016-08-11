var path = require('path');
var devConfigPath = path.join(__dirname, './development.js');
var productionConfigPath = path.join(__dirname, './production.js');

if (process.env.NODE_ENV === 'production') {
	console.log('Production path');

    module.exports = require(productionConfigPath);
} else {
	console.log('Dev path');
    module.exports = require(devConfigPath);
}