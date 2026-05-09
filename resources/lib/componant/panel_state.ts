export type PanelState = {
	open: boolean;
	toggle(): void;
	openPanel(): void;
	closePanel(): void;
};

export function createPanelState(initial = false): PanelState {
	let open = initial;

	return {
		get open() {
			return open;
		},
		set open(value: boolean) {
			open = value;
		},
		toggle() {
			open = !open;
		},
		openPanel() {
			open = true;
		},
		closePanel() {
			open = false;
		}
	};
}