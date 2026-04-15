import Utils from '../utils/utils.ts'
import CSS_line_station from '../../style/line-station.css';
import { InfoMessage, Network, Pattern, Station } from '../utils/networktype.ts';

const SVG_NS = 'http://www.w3.org/2000/svg'

export interface Line_Station_Data {
	arrival_minute: number | null,
	departure_minute: number | null,
	station_ID: string | null,
	reference_minute: number | null,
	info_messages: InfoMessage[] | null,
	property : string | null,
	parent: Pattern
}

/**
 * The **Ligne station** is an object used to display station information inside a schedule.
 *
 * Structure
 * ---------
 * .. code-block:: html
 *
 * 	<div class='station-row'>
 * 		<div class='times-origin'>
 * 			<span class='origin-time'/>
 * 		</div>
 * 		<div class='times-cadence'>
 * 			<span class='cadence-arrival'/>
 * 			<span class='cadence-departure'/>
 * 		</div>
 * 		<div class='station-icon-wrap'>
 * 			<svg>...</svg>
 * 		</div>
 * 		<div class='station-name'/>
 * 	</div>
 */
class Line_Station extends HTMLElement {

	/**
	 * station data
	 */
	station_data: Line_Station_Data | null = null;

	/**
	 * data bout the whole network
	 */
	network_data: Network | null  = null;

	/**
	 * start path with rounded corner at the top
	 */
	static start_icon_path = 'M0,20 A5,5 0 0 1 10,20 V40 H0 Z';

	/**
	 * middle path that is basicaly a rectangle
	 */
	static middle_icon_path = 'M0,0 H10 V40 H0 Z';

	/**
	 * end path with rounded corner at the bottom
	 */
	static end_icon_path = 'M0,0 H10 V20 A5,5 0 0 1 0,20 Z';

	/**
	 * end path with small points
	 */
	static blank_station_path = ' M0,0 H10 V5.714 H0 Z M0,11.428 H10 V17.142 H0 Z M0,22.856 H10 V28.57 H0 Z M0,34.284 H10 V40 H0 Z';

	/**
	 * Builds the 'times-origin' block
	 */
	static _Build_Times_Origin(): HTMLElement {
		const div = Utils.Create_Element_With_Class('div', 'times-origin');
		const span = Utils.Create_Element_With_Class('span', 'origin-time');
		div.appendChild(span);
		return div;
	}

	/**
	 * Builds the 'times-cadence' block
	 */
	static _Build_Times_Cadence(): HTMLElement {
		const div = Utils.Create_Element_With_Class('div', 'times-cadence');
		const arr = Utils.Create_Element_With_Class('span', 'cadence-arrival');
		const dep = Utils.Create_Element_With_Class('span', 'cadence-departure');
		div.append(arr, dep);
		return div;
	}

	/**
	 * Builds the 'station-icon-wrap' block with SVG + gradient
	 */
	static _Build_Icon_Wrap(): HTMLElement {
		const wrap = Utils.Create_Element_With_Class('div', 'station-icon-wrap');

		const svg = document.createElementNS(SVG_NS, 'svg');
		svg.setAttribute('class', 'station-icon-svg');
		svg.setAttribute('viewBox', '0 0 10 40');
		svg.setAttribute('preserveAspectRatio', 'none');

		const path = document.createElementNS(SVG_NS, 'path');
		const circle = document.createElementNS(SVG_NS, 'circle');
		circle.setAttribute('cx', '5');
		circle.setAttribute('cy', '20');
		circle.setAttribute('r', '4');

		svg.append(path, circle);
		svg.appendChild(Line_Station._Build_SVG_Gradient());

		wrap.appendChild(svg);
		return wrap;
	}

	/**
	 * Base template for Line Station
	 */
	static base_template: HTMLTemplateElement =(() =>  {
		const template = document.createElement('template');
		const container = Utils.Create_Element_With_Class('div', 'station-row');

		const times_origin = Line_Station._Build_Times_Origin();
		const times_cadence = Line_Station._Build_Times_Cadence();
		const icon_wrap = Line_Station._Build_Icon_Wrap();
		const station_name = Utils.Create_Element_With_Class('span', 'station-name');

		container.append(times_origin, times_cadence, icon_wrap, station_name);
		template.content.append(container);

		return template;
	})();

