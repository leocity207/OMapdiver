// line-schedule.js
import Line_Station from './line-station.js';
import Utils from "../utils/utils.js"
import Fold_Plus_Minus from '../components/fold-plus-minus.js';
import CSS_line_schedule from '../../style/line-schedule.css';

/**
 * The **Ligne schedule** is an object used to display schedule information about a line.
 *
 * Structure
 * ---------
 * .. code-block:: html
 *
 * 	<div class='schedule-item'>
 * 		<div class='schedule-header'>
 * 			* Schedule title
 * 			* Icon if schedule has information
 * 			* Plus_Minus_Button to acces details
 * 		</div>
 * 		<div class='schedule-details'>
 * 			* list of stations
 * 		</div>
 * 	</div>
 */
class Line_Schedule extends HTMLElement {

	/**
	 * Data about the schedule
	 */
	schedule_data = null;

	/**
	 * all data about the network
	 */
	network_data = null;

	/**
	 * the station of reference if null the first station is the reference station this is used to find the starting point of the displayed line if null is provided it is assumed to be the first station of the line
	 */
	reference_station = null;

	/**
	 * the line data that we are displaying the data of
	 */
	reference_line = null;


	/**
	 * Base template strucutre
	 */
	static template_base =(() =>{
		const template = document.createElement('template');
		const container = Utils.Create_Element_With_Class('div', 'schedule-item');

		const header = Utils.Create_Element_With_Class('div','schedule-header');
		const details = Utils.Create_Element_With_Class('div','schedule-details');

		// Left container
		const header_left = Utils.Create_Element_With_Class('div', 'header-left');
		const header_left_icon = Utils.Create_Element_With_Class('div', 'header-left-icon');
		const header_left_title = Utils.Create_Element_With_Class('div', 'header-left-text');
		header_left.append(header_left_icon, header_left_title);

		// Fold_Plus_Minus
		const header_right = Utils.Create_Element_With_Class('div', 'header-right');
		const fold = Fold_Plus_Minus.Create();
		const header_minute = Utils.Create_Element_With_Class('div', 'header-minute');
		const header_info_icon = Utils.Create_Element_With_Class('div', 'header-icon');
		header_right.append(header_info_icon, header_minute, fold);

		// Info icon
		const svg_ns = 'http://www.w3.org/2000/svg';
		const info_icon = document.createElementNS(svg_ns, 'svg');
		info_icon.setAttribute('class', 'schedule-info-icon');
		info_icon.setAttribute('viewBox', '0 0 20 20');

		const circle = document.createElementNS(svg_ns, 'rect');
		circle.setAttribute('x', '0');
		circle.setAttribute('y', '0');
		circle.setAttribute('rx', '5');
		circle.setAttribute('ry', '5');
		circle.setAttribute('width', '20');
		circle.setAttribute('height', '20');
		circle.setAttribute('fill', '#888');

		const text = document.createElementNS(svg_ns, 'text');
		text.setAttribute('x', '10');
		text.setAttribute('y', '15');
		text.setAttribute('text-anchor', 'middle');
		text.setAttribute('font-size', '15');
		text.setAttribute('fill', '#fff');
		text.textContent = 'i';
		header_info_icon.appendChild(info_icon)

		info_icon.append(circle, text);

		header.append(header_left, header_right);

		container.append(header, details);
		template.content.append(container);
		return template;
	})()

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		Utils.Add_Stylesheet(this.shadowRoot, CSS_line_schedule);
		Utils.Clone_Node_Into(this.shadowRoot,Line_Schedule.template_base);
	}

	/**
	 * Factory to create the Node
	 * @param {Object} schedule_data  information about the line-schedule
	 * @param {Object} stations_data  information about all stations
	 * @param {Object} reference_station reference station we are displaying the line info from
	 * @returns instance of Line_Schedule
	 */
	static Create(schedule_data, network_data, reference_station) {
		const object = document.createElement('line-schedule');
		object.schedule_data = schedule_data;
		object.network_data = network_data;
		object.reference_station = reference_station;
		object.reference_line = schedule_data.parent;
		return object;
	}

	/**
	 * Called when node is connected to the DOM
	 */
	connectedCallback() {
		this.Render();
		this.addEventListener('click', () => {
			Utils.Get_Subnode(this.shadowRoot,'.schedule-details').classList.toggle('open');
			Utils.Get_Subnode(this.shadowRoot,'plus-minus').Next_State();

		});
	}

	/**
	 * Called when node is disconected from the DOM
	 */
	disconnectedCallback() {
		this.removeEventListener("click",() => {
			Utils.Get_Subnode(this.shadowRoot,'.schedule-details').classList.toggle('open');
		});
	}

	/**
	 * Render the line-schedule
	 * change the title name and load the stations for the schedule
	 */
	Render() {
		const header_title = Utils.Get_Subnode(this.shadowRoot,'.header-left-text');
		const header_minute = Utils.Get_Subnode(this.shadowRoot,'.header-minute');
		const details = Utils.Get_Subnode(this.shadowRoot,'.schedule-details');
		const header_left_icon = Utils.Get_Subnode(this.shadowRoot,'.header-left-icon');
		const header_info_icon = Utils.Get_Subnode(this.shadowRoot,'.header-icon');

		Utils.Empty_Node(details);
		if (!this.schedule_data.info_messages?.length)
			header_info_icon.style.display = 'none';
		header_title.textContent = this.schedule_data.label;
		header_minute.textContent = ":" + String(this.schedule_data.departure_minute).padStart(2, '0'); 
		header_left_icon.innerHTML = this.network_data.stop_patterns[this.schedule_data.stop_pattern].icon


		let reference_index = this.reference_line.stations.findIndex(stop => stop === this.reference_station);

		// Reference station not found – fallback to index 0
		if (reference_index === -1)
			reference_index = 0;

		const reference_minute = this.schedule_data.arrival_minutes[reference_index];


		const refStation_stop = {
			arrival_minute: reference_minute,
			departure_minute: this.schedule_data.departure_minutes[reference_index],
			station_ID: this.reference_line.stations[reference_index],
			reference_minute: reference_minute,
			info_message: this.reference_line.info_messages.filter( item => item.index === reference_index),
			property: null,
			parent: this.schedule_data
		};

		// Add the first station as Gray_Station if it's not the reference
		if (reference_index > 0) {
			const firstStop= {
				arrival_minute: this.schedule_data.arrival_minutes[0],
				departure_minute: this.schedule_data.departure_minutes[0],
				station_ID: this.reference_line.stations[0],
				reference_minute: reference_minute,
				info_messages: null,
				property : "gray",
				parent: this.schedule_data
			};
			details.appendChild(Line_Station.Create(firstStop, this.network_data));
			refStation_stop.property = "half-grayed";
		}

		if (reference_index > 1) {
			const blank_stop = {
				arrival_minute: null,
				departure_minute: null,
				station_ID: null,
				reference_minute: null,
				info_messages: null,
				property : "blank",
				parent: this.schedule_data
			};
			details.appendChild(Line_Station.Create(blank_stop, this.network_data));
		}

		details.appendChild(Line_Station.Create(refStation_stop, this.network_data));


		// Add visible stations from reference onward
		for (let i = reference_index + 1; i < this.reference_line.stations.length; i++) {
			const stop_object = {
				arrival_minute: this.schedule_data.arrival_minutes[i],
				departure_minute: this.schedule_data.departure_minutes[i],
				station_ID: this.reference_line.stations[i],
				reference_minute: reference_minute,
				info_messages: this.reference_line.info_messages.filter( item => item.index === i),
				property : null,
				parent: this.schedule_data
			};

			details.appendChild(Line_Station.Create(stop_object, this.network_data));
		}
	}
}

customElements.define('line-schedule', Line_Schedule);

export default Line_Schedule;