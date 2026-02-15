
const path = require('path');

module.exports = {
	/**
	 * Server Port
	 */
	PORT: process.env.PORT || 8000,

	/**
	 * website static resource directory
	 */
	PUBLIC_DIR: path.join(__dirname, '../resources'),

	/**
	 * specific website data
	 */
	PUBLIC_DATA_DIR: path.join(__dirname, '../resources/resources-config/data'),

	/**
	 * Cache data folder for files
	 */
	CACHE_FOLDER: path.join(__dirname, 'cache'),

	VERBOSE: true,
};