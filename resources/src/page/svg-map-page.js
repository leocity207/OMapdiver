import Page from "./page.js";
import SVG_Map from "../map/svg_map.js";
import {Config} from "../../resources-config/config.js"
import Sticky_Header from "../components/sticky_header.js"
import LeftPanel from "../components/left_panel.js"
import Right_Panel from "../right-panel/right-panel.js";
import Utils from "../utils/utils.ts";

/**
 * Map_App are object that define a node containing a SVG_Map for manipulation and display
 *
 * Map_App define a custom element named "svg-map-app"
 */
class Map_Page extends Page {

	/**
	 * the map object
	 */
	map = null;

	/**
	 * the resizer observer on the map container
	 */
	resize_observer = null;

	/**
	 * Base template strucutre
	 */
	static template_base =(() =>{
		const template = document.createElement('template');
		const sticky_header = Sticky_Header.Create();
		const left_panel = LeftPanel.Create();
		const right_panel = Right_Panel.Create();
		const map_container = Utils.Create_Element_With_Class('div','map-container');
		const map_canvas = Utils.Create_Element_With_Class('canvas','map-canvas');

		map_container.appendChild(map_canvas);

		template.content.append(sticky_header, left_panel, right_panel, map_container);

		return template;
	})();

	constructor() {
		super();
		Utils.Clone_Node_Into(this.shadowRoot, Map_Page.template_base);
	}

	/**
	 * Asynchronous function that initialize the map. the function resolve when the SVG is loaded and displayed inside the current node
	 */
	Initialize_Map = async () => {
		this.map = new SVG_Map("Desktop", "image/map.svg", Config);
		await this.map.Setup("Fr", Utils.Get_Subnode(this.shadowRoot, '.map-canvas'));
		this.map.Setup_Mouse_Handlers();

		this.resize_observer = new ResizeObserver(entries => {
			for (let entry of entries) {
				const { width, height } = entry.contentRect;
				this.map.Zoom_Check_Map_Resize(width, height);
			}
		});
		this.resize_observer.observe(this.map_container);
	}

	/**
	 * create a travling movemont tower the initial object indicated in the conf on the map
	 */
	Initial_Zoom_Move = async () => {
		if(this.map)
			await this.map.Initial_Zoom_Move();
	}

	/**
	 * Create a Map_Page object and initialize it.
	 *
	 * @returns {Map_Page} a Page Object
	 */
	static Create() {
		return document.createElement('svg-map-page');
	}

	static icon = '<?xml version="1.0" encoding="UTF-8"?>\
	<svg version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">\
		<g fill="none" stroke-linecap="round" stroke-linejoin="round">\
			<path d="m92.297 17.676-27.814-6.9536-27.814 6.9536-27.814-6.9536v73.012l27.814 6.9536 27.814-6.9536 27.814 6.9536zm-27.814 66.059v-73.012m-28.288 6.9259 0.47345 73.04" stroke-width="8.4834"/>\
			<g stroke-width="4.7284">\
				<path d="m92.297 39.289-27.814-9.2201-7.9507 2.1304-13.486 23.144-6.5989 1.2596-27.593-7.3936"/>\
				<path d="m22.762 87.212 13.83-8.4061 27.891-48.737 15.477-15.477"/>\
				<path d="m22.762 14.2 13.564 23.493 28.158 16.257 20.098 34.81"/>\
			</g>\
		</g>\
		<g fill="#fff">\
			<circle cx="51.982" cy="46.472" r="5.4415" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5772" style="paint-order:stroke fill markers"/>\
			<circle cx="20.398" cy="52.128" r="2.0082" style="paint-order:stroke fill markers"/>\
			<circle cx="46.655" cy="60.976" r="2.0082" style="paint-order:stroke fill markers"/>\
			<circle cx="30.192" cy="82.61" r="2.0082" style="paint-order:stroke fill markers"/>\
			<circle cx="73.13" cy="32.843" r="2.0082" style="paint-order:stroke fill markers"/>\
			<circle cx="73.108" cy="21.265" r="2.0082" style="paint-order:stroke fill markers"/>\
			<circle cx="55.642" cy="34.013" r="2.0082" style="paint-order:stroke fill markers"/>\
			<circle cx="84.332" cy="36.654" r="2.0082" style="paint-order:stroke fill markers"/>\
			<circle cx="71.644" cy="66.427" r="2.0082" style="paint-order:stroke fill markers"/>\
			<circle cx="78.797" cy="78.731" r="2.0082" style="paint-order:stroke fill markers"/>\
			<circle cx="29.437" cy="25.697" r="2.0082" style="paint-order:stroke fill markers"/>\
		</g>\
	</svg>';
}

customElements.define("svg-map-page", Map_Page);

export default Map_Page;