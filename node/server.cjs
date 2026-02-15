const http = require('http');
const url = require('url');
const Network_Service = require('./service/network_service.cjs');
const Static_File_Service = require('./service/static_file_service.cjs');
const Config = require('./config.cjs')


const network_service = new Network_Service();
const static_file_service = new Static_File_Service();


const server = http.createServer(async (req, res) => {
	try 
	{
		const parsed = url.parse(req.url, true);
		const pathname = decodeURIComponent(parsed.pathname || '/');
		if(Config.VERBOSE) console.log(`[INFO] Serving: ${pathname}`);

		if(await network_service.Serve(req, pathname, res)) return;
		if(await static_file_service.Serve(req, pathname, res)) return;

		res.setHeader('X-Powered-By', 'pnpm');
		res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
		res.end('<h1>404 Not Found</h1>');	
	} 
	catch (err) 
	{
		console.error('Server error:', err);
		res.setHeader('X-Powered-By', 'pnpm');
		res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
		res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
	}
});


server.listen(Config.PORT, () => {
	console.log(`Server listening on http://localhost:${Config.PORT}`);
});