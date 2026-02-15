const Service = require("./service.cjs");
const Config = require("../config.cjs");
const path = require('path');
const File_Cache = require("../cache/file_cache.cjs")

const MIME = {
	".html": "text/html",
	".css": "text/css",
	".js": "application/javascript",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".ico": "image/x-icon",
	".txt": "text/plain"
};

/**
 * Static file service that serve static files
 */
class Static_File_Service extends Service
{
	constructor()
	{
		super();
		this.document_memory_map = {}
	}

	/**
	 * 
	 * @param {ServerResponse} connection where to pipe the file in
	 * @param {File_Cache} file_cache where to read the file from
	 * @returns true if sending the file went correctly
	 */
	async _Send_File(connection, file_cache)
	{
		const data = await file_cache.Load();
		const contentType = MIME[file_cache.extension] || "application/octet-stream";
		connection.writeHead(200, {
			"Content-Type": contentType,
			"Content-Length": file_cache.size
		});
		connection.end(data);
		return true;
	}

	/**
	 * 
	 * @param {IncomingMessage} req request incoming
	 * @param {String} pathname path of the request
	 * @param {ServerResponse} connection connection to ouput the response into
	 * @returns true if the service was able to serve the request false otherwise
	 */
	async Serve(req, pathname, connection)
	{
		if(req.method === 'GET' && pathname === '/favicon.ico')
		{
			const favicon_path = path.join(Config.PUBLIC_DIR, 'resources-config/image/favicon.ico');
			if(this.document_memory_map[favicon_path])
				return await this._Send_File(connection, this.document_memory_map[favicon_path]);
			this.document_memory_map[favicon_path] = new File_Cache(favicon_path);
			return await this._Send_File(connection, this.document_memory_map[favicon_path]);
		}
		else if(req.method === 'GET')
		{
			
			let safe_path = path.normalize(pathname).replace(/^([\/.]+)+/, '');
			if (safe_path === '' || safe_path === '/') safe_path = '/';
			let file_path = path.join(Config.PUBLIC_DIR, safe_path);
			if (safe_path === '/' || pathname.endsWith('/'))
				file_path = path.join(Config.PUBLIC_DIR, safe_path, 'index.html');
			if(this.document_memory_map[file_path])
				return await this._Send_File(connection, this.document_memory_map[file_path]);
			this.document_memory_map[file_path] = new File_Cache(file_path);
			return await this._Send_File(connection, this.document_memory_map[file_path]);
		}
		return false;
	}

}

module.exports = Static_File_Service;