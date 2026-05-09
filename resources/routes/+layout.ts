import { Init_Config } from "$lib/config/config_loader";

export async function load({ fetch }) {
	await Init_Config(fetch);

	return {};
}