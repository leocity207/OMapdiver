import Observable from "../utils/observable";
import Toggleable from "../utils/toggleable";
import Utils from "../utils/utils"
import CSS_switch from '../../style/switch.css';

/**
 * The **Switch_Event** is a UI component that can hold two states and triggers an event when toggled by the user.
 *
 * Functionality
 * -------------
 *
 * - Can switch between **two states** (e.g., ON/OFF, Enabled/Disabled).
 * - Sends an **event notification** whenever the state changes.
 *
 * Structure
 * ---------
 * .. code-block:: html
 *
 * 	<div class="switch-container">
 * 		<text> *text of the switch
 * 		<label>
 * 			<input>
 * 			<span>
 * 		</label>
 * 	</div>
 *
 */
class Switch_Event extends Observable(Toggleable(HTMLElement))  {

	/**
	 * text to be displayed on the left of the Switch
	 */
	private m_text: string = "";
	
	private _Handle_Click_bound: (event: Event) => void;

	/**
	 * Base template for the round cross wich contain the circle and the cross
	 */
	static template = (() => {
		const template = document.createElement('template');

		const master_switch = Utils.Create_Element_With_Class('div', 'switch-container');

		const text_elt = document.createElement("span");
		const label_switch = Utils.Create_Element_With_Class('label','switch');

		const input_checkbox = document.createElement("input");
		input_checkbox.setAttribute("type", "checkbox");
		const span_checkbox = Utils.Create_Element_With_Class('span','slider');
		label_switch.append(input_checkbox, span_checkbox);

		master_switch.append(text_elt, label_switch);
		template.content.appendChild(master_switch);
		return template;
	})();

	constructor() {
		super();

		this.m_text = "";
		this.attachShadow({ mode: "open" });
		Utils.Add_Stylesheet(this.shadowRoot!, CSS_switch)
		Utils.Clone_Node_Into(this.shadowRoot!,Switch_Event.template);
		this._Handle_Click_bound = this._Handle_Click.bind(this);
	}

	/**
	 * Creates and initializes a Switch_Event instance.
	 * @param {string} name - The identifier for the switch.
	 * @param {string} text - The label text for the switch.
	 * @returns {Switch_Event} A new instance of Switch_Event.
	 */
	static Create(name:string, text: string): Switch_Event {
		const elt = document.createElement("switch-event") as Switch_Event;
		elt.Observable_Init(name);
		elt.Toggleable_Init([false,true],false);
		elt.m_text = text;
		return elt;
	}

	/**
	* Called when node is connected to the dom
	*/
	connectedCallback() {
		this.Observable_connectedCallback();
		this.Toggleable_connectedCallback();
		const checkbox = this.shadowRoot!.querySelector("input[type='checkbox']");
		if(checkbox)
			checkbox.addEventListener("click", this._Handle_Click_bound);
	}

	/**
	 * Called when node disapear from the dom
	 */
	disconnectedCallback() {
		const checkbox = this.shadowRoot!.querySelector("input[type='checkbox']");
		if(checkbox)
			checkbox.removeEventListener("click", this._Handle_Click_bound);
	}

	/**
	 * Render the node add styles and
	 */
	Render() {
		const text_elt = Utils.Get_Subnode(this.shadowRoot!,'text');
		text_elt.textContent = this.m_text;
	}

	/**
	 * Handle the event
	 *
	 * @param {Event} event
	 */
	_Handle_Click(event: Event) {
		event.stopPropagation(); // (optionnel) évite que le clic remonte inutilement
		this.Next_State();
		this.Emit(this.Get_State());
	}
}

// Define the custom element
customElements.define("switch-event", Switch_Event);

export default Switch_Event;