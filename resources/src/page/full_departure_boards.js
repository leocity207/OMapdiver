import Page from "./page.js";
import Sticky_Header from "../components/sticky_header.js"
import LeftPanel from "../components/left_panel.js"
import Utils from "../utils/utils.js";

/**
 * Time_Tables_Page define the page to show different timetable
 */
class Full_Departure_Boards extends Page {

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

	static icon = ""

	constructor() {
		super();
		Utils.Clone_Node_Into(this.shadowRoot, Full_Departure_Boards.template_base);
	}

	Initialize_Departure_Boards = async () => {

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
		return document.createElement('full-departure-boards-page');
	}

	static icon = '<?xml version="1.0" encoding="UTF-8"?>\
	<svg version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">\
		<g fill="none" stroke-linecap="round">\
			<g stroke-linejoin="round">\
				<g stroke-width="4.3358">\
					<rect x="11.938" y="55.493" width="78.24" height="38.256" rx=".71686" ry=".49211" style="paint-order:stroke fill markers"/>\
					<path d="m12.436 67.522h77.268" style="paint-order:stroke fill markers"/>\
					<path d="m12.51 81.326h77.693" style="paint-order:stroke fill markers"/>\
					<path d="m37.049 68.311v24.255" style="paint-order:stroke fill markers"/>\
					<path d="m64.021 67.916v25.832" style="paint-order:stroke fill markers"/>\
				</g>\
				<g stroke-width="7.9443">\
					<path d="m28.743 47.728v11.947" style="paint-order:stroke fill markers"/>\
					<path d="m51.312 47.592v11.947" style="paint-order:stroke fill markers"/>\
					<path d="m74.106 47.592v11.947" style="paint-order:stroke fill markers"/>\
				</g>\
				<circle cx="51.507" cy="19.546" r="4.9926" stroke-width="1.2486" style="paint-order:stroke fill markers"/>\
				<path d="m53.461 22.097-2.1164-2.2792v-3.256" stroke-width="1.2486" style="paint-order:stroke fill markers"/>\
			</g>\
			<path d="m23.722 19.087 27.828-16.066 28.079 16.211" stroke-width="2.5135"/>\
		</g>\
		<path d="m51.538 7.4459-24.309 14.035 0.11949 14.678h3.7461v-8.6339a5.0271 5.0271 0 0 1 5.0268-5.0268 5.0271 5.0271 0 0 1 5.0268 5.0268v8.6339h4.1046v-16.916a6.2839 6.2839 0 0 1 6.2841-6.2828 6.2839 6.2839 0 0 1 6.2841 6.2828v16.916h4.5501v-8.187a5.0271 5.0271 0 0 1 5.0281-5.0268 5.0271 5.0271 0 0 1 5.0268 5.0268v8.187h4.5813v-14.007z"/>\
		<path d="m22.363 39.248h59.481" fill="none" stroke-linecap="round" stroke-width="2.5135"/>\
	</svg>';
}

customElements.define("full-departure-boards-page", Full_Departure_Boards);

export default Full_Departure_Boards;