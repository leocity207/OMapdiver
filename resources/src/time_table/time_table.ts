import Utils from "../utils/utils";
import Switch_Pattern from "../components/pattern_switch"
import TimeTable_Service_Mission from "./time_table_service_mission"
import { Network, Pattern_Schemes } from "../utils/networktype";

// @ts-ignore for CSS import
import CSS_timetable from '../../style/timetable.css';


class TimeTable extends HTMLElement {

	/**
	 * data about the network
	 */
	network_data = null;

	calendar_pattern_selector: Switch_Pattern;

	stop_pattern_selector: Switch_Pattern;

	timetable_service_mission: TimeTable_Service_Mission;

	static template =(() =>{
		const template = document.createElement('template');
		const top_container = Utils.Create_Element_With_Class('div', 'line-info');
		const calendar_pattern_selector = Switch_Pattern.Create("calendar_pattern");
		calendar_pattern_selector.id = "calendar-pattern";
		const stop_pattern_selector = Switch_Pattern.Create("stop_pattern");
		stop_pattern_selector.id = "stop-pattern";
		top_container.append(calendar_pattern_selector, stop_pattern_selector);

		const time_table = TimeTable_Service_Mission.Create();

		template.content.append(top_container, time_table);

		return template;
	})();

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		Utils.Add_Stylesheet(this.shadowRoot!, CSS_timetable);
		Utils.Clone_Node_Into(this.shadowRoot!, TimeTable.template);
		let line_info = Utils.Get_Subnode(this.shadowRoot!, ".line-info");
		this.calendar_pattern_selector = Utils.Get_Subnode(line_info, "#calendar-pattern") as Switch_Pattern;
		this.stop_pattern_selector = Utils.Get_Subnode(line_info, "#stop-pattern") as Switch_Pattern;
		this.timetable_service_mission = Utils.Get_Subnode(this.shadowRoot!, "timetable-services-missions") as TimeTable_Service_Mission;
	}
	
	static Create()
	{
		const elt = document.createElement("timetable-table");
		return elt;
	}

	On_Calendar_Pattern(selected_pattern: string) {

	}

	On_Stop_Pattern(selected_pattern: string) {

	}

	Set_TimeTable_Content(line_ID: string, network_data: Network) {
		this.calendar_pattern_selector.Update(network_data.calendar_patterns as {[index: string]: Pattern_Schemes});
		this.stop_pattern_selector.Update(network_data.stop_patterns as {[index: string]: Pattern_Schemes});
		this.timetable_service_mission.Update(network_data.lines[line_ID], network_data.stations);
	}

}

customElements.define("timetable-table", TimeTable);

export default TimeTable;
