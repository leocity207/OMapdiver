import Utils from "../utils/utils.js";
import CSS_timetable_service_mission from '../../style/timetable_service_mission.css';

function Normalize_Class_Token(value) {
	return String(value)
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9_-]+/g, "-");
}

function To_Array(value) {
	if (Array.isArray(value)) return value;
	if (value == null) return [];
	return [value];
}

function Pattern_List_To_Tokens(list) {
	return To_Array(list).map(Normalize_Class_Token);
}

function Has_Any_Intersection(list_a, list_b) {
	if (!list_a || list_a.length === 0) return true; // no filter => visible
	const set_b = new Set(list_b);
	for (const item of list_a) {
		if (set_b.has(item)) return true;
	}
	return false;
}

class TimeTable_Services_Missions extends HTMLElement {

	static template = (() => {
		const template = document.createElement('template');

		const root = Utils.Create_Element_With_Class('div', 'timetable-root');

		const header = Utils.Create_Element_With_Class('div', 'timetable-header');
		const line_badge = Utils.Create_Element_With_Class('div', 'timetable-line-badge');
		const line_title = Utils.Create_Element_With_Class('div', 'timetable-line-title');
		const line_subtitle = Utils.Create_Element_With_Class('div', 'timetable-line-subtitle');
		header.append(line_badge, line_title, line_subtitle);

		const scroll = Utils.Create_Element_With_Class('div', 'timetable-scroll');

		const table = document.createElement('table');
		table.className = 'timetable-table';

		const thead = document.createElement('thead');
		const tbody = document.createElement('tbody');

		table.append(thead, tbody);
		scroll.appendChild(table);

		root.append(header, scroll);
		template.content.appendChild(root);

		return template;
	})();

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		Utils.Add_Stylesheet(this.shadowRoot, CSS_timetable_service_mission);
		Utils.Clone_Node_Into(this.shadowRoot, TimeTable_Services_Missions.template);

		this.m_data = null;

