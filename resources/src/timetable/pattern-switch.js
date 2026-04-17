import Observable from "./utils/observable.js";
import MixHTMLElementWith from "./src/utils/MixHTMLElement.js";
import Utils from "./src/utils/utils.js";

/**
 * PatternSwitcher
 * ----------------
 * Compose plusieurs <switch-event> (déjà fourni dans ton code) pour
 * créer un sélecteur multi-pattern (weekday/weekend/holiday/night...).
 *
 * Emitted event: name "pattern-change" with payload Array<string> (selected patterns)
 */
class PatternSwitcher extends MixHTMLElementWith(Observable) {
	// m_patterns: array of { key: string, label: string, default: boolean }
	m_patterns
	m_selected

	static template = (() => {
		const t = document.createElement("template");
		const container = Utils.Create_Element_With_Class("div", "pattern-switcher");
		const label = Utils.Create_Element_With_Class("div", "ps-label");
		label.textContent = "Filtrer :";
		const inner = Utils.Create_Element_With_Class("div", "ps-items");
		container.append(label, inner);
		t.content.append(container);
		return t;
	})();

	constructor() {
		super();
		this.m_patterns = [];
		this.m_selected = new Set();
		this.attachShadow({ mode: "open" });
		Utils.Add_Stylesheet(this.shadowRoot, "style/pattern-switcher.css");
		Utils.Clone_Node_Into(this.shadowRoot, PatternSwitcher.template);
		this._Handle_Switch = this._Handle_Switch.bind(this);
	}

	/**
	 * Create a PatternSwitcher with an initial pattern set
	 * patterns = [{ key: "weekday", label: "Semaine", default: true}, ...]
	 */
	static Create(name, patterns = []) {
		const elt = document.createElement("pattern-switcher");
		elt.Observable_Init(name);
		elt.m_patterns = patterns;
		// populate defaults
		patterns.forEach(p => { if (p.default) elt.m_selected.add(p.key); });
		return elt;
	}

	connectedCallback() {
		this.Observable_connectedCallback();
		this.Render();
	}

	Render() {
		const container = Utils.Get_Subnode(this.shadowRoot, ".ps-items");
		container.innerHTML = "";
		this.m_patterns.forEach(p => {
			const sw = document.createElement("switch-event"); // existing custom element
			sw.Observable_Init && sw.Observable_Init(`ps-${p.key}`); // defensive
			// Toggleable_Init exists on original Switch_Event - we assume it is defined
			if (typeof sw.Toggleable_Init === "function") {
				sw.Toggleable_Init([false, true], !!p.default);
			}
			sw.text = p.label ?? p.key;
			// attach listener
			sw.addEventListener("click", (ev) => this._Handle_Switch(ev, p.key, sw));
			// store state visually
			if (p.default) {
				// simulate initial checked rendering if underlying switch supports DOM access
				const input = sw.shadowRoot?.querySelector("input[type='checkbox']");
				if (input) input.checked = true;
			}
			container.appendChild(sw);
		});
		// emit initial state
		this.Emit(Array.from(this.m_selected));
	}

	_Handle_Switch(event, key, swElement) {
		// Read state from element if it supports Get_State, else toggle based on dataset
		let checked = false;
		if (typeof swElement.Get_State === "function") {
			checked = swElement.Get_State();
		} else {
			const input = swElement.shadowRoot?.querySelector("input[type='checkbox']");
			checked = !!(input && input.checked);
		}
		if (checked) this.m_selected.add(key);
		else this.m_selected.delete(key);

		this.Emit(Array.from(this.m_selected)); // payload: array of selected patterns
	}
}

customElements.define("pattern-switcher", PatternSwitcher);

/**
 * TimetableCell factory - returns a <td> element with dataset attributes
 * - stationId
 * - trainId
 * - departureTime / arrivalTime (strings "HH:MM" or null)
 * - note (string or null)
 */
