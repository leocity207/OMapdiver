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
async function Build_Network(network_data_path) {
	const network = { lines: {}, stations: {} };

	const lines_index_path = path.join(network_data_path, 'data/line.json');
	const stations_index_path = path.join(network_data_path, 'data/station.json');

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
		const p = path.join(network_data_path, 'data/station', `${station_id}.json`);
		const stationDto = await Read_Json_File(p);
		if (stationDto) {
			network.stations[station_id] = stationDto;
		} else {
			console.warn(`Missing or invalid station file: ${p}`);
		}
	}

	// Load line files
	for (const line_id of lines_index.lines) {
		const p = path.join(network_data_path, 'data/line', `${line_id}.json`);
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
 * Collect list of all relevant file paths given network_data_path:
 */
async function Collect_Relevant_Paths(network_data_path) {
	const lines_index_path = path.join(network_data_path, 'data/line.json');
	const stations_index_path = path.join(network_data_path, 'data/station.json');

	const lines_index = await Read_Json_File(lines_index_path);
	const stations_index = await Read_Json_File(stations_index_path);

	if (!lines_index || !Array.isArray(lines_index.lines) || !stations_index || !Array.isArray(stations_index.stations)) {
		return { "valid": false };
	}

	let lines_paths = [];
	let stations_path = [];

	for (const id of lines_index.lines) {
		lines_paths.push(path.join(network_data_path, 'data/line', `${id}.json`));
	}
	for (const id of stations_index.stations) {
		stations_path.push(path.join(network_data_path, 'data/station', `${id}.json`));
	}
	return { "lines_path": lines_paths,"stations_path":stations_path , "valid": true };
}

/**
 * Main loader function.
 * Uses File_cache to avoid re-reading all individual JSON files on each request.
 */
async function Load_Data(network_data_path = config.PUBLIC_DATA_DIR) {
	// Use a single in-flight promise to serialize concurrent calls
	if (load_in_progress) {
		return load_in_progress;
	}

	load_in_progress = (async () => {
		try {
			const { lines_path, stations_path, valid } = await Collect_Relevant_Paths(network_data_path);
			if (!valid) {
				throw new Error('Index files missing or malformed (line.json / station.json).');
			}

			// instantiate File_cache
			const cache_file_path = path.join(config.CACHE_FOLDER, CACHE_FILE_NAME);
			const file_cache = new File_Cache_JSON(cache_file_path);

			// ask cache if valid compared to source paths
			const cacheCheck = await file_cache.Load_If_Valid([lines_path, stations_path, path.join(network_data_path, 'line.json'), path.join(network_data_path, 'station.json')]);
			if (cacheCheck.valid) {
				return cacheCheck.data;
			}
			console.log("[INFO] rebuilding cache file")
			// cache not valid -> rebuild network
			const network = await Build_Network(network_data_path);

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
		res.end(JSON.stringify( data ));
	} catch (err) {
		console.error('Failed to load timetable:', err && err.stack ? err.stack : err);
		res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
		res.end(JSON.stringify({ success: false, error: 'Failed to load timetable' }));
	}
}

module.exports = { Get, Load_Data };
