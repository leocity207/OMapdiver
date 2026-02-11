const fs = require('fs').promises;
const path = require('path');

class Memory_Cache_JSON
{
	constructor() {
		this.cache_data = null;
		this.last_update = null;
	}


	async Read() {
		return this.cache_data;
	}

	async Write(data, mtime = Date.now()) {
		this.cache_data = data;
		this.last_update = mtime;
	}

	async Exists() {
		return this.cache_data !== null
	}

	static async Compute_Max_MTime(paths) {
		if (!Array.isArray(paths) || paths.length === 0) return null;
		let max = null;
		for (const p of paths) {
			try {
				const st = await fs.stat(p);
				const m = st.mtimeMs;
				if (max === null || m > max) max = m;
			} catch (err) {
				// ignore missing files
			}
		}
		return max;
	}

	async Try_Load(source_paths) {
		const currentMax = await Memory_Cache_JSON.Compute_Max_MTime(source_paths);
		if (this.last_update && this.cache_data && this.last_update === currentMax)
			return { valid: true, data: this.cache_data, mtime: currentMax };
		return { valid: false};
	}
}

module.exports = Memory_Cache_JSON;
