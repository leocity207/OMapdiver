import type { Line, Station } from "$lib/types/network";
import type { Map_Config_Type } from "$lib/types/map_config";
import type { Network_Config_Type } from "$lib/types/network_config";
import { String_Error } from "$lib/utils/constant";
import SVG_Map from "./svg_map";

/**
 * Adds network-specific selection, highlighting, and color handling to the SVG map.
 */
class Network_Map extends SVG_Map {
	network_config: Network_Config_Type;
	lines: Record<string, Line> = {};
	stations: Record<string, Station> = {};
	selected_color = "default";
	highlighted_line_codes: string[] | null = null;

	private original_transforms = new WeakMap<SVGElement, string | null>();

	constructor(
		client_type: string,
		filename: string,
		map_config: Map_Config_Type,
		network_config: Network_Config_Type
	) {
		super(client_type, filename, map_config);
		this.network_config = network_config;
	}

	async Setup_Mouse_Handlers_With_Data(
		lines: Record<string, Line>,
		stations: Record<string, Station>
	): Promise<void> {
		this.lines = lines;
		this.stations = stations;
		this.highlighted_line_codes = Object.keys(lines);
		await super.Setup_Mouse_Handlers();

		this.Add_SVG_Event_Listener("click", this._Handle_Click);
		this.Add_SVG_Event_Listener("mouseover", this._Handle_Mouse_Over);
		this.Add_SVG_Event_Listener("mouseout", this._Handle_Mouse_Out);

		for (const obj of this.Find_Map_Objs_By_Id(this.network_config.TRACK_PREFIX_ID))
			obj.classList.add("leaflet-map-selectable");
		for (const obj of this.Find_Map_Objs_By_Id(this.network_config.LINE_LABEL_PREFIX_ID))
			obj.classList.add("leaflet-map-selectable");
		for (const obj of this.Find_Map_Objs_By_Id(this.network_config.STATION_PREFIX_ID))
			obj.classList.add("leaflet-map-selectable");
		for (const obj of this.Find_Map_Objs_By_Id(this.network_config.STATION_LABEL_PREFIX_ID))
			obj.classList.add("leaflet-map-selectable");
	}

	Change_Color = (color: string): void => {
		if (!this.highlighted_line_codes) throw Error(String_Error.NULL_HIGHLIGHTED_LINE_CODES);
		this.selected_color = color;
		this.Highlight_Lines(this.highlighted_line_codes, false);
	};

	Highlight_Lines = (line_codes: string[], zoom_to_line = line_codes.length === 1): void => {
		this.highlighted_line_codes = line_codes;
		const line_colors = new Map<string, string>();
		for (const code of line_codes) {
			const line = this._Find_Line_Data_By_Id(code);
			const color = line?.color[this.selected_color];
			if (!color)
				throw new Error(`Color "${this.selected_color}" is missing for line "${code}".`);
			line_colors.set(code, color);
		}

		const tracks = this.Find_Map_Objs_By_Id(this.network_config.TRACK_PREFIX_ID);
		for (const track of tracks) {
			const line_code = this._Find_Code_For_Object(
				track.id,
				this.network_config.TRACK_PREFIX_ID,
				this.lines
			);
			const color = line_code ? line_colors.get(line_code) : undefined;
			this._Change_Object_Color(
				track,
				color ?? this.network_config.DISABLE_ELEMENT_COLOR,
				"stroke"
			);
		}

		const labels = this.Find_Map_Objs_By_Id(this.network_config.LINE_LABEL_PREFIX_ID);
		for (const label of labels) {
			const line_code = this._Find_Code_For_Object(
				label.id,
				this.network_config.LINE_LABEL_PREFIX_ID,
				this.lines
			);
			const color = line_code ? line_colors.get(line_code) : undefined;
			this._Change_Object_Color(
				label,
				color ?? this.network_config.DISABLE_ELEMENT_COLOR,
				"fill"
			);
			this._Change_Object_Color(
				label,
				color ?? this.network_config.DISABLE_ELEMENT_COLOR,
				"stroke"
			);
		}

		if (zoom_to_line && line_codes.length === 1) this.Zoom_To_Line(line_codes[0]);
	};

	Reset_Line_Highlight = (): void => {
		this.Highlight_Lines(Object.keys(this.lines), false);
	};

