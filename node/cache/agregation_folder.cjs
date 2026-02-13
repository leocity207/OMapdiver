
const Memory_Cache = require('./memory_cache.cjs');
const Config = require('../config.cjs')
const path = require('path');
const fs = require('fs').promises;


/**
 * Cache that agregate the data found inside a folder
 */
class Cache_Memory_Agregate_JSON extends Memory_Cache
{
	constructor (name, key = name)
	{
		super(name);
		this.agregate_path_file = path.join(Config.PUBLIC_DATA_DIR, name, ".json");
		this.agregate_path_folder = path.join(Config.PUBLIC_DATA_DIR, name);
		this.key_in_file = key;
	}

	async _Compute_Update()
	{
		files = _Collect_Relevant_Paths(this.agregate_path_file, this.key, this.agregate_path_folder);
		files.push(this.agregate_path_file);
		return Memory_Cache.Compute_Files_Closest_Last_Update(files);
	}

	async _Update()
	{
		files_paths = _Collect_Relevant_Paths();
		agregated_data = _Build_Agregate(files_paths)
		this._Set(agregated_data);
		return agregated_data;
	}

	async _Collect_Relevant_Paths()
	{
		const raw = await fs.readFile(this.aggregating_file, { encoding: 'utf8' });
		if(!raw) throw new Error('[ERROR] Could not open aggregate file.');
		const ids = JSON.parse(raw);
		if (!ids || !Array.isArray(ids[this.key])) throw new Error('[ERROR] Index files missing or malformed.');

		let paths = [];

		for (const id of ids[this.key])
			paths.push(path.join(this.agregate_path_folder, `${id}.json`));

		return paths ;
	}

	async _Build_Agregate(files_paths)
	{
		const agregate = {};
		agregate[this.key] = {};

		// Load line files
		for (const file_path of files_paths) {
			const raw = await fs.readFile(file_path, { encoding: 'utf8' });
			if(!raw) throw new Error(`[ERROR] Could not open file : ${file_path}.`);
			const data = JSON.parse(raw);
			if(!data) throw new Error(`[ERROR] One of the file is not json : ${file_path}.`);
			agregate[this.key][line_id] = data;
		}
		return agregate;
	}
}

module.exports = { Cache_Memory_Agregate_JSON };