import Utils from "../utils/utils";
import Top_Panel from "../components/top_panel"
import CSS_network_line_selector_panel from '../../style/network_line_selector_panel.css';
import { Subject } from "rxjs";


class Network_Line_Selector_Panel extends Top_Panel
{

	/**
	 * Observable subject
	 */
	subject = null;

	/**
	 * data about the current network
	 */
	network_data = null;

	static template = (() => {
		const template = document.createElement('template');
		let inner_container = Utils.Create_Element_With_Class('div', 'line-container');
		template.content.append(inner_container);
		return template;
	})();

	static icon_template = (() => {
		const template = document.createElement('template');
		let inner_container = Utils.Create_Element_With_Class('div', 'line-icon');
		template.content.append(inner_container);
		return template;
	})();

	constructor() {
		super();
		this.subject = new Subject();
		Utils.Add_Stylesheet(this.shadowRoot, CSS_network_line_selector_panel);
		Utils.Clone_Node_Into(this.content_wrapper, Network_Line_Selector_Panel.template);
		this.line_container = Utils.Get_Subnode(this.shadowRoot, ".line-container");
	}

	Get_Observable() {
		return this.subject;
	}

	Initialize(network_data) {
		this.network_data = network_data;
		for(let [line_ID, data] of Object.entries(this.network_data.lines)) {
			let icon = Utils.Clone_Node_Into(this.line_container, Network_Line_Selector_Panel.icon_template);
			icon.innerHTML = data.icon;
			const rect = icon.querySelector('rect');
			if (rect)
				rect.setAttribute('fill', data.color.default);
			else
				console.warn('No <rect> element found in SVG.');

			icon.addEventListener('click', (e) => {
				this.subject.next({ line: line_ID, network: this.network_data})
			});
		}
	}

	static Create() {
		const elt = document.createElement("network-line-selector-panel");
		return elt;
	}

}

customElements.define("network-line-selector-panel", Network_Line_Selector_Panel);

export default Network_Line_Selector_Panel;
