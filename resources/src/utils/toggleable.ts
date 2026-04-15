type Constructor<T = {}> = new (...args: any[]) => T;

export interface ToggleableShape {
	states: string[];
	current_index: number;
	Serialize<T>(objList: T[]): string;
	Deserialize<T = unknown>(str: string | null): T[];
}

function Toggleable<TBase extends Constructor<HTMLElement>>(Base: TBase) {
	return class ToggleableClass extends Base implements ToggleableShape {
		states: string[] = [];
		current_index: number = 0;

		/**
		 * Set up the allowed states and the initial one.
		 */
		Toggleable_Init(states: any[], initial_state: any | null): void {
			this.states = states;

			if (initial_state !== null) {
				const idx = states.indexOf(initial_state);
				if (idx !== -1) {
					this.current_index = idx;
				} else {
					throw new Error("Desired state is not in the state list");
				}
			} else {
				this.current_index = 0;
			}

			this.setAttribute("current-state", String(this.current_index));
			this.setAttribute("states", this.Serialize(this.states));
		}

		/**
		 * Restore internal state from attributes after cloning or reconnecting.
		 */
		Toggleable_connectedCallback(): void {
			const currentStateAttr = this.getAttribute("current-state");
			if (currentStateAttr !== null) {
				const current_index = Number.parseInt(currentStateAttr, 10);
				if (!Number.isNaN(current_index)) {
					this.current_index = current_index;
				}
			}

			const statesAttr = this.getAttribute("states");
			if (statesAttr !== null) {
				this.states = this.Deserialize<string>(statesAttr);
			}
		}

		/**
		 * Move to the next state in the cycle.
		 */
		Next_State(): string {
			if (this.states.length === 0) {
				throw new Error("Toggleable has no states defined");
			}

			this.current_index = (this.current_index + 1) % this.states.length;
			this.setAttribute("current-state", String(this.current_index));
			return this.Get_State();
		}

		/**
		 * Get the current state.
		 */
		Get_State(): string {
			if (this.states.length === 0) {
				throw new Error("Toggleable has no states defined");
			}
			return this.states[this.current_index];
		}

		/**
		 * Set a specific state.
		 */
		Set_State(state: string): void {
			const idx = this.states.indexOf(state);
			if (idx !== -1) {
				this.current_index = idx;
				this.setAttribute("current-state", String(this.current_index));
			} else {
				throw new Error("Desired state is not in the state list");
			}
		}

		/**
		 * Serialize any array to JSON.
		 */
		Serialize<T>(objList: T[]): string {
			try {
				return JSON.stringify(objList);
			} catch (e) {
				console.error("Serialization failed:", e);
				return "";
			}
		}

		/**
		 * Deserialize JSON into an array.
		 */
		Deserialize<T = unknown>(str: string | null): T[] {
			if (str === null || str.trim() === "") {
				return [];
			}

			try {
				const parsed: unknown = JSON.parse(str);
				return Array.isArray(parsed) ? (parsed as T[]) : [];
			} catch (e) {
				console.error("Deserialization failed:", e);
				return [];
			}
		}
	};
}

export default Toggleable;