class TimetableCell {
	static Create(stationId, trainId, departureTime = null, arrivalTime = null, note = null) {
		const td = document.createElement("td");
		td.classList.add("timetable-cell");
		td.dataset.stationId = stationId;
		td.dataset.trainId = trainId;
		if (departureTime) td.dataset.departureTime = departureTime;
		if (arrivalTime) td.dataset.arrivalTime = arrivalTime;
		if (note) td.dataset.note = note;
		// Content will be rendered by TimetableTable according to current mode (dep/arr/both)
		return td;
	}
}

/**
 * TimetableTable
 * --------------
 * Usage:
 *   const tt = document.createElement("timetable-table");
 *   tt.Observable_Init("tt-101");
 *   tt.Load_Data(jsonObject);
 *
 * API methods exposed:
 *   - Load_Data(json)
 *   - FilterByPattern(arrayOfPatterns)
 *   - RemoveColumn(trainId) / RestoreColumn(trainId)
 *   - RemoveRow(stationId) / RestoreRow(stationId)
 *   - ToggleDisplayMode(mode) where mode in {'departure','arrival','both'}
 */
class TimetableTable extends MixHTMLElementWith(Observable) {
	// m_ fields
	m_data
	m_displayedTrains
	m_displayedStations
	m_mode // 'departure'|'arrival'|'both'

	static template = (() => {
		const t = document.createElement("template");

		const root = Utils.Create_Element_With_Class("div", "timetable-root");

		// header area: title + validity
		const header = Utils.Create_Element_With_Class("div", "tt-header");
		const title = Utils.Create_Element_With_Class("div", "tt-title");
		const validity = Utils.Create_Element_With_Class("div", "tt-validity");
		header.append(title, validity);

		// controls area: pattern switcher placeholder + info/toggle buttons
		const controls = Utils.Create_Element_With_Class("div", "tt-controls");
		const patternPlaceholder = Utils.Create_Element_With_Class("div", "tt-pattern-placeholder");
		const infoToggle = Utils.Create_Element_With_Class("div", "tt-controls-right");
		// a departure/arrival toggle dropdown placeholder
		const modeSelect = Utils.Create_Element_With_Class("select", "tt-mode-select");
		const optDep = document.createElement("option"); optDep.value = "departure"; optDep.textContent = "Départ";
		const optArr = document.createElement("option"); optArr.value = "arrival"; optArr.textContent = "Arrivée";
		const optBoth = document.createElement("option"); optBoth.value = "both"; optBoth.textContent = "Les deux";
		modeSelect.append(optDep, optArr, optBoth);
		infoToggle.append(modeSelect);
		controls.append(patternPlaceholder, infoToggle);

		// table container: left sticky column (stations) + right table (trains)
		const tableWrap = Utils.Create_Element_With_Class("div", "tt-table-wrap");
		const leftCol = Utils.Create_Element_With_Class("table", "tt-left-col"); // station names
		leftCol.setAttribute("aria-hidden", "false");
		const rightCol = Utils.Create_Element_With_Class("table", "tt-right-col"); // header + body
		rightCol.setAttribute("aria-hidden", "false");
		tableWrap.append(leftCol, rightCol);

		root.append(header, controls, tableWrap);
		t.content.append(root);
		return t;
	})();

	constructor() {
		super();
		this.m_data = null;
		this.m_displayedTrains = [];
		this.m_displayedStations = [];
		this.m_mode = "departure";
		this.attachShadow({ mode: "open" });
		Utils.Add_Stylesheet(this.shadowRoot, "style/timetable.css");
		Utils.Clone_Node_Into(this.shadowRoot, TimetableTable.template);

		// bindings
		this._OnPatternChange = this._OnPatternChange.bind(this);
		this._OnModeChange = this._OnModeChange.bind(this);
	}

