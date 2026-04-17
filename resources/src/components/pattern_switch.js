import Observable from "../utils/observable.js";
import Toggleable from "../utils/toggleable.js";
import MixHTMLElementWith from "../utils/MixHTMLElement.js";
import Utils from "../utils/utils.js";
import CSS_Pattern_Switch from "../../style/pattern_switch.css";

/**
 * A smooth segmented switch with:
 * - normal choices on the left
 * - optional special choices in a dropdown on the right
 *
 * Each choice is one state.
 */
class Pattern_Switch extends MixHTMLElementWith(Observable, Toggleable) {

	/**
	 * List of normal choices shown as left buttons.
	 */
	m_choices = [];

	/**
	 * List of special choices shown inside the right dropdown.
	 */
	m_special_choices = [];

	/**
	 * True when the dropdown menu is opened.
	 */
	m_dropdown_open = false;

	/**
	 * Base template for the switch.
	 */
	static template = (() => {
		const template = document.createElement("template");

		const master = Utils.Create_Element_With_Class("div", "switch-container");

		const track = Utils.Create_Element_With_Class("div", "switch-track");
		const indicator = Utils.Create_Element_With_Class("span", "switch-indicator");

		const left_group = Utils.Create_Element_With_Class("div", "switch-left-group");
		const special_group = Utils.Create_Element_With_Class("div", "switch-special-group");

		track.append(indicator, left_group, special_group);
		master.append(track);

		template.content.appendChild(master);
		return template;
	})();

	constructor() {
		super();

		this.attachShadow({ mode: "open" });
		Utils.Add_Stylesheet(this.shadowRoot, CSS_Pattern_Switch);
		Utils.Clone_Node_Into(this.shadowRoot, Pattern_Switch.template);

		this._Handle_Normal_Click = this._Handle_Normal_Click.bind(this);
		this._Handle_Special_Toggle = this._Handle_Special_Toggle.bind(this);
		this._Handle_Special_Choice_Click = this._Handle_Special_Choice_Click.bind(this);
		this._Handle_Outside_Click = this._Handle_Outside_Click.bind(this);
		this._Handle_Resize = this._Handle_Resize.bind(this);
	}

	/**
	 * Factory function.
	 *
	 * @param {string} name - Unique observable name.
	 * @param {Array<string|Object>} usual_choices - Left-side choices.
	 * @param {Array<string|Object>} special_choices - Right-side dropdown choices.
	 * @param {string|null} initial_state - Optional initial state value.
	 * @returns {Pattern_Switch} A configured instance.
	 */
	static Create(name) {
		const elt = document.createElement("switch-choice");

		elt.Observable_Init(name);

		return elt;
	}

	Update(choices) {
		const all_states = Object.entries(choices).map(([key, value]) => value.id)


		this.Toggleable_Init(all_states, all_states[0] );

		const [special, normal] = Object.entries(choices).reduce(
			([accTrue, accFalse], [key, value]) => {
				if (value.is_exceptional) 
					accTrue[key] = value; 
				else
					accFalse[key] = value; 
				return [accTrue, accFalse];
			},
			[{}, {}]
		);
		
		this.m_choices = normal;
		this.m_special_choices = special;
		this.Render();
	}

	/**
	 * Called when node is connected to the DOM.
	 */
	connectedCallback() {
		this.Observable_connectedCallback();
		this.Toggleable_connectedCallback();
		this.Render();

		document.addEventListener("click", this._Handle_Outside_Click);
		window.addEventListener("resize", this._Handle_Resize);
	}

	/**
	 * Called when node is removed from the DOM.
	 */
	disconnectedCallback() {
		document.removeEventListener("click", this._Handle_Outside_Click);
		window.removeEventListener("resize", this._Handle_Resize);
	}

	/**
	 * Rebuild the UI.
	 */
	Render() {
		const left_group = this.shadowRoot.querySelector(".switch-left-group");
		const special_group = this.shadowRoot.querySelector(".switch-special-group");

		left_group.replaceChildren();
		special_group.replaceChildren();

		this.m_left_buttons = [];
		this.m_special_menu = null;
		this.m_special_toggle = null;
		this.m_indicator = this.shadowRoot.querySelector(".switch-indicator");

		// Normal choices on the left
		for (const [key, value] of Object.entries(this.m_choices)) {
			const button = document.createElement("button");
			button.type = "button";
			button.className = "switch-option switch-normal-option";
			button.textContent = value.label;
			button.dataset.value = value.id;
			button.addEventListener("click", this._Handle_Normal_Click);
			left_group.appendChild(button);
			this.m_left_buttons.push(button);
		}

		// Special dropdown on the right, only if provided
		if (Object.entries(this.m_special_choices).length > 0) {
			const wrapper = Utils.Create_Element_With_Class("div", "switch-special-wrapper");

			const toggle = document.createElement("button");
			toggle.type = "button";
			toggle.className = "switch-option switch-special-toggle";
			toggle.setAttribute("aria-expanded", "false");
			toggle.addEventListener("click", this._Handle_Special_Toggle);

			const chevron = Utils.Create_Element_With_Class("span", "switch-chevron");
			chevron.textContent = "▾";

			const label = Utils.Create_Element_With_Class("span", "switch-special-label");
			label.textContent = "More";

			toggle.append(label, chevron);

			const menu = Utils.Create_Element_With_Class("div", "switch-special-menu");

			for (const [key, value] of Object.entries(this.m_special_choices)) {
				const item = document.createElement("button");
				item.type = "button";
				item.className = "switch-special-item";
				item.textContent = value.label;
				item.dataset.value = value.id;
				item.addEventListener("click", this._Handle_Special_Choice_Click);
				menu.appendChild(item);
			}

			wrapper.append(toggle, menu);
			special_group.appendChild(wrapper);

			this.m_special_toggle = toggle;
			this.m_special_menu = menu;
			this.m_special_label = label;
		}

		this.Render_State();
	}

