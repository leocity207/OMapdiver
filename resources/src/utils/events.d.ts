declare global {
	interface DocumentEventMap {
		"station-click": CustomEvent<string>;
		"line-click": CustomEvent<string>;
	}
}

export {};