const Service = require("./service.cjs");
const Cache_Memory_Agregate_JSON = require("../cache/agregation_folder.cjs")


/**
 * Data network services
 */
class Network_Service extends Service
{
	constructor()
	{
		this.calendar_patterns = Cache_Memory_Agregate_JSON("calendar_patterns");
		this.landmarks         = Cache_Memory_Agregate_JSON("landmarks");
		this.lines             = Cache_Memory_Agregate_JSON("lines");
		this.operators         = Cache_Memory_Agregate_JSON("operators");
		this.organisers        = Cache_Memory_Agregate_JSON("organisers");
		this.stations          = Cache_Memory_Agregate_JSON("stations");
		this.stop_patterns     = Cache_Memory_Agregate_JSON("stop_patterns");
		this.territories       = Cache_Memory_Agregate_JSON("territories");

		this.netwoks           = Cache_Memory_Agregate_JSON("netwoks");

		this.loading = {is_loading_data: false, promise: null};
		this.full_data = {};
	}

	/**
	 * 
	 * @returns promise resolved when full data has been loaded and containing the this.full_data
	 */
	async Update_Data()
	{
		if(this.loading.is_loading_data)
			return this.loading.promise;
		this.loading.is_loading_data = true;
		this.loading.promise = (async () => {
			try{
				if(await this.calendar_patterns.Need_Update())
				{
					const calendar_patterns = await this.calendar_patterns.Load();
					this.full_data.calendar_patterns = calendar_patterns.calendar_patterns;
				}
				if(await this.landmarks.Need_Update())
				{
					const landmarks = await this.landmarks.Load();
					this.full_data.landmarks = landmarks.landmarks;
				}
				if(await this.lines.Need_Update())
				{
					const lines = await this.lines.Load();
					this.full_data.lines = lines.lines;
				}
				if(await this.operators.Need_Update())
				{
					const operators = await this.operators.Load();
					this.full_data.operators = operators.operators;
				}
				if(await this.organisers.Need_Update())
				{
					const organisers = await this.organisers.Load();
					this.full_data.organisers = organisers.organisers;
				}
				if(await this.stations.Need_Update())
				{
					const stations = await this.stations.Load();
					this.full_data.stations = stations.stations;
				}
				if(await this.stop_patterns.Need_Update())
				{
					const stop_patterns = await this.stop_patterns.Load();
					this.full_data.stop_patterns = stop_patterns.stop_patterns;
				}
				if(await this.territories.Need_Update())
				{
					const territories = await this.territories.Load();
					this.full_data.territories = territories.territories;
				}
				if(await this.netwoks.Need_Update())
				{
					const netwoks = await this.netwoks.Load();
					this.full_data.netwoks = netwoks.netwoks;
				}
				return this.full_data;
			} finally {
				this.loading.is_loading_data = false;
			}
		});
		return this.loading.promise
	}

	async Serve(method, pathname, req, connection)
	{
		if(method === 'GET' && pathname === '/dyn/network_data')
		{
			const full_data = await Load_Full_Data();
			connection.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
			connection.end(JSON.stringify( full_data ));
			return true;
		}
		return false;
	}

}

module.exports = { Network_Service };
