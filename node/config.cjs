
const path = require('path');

module.exports =  {
	PORT: process.env.PORT || 8000,
	PUBLIC_DIR: path.join(__dirname, '../resources'),
	PUBLIC_DATA_DIR: path.join(__dirname, '../resources/resources-config'),
	CACHE_FOLDER: path.join(__dirname, 'cache'),
};