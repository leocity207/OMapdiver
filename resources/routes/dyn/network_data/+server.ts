import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
	const host = process.env.ORM_HOST ?? "localhost";
	const port = process.env.ORM_PORT ?? "8000";

	const response = await fetch(`http://${host}:${port}/dyn/network_data`);
	if (!response.ok) throw error(response.status, "Failed to fetch network data from ORM");

	return new Response(response.body, {
		status: response.status,
		headers: response.headers,
	});
};
