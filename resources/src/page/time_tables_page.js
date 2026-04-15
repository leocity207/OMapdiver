import Page from "./page.js";
import Network_Line_Selector_Panel from "../time_table/network_line_selector_panel.js"
import Utils from "../utils/utils.ts";
import TimeTable from "../time_table/time_table.js";
/**
 * Time_Tables_Page define the page to show different timetable
 */
class Timetables_Page extends Page {

	/**
	 * node pointing to the line selector panel
	 */
	network_line_selector_panel = null;

	/**
	 * node pointing to the actual timetable
	 */
	time_table = null;

	/**
	 * Base template strucutre
	 */
	static template_base =(() =>{
		const template = document.createElement('template');
		const network_line_selector_panel = Network_Line_Selector_Panel.Create();
		const time_table = TimeTable.Create();

		template.content.append(network_line_selector_panel, time_table);

		return template;
	})();

	constructor() {
		super();
		Utils.Clone_Node_Into(this.shadowRoot, Timetables_Page.template_base);
		this.network_line_selector_panel = Utils.Get_Subnode(this.shadowRoot, "network-line-selector-panel");
		this.time_table = Utils.Get_Subnode(this.shadowRoot, "timetable-table");
	}

	Initialize_Timetables = async () => {
		this.network_data = await Utils.Fetch_Resource("dyn/network_data");
		this.network_line_selector_panel.Initialize(this.network_data);
		this.network_line_selector_panel.Get_Observable().subscribe((data) => this.time_table.Set_TimeTable_Content(data.line, data.network));
	}

	/**
	 * Create a Map_Page object and initialize it.
	 *
	 * @returns {Map_Page} a Page Object
	 */
	static Create() {
		return document.createElement('timetables-page');
	}

