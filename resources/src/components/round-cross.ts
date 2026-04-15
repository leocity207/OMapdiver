import Observable from "../utils/observable.ts";
import Utils from "../utils/utils.ts"
import CSS_round_cross from '../../style/round-cross.css';

/**
 * Round_Cross emits an event when clicked.
 *
 * Structure
 * ---------
 * .. code-block:: html
 *
 * 	<div class='circle'>
 * 		<div class='left'>
 * 		</div>
 * 		<div class='right'>
 * 		</div>
 * 	</div>
 */
class Round_Cross extends Observable(HTMLElement) {

	/**
	 * Base template strucutre
	 */
	static template = (() => {
		const template = document.createElement('template');

		// Create the main circle
		const wrapper = Utils.Create_Element_With_Class('div','circle');
		const left = Utils.Create_Element_With_Class('div','left');
		const right = Utils.Create_Element_With_Class('div','right');

		wrapper.appendChild(left);
		wrapper.appendChild(right);
		template.content.appendChild(wrapper);
		return template;
	})();

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		Utils.Add_Stylesheet(this.shadowRoot!, CSS_round_cross);
		Utils.Clone_Node_Into(this.shadowRoot!, Round_Cross.template);
	}

	/**
	 * Factory cronstructor of Round_Cross
	 * @param {string} name
	 * @returns Round_Cross
	 */
	static Create(name: string) {
		const object = document.createElement("round-cross") as Round_Cross;
		object.Observable_Init(name);
		return object;
	}

	/**
	 * Called when node is connected to the dom
	 */
	connectedCallback() {
		this.Observable_connectedCallback();
		this.addEventListener("click", () => {
			this.Emit(null);
		});
	}

	/**
	 * Called when node disapear from the dom
	 */
	disconnectedCallback() {
		this.removeEventListener("click",() => {
			this.Emit(null);
		});
	}
}

customElements.define("round-cross", Round_Cross);

export default Round_Cross