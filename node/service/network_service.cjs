const Service = require("./service.cjs");
const Cache_Memory_Agregate_JSON = require("../utils/agregation_folder.cjs")



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
	}

	async Serve(method, resource, querry)
	{
		throw new Error("[ERROR] this method should be overiden");
	}

}

async function Load_Full_Data() {
	const lines_data = Lines.Lines.Get();
	const stations_data = Stations.Stations.Get();
	const patterns_data = Patterns.Patterns.Get();
	return Object.assign({}, lines_data, stations_data, patterns_data);
}

async function Get(res, searchParams) {
	try {
		const full_data = await Load_Full_Data();
		res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
		res.end(JSON.stringify( full_data ));
	} catch (err) {
		console.error('Failed to load timetable:', err && err.stack ? err.stack : err);
		res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
		res.end(JSON.stringify({ success: false, error: 'Failed to load data' }));
	}
}

module.exports = { Network_Service };
