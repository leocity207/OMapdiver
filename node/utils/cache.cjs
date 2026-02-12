const fs = require('fs').promises;
const path = require('path');


/**
 * General cache structure for keeping data and update it when needed
 */
class Cache
{
	constructor(identifier) {
		if (!identifier) throw new Error('[ERROR] identifier required.');
		this.identifier = identifier
		this.last_update = null;
	}
	async _Get() {
		throw new Error("[ERROR] This function must be overriden");
	}

	async _Exists() {
		throw new Error("[ERROR] This function must be overriden");
	}

	async _Compute_Update() {
		throw new Error("[ERROR] This function must be overriden");
	}

	async _Update() {
		throw new Error("[ERROR] This function must be overriden");
	}

	_Need_Update(expected_last_update) {
		if(this.last_update === null) return true;
		if(this.last_update === expected_last_update) return false;
		return true;
	}

	async Load() {
		const exists = await this._Exists();

		const expected_last_update = await this._Compute_Update();
		const need_update = this._Need_Update(expected_last_update);
		
		if (!exists || need_update) {
			this.last_update = expected_last_update;
			return await this._Update();
		}
		return await this._Get();
	}

	static async Compute_Files_Closest_Last_Update(paths) {
		if (!Array.isArray(paths) || paths.length === 0) return null;
		let max = null;
		for (const p of paths) {
			try {
				const st = await fs.stat(p);
				const m = st.mtimeMs;
				if (max === null || m > max) max = m;
			} catch (err) {
				throw new Error(`[ERROR] could not stat file : ${p}`);
			}
		}
		return max;
	}
}

module.exports = { Cache };
