class service {

	constructor(name)
	{
		this.name = name;
	}

	async Serve(method, resource, querry)
	{
		throw new Error("[ERROR] this method should be overiden");
	}
}

module.exports = { service };