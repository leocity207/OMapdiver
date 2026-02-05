const fs = require('fs').promises;
const path = require('path');
const config = require('../config.cjs');
const File_Cache_JSON = require('../utils/file_cache.cjs');

const CACHE_FILE_NAME = 'network_data_cache.json';

// Simple in-memory lock to prevent concurrent rebuilds
let load_in_progress = null;

/**
 * Read and parse JSON file. Returns parsed object or null on error.
 */
async function Read_Json_File(filePath) {
	try {
		const str = await fs.readFile(filePath, { encoding: 'utf8' });
		return JSON.parse(str);
	} catch (err) {
		return null;
	}
}

/**
 * Build the network object by reading index files and per-item files.
 * Returns { lines: {id:lineDTO}, stations: {id:stationDTO} }
 */
async function Build_Network(basePath) {
	const network = { lines: {}, stations: {} };

	const lines_index_path = path.join(basePath, 'line.json');
	const stations_index_path = path.join(basePath, 'station.json');

	const lines_index = await Read_Json_File(lines_index_path);
	if (!lines_index || !Array.isArray(lines_index.lines)) {
		throw new Error(`Invalid or missing lines index (${lines_index_path})`);
	}

	const stations_index = await Read_Json_File(stations_index_path);
	if (!stations_index || !Array.isArray(stations_index.stations)) {
		throw new Error(`Invalid or missing stations index (${stations_index_path})`);
	}

	// Load station files
	for (const station_id of stations_index.stations) {
		const p = path.join(basePath, 'station', `${station_id}.json`);
		const stationDto = await Read_Json_File(p);
		if (stationDto) {
			network.stations[station_id] = stationDto;
		} else {
			console.warn(`Missing or invalid station file: ${p}`);
		}
	}

	// Load line files
	for (const line_id of lines_index.lines) {
		const p = path.join(basePath, 'line', `${line_id}.json`);
		const lineDto = await Read_Json_File(p);
		if (lineDto) {
			network.lines[line_id] = lineDto;
		} else {
			console.warn(`Missing or invalid line file: ${p}`);
		}
	}

	return network;
}

/**
 * Collect list of all relevant file paths given basePath:
 */
async function Collect_Relevant_Paths(basePath) {
	const lines_index_path = path.join(basePath, 'line.json');
	const stations_index_path = path.join(basePath, 'station.json');

	const lines_index = await Read_Json_File(lines_index_path);
	const stations_index = await Read_Json_File(stations_index_path);

	if (!lines_index || !Array.isArray(lines_index.lines) || !stations_index || !Array.isArray(stations_index.stations)) {
		return { paths: [lines_index_path, stations_index_path], valid: false };
	}

	const paths = [lines_index_path, stations_index_path];

	for (const id of lines_index.lines) {
		paths.push(path.join(basePath, 'line', `${id}.json`));
	}
	for (const id of stations_index.stations) {
		paths.push(path.join(basePath, 'station', `${id}.json`));
	}

	return { paths, valid: true };
}

/**
 * Main loader function.
 * Uses File_cache to avoid re-reading all individual JSON files on each request.
 */
async function Load_Data(basePath = config.PUBLIC_DATA_DIR) {
	// Use a single in-flight promise to serialize concurrent calls
	if (load_in_progress) {
		return load_in_progress;
	}

	load_in_progress = (async () => {
		try {
			const { paths, valid } = await Collect_Relevant_Paths(basePath);
			if (!valid) {
				throw new Error('Index files missing or malformed (line.json / station.json).');
			}

			// instantiate File_cache
			const cache_file_path = path.join(config.CACHE_FOLDER, CACHE_FILE_NAME);
			const file_cache = new File_Cache_JSON(cache_file_path);

			// ask cache if valid compared to source paths
			const cacheCheck = await file_cache.Load_If_Valid(paths);
			if (cacheCheck.valid) {
				return cacheCheck.data;
			}

			// cache not valid -> rebuild network
			const network = await Build_Network(basePath);

			// write fresh cache with computed mtime (cacheCheck.mtime could be null)
			const mtimeToWrite = (typeof cacheCheck.mtime === 'number' && cacheCheck.mtime !== null) ? cacheCheck.mtime : Date.now();

			await file_cache.write(network, mtimeToWrite);

			return network;
		} finally {
			load_in_progress = null;
		}
	})();

	return load_in_progress;
}

/**
 * The exported HTTP handler function exactly matching your signature.
 */
async function Get(res) {
	try {
		const data = await Load_Data();
		res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
		res.end(JSON.stringify({ success: true, data }));
	} catch (err) {
		console.error('Failed to load timetable:', err && err.stack ? err.stack : err);
		res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
		res.end(JSON.stringify({ success: false, error: 'Failed to load timetable' }));
	}
}

module.exports = { Get, Load_Data };