	connectedCallback() {
		this.Observable_connectedCallback();
		// wire mode select
		const modeSelect = Utils.Get_Subnode(this.shadowRoot, ".tt-mode-select");
		modeSelect.addEventListener("change", this._OnModeChange);
	}

	disconnectedCallback() {
		const modeSelect = Utils.Get_Subnode(this.shadowRoot, ".tt-mode-select");
		modeSelect.removeEventListener("change", this._OnModeChange);
	}

	/**
	 * Load the timetable JSON (structure like the one you described)
	 */
	Load_Data(json) {
		this.m_data = json;
		// initialize displayed arrays to all items
		this.m_displayedTrains = (json.trains || []).map(t => t.id);
		this.m_displayedStations = (json.stations || []).map(s => s.id);

		this.Render();
	}

	/**
	 * Render the whole component based on this.m_data and current filters/mode
	 */
	Render() {
		if (!this.m_data) return;
		// header
		const titleNode = Utils.Get_Subnode(this.shadowRoot, ".tt-title");
		const validityNode = Utils.Get_Subnode(this.shadowRoot, ".tt-validity");
		titleNode.textContent = `${this.m_data.meta?.title ?? ""} — ${this.m_data.meta?.routeId ?? ""}`;
		const vf = this.m_data.meta?.validFrom ?? "";
		const vt = this.m_data.meta?.validTo ?? "";
		validityNode.textContent = vf && vt ? `Valide du ${vf} au ${vt}` : "";

		// inject PatternSwitcher
		const patternPlaceholder = Utils.Get_Subnode(this.shadowRoot, ".tt-pattern-placeholder");
		patternPlaceholder.innerHTML = "";
		// derive available patterns from trains
		const patternsMap = new Map();
		(this.m_data.trains || []).forEach(t => {
			(t.pattern || []).forEach(p => { if (!patternsMap.has(p)) patternsMap.set(p, { key: p, label: this._LabelForPattern(p), default: p === "weekday" }); });
		});
		const patterns = Array.from(patternsMap.values());
		const ps = PatternSwitcher.Create("ps-main", patterns);
		ps.addEventListener("pattern-change", (ev) => { /* in case PatternSwitcher emits native event */ });
		// PatternSwitcher uses Observable.Emit internally — listen to it via addition of event on the element's Observable API
		if (typeof ps.Observable_on === "function") {
			ps.Observable_on((payload) => this._OnPatternChange({ detail: payload }));
		}
		// fallback: listen to custom event
		ps.addEventListener("pattern-change", (e) => this._OnPatternChange({ detail: e.detail }));
		patternPlaceholder.appendChild(ps);

		// build tables
		this._BuildTables();
		// initial mode render
		this.ToggleDisplayMode(this.m_mode);
	}

	_LabelForPattern(patternKey) {
		// small helper to map keys to labels (you can expand)
		const map = {
			weekday: "Semaine",
			weekend: "Week-end",
			holiday: "Jours fériés",
			night: "Nuit"
		};
		return map[patternKey] ?? patternKey;
	}