	static icon = '<?xml version="1.0" encoding="UTF-8"?>\
	<svg  version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">\
		<g fill="none" stroke-linecap="round" stroke-linejoin="round">\
			<g stroke-width="4.212">\
				<rect x="12.977" y="55.063" width="76.005" height="37.163" rx=".69638" ry=".47805" style="paint-order:stroke fill markers"/>\
				<path d="m13.462 66.748h75.061" style="paint-order:stroke fill markers"/>\
				<path d="m13.533 80.157h75.474" style="paint-order:stroke fill markers"/>\
				<path d="m37.371 67.514v23.562" style="paint-order:stroke fill markers"/>\
				<path d="m63.573 67.131v25.094" style="paint-order:stroke fill markers"/>\
			</g>\
			<g stroke-width="7.7174">\
				<path d="m29.302 47.52v11.605" style="paint-order:stroke fill markers"/>\
				<path d="m51.228 47.387v11.605" style="paint-order:stroke fill markers"/>\
				<path d="m73.37 47.387v11.605" style="paint-order:stroke fill markers"/>\
			</g>\
			<path d="m16.884 26.699h67.895" stroke-width="10.096" style="paint-order:stroke fill markers"/>\
		</g>\
		<g fill="#fff">\
			<circle cx="38.488" cy="26.845" r="4.2312" style="paint-order:stroke fill markers"/>\
			<circle cx="17.166" cy="26.483" r="4.2312" style="paint-order:stroke fill markers"/>\
			<circle cx="61.301" cy="26.789" r="4.2312" style="paint-order:stroke fill markers"/>\
			<circle cx="84.371" cy="26.782" r="4.2312" style="paint-order:stroke fill markers"/>\
		</g>\
		<g stroke-width=".23685">\
			<path class="B D G" d="m16.252 7.9588c-4.9612 0-13.523 1.4629-13.503 7.9314 0.00143 0.47039 0.28497 0.61018 0.28497 0.61018l4.3818-0.03099a1.3169 1.3169 0 0 0 1.9707 0.9687 1.3169 1.3169 0 0 0 0.64348-0.9872l1.1505-0.0082a1.3169 1.3169 0 0 0 1.9735 0.99553 1.3169 1.3169 0 0 0 0.6458-1.014l14.678-0.10364a1.3169 1.3169 0 0 0 1.9813 1.1177 1.3169 1.3169 0 0 0 0.65181-1.1366l1.652-0.01162c0.72193 0.02036 0.48342-0.9488 0.48342-0.9488v-6.7314c0.0102-0.65064-0.53894-0.65089-0.53894-0.65089zm-0.09714 0.92984c0.31241 0.0011 0.44309 0.1631 0.43439 0.53801h4.73e-4c0 0.3657-0.48267 2.936-3.8901 2.8163-2.5523-0.08954-6.2068-0.02035-6.2068-0.02035-0.26433 0-0.66375-0.29229-0.21372-0.65089 0.61416-0.48934 4.0277-2.5263 9.7305-2.6739 0.05217-0.0063 0.10063-0.0094 0.14525-0.0092zm3.0046 0.70177h12.104c0.5149 0 0.92938 0.41448 0.92938 0.92938v0.95944c0 0.5149-0.41448 0.92938-0.92938 0.92938h-12.104c-0.5149 0-0.92984-0.41448-0.92984-0.92938v-0.95944c0-0.5149 0.41494-0.92938 0.92984-0.92938z"/>\
			<path class="B D G" d="m83.881 7.9667c4.9611 0 13.523 1.4629 13.503 7.9314-0.0019 0.47039-0.28497 0.61018-0.28497 0.61018l-4.3818-0.03099a1.3169 1.3169 0 0 1-1.9707 0.9687 1.3169 1.3169 0 0 1-0.64348-0.9872l-1.1505-0.0082a1.3169 1.3169 0 0 1-1.9735 0.99548 1.3169 1.3169 0 0 1-0.6458-1.014l-14.678-0.10363a1.3169 1.3169 0 0 1-1.9813 1.1177 1.3169 1.3169 0 0 1-0.65181-1.1366l-1.652-0.01162c-0.72193 0.02039-0.48342-0.94878-0.48342-0.94878v-6.7314c-0.010201-0.65064 0.53894-0.65089 0.53894-0.65089zm0.09714 0.92984c-0.31241 0.0011-0.44309 0.1631-0.43439 0.53801h-4.74e-4c0 0.3657 0.48267 2.936 3.8901 2.8163 2.5523-0.08954 6.2068-0.02035 6.2068-0.02035 0.26434 0 0.66375-0.29229 0.21373-0.65089-0.61417-0.48934-4.0277-2.5263-9.7305-2.6739-0.05217-0.0063-0.10063-0.0094-0.14527-0.0094zm-3.0046 0.70178h-12.104c-0.5149 0-0.92938 0.41448-0.92938 0.92937v0.95944c0 0.5149 0.41448 0.92938 0.92938 0.92938h12.104c0.5149 0 0.92984-0.41448 0.92984-0.92938v-0.95944c0-0.5149-0.41494-0.92937-0.92984-0.92937z"/>\
			<path class="B D I" d="m35.235 7.8713c-0.5149 0-0.92984 0.41448-0.92984 0.92938v6.5759c0 0.5149 0.41494 0.92938 0.92984 0.92938h0.8845a1.3169 1.3169 0 0 0 1.9804 1.0982 1.3169 1.3169 0 0 0 0.65135-1.0982h23.098a1.3169 1.3169 0 0 0 1.9776 1.0358 1.3169 1.3169 0 0 0 0.64765-1.0358h0.85351c0.5149 0 0.92938-0.41448 0.92938-0.92938v-6.5759c0-0.51489-0.41448-0.92938-0.92938-0.92938zm3.7157 1.7537h22.716c0.5149 0 0.92937 0.41448 0.92937 0.92938v0.95944c0 0.5149-0.41448 0.92938-0.92937 0.92938h-22.716c-0.5149 0-0.92938-0.41448-0.92938-0.92938v-0.95944c0-0.5149 0.41448-0.92938 0.92938-0.92938z"/>\
		</g>\
	</svg>\
';
}

customElements.define("timetables-page", Timetables_Page);

export default Timetables_Page;