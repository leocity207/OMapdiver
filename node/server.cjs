const http = require('http');
const url = require('url');
const Network_Service = require('./service/network_service.cjs');
const Static_File_Service = require('./service/static_file_service.cjs');


const network_service = Network_Service();
const static_file_service = Static_File_Service();


const server = http.createServer(async (req, res) => {
	try 
	{
		const parsed = url.parse(req.url, true);
		const pathname = decodeURIComponent(parsed.pathname || '/');
		
		if(network_service.Serve(req, pathname, res)) return;
		if(static_file_service.serve(req, pathname, res)) return;

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


server.listen(config.PORT, () => {
	console.log(`Server listening on http://localhost:${config.PORT}`);
});