		this.m_display_state = {
			calendar_patterns: [],
			stop_patterns: [],
			display_hidden_stations: false,
			show_arrival_minutes: false,
		};
	}

	static Create() {
		const elt = document.createElement("timetable-services-missions");
		return elt;
	}

	connectedCallback() {
		// If data already exists before insertion in DOM, render it now.
		if (this.m_data) {
			this.Render();
		}
	}

	/**
	 * Update the timetable data and rebuild the GUI.
	 * @param {Object} data - Line timetable data.
	 * @param {Object|null} display_state - Optional display state update.
	 */
	Update(data, stations, display_state = null) {
		this.m_data = data ?? null;
		this.m_stations = stations ?? null;

		if (display_state !== null) {
			this.Update_Display_State(display_state);
		}

		this.Render();
		this.setAttribute("data-ready", "true");
	}

	/**
	 * Update only the display state without rebuilding the whole timetable.
	 * @param {Object} display_state
	 */
	Update_Display_State(display_state = {}) {
		if (display_state.calendar_patterns !== undefined) {
			this.m_display_state.calendar_patterns = Pattern_List_To_Tokens(display_state.calendar_patterns);
		}

		if (display_state.stop_patterns !== undefined) {
			this.m_display_state.stop_patterns = Pattern_List_To_Tokens(display_state.stop_patterns);
		}

		if (display_state.display_hidden_stations !== undefined) {
			this.m_display_state.display_hidden_stations = Boolean(display_state.display_hidden_stations);
		}

		if (display_state.show_arrival_minutes !== undefined) {
			this.m_display_state.show_arrival_minutes = Boolean(display_state.show_arrival_minutes);
		}

		this.classList.toggle("show-hidden-stations", this.m_display_state.display_hidden_stations);
		this.classList.toggle("show-arrival-minutes", this.m_display_state.show_arrival_minutes);

		this._Refresh_Visibility();
	}

	/**
	 * Build the complete table.
	 */
	Render() {
		const thead = this.shadowRoot.querySelector("thead");
		const tbody = this.shadowRoot.querySelector("tbody");
		const line_badge = this.shadowRoot.querySelector(".timetable-line-badge");
		const line_title = this.shadowRoot.querySelector(".timetable-line-title");
		const line_subtitle = this.shadowRoot.querySelector(".timetable-line-subtitle");

		thead.replaceChildren();
		tbody.replaceChildren();

		if (!this.m_data) {
			this.removeAttribute("data-ready");
			return;
		}

		const line = this.m_data;

		// Header block
		line_badge.textContent = line.label ?? line.id ?? "";
		line_badge.style.backgroundColor = line.color?.default ?? "#25158B";
		line_badge.style.color = "#fff";

		line_title.textContent = line.label ?? line.id ?? "";
		line_subtitle.textContent = line.id ?? "";

		// Table header row
		const header_row = document.createElement("tr");

		const station_header = document.createElement("th");
		station_header.className = "station-header";
		station_header.textContent = "Station";
		header_row.appendChild(station_header);

		for (const timetable of (line.timetables ?? [])) {
			const th = document.createElement("th");
			th.className = "timetable-header-cell";

			const cal_tokens = Pattern_List_To_Tokens(timetable.calendar_pattern);
			const stop_tokens = Pattern_List_To_Tokens(timetable.stop_pattern);

			for (const token of cal_tokens) th.classList.add(`calendar-${token}`);
			for (const token of stop_tokens) th.classList.add(`stop-${token}`);

			th.dataset.calendarPatterns = JSON.stringify(cal_tokens);
			th.dataset.stopPatterns = JSON.stringify(stop_tokens);

			const label = Utils.Create_Element_With_Class("div", "timetable-label");
			label.textContent = timetable.label ?? timetable.id ?? "";

			th.appendChild(label);
			header_row.appendChild(th);
		}

		thead.appendChild(header_row);

		// Body rows
		const stations = line.stations ?? [];
		const timetables = line.timetables ?? [];

		for (let station_index = 0; station_index < stations.length; station_index++) {
			const station_id = stations[station_index];

			const tr = document.createElement("tr");
			tr.className = "station-row";
			tr.dataset.stationIndex = String(station_index);
			tr.dataset.stationId = station_id;

			const station_cell = document.createElement("th");
			station_cell.className = "station-cell";
			station_cell.textContent = this.m_stations[station_id].label;
			tr.appendChild(station_cell);

			for (const timetable of timetables) {
				const td = document.createElement("td");
				td.className = "timetable-cell";

				const cal_tokens = Pattern_List_To_Tokens(timetable.calendar_pattern);
				const stop_tokens = Pattern_List_To_Tokens(timetable.stop_pattern);

				for (const token of cal_tokens) td.classList.add(`calendar-${token}`);
				for (const token of stop_tokens) td.classList.add(`stop-${token}`);

				td.dataset.calendarPatterns = JSON.stringify(cal_tokens);
				td.dataset.stopPatterns = JSON.stringify(stop_tokens);

				const arrival = timetable.arrival_minutes?.[station_index] ?? null;
				const departure = timetable.departure_minutes?.[station_index] ?? null;

				const has_arrival = arrival !== null && arrival !== undefined && arrival !== "";
				const has_departure = departure !== null && departure !== undefined && departure !== "";

				if (!has_arrival && !has_departure) {
					td.classList.add("is-empty");
				} else {
					td.dataset.hasContent = "true";

					const content = Utils.Create_Element_With_Class("div", "time-content");

					// Arrival line: gray and above only if there is a departure as well.
					if (has_arrival && has_departure) {
						const arrival_elt = Utils.Create_Element_With_Class("span", "time-arrival");
						arrival_elt.textContent = Utils.Format_Minute(arrival);
						content.appendChild(arrival_elt);
					}

					const main_elt = Utils.Create_Element_With_Class("span", "time-main");

					// Main value:
					// - departure if present
					// - otherwise arrival (typically terminal stop / end of line)
					if (has_departure) {
						main_elt.textContent = Utils.Format_Minute(departure);
					} else if (has_arrival) {
						main_elt.textContent = Utils.Format_Minute(arrival);
						main_elt.classList.add("time-main-terminal");
					} else {
						main_elt.textContent = "";
					}

					content.appendChild(main_elt);
					td.appendChild(content);
				}

				tr.appendChild(td);
			}

			tbody.appendChild(tr);
		}

		this._Refresh_Visibility();
	}

	/**
	 * Apply current filter state to headers, columns and station rows.
	 */
	_Refresh_Visibility() {
		if (!this.m_data) return;

		const root = this.shadowRoot.querySelector(".timetable-root");
		const thead = this.shadowRoot.querySelector("thead");
		const tbody = this.shadowRoot.querySelector("tbody");

		const active_calendar = this.m_display_state.calendar_patterns;
		const active_stop = this.m_display_state.stop_patterns;

		// 1) Column visibility: header + all cells in the same timetable column.
		const header_cells = thead.querySelectorAll("th.timetable-header-cell");
		header_cells.forEach((th, column_index) => {
			const cal_tokens = JSON.parse(th.dataset.calendarPatterns || "[]");
			const stop_tokens = JSON.parse(th.dataset.stopPatterns || "[]");

			const visible_by_calendar = Has_Any_Intersection(active_calendar, cal_tokens);
			const visible_by_stop = Has_Any_Intersection(active_stop, stop_tokens);

			const visible = visible_by_calendar && visible_by_stop;

			th.classList.toggle("is-hidden-column", !visible);

			const body_rows = tbody.querySelectorAll("tr.station-row");
			for (const row of body_rows) {
				const cells = row.querySelectorAll("td.timetable-cell");
				const cell = cells[column_index];
				if (!cell) continue;

				cell.classList.toggle("is-hidden-column", !visible);
				cell.dataset.visibleColumn = visible ? "true" : "false";
			}
		});

		// 2) Station row visibility:
		// Hide rows by default if none of their visible timetable cells contain content.
		const rows = tbody.querySelectorAll("tr.station-row");
		rows.forEach((row) => {
			const cells = row.querySelectorAll("td.timetable-cell");
			let has_visible_content = false;

			for (const cell of cells) {
				const is_column_visible = cell.dataset.visibleColumn !== "false";
				const has_content = cell.dataset.hasContent === "true";

				if (is_column_visible && has_content) {
					has_visible_content = true;
					break;
				}
			}

			const should_hide = !this.m_display_state.display_hidden_stations && !has_visible_content;
			row.classList.toggle("is-hidden-row", should_hide);
		});

		// Optional: hide the whole table if there is no data visible.
		const any_visible_row = [...rows].some(row => !row.classList.contains("is-hidden-row"));
		root.classList.toggle("has-visible-rows", any_visible_row);
	}
}

customElements.define("timetable-services-missions", TimeTable_Services_Missions);

export default TimeTable_Services_Missions;