const fs = require('fs').promises;
const path = require('path');
const config = require('../config.cjs');

class Stations
{
    static async Get()
    {
        const cache_file_path = path.join(config.CACHE_FOLDER, "stations.cache.json");
        const aggregating_file = path.join(config.PUBLIC_DATA_DIR, "stations.json");
        const aggregate_folder = path.join(config.PUBLIC_DATA_DIR, "stations");
        const agregated = Load_Agregated_Data(aggregating_file, "stations", aggregate_folder, cache_file_path)
    }
}