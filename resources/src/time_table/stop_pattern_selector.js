import Utils from "../utils/utils.js";
import CSS_pattern_selector from '../../style/pattern_selector.css';


class Stop_Pattern_Selector extends HTMLElement {

	static template = (() => {
		const template = document.createElement('template');
		return template;
	})();

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		Utils.Add_Stylesheet(this.shadowRoot, CSS_pattern_selector);
		Utils.Clone_Node_Into(this.shadowRoot, Stop_Pattern_Selector.template);
	}

	static Create()
	{
		const elt = document.createElement("stop-pattern-selector");
		return elt;
	}
}

customElements.define("stop-pattern-selector", Stop_Pattern_Selector);

export default Stop_Pattern_Selector;