	/**
	 * Builds <defs> with the vertical gradient
	 */
	static _Build_SVG_Gradient(): SVGDefsElement {
		const defs = document.createElementNS(SVG_NS, 'defs');
		const gradient = document.createElementNS(SVG_NS, 'linearGradient');

		gradient.setAttribute('id', 'station-vertical-gradient');
		gradient.setAttribute('x1', '0%');
		gradient.setAttribute('y1', '0%');
		gradient.setAttribute('x2', '0%');
		gradient.setAttribute('y2', '100%');

		const stop1 = document.createElementNS(SVG_NS, 'stop');
		stop1.setAttribute('offset', '50%');
		stop1.setAttribute('stop-color', '#888888');

		const stop2 = document.createElementNS(SVG_NS, 'stop');
		stop2.setAttribute('class', 'station-gradient-color');
		stop2.setAttribute('offset', '50%');

		gradient.append(stop1, stop2);
		defs.appendChild(gradient);

		return defs;
	}

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		Utils.Add_Stylesheet(this.shadowRoot!, CSS_line_station);
		Utils.Clone_Node_Into(this.shadowRoot!, Line_Station.base_template);
	}

	/**
	 * Factory to create this component
	 * @param {Object} station_data - Data specific to this station in the schedule
	 * @param {Object} stations_data - Master dataset of all stations
	 * @returns {Line_Station}
	 */
	static Create(station_data: Line_Station_Data, network_data: Network): Line_Station {
		const object = document.createElement('line-station') as Line_Station;
		object.station_data = station_data;
		object.network_data = network_data;
		return object;
	}

	/**
	 * Called when the Line_Station is connected to the DOM
	 */
	connectedCallback(): void {
		this.Render();
	}

	/**
	 * Render the visual appearance and timings of this station
	 */
	Render(): void {
		const path = Utils.Get_Subnode(this.shadowRoot!, 'path') as SVGPathElement;
		const station_name = Utils.Get_Subnode(this.shadowRoot!, '.station-name');
		const origin_time = Utils.Get_Subnode(this.shadowRoot!, '.origin-time') as HTMLElement;
		const cadence_arrival = Utils.Get_Subnode(this.shadowRoot!, '.cadence-arrival') as HTMLElement;
		const cadence_departure = Utils.Get_Subnode(this.shadowRoot!, '.cadence-departure') as HTMLElement;

		const color = this.station_data!.parent?.parent.color.default;

		this._Render_Icon(path, color);
		this._Render_Path_Shape(path);
		this._Render_Times(origin_time, cadence_arrival, cadence_departure);
		if(this.station_data!.station_ID)
			station_name.textContent = this.network_data!.stations[this.station_data!.station_ID].label;
	}

	/**
	 * Set the path's fill based on whether it's grayed
	 * @param {SVGPathElement} path
	 * @param {string} color
	 */
	_Render_Icon(path: SVGPathElement, color: string): void {
		if (this.station_data!.property === 'gray')
			path.setAttribute('fill', '#888888');
		else if(this.station_data!.property === 'blank') {
			const circle = Utils.Get_Subnode(this.shadowRoot!, 'circle');
			circle.setAttribute('display', 'none');
			path.setAttribute('fill', '#888888');
		}
		else if (this.station_data!.property === 'half-grayed' ) {
			const gradient_color = Utils.Get_Subnode(this.shadowRoot!, '.station-gradient-color');
			gradient_color.setAttribute('stop-color', color);
			path.setAttribute('fill', 'url(#station-vertical-gradient)');
		}
		else
			path.setAttribute('fill', color);
	}

	/**
	 * Choose the shape of the path depending on arrival/departure state
	 * @param {SVGPathElement} path
	 */
	_Render_Path_Shape(path: SVGPathElement): void {
		const { arrival_minute, departure_minute } = this.station_data!;
		const has_arrival = arrival_minute != null;
		const has_departure = departure_minute != null;

		if(this.station_data!.property === "blank")
			path.setAttribute('d', Line_Station.blank_station_path);
		else if (!has_arrival && has_departure)
			path.setAttribute('d', Line_Station.start_icon_path);
		else if (!has_departure && has_arrival)
			path.setAttribute('d', Line_Station.end_icon_path);
		else
			path.setAttribute('d', Line_Station.middle_icon_path);
	}

	/**
	 * Render arrival, departure and relative origin time
	 * @param {HTMLElement} origin_time
	 * @param {HTMLElement} cadence_arrival
	 * @param {HTMLElement} cadence_departure
	 */
	_Render_Times(origin_time: HTMLElement, cadence_arrival: HTMLElement, cadence_departure: HTMLElement): void {
		if(this.station_data!.property === 'blank') return;
		let { arrival_minute, departure_minute, reference_minute} = this.station_data!;
		if(reference_minute === null)
			reference_minute = 0;
		const base = this.station_data!.parent.departure_minute;


		origin_time.textContent = arrival_minute ? Utils.Format_Minute(arrival_minute - reference_minute) : null;

		const hours_to_remove = Math.floor((base + reference_minute) / 60)*60;
		if (arrival_minute != null) {
			cadence_arrival.textContent = Utils.Format_Minute(base + arrival_minute - hours_to_remove);
			cadence_arrival.style.display = 'block';
		}
		else
			cadence_arrival.style.display = 'none';

		if (departure_minute != null && reference_minute <= departure_minute) {
			cadence_departure.textContent = Utils.Format_Minute(base + departure_minute - hours_to_remove);
			cadence_departure.style.display = 'block';
		}
		else
			cadence_departure.style.display = 'none';
	}
}

customElements.define('line-station', Line_Station);

export default Line_Station;
