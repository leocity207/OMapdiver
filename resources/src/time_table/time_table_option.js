import Utils from "../utils/utils.js";



class TimeTable_Option extends HTMLElement {

	static Create()
	{
		const elt = document.createElement("timetable-Option");
		return elt;
	}

}

customElements.define("timetable-Option", TimeTable_Option);

export default TimeTable_Option;
