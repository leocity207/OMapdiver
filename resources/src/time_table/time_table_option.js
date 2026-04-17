import Utils from "../utils/utils.js";
import CSS_timetable_options from '../../style/timetable_options.css';


class TimeTable_Options extends HTMLElement {

	static template = (() => {
		const template = document.createElement('template');
		return template;
	})();

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		Utils.Add_Stylesheet(this.shadowRoot, CSS_timetable_options);
		Utils.Clone_Node_Into(this.shadowRoot, TimeTable_Options.template);
	}

	static Create()
	{
		const elt = document.createElement("timetable-Options");
		return elt;
	}

}

customElements.define("timetable-Options", TimeTable_Options);

export default TimeTable_Options;
