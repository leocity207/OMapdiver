/**
 * base class of Services
 */
class Service {

	constructor(name)
	{
		this.name = name;
	}

	async Serve(req, pathname, connection)
	{
		throw new Error("[ERROR] this method should be overiden");
	}
}

module.exports = { Service };