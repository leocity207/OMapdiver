import Utils from "../utils/utils.js";

class TimeTable extends HTMLElement {

	static Create()
	{
		const elt = document.createElement("timetable-table");
		return elt;
	}

}

customElements.define("timetable-table", TimeTable);

export default TimeTable;
