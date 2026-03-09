import Utils from "../utils/utils.js";

import Calendar_Pattern_Selector from "./calendar_pattern_selector.js"
import Stop_Pattern_Selector from "./stop_pattern_selector.js"
import CSS_timetable from '../../style/timetable.css';
import TimeTable_Service_Mission from "./time_table_service_mission.js"

class TimeTable extends HTMLElement {

	/**
	 * data about the network
	 */
	network_data = null;

	static template =(() =>{
		const template = document.createElement('template');
		const top_container = Utils.Create_Element_With_Class('div', 'line-info');
		const calendar_pattern_selector = Calendar_Pattern_Selector.Create();
		const stop_pattern_selector = Stop_Pattern_Selector.Create();
		top_container.append(calendar_pattern_selector, stop_pattern_selector);

		const time_table = TimeTable_Service_Mission.Create();

		template.content.append(top_container, time_table);

		return template;
	})();

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		Utils.Add_Stylesheet(this.shadowRoot, CSS_timetable);
		Utils.Clone_Node_Into(this.shadowRoot, TimeTable.template);
	}
	
	static Create()
	{
		const elt = document.createElement("timetable-table");
		return elt;
	}

	On_Calendar_Pattern(slected_pattern) {

	}

	On_Stop_Pattern(slected_pattern) {

	}

	Set_TimeTable_Content(line_ID, network_data) {

	}

}

customElements.define("timetable-table", TimeTable);

export default TimeTable;
