const Service = require("./service.cjs");
const DatabaseService = require("./database_service.cjs");
const Config = require('../config.cjs');

/**
 * Data network services
 */
class Network_Service extends Service {
	constructor() {
		super();
		this.db = new DatabaseService();
		this.loading = { is_loading_data: false, promise: null };
		this.full_data = null;
	}

	/**
	 * @returns promise resolved when full data has been loaded and containing the full network object
	 */
	async Update_Data() {
		if (this.full_data) {
			return this.full_data;
		}

		if (this.loading.is_loading_data) {
			return this.loading.promise;
		}

		this.loading.is_loading_data = true;
		this.loading.promise = (async () => {
			try {
				if (Config.VERBOSE) console.log("[INFO] Loading network data from PostgreSQL");
				this.full_data = await this.db.Load_Network();
				return this.full_data;
			} finally {
				this.loading.is_loading_data = false;
			}
		})();

		return this.loading.promise;
	}

	async Serve(req, pathname, connection) {
		if (req.method === 'GET' && pathname === '/dyn/network_data') {
			const full_data = await this.Update_Data();
			connection.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
			connection.end(JSON.stringify(full_data));
			return true;
		}
		return false;
	}
}

module.exports = Network_Service;