	/**
	 * Keep the view synced with the current state.
	 */
	Render_State() {
		const state = this.Get_State();

		// Mark normal buttons
		for (const button of (this.m_left_buttons ?? [])) {
			const selected = button.dataset.value === state;
			button.setAttribute("aria-pressed", selected ? "true" : "false");
			button.classList.toggle("is-selected", selected);
		}

		// Mark special selection + update toggle label
		if (this.m_special_toggle && this.m_special_choices.length > 0) {
			const is_special = this.m_special_choices.some(choice => choice.value === state);
			const selected_special = this.m_special_choices.find(choice => choice.value === state);

			this.m_special_toggle.classList.toggle("is-selected", is_special);
			this.m_special_toggle.setAttribute("aria-pressed", is_special ? "true" : "false");

			if (this.m_special_label) {
				this.m_special_label.textContent = selected_special ? selected_special.label : "More";
			}

			for (const item of this.m_special_menu.querySelectorAll(".switch-special-item")) {
				const selected = item.dataset.value === state;
				item.classList.toggle("is-selected", selected);
				item.setAttribute("aria-pressed", selected ? "true" : "false");
			}
		}

		this._Update_Indicator();
	}

	/**
	 * Update the moving indicator position.
	 */
	_Update_Indicator() {
		if (!this.m_indicator) return;

		const state = this.Get_State();

		let selected_button = null;

		for (const button of (this.m_left_buttons ?? [])) {
			if (button.dataset.value === state) {
				selected_button = button;
				break;
			}
		}

		if (!selected_button && this.m_special_toggle && Object.entries(this.m_special_choices).some(([key, choice]) => choice.value === state)) {
			selected_button = this.m_special_toggle;
		}

		if (!selected_button) {
			this.m_indicator.style.opacity = "0";
			return;
		}

		this.m_indicator.style.opacity = "1";

		const track = this.shadowRoot.querySelector(".switch-track");
		const track_rect = track.getBoundingClientRect();
		const button_rect = selected_button.getBoundingClientRect();

		const left = button_rect.left - track_rect.left;
		const top = button_rect.top - track_rect.top;
		const width = button_rect.width;
		const height = button_rect.height;

		this.m_indicator.style.width = `${width}px`;
		this.m_indicator.style.height = `${height}px`;
		this.m_indicator.style.transform = `translate3d(${left}px, ${top}px, 0)`;
	}

	/**
	 * Set a new state and refresh the component.
	 * @param {string} state
	 */
	Set_State(state) {
		super.Set_State(state);
		this.setAttribute("current-state", this.current_index);
		this.Render_State();
		return this.Get_State();
	}

	/**
	 * Go to next state and refresh the component.
	 * @returns {string}
	 */
	Next_State() {
		super.Next_State();
		this.setAttribute("current-state", this.current_index);
		this.Render_State();
		return this.Get_State();
	}

	/**
	 * Open/close the special dropdown.
	 * @param {boolean} open
	 */
	_Set_Dropdown_Open(open) {
		if (!this.m_special_toggle || !this.m_special_menu) return;

		this.m_dropdown_open = open;
		this.m_special_toggle.setAttribute("aria-expanded", open ? "true" : "false");
		this.m_special_menu.classList.toggle("open", open);
	}

	/**
	 * Handle click on a normal choice.
	 * @param {MouseEvent} event
	 */
	_Handle_Normal_Click = function(event) {
		event.stopPropagation();

		const value = event.currentTarget?.dataset?.value;
		if (value == null) return;

		this.Set_State(value);
		this.Emit(this.Get_State());
		this._Set_Dropdown_Open(false);
	}

	/**
	 * Handle click on the special dropdown toggle.
	 * @param {MouseEvent} event
	 */
	_Handle_Special_Toggle = function(event) {
		event.stopPropagation();

		if (!this.m_special_choices || this.m_special_choices.length === 0) return;
		this._Set_Dropdown_Open(!this.m_dropdown_open);
	}

	/**
	 * Handle click on a special menu item.
	 * @param {MouseEvent} event
	 */
	_Handle_Special_Choice_Click = function(event) {
		event.stopPropagation();

		const value = event.currentTarget?.dataset?.value;
		if (value == null) return;

		this.Set_State(value);
		this.Emit(this.Get_State());
		this._Set_Dropdown_Open(false);
	}

	/**
	 * Close dropdown when clicking outside.
	 * @param {MouseEvent} event
	 */
	_Handle_Outside_Click = function(event) {
		if (!this.shadowRoot.contains(event.target)) {
			this._Set_Dropdown_Open(false);
		}
	}

	/**
	 * Refresh indicator on resize.
	 */
	_Handle_Resize = function() {
		this._Update_Indicator();
	}
}

customElements.define("switch-choice", Pattern_Switch);

export default Pattern_Switch;