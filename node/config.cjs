
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

	/**
	 * Verbose for all comment
	 */
	VERBOSE: true,

	/**
	 * database host IP adress
	 */
	DB_HOST: process.env.DB_HOST || 'localhost',

	/**
	 * database port
	 */
	DB_PORT: Number(process.env.DB_PORT || 5432),

	/**
	 * Database name
	 */
	DB_NAME: process.env.DB_NAME || 'appdb',

	/**
	 * Database username
	 */
	DB_USER: process.env.DB_USER || 'appuser',

	/**
	 * Database password
	 */
	DB_PASSWORD: process.env.DB_PASSWORD || 'app_password',
};