	Highlight_All_Lines_At_Station = (station_code: string): void => {
		const station = this._Find_Station_Data_By_Id(station_code);
		if (!station) throw new Error(`Station was not found inside the list: ${station_code}`);
		this.Highlight_Lines(station.lines, false);
	};

	Zoom_Highlighted_Line = (line_code: string): void => {
		this.Zoom_To_Line(line_code);
	};

	Zoom_Highlighted_Stations = (
		from_station_code: string,
		to_station_code: string | null = null
	): void => {
		const objects = [
			...this.Find_Map_Objs_By_Id(`highlight_pos_${from_station_code}`, true),
			...(to_station_code
				? this.Find_Map_Objs_By_Id(`highlight_pos_${to_station_code}`, true)
				: []),
		];
		this.Zoom_To_Objects(objects, this.REMToPX(24));
	};

	Zoom_Highlighted_Tracks = (station_codes: string[]): void => {
		const objects = station_codes.flatMap((station_code) =>
			this.Find_Map_Objs_By_Id(`highlight_pos_${station_code}`, true)
		);
		this.Zoom_To_Objects(objects, this.REMToPX(24));
	};

	Zoom_Not_Visible_Station = (station_code: string): void => {
		const objects = this.Find_Map_Objs_By_Id(`highlight_pos_${station_code}`, true);
		this.Zoom_To_Objects(objects, this.REMToPX(24));
	};

	Highlight_Station = (station_code: string, station_type: string): void => {
		const station = this.Find_Map_Objs_By_Id(`highlight_pos_${station_code}`, true)[0];
		const marker = this.Find_Map_Objs_By_Id(
			station_type === "from" ? "highlight_origin" : "highlight_destination",
			true
		)[0];
		if (!station || !marker) return;
		if (!this.original_transforms.has(marker))
			this.original_transforms.set(marker, marker.getAttribute("transform"));
		const original_transform = this.original_transforms.get(marker);
		if (original_transform) marker.setAttribute("transform", original_transform);
		else marker.removeAttribute("transform");
		const station_center = this.Get_Object_Center(station);
		const marker_center = this.Get_Object_Center(marker);
		if (!station_center || !marker_center) return;
		const dx = station_center.x - marker_center.x;
		const dy = station_center.y - marker_center.y;
		marker.setAttribute(
			"transform",
			`translate(${dx} ${dy})${original_transform ? ` ${original_transform}` : ""}`
		);
		marker.setAttribute("visibility", "visible");
	};

	Reset_All_Highlight_Station = (): void => {
		for (const marker of this.Find_Map_Objs_By_Id("highlight_origin", true).concat(
			this.Find_Map_Objs_By_Id("highlight_destination", true)
		)) {
			marker.setAttribute("visibility", "hidden");
			const original_transform = this.original_transforms.get(marker);
			if (original_transform) marker.setAttribute("transform", original_transform);
			else marker.removeAttribute("transform");
		}
	};

	Check_Station_Visible = (station_code: string): boolean => {
		const station = this.Find_Map_Objs_By_Id(`highlight_pos_${station_code}`, true)[0];
		if (!station || !this.leaflet_map) return true;
		const bounds = this.Get_Object_Bounds([station], 0);
		return bounds ? this.leaflet_map.getBounds().contains(bounds) : true;
	};

	private Zoom_To_Line(line_code: string): void {
		if (!this._Find_Line_Data_By_Id(line_code))
			throw new Error(`Code was not found inside the list: ${line_code}`);
		const track_id = `${this.network_config.TRACK_PREFIX_ID}${line_code}`;
		const label_id = `${this.network_config.LINE_LABEL_PREFIX_ID}${line_code}`;
		const objects = [
			...this.Find_Map_Objs_By_Id(track_id, false).filter(
				(obj) => obj.id === track_id || obj.id.startsWith(`${track_id}-`)
			),
			...this.Find_Map_Objs_By_Id(label_id, false).filter(
				(obj) => obj.id === label_id || obj.id.startsWith(`${label_id}-`)
			),
		];
		this.Zoom_To_Objects(objects, this.REMToPX(24));
	}

	private _Change_Object_Color(
		obj: SVGElement,
		color: string,
		property: "fill" | "stroke"
	): void {
		obj.style.transition = this.config.HARD_ANIMATION_TRANSITION
			? "none"
			: `fill ${this.network_config.COLOR_ANIMATION_TIME}ms ease, stroke ${this.network_config.COLOR_ANIMATION_TIME}ms ease`;
		obj.style.setProperty(property, color);
	}

