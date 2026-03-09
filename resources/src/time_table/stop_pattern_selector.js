import Utils from "../utils/utils.js";



class Stop_Pattern_Selector extends HTMLElement {

	static Create()
	{
		const elt = document.createElement("stop-pattern-selector");
		return elt;
	}
}

customElements.define("stop-pattern-selector", Stop_Pattern_Selector);

export default Stop_Pattern_Selector;
