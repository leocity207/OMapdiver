import Utils from "../utils/utils.js";
import CSS_timetable_service_mission from '../../style/timetable_service_mission.css';

class TimeTable_Service_Mission extends HTMLElement {

	static template = (() => {
		const template = document.createElement('template');
		return template;
	})();

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		Utils.Add_Stylesheet(this.shadowRoot, CSS_timetable_service_mission);
		Utils.Clone_Node_Into(this.shadowRoot, TimeTable_Service_Mission.template);
	}

	static Create() {
		const elt = document.createElement("timetable-service-mission");
		return elt;
	}

}

customElements.define("timetable-service-mission", TimeTable_Service_Mission);

export default TimeTable_Service_Mission;