	private _Handle_Click = (event: Event): void => {
		const target = this._Get_Interactive_Target(event);
		if (!target) return;
		if (target.id.startsWith(this.network_config.TRACK_PREFIX_ID)) {
			const line_code = this._Find_Code_For_Object(
				target.id,
				this.network_config.TRACK_PREFIX_ID,
				this.lines
			);
			if (line_code) this._Dispatch_Click("line-click", line_code);
		} else if (target.id.startsWith(this.network_config.LINE_LABEL_PREFIX_ID)) {
			const line_code = this._Find_Code_For_Object(
				target.id,
				this.network_config.LINE_LABEL_PREFIX_ID,
				this.lines
			);
			if (line_code) this._Dispatch_Click("line-click", line_code);
		} else {
			const station_prefix = target.id.startsWith(this.network_config.STATION_PREFIX_ID)
				? this.network_config.STATION_PREFIX_ID
				: this.network_config.STATION_LABEL_PREFIX_ID;
			const station_code = this._Find_Code_For_Object(
				target.id,
				station_prefix,
				this.stations
			);
			if (station_code) this._Dispatch_Click("station-click", station_code);
		}
	};

	private _Handle_Mouse_Over = (event: Event): void => {
		const target = this._Get_Interactive_Target(event);
		if (
			!target ||
			this._Get_Interactive_TargetFromNode((event as MouseEvent).relatedTarget) === target
		)
			return;
		const container = this.leaflet_map?.getContainer();
		if (container) container.style.cursor = "pointer";
		target.dispatchEvent(
			new CustomEvent("map-object-mouseover", {
				bubbles: true,
				detail: { id: target.id, type: this._Get_Object_Type(target.id) },
			})
		);
	};

	private _Handle_Mouse_Out = (event: Event): void => {
		const target = this._Get_Interactive_Target(event);
		if (
			!target ||
			this._Get_Interactive_TargetFromNode((event as MouseEvent).relatedTarget) === target
		)
			return;
		const container = this.leaflet_map?.getContainer();
		if (container) container.style.cursor = "";
		target.dispatchEvent(
			new CustomEvent("map-object-mouseout", {
				bubbles: true,
				detail: { id: target.id, type: this._Get_Object_Type(target.id) },
			})
		);
	};

	private _Get_Interactive_Target(event: Event): SVGElement | null {
		return this._Get_Interactive_TargetFromNode(event.target);
	}

	private _Get_Interactive_TargetFromNode(node: EventTarget | null): SVGElement | null {
		if (!(node instanceof Element) || !this.svg_root) return null;
		let current: Element | null = node;
		while (current && current !== this.svg_root) {
			if (current.classList.contains("event-disable")) return null;
			if (
				current.hasAttribute("id") &&
				(current.id.startsWith(this.network_config.TRACK_PREFIX_ID) ||
					current.id.startsWith(this.network_config.LINE_LABEL_PREFIX_ID) ||
					current.id.startsWith(this.network_config.STATION_PREFIX_ID) ||
					current.id.startsWith(this.network_config.STATION_LABEL_PREFIX_ID))
			) {
				return current as SVGElement;
			}
			current = current.parentElement;
		}
		return null;
	}

	private _Find_Code_For_Object<T>(
		id: string | undefined,
		prefix: string,
		values: Record<string, T>
	): string | null {
		if (!id || !id.startsWith(prefix)) return null;
		const code_part = id.slice(prefix.length);
		return (
			Object.keys(values)
				.sort((left, right) => right.length - left.length)
				.find((code) => code_part === code || code_part.startsWith(`${code}-`)) ?? null
		);
	}

	private _Dispatch_Click(event_name: string, id: string): void {
		document.dispatchEvent(new CustomEvent(event_name, { detail: id }));
	}

	private _Get_Object_Type(id: string): "line" | "station" {
		return id.startsWith(this.network_config.TRACK_PREFIX_ID) ||
			id.startsWith(this.network_config.LINE_LABEL_PREFIX_ID)
			? "line"
			: "station";
	}

	private _Find_Line_Data_By_Id(code: string): Line | undefined {
		return this.lines[code];
	}

	private _Find_Station_Data_By_Id(code: string): Station | undefined {
		return this.stations[code];
	}
}

export default Network_Map;
