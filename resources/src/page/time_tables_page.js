import Page from "./page.js";
import Sticky_Header from "../components/sticky_header.js"
import LeftPanel from "../components/left_panel.js"
import Utils from "../utils/utils.js";

/**
 * Time_Tables_Page define the page to show different timetable
 */
class Timetables_Page extends Page {

	/**
	 * Base template strucutre
	 */
	static template_base =(() =>{
		const template = document.createElement('template');
		const sticky_header = Sticky_Header.Create();
		const left_panel = LeftPanel.Create();

		template.content.append(sticky_header, left_panel);

		return template;
	})();

	constructor() {
		super();
		Utils.Clone_Node_Into(this.shadowRoot, Timetables_Page.template_base);
	}

	Load_Data()
	{
		Utils.Get_Subnode(this.shadowRoot,"sticky-header").Show_Left_Panel();
	}

	/**
	 * Create a Map_Page object and initialize it.
	 *
	 * @returns {Map_Page} a Page Object
	 */
	static Create() {
		return document.createElement('timetables-page');
	}
}

customElements.define("timetables-page", Timetables_Page);

export default Timetables_Page;