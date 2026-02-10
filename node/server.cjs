const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const fsPromises = fs.promises;


const config = require('./config.cjs');
const Time_Table = require('./endpoint/timetable.cjs');
const Map_Data = require('./endpoint/network_data.cjs');


// Small map of MIME types useful for static files
const MIME = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'application/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
	'.txt': 'text/plain; charset=utf-8'
};


// Common header setter
function Set_Common_Headers(res)
{
	res.setHeader('X-Powered-By', 'pnpm');
}


// Staticaly serve file
async function Serve_Static(filePath, res)
{
	try
	{
		const stat = await fsPromises.stat(filePath);
		if (stat.isDirectory())
		{
			const indexPath = path.join(filePath, 'index.html');
			
			return Serve_Static(indexPath, res);
		}
		console.log("serving: " + filePath);
		const ext = path.extname(filePath).toLowerCase();
		const contentType = MIME[ext] || 'application/octet-stream';
		res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': stat.size });
		const stream = fs.createReadStream(filePath);
		stream.pipe(res);
		return true;
	} 
	catch (err)
	{
		return false;
	}
}



const server = http.createServer(async (req, res) => {
	try 
	{
		const parsed = url.parse(req.url, true);
		const pathname = decodeURIComponent(parsed.pathname || '/');
		let served = true;

		/// Main service handler
		if(req.method === 'GET' && pathname === '/dyn/network_data') {
			served = await Map_Data.Get(res, parsed.searchParams);
		}
		else if (pathname === '/favicon.ico') {
			const faviconPath = path.join(config.PUBLIC_DIR, 'resources-config/image/favicon.ico');
			served = Serve_Static(faviconPath, res);
		}
		else {

			/// Normalize filepath
			let safePath = path.normalize(pathname).replace(/^([\/.]+)+/, '');
			if (safePath === '' || safePath === '/') safePath = '/';
			let filePath = path.join(config.PUBLIC_DIR, safePath); {
				filePath = path.join(config.PUBLIC_DIR, safePath, 'index.html');
			}

			served = await Serve_Static(filePath, res);
		}

		/// Check if served
		if(!served) {
			Set_Common_Headers(res);
			res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
			res.end('<h1>404 Not Found</h1>');
		}

	} catch (err) {
		console.error('Server error:', err);
		Set_Common_Headers(res);
		res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
		res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
	}
});


server.listen(config.PORT, () => {
	console.log(`Server listening on http://localhost:${config.PORT}`);
});