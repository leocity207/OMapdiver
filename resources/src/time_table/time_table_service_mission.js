import Utils from "../utils/utils.js";

class TimeTable_Service_Mission extends HTMLElement {

	static Create()
	{
		const elt = document.createElement("timetable-service-mission");
		return elt;
	}

}

customElements.define("timetable-service-mission", TimeTable_Service_Mission);

export default TimeTable_Service_Mission;
