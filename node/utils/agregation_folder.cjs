const fs = require('fs').promises;
const path = require('path');
const File_Cache_JSON = require('./file_cache.cjs');

let load_in_progress = {};

class Agregate_Folder
{
	static async Collect_Relevant_Paths(aggregating_file, key, aggregate_folder)
	{
		const ids = await Read_Json_File(aggregating_file);

		if (!ids || !Array.isArray(ids[key]))
			throw new Error('Index files missing or malformed.');

		let paths = [];

		for (const id of ids[key])
			paths.push(path.join(aggregate_folder, `${id}.json`));

		return paths ;
	}

	static async Build_Agregate(paths, key) {
		const agregate = {};
		agregate[key] = {};

		// Load line files
		for (const line_id of lines_index.lines) {
			const p = path.join(network_data_path, 'data/line', `${line_id}.json`);
			const data = await Read_Json_File(p);
			if (data)
				agregate[key][line_id] = lineDto;
			else
				console.warn(`[WARN] Missing or invalid line file: ${p}`);
		}
		return agregate;
	}

	static async Load_Agregated_Data(aggregating_file, key, aggregate_folder, cache_file_path)
	{
		// Use a single in-flight promise to serialize concurrent calls
		if (load_in_progress[aggregating_file])
			return load_in_progress[aggregating_file].promise;

		load_in_progress[aggregating_file] = {};
		load_in_progress[aggregating_file].promise = (async () => {
			try {
				const paths = await Collect_Relevant_Paths(aggregating_file, key, aggregate_folder, extension);
					
				// instantiate File_cache
				const file_cache = new File_Cache_JSON(cache_file_path);
				const loaded_data = await file_cache.Try_Load(paths);
				if (loaded_data.valid) {
					return loaded_data.data;
				}
				console.log("[INFO] rebuilding cache file")
				// cache not valid -> rebuild network
				const agregate = await Build_Agregate(network_data_path, key);

				// write fresh cache with computed mtime (cacheCheck.mtime could be null)
				const new_mTime = (typeof loaded_data.mtime === 'number' && loaded_data.mtime !== null) ? cacheCheck.mtime : Date.now();

				await file_cache.Write(agregate, new_mTime);

				return network;
			} finally {
				load_in_progress[aggregating_file] = null;
			}
		})();

		return load_in_progress[aggregating_file].promise;
	}
}

module.exports = Agregate_Folder;