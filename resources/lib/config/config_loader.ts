import type { App_Config_Type } from "$lib/types/app_config";
import type { Map_Config_Type } from "$lib/types/map_config";
import type { Network_Config_Type } from "$lib/types/network_config";

let app_config: App_Config_Type | null = null;
let map_config: Map_Config_Type | null = null;
let network_config: Network_Config_Type | null = null;

let initialized = false;

async function Load_JSON<T>(fetch_fn: typeof fetch, path: string): Promise<T> {
	const res = await fetch_fn(path);

	if (!res.ok) throw new Error(`Failed to load ${path}`);

	return res.json();
}

export async function Init_Config(fetch_fn: typeof fetch) {
	if (initialized) return;

	const [app, base, network] = await Promise.all([
		Load_JSON<App_Config_Type>(fetch_fn, "/customization/app_config.json"),

		Load_JSON<Map_Config_Type>(fetch_fn, "/customization/map_config.json"),

		Load_JSON<Network_Config_Type>(fetch_fn, "/customization/network_config.json"),
	]);

	app_config = app;
	map_config = base;
	network_config = network;

	initialized = true;
}

function Assert_Init() {
	if (!initialized) {
		throw new Error(
			"Config not initialized. Ensure Init_Config() is called before accessing configuration."
		);
	}
}

export function Get_App_Config(): App_Config_Type {
	Assert_Init();
	return app_config!;
}

export function Get_Map_Config(): Map_Config_Type {
	Assert_Init();
	return map_config!;
}

export function Get_Network_Config(): Network_Config_Type {
	Assert_Init();
	return network_config!;
}
