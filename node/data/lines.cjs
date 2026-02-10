const path = require('path');
const config = require('../config.cjs');
const Agregate_Folder = require(".../utils/agregation_folder.cjs");

class Lines
{
	static async Get()
	{
		const cache_file_path = path.join(config.CACHE_FOLDER, "lines.cache.json");
		const aggregating_file = path.join(config.PUBLIC_DATA_DIR, "lines.json");
		const aggregate_folder = path.join(config.PUBLIC_DATA_DIR, "lines");
		return Agregate_Folder.Load_Agregated_Data(aggregating_file, "lines", aggregate_folder, cache_file_path)
	}
}

module.exports = { Lines };