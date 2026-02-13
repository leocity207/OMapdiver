
const Memory_Cache = require('./memory_cache.cjs');
const path = require('path');
const fs = require('fs').promises;

/**
 * Cache that stock memory of a file in memory
 */
class File_Cache extends Memory_Cache
{
	constructor (name, file_path = name)
	{
		super(name);
		this.file_path = file_path;
		const {data, size} = File_Cache.Read_File(file_path)
		this.data = data;
		this.size = size;
		this.extension = path.extname(file_path).toLowerCase();
	}

	async _Compute_Update()
	{
		return Memory_Cache.Compute_Files_Closest_Last_Update([this.file_path]);
	}

	async _Update()
	{
		const {data, size} = Read_File(file_path)
		this.data = data;
		this.size = size;
		return this.data;
	}

	static async Read_File(file_path)
	{
		const stat = await fs.stat(file_path);
		if (!stat.isFile())
			throw new Error("[ERROR] expected a file to read.");
		const data = await fs.readFile(file_path);
		return {data, size: stat.size};
	} 
}

module.exports = { File_Cache };