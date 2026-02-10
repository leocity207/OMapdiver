const fs = require('fs').promises;
const path = require('path');
const config = require('../config.cjs');

class Patterns
{
	static async Get()
	{
		const patterns = await Read_Json_File(path.join(config.PUBLIC_DATA_DIR, "patterns.json"));

		if (!patterns || !patterns.timetable || !Array.isArray(patterns.timetable) || !patterns.service || !Array.isArray(patterns.service))
			throw new Error('Index files missing or malformed.');
	}
}

module.exports = { Patterns };