	_BuildTables() {
		const left = Utils.Get_Subnode(this.shadowRoot, ".tt-left-col");
		const right = Utils.Get_Subnode(this.shadowRoot, ".tt-right-col");
		left.innerHTML = "";
		right.innerHTML = "";

		// LEFT: station names as single-column table (thead optional)
		const leftTHead = document.createElement("thead");
		const leftHeadRow = document.createElement("tr");
		const headCell = document.createElement("th");
		headCell.textContent = "Stations";
		headCell.classList.add("station-head");
		leftHeadRow.appendChild(headCell);
		leftTHead.appendChild(leftHeadRow);
		left.appendChild(leftTHead);

		const leftBody = document.createElement("tbody");
		(this.m_data.stations || []).forEach(st => {
			const tr = document.createElement("tr");
			tr.dataset.stationId = st.id;
			tr.classList.add("station-row");
			const td = document.createElement("td");
			td.classList.add("station-name");
			td.textContent = st.name;
			tr.appendChild(td);
			leftBody.appendChild(tr);
		});
		left.appendChild(leftBody);

		// RIGHT: header row with trains
		const rightTHead = document.createElement("thead");
		const rightHeadRow = document.createElement("tr");
		// empty top-left cell to line up with left column header
		const emptyTH = document.createElement("th");
		emptyTH.classList.add("empty-head");
		rightHeadRow.appendChild(emptyTH);

		(this.m_data.trains || []).forEach(trn => {
			const th = document.createElement("th");
			th.classList.add("train-head");
			th.dataset.trainId = trn.id;
			th.textContent = trn.label ?? trn.id;
			// attach note icon if notes present
			if (trn.notes) {
				const info = document.createElement("button");
				info.classList.add("train-info");
				info.setAttribute("aria-label", `Info train ${trn.label}`);
				info.textContent = "i";
				info.title = trn.notes;
				th.appendChild(info);
			}
			rightHeadRow.appendChild(th);
		});
		rightTHead.appendChild(rightHeadRow);
		right.appendChild(rightTHead);

		// RIGHT: body with times
		const rightBody = document.createElement("tbody");
		(this.m_data.stations || []).forEach(st => {
			const tr = document.createElement("tr");
			tr.dataset.stationId = st.id;
			tr.classList.add("times-row");
			// row header (station repeated visually in right table for alignment, can be hidden)
			const rowHeader = document.createElement("th");
			rowHeader.classList.add("station-row-head");
			rowHeader.textContent = st.name;
			tr.appendChild(rowHeader);

			// for each train, find schedule entry for this station
			(this.m_data.trains || []).forEach(trn => {
				const scheduleEntry = (trn.schedule || []).find(s => s.id === st.id) || {};
				const arrival = scheduleEntry["arrival-time"] ?? null;
				const departure = scheduleEntry["departure-time"] ?? null;
				const note = scheduleEntry.note ?? null;
				const td = TimetableCell.Create(st.id, trn.id, departure, arrival, note);
				// populate textual content depending on current mode (will be updated by ToggleDisplayMode)
				tr.appendChild(td);
			});

			rightBody.appendChild(tr);
		});
		right.appendChild(rightBody);

		// remember displayed lists are all by default
		this.m_displayedTrains = (this.m_data.trains || []).map(t => t.id);
		this.m_displayedStations = (this.m_data.stations || []).map(s => s.id);
	}

	/**
	 * Handle pattern changes emitted by PatternSwitcher
	 * payload: array of patterns to keep (selected)
	 */
	_OnPatternChange(event) {
		const selected = event?.detail ?? event;
		if (!Array.isArray(selected)) return;
		this.FilterByPattern(selected);
	}

	/**
	 * Filter the visible columns (trains) using patterns.
	 * patterns: array of strings (e.g. ["weekday","friday"])
	 */
	FilterByPattern(patterns = []) {
		if (!this.m_data) return;
		const trains = this.m_data.trains || [];
		// compute new displayed trains
		const newDisplayed = trains
			.filter(t => {
				// if train has no pattern, keep it
				if (!t.pattern || t.pattern.length === 0) return true;
				// keep train if any of its patterns is in the selected patterns
				return t.pattern.some(p => patterns.includes(p));
			})
			.map(t => t.id);

		// update DOM: show/hide train header cells and cells
		const allTrainHeads = this.shadowRoot.querySelectorAll(".train-head");
		allTrainHeads.forEach(th => {
			const id = th.dataset.trainId;
			if (newDisplayed.includes(id)) th.style.display = "";
			else th.style.display = "none";
		});
		const allCells = this.shadowRoot.querySelectorAll(".timetable-cell");
		allCells.forEach(cell => {
			const id = cell.dataset.trainId;
			if (newDisplayed.includes(id)) cell.style.display = "";
			else cell.style.display = "none";
		});

		this.m_displayedTrains = newDisplayed;
		// emit an update event
		this.Emit({ type: "filter", trains: newDisplayed });
	}

