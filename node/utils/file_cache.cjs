const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

class File_Cache_JSON {
	/**
	 * @param {string} cache_file_path absolute path to cache file
	 */
	constructor(cache_file_path) {
		if (!cache_file_path) throw new Error('[ERROR] cache_file_path required');
		this.cache_file_path = cache_file_path;
	}

	async _Read_Raw() {
		try {
			const raw = await fs.readFile(this.cache_file_path, { encoding: 'utf8' });
			return JSON.parse(raw);
		} catch (err) {
			return null;
		}
	}

	async Read() {
		const obj = await this._Read_Raw();
		return obj ? obj.data : null;
	}

	async write(data, mtime = Date.now()) {
		try {
			const dir = path.dirname(this.cache_file_path);
			// ensure directory exists
			if (!fsSync.existsSync(dir)) {
				fsSync.mkdirSync(dir, { recursive: true });
			}
			const tmp = this.cache_file_path + '.tmp';
			const payload = { mtime, data };
			await fs.writeFile(tmp, JSON.stringify(payload), { encoding: 'utf8' });
			await fs.rename(tmp, this.cache_file_path); // atomic on most filesystems
			return true;
		} catch (err) {
			// don't throw - fail silently (caller can handle)
			console.warn('[ERROR] FileCache write failed:', err);
			return false;
		}
	}

	async Exists() {
		try {
			await fs.access(this.cache_file_path);
			return true;
		} catch (err) {
			return false;
		}
	}

	/**
	 * Compute maximum mtime (in ms) among the provided paths.
	 * Ignores missing files. Returns null if none exist.
	 * @param {string[]} paths
	 * @returns {number|null}
	 */
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

	/**
	 * Check the cache validity against a set of source file paths.
	 * Returns an object: { valid: boolean, data: any|null, mtime: number|null }
	 * - valid=true: cache contains data and its mtime === current max mtime
	 * - mtime is the computed current max mtime (or null)
	 */
	async Load_If_Valid(source_paths) {
		const currentMax = await File_Cache_JSON.Compute_Max_MTime(source_paths);
		const raw = await this._Read_Raw();
		if (raw && typeof raw.mtime === 'number' && raw.data && raw.mtime === currentMax) {
			return { valid: true, data: raw.data, mtime: currentMax };
		}
		return { valid: false, data: raw ? raw.data : null, mtime: currentMax };
	}
}

module.exports = File_Cache_JSON;
