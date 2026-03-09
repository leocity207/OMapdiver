import Utils from "../utils/utils.js";


class Calendar_Pattern_Selector extends HTMLElement {

	static Create()
	{
		const elt = document.createElement("calendar-pattern-selector");
		return elt;
	}

}

customElements.define("calendar-pattern-selector", Calendar_Pattern_Selector);

export default Calendar_Pattern_Selector;
