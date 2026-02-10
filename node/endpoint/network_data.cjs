
const Lines = require('../data/lines.cjs');
const Stations = require('../data/lines.cjs');
const Patterns = require('../data/lines.cjs');

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

module.exports = { Get };