	/**
	 * Remove (hide) a train column
	 */
	RemoveColumn(trainId) {
		const heads = this.shadowRoot.querySelectorAll(`.train-head[data-train-id='${trainId}']`);
		const cells = this.shadowRoot.querySelectorAll(`.timetable-cell[data-train-id='${trainId}']`);
		heads.forEach(h => h.style.display = "none");
		cells.forEach(c => c.style.display = "none");
		this.m_displayedTrains = this.m_displayedTrains.filter(t => t !== trainId);
	}

	RestoreColumn(trainId) {
		const heads = this.shadowRoot.querySelectorAll(`.train-head[data-train-id='${trainId}']`);
		const cells = this.shadowRoot.querySelectorAll(`.timetable-cell[data-train-id='${trainId}']`);
		heads.forEach(h => h.style.display = "");
		cells.forEach(c => c.style.display = "");
		if (!this.m_displayedTrains.includes(trainId)) this.m_displayedTrains.push(trainId);
	}

	RemoveRow(stationId) {
		const leftRow = this.shadowRoot.querySelector(`.station-row[data-station-id='${stationId}']`);
		const rightRow = this.shadowRoot.querySelector(`.times-row[data-station-id='${stationId}']`);
		if (leftRow) leftRow.style.display = "none";
		if (rightRow) rightRow.style.display = "none";
		this.m_displayedStations = this.m_displayedStations.filter(s => s !== stationId);
	}

	RestoreRow(stationId) {
		const leftRow = this.shadowRoot.querySelector(`.station-row[data-station-id='${stationId}']`);
		const rightRow = this.shadowRoot.querySelector(`.times-row[data-station-id='${stationId}']`);
		if (leftRow) leftRow.style.display = "";
		if (rightRow) rightRow.style.display = "";
		if (!this.m_displayedStations.includes(stationId)) this.m_displayedStations.push(stationId);
	}

	/**
	 * Toggle display mode for cells
	 * mode: 'departure' | 'arrival' | 'both'
	 */
	ToggleDisplayMode(mode = "departure") {
		this.m_mode = mode;
		const cells = this.shadowRoot.querySelectorAll(".timetable-cell");
		cells.forEach(td => {
			const dep = td.dataset.departureTime ?? null;
			const arr = td.dataset.arrivalTime ?? null;
			const note = td.dataset.note ?? null;
			td.innerHTML = "";
			if (mode === "departure") {
				td.textContent = dep ?? (arr ?? "");
			} else if (mode === "arrival") {
				td.textContent = arr ?? (dep ?? "");
			} else { // both
				// show arrival on top small, departure below
				const wrap = document.createElement("div");
				wrap.classList.add("both-wrap");
				const top = document.createElement("div");
				top.classList.add("both-arr");
				top.textContent = arr ?? "";
				const bottom = document.createElement("div");
				bottom.classList.add("both-dep");
				bottom.textContent = dep ?? "";
				wrap.append(top, bottom);
				td.appendChild(wrap);
			}
			// add note indicator if present
			if (note) {
				const nb = document.createElement("span");
				nb.classList.add("cell-note");
				nb.setAttribute("title", note);
				nb.textContent = "•";
				td.appendChild(nb);
			}
		});
		// update selector UI if exists
		const modeSelect = Utils.Get_Subnode(this.shadowRoot, ".tt-mode-select");
		if (modeSelect && modeSelect.value !== mode) modeSelect.value = mode;
		this.Emit({ type: "mode", mode: this.m_mode });
	}

	_OnModeChange(ev) {
		const mode = ev.target?.value ?? "departure";
		this.ToggleDisplayMode(mode);
	}
}

customElements.define("timetable-table", TimetableTable);

export default TimetableTable;
