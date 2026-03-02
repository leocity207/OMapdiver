const Cache = require("./cache.cjs")

/**
 * a cache that is directly stocked in the memory
 */
class Memory_Cache extends Cache
{
	constructor(identifier)
	{
		super(identifier);
		this.cache_data = null;
	}

	_Get()
	{
		return this.cache_data;
	}

	_Set(data)
	{
		this.cache_data = data;
	}

	async _Exists()
	{
		return this.cache_data !== null
	}
}

module.exports = Memory_Cache;
