import type * as Leaflet from "leaflet";
import type { Map_Config_Type } from "$lib/types/map_config";
import { String_Error } from "$lib/utils/constant";
import Utils from "$lib/utils/utils"

type Map_Bounds = Leaflet.LatLngBounds;

interface SVG_View_Box {
	x: number;
	y: number;
	width: number;
	height: number;
	scale_x: number;
	scale_y: number;
}

interface Zoom_Box {
	center_left: number;
	center_top: number;
	zoom_level: number;
}

interface Leaflet_Runtime {
	CRS: { Simple: Leaflet.CRS }; // coordinate reference system
	map: (container: HTMLElement, options: Leaflet.MapOptions) => Leaflet.Map;
	svgOverlay: (
		svg: SVGSVGElement,
		bounds: Leaflet.LatLngBoundsExpression,
		options?: Leaflet.ImageOverlayOptions
	) => Leaflet.SVGOverlay;
	latLngBounds: (bounds: Leaflet.LatLngBoundsLiteral) => Leaflet.LatLngBounds;
	latLng: (latitude: number, longitude: number) => Leaflet.LatLng;
	point: (x: number, y: number) => Leaflet.Point;
}

/**
 * Loads an SVG into Leaflet's simple coordinate system and provides SVG-aware navigation.
 */
class SVG_Map {
	filename: string;
	config: Map_Config_Type;
	client_type: string;
	language: string | null = null;
	leaflet_map: Leaflet.Map | null = null;
	svg_root: SVGSVGElement | null = null;
	svg_bounds: Leaflet.LatLngBounds | null = null;
	view_box: SVG_View_Box | null = null;
	panel_detail_space = 0;
	panel_header_height = 0;
	map_animation_run = false;

	private leaflet_module: Leaflet_Runtime | null = null;
	private svg_layer: Leaflet.SVGOverlay | null = null;
	private svg_event_listeners: Array<{
		type: string;
		event_listener: EventListener;
	}> = [];
	private initial_zoom_timer: ReturnType<typeof setTimeout> | null = null;
	private cancel_initial_zoom: (() => void) | null = null;
	private cancel_map_animation: (() => void) | null = null;
	private initial_zoom_cancelled = false;

	constructor(client_type: string, filename: string, config: Map_Config_Type) {
		this.filename = filename;
		this.config = config;
		this.client_type = client_type.toLowerCase();
	}

	Setup = async (language: string, container: HTMLElement): Promise<void> => {
		this.language = language;
		const [leaflet, response] = await Promise.all([import("leaflet"), fetch(this.filename)]);

		if (!response.ok)
			throw new Error(
				Utils.Format_String(String_Error.MAP_LOADING_FAILED, {
					filename: this.filename,
					status: response.status,
				})
			);

		const svg_text = await response.text();
		const parsed_document = new DOMParser().parseFromString(svg_text, "image/svg+xml");
		const svg_root = parsed_document.querySelector<SVGSVGElement>("svg");
		if (!svg_root || parsed_document.querySelector("parsererror") !== null)
			throw new Error(
				Utils.Format_String(String_Error.MAP_NOT_SVG, { filename: this.filename })
			);

		const view_box = this._Read_View_Box(svg_root);
		svg_root.setAttribute(
			"viewBox",
			`${view_box.x} ${view_box.y} ${view_box.width} ${view_box.height}`
		);
		const imported_svg = document.importNode(svg_root, true) as SVGSVGElement;

		this.leaflet_module = leaflet;
		this.svg_root = imported_svg;
		this.view_box = view_box;
		this.svg_bounds = leaflet.latLngBounds([
			[0, 0],
			[view_box.height * view_box.scale_y, view_box.width * view_box.scale_x],
		]);

		const min_zoom = this._Scale_To_Zoom(this.config.MAX_ZOOM_OUT);
		const max_zoom = this._Scale_To_Zoom(this.config.MAX_ZOOM_IN);
		if (min_zoom > max_zoom) throw new Error(String_Error.MIN_MAX_ERROR_ZOOM);
		this.leaflet_map = leaflet.map(container, {
			crs: leaflet.CRS.Simple,
			minZoom: min_zoom,
			maxZoom: max_zoom,
			zoomSnap: 0,
			zoomDelta: 0.25,
			zoomControl: false,
			scrollWheelZoom: true,
			tapTolerance: this.config.TAP_MAX_DIFF,
			maxBounds: this.svg_bounds,
			maxBoundsViscosity: 1,
			attributionControl: false,
		});
		this.svg_layer = leaflet.svgOverlay(imported_svg, this.svg_bounds, {
			interactive: true,
		});
		this.svg_layer.addTo(this.leaflet_map);
		this.leaflet_map.setView(
			[(view_box.height * view_box.scale_y) / 2, (view_box.width * view_box.scale_x) / 2],
			this._Scale_To_Zoom(this.config.INITIAL_ZOOM),
			{ animate: false }
		);
		this.leaflet_map.setMaxBounds(this.svg_bounds);

		if (this.config.DEBUG)
			console.info(String_Error.SVG_MAP_LOADED_SUCCESSFULLY, this.filename);
	};

	async Setup_Mouse_Handlers(): Promise<void> {
		if (!this.leaflet_map || !this.svg_root) throw new Error(String_Error.SVG_MAP_NOT_SET_UP);
	}

	Add_SVG_Event_Listener(type: string, event_listener: EventListener): void {
		if (!this.svg_root) throw new Error(String_Error.SVG_MAP_NOT_SET_UP);
		this.svg_root.addEventListener(type, event_listener);
		this.svg_event_listeners.push({ type, event_listener });
	}

	Find_Map_Objs_By_Classname = (class_name: string): SVGElement[] => {
		if (!this.svg_root) return [];
		return Array.from(this.svg_root.querySelectorAll<SVGElement>("[class]")).filter((obj) =>
			obj.classList.contains(class_name)
		);
	};

	Find_Map_Objs_By_Id = (id_part: string, full_match = false): SVGElement[] => {
		if (!this.svg_root) return [];
		return Array.from(this.svg_root.querySelectorAll<SVGElement>("[id]")).filter((obj) =>
			full_match ? obj.id === id_part : obj.id.includes(id_part)
		);
	};

	Animated_Pan_Zoom = async (zoom_box: Zoom_Box): Promise<void> => {
		if (!this.leaflet_map || !this.leaflet_module)
			throw new Error(String_Error.SVG_MAP_NOT_SET_UP);
		this._Cancel_Initial_Zoom();
		const center = this.leaflet_module.latLng(zoom_box.center_top, zoom_box.center_left);
		await this._Animate_Pan_Zoom(
			center,
			zoom_box.zoom_level,
			this._Get_Animation_Duration(center, zoom_box.zoom_level)
		);
	};

	Initial_Zoom_Move = async (): Promise<void> => {
		if (!this.leaflet_map || !this.leaflet_module || !this.svg_bounds) return;
		const focus_object = this._Find_SVG_Objs_By_Id(
			this.config.INITIAL_CENTERING_OBJECT_ID,
			true
		)[0];
		if (!focus_object) return;
		const bounds = this.Get_Object_Bounds([focus_object], 0);
		if (!bounds) return;

		this.initial_zoom_cancelled = false;
		await new Promise<void>((resolve) => {
			this.initial_zoom_timer = setTimeout(() => {
				this.initial_zoom_timer = null;
				this.cancel_initial_zoom = null;
				resolve();
			}, this.config.INITIAL_ZOOM_MOVE_DELAY);
			this.cancel_initial_zoom = () => {
				if (this.initial_zoom_timer !== null) clearTimeout(this.initial_zoom_timer);
				this.initial_zoom_timer = null;
				this.cancel_initial_zoom = null;
				resolve();
			};
		});

		if (this.initial_zoom_cancelled || !this.leaflet_map || !this.leaflet_module) return;
		const map_size = this.leaflet_map.getSize();
		if (map_size.x <= 0 || map_size.y <= 0) {
			if (this.config.DEBUG) console.warn(String_Error.SKIPPING_INITIAL_MAP_ANIMATION);
			return;
		}
		const padding = this._Get_Initial_Padding();
		const target_zoom = this._Bounds_Zoom(bounds, padding);
		const zoom_step =
			this.client_type === "mobile"
				? this.config.INITIAL_ZOOM_MOVE_STEP_MOBILE
				: this.config.INITIAL_ZOOM_MOVE_STEP_DESKTOP;
		const target_zoom_with_step = Math.min(
			this._Scale_To_Zoom(this.config.MAX_ZOOM_IN),
			target_zoom + Math.log2(1 + zoom_step)
		);
		const center = this._Bounds_Center(bounds);
		await this._Animate_Pan_Zoom(
			center,
			target_zoom_with_step,
			this._Get_Initial_Animation_Duration()
		);
	};

	Zoom_To_Objects = (objects: SVGElement[], extra_right_padding: number): void => {
		if (!this.leaflet_map || !this.leaflet_module) return;
		const map_size = this.leaflet_map.getSize();
		if (map_size.x <= 0 || map_size.y <= 0) return;
		console.log(extra_right_padding)
		const bounds = this.Get_Object_Bounds(objects, extra_right_padding);
		if (!bounds) return;
		const padding_size = this._Get_Visible_Space_Margin();
		const padding = this.leaflet_module.point(padding_size, padding_size);
		const zoom_level = this._Bounds_Zoom(bounds, padding);
		const center = this._Bounds_Center(bounds);
		void this.Animated_Pan_Zoom({
			center_left: center.lng,
			center_top: center.lat,
			zoom_level,
		});
	};

	Zoom_Check_Map_Resize = (_map_container_width: number, _map_container_height: number): void => {
		this.leaflet_map?.invalidateSize({ pan: false });
	};

	Destroy(): void {
		this._Cancel_Initial_Zoom();
		this._Cancel_Map_Animation();
		this.map_animation_run = false;
		for (const event_data of this.svg_event_listeners)
			this.svg_root?.removeEventListener(event_data.type, event_data.event_listener);

		this.svg_event_listeners = [];
		this.svg_layer?.remove();
		this.svg_layer = null;
		this.leaflet_map?.remove();
		this.leaflet_map = null;
		this.svg_root = null;
		this.svg_bounds = null;
		this.view_box = null;
		this.leaflet_module = null;
	}

	protected Get_Object_Bounds(objects: SVGElement[], extra_right_padding: number): Leaflet.LatLngBounds | null {
		if (!this.svg_root || !this.view_box || !this.leaflet_module) return null;
		const root_matrix = this.svg_root.getScreenCTM();
		if (!root_matrix) return null;
		const root_inverse = root_matrix.inverse();
		let min_x = Number.POSITIVE_INFINITY;
		let min_y = Number.POSITIVE_INFINITY;
		let max_x = Number.NEGATIVE_INFINITY;
		let max_y = Number.NEGATIVE_INFINITY;

		for (const element of objects) {
			if (!("getBBox" in element) || !("getScreenCTM" in element)) continue;
			const graphic = element as SVGGraphicsElement;
			const box = graphic.getBBox();
			const matrix = graphic.getScreenCTM();
			if (!matrix || box.width < 0 || box.height < 0) continue;
			const transform = root_inverse.multiply(matrix);
			for (const [x, y] of [
				[box.x, box.y],
				[box.x + box.width, box.y],
				[box.x, box.y + box.height],
				[box.x + box.width, box.y + box.height],
			]) {
				const point_x = transform.a * x + transform.c * y + transform.e;
				const point_y = transform.b * x + transform.d * y + transform.f;
				if (!Number.isFinite(point_x) || !Number.isFinite(point_y)) continue;
				min_x = Math.min(min_x, point_x);
				min_y = Math.min(min_y, point_y);
				max_x = Math.max(max_x, point_x);
				max_y = Math.max(max_y, point_y);
			}
		}

		if (![min_x, min_y, max_x, max_y].every(Number.isFinite) || max_x < min_x || max_y < min_y)
			return null;
		const west = (min_x - this.view_box.x) * this.view_box.scale_x;
		const east = (max_x - this.view_box.x) * this.view_box.scale_x + extra_right_padding;
		const north = (this.view_box.height - (min_y - this.view_box.y)) * this.view_box.scale_y;
		const south = (this.view_box.height - (max_y - this.view_box.y)) * this.view_box.scale_y;
		const bounds = this.leaflet_module.latLngBounds([
			[south, west],
			[north, east],
		]);
		return bounds.isValid() ? bounds : null;
	}

	protected Get_Object_Center(obj: SVGElement): { x: number; y: number } | null {
		if (!this.svg_root) return null;
		const root_matrix = this.svg_root.getScreenCTM();
		if (!root_matrix || !("getBBox" in obj) || !("getScreenCTM" in obj)) return null;
		const graphic = obj as SVGGraphicsElement;
		const matrix = graphic.getScreenCTM();
		if (!matrix) return null;
		const box = graphic.getBBox();
		const transform = root_matrix.inverse().multiply(matrix);
		const x = box.x + box.width / 2;
		const y = box.y + box.height / 2;
		return {
			x: transform.a * x + transform.c * y + transform.e,
			y: transform.b * x + transform.d * y + transform.f,
		};
	}

	protected REMToPX(rem: number) {
		const remInPx = parseFloat(
			getComputedStyle(document.documentElement).fontSize
		);
		return rem * remInPx;
	}

	private _Read_View_Box(svg: SVGSVGElement): SVG_View_Box {
		const raw_view_box = svg
			.getAttribute("viewBox")
			?.trim()
			.split(/[\s,]+/)
			.map(Number);
		let view_box: SVG_View_Box;
		if (raw_view_box?.length === 4 && raw_view_box.every(Number.isFinite)) {
			view_box = {
				x: raw_view_box[0],
				y: raw_view_box[1],
				width: raw_view_box[2],
				height: raw_view_box[3],
				scale_x: 1,
				scale_y: 1,
			};
		} else {
			view_box = {
				x: 0,
				y: 0,
				width: this._Length_To_Pixels(svg.getAttribute("width"), Number.NaN),
				height: this._Length_To_Pixels(svg.getAttribute("height"), Number.NaN),
				scale_x: 1,
				scale_y: 1,
			};
		}
		if (
			!Number.isFinite(view_box.width) ||
			!Number.isFinite(view_box.height) ||
			view_box.width <= 0 ||
			view_box.height <= 0
		) {
			throw new Error(`The map at ${this.filename} has no usable SVG viewBox or dimensions.`);
		}
		view_box.scale_x =
			this._Length_To_Pixels(svg.getAttribute("width"), view_box.width) / view_box.width;
		view_box.scale_y =
			this._Length_To_Pixels(svg.getAttribute("height"), view_box.height) / view_box.height;
		return view_box;
	}

	private _Length_To_Pixels(length: string | null, fallback: number): number {
		if (!length) return fallback;
		const match = length.trim().match(/^([+-]?(?:\d+\.?\d*|\.\d+))(px|mm|cm|in|pt|pc)?$/i);
		if (!match) return fallback;
		const value = Number(match[1]);
		const unit = match[2]?.toLowerCase();
		const unit_scale =
			unit === "mm"
				? 96 / 25.4
				: unit === "cm"
					? 96 / 2.54
					: unit === "in"
						? 96
						: unit === "pt"
							? 96 / 72
							: unit === "pc"
								? 16
								: 1;
		return value * unit_scale;
	}

	private _Bounds_Zoom(bounds: Map_Bounds, padding: Leaflet.Point): number {
		if (!this.leaflet_map || !this.leaflet_module)
			throw new Error(String_Error.SVG_MAP_NOT_SET_UP);
		if (!bounds.isValid()) throw new Error("Cannot zoom to invalid SVG bounds.");
		const size = this.leaflet_map.getSize();
		if (size.x <= 0 || size.y <= 0)
			throw new Error("Cannot calculate map zoom while the Leaflet container has no size.");
		const fit_zoom = this.leaflet_map.getBoundsZoom(bounds, false, padding);
		if (!Number.isFinite(fit_zoom))
			throw new Error(`Leaflet returned an invalid zoom level for map bounds: ${fit_zoom}.`);
		return Math.min(
			this._Scale_To_Zoom(this.config.MAX_ZOOM_IN),
			Math.max(this._Scale_To_Zoom(this.config.MAX_ZOOM_OUT), fit_zoom)
		);
	}

	private _Bounds_Center(bounds: Leaflet.LatLngBounds): Leaflet.LatLng {
		if (!this.leaflet_module) throw new Error(String_Error.SVG_MAP_NOT_SET_UP);
		return bounds.getCenter();
	}

	private _Get_Initial_Padding(): Leaflet.Point {
		if (!this.leaflet_module) throw new Error(String_Error.SVG_MAP_NOT_SET_UP);
		const padding =
			this.client_type === "mobile"
				? this.config.INITIAL_ADDITIONAL_BOUND_ZOOM_SPACE_MOBILE
				: this.config.INITIAL_ADDITIONAL_BOUND_ZOOM_SPACE_DESKTOP;
		return this.leaflet_module.point(padding, padding);
	}

	private _Get_Padding(): Leaflet.Point {
		if (!this.leaflet_module) throw new Error(String_Error.SVG_MAP_NOT_SET_UP);
		const padding =
			this.client_type === "mobile"
				? this.config.ADDITIONAL_BOUND_ZOOM_SPACE_MOBILE
				: this.config.ADDITIONAL_BOUND_ZOOM_SPACE_DESKTOP;
		return this.leaflet_module.point(padding, padding);
	}

	private _Get_Visible_Space_Margin(): number {
		return this.client_type === "mobile"
			? this.config.ADDITIONAL_VISIBLE_SPACE_MARGIN_MOBILE
			: this.config.ADDITIONAL_VISIBLE_SPACE_MARGIN_DESKTOP;
	}

	private _Get_Animation_Duration(target: Leaflet.LatLngExpression, target_zoom: number): number {
		if (!this.leaflet_map) throw new Error(String_Error.SVG_MAP_NOT_SET_UP);
		const min_duration =
			this.client_type === "mobile"
				? this.config.MIN_MAP_ANIMATION_TIME_MOBILE
				: this.config.MIN_MAP_ANIMATION_TIME_DESKTOP;
		const max_duration =
			this.client_type === "mobile"
				? this.config.MAX_MAP_ANIMATION_TIME_MOBILE
				: this.config.MAX_MAP_ANIMATION_TIME_DESKTOP;
		const current_center_point = this.leaflet_map.project(this.leaflet_map.getCenter());
		const target_center_point = this.leaflet_map.project(target);
		const size = this.leaflet_map.getSize();
		const move_ratio = Math.min(
			1,
			current_center_point.distanceTo(target_center_point) / Math.max(size.x, size.y)
		);
		const zoom_range =
			this._Scale_To_Zoom(this.config.MAX_ZOOM_IN) -
			this._Scale_To_Zoom(this.config.MAX_ZOOM_OUT);
		const zoom_ratio =
			zoom_range === 0
				? 0
				: Math.min(1, Math.abs(this.leaflet_map.getZoom() - target_zoom) / zoom_range);
		return (
			(min_duration + (max_duration - min_duration) * Math.max(move_ratio, zoom_ratio)) / 1000
		);
	}

	private _Ease_In_Out_Quart(t: number): number {
		return t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2;
	}

	private async _Animate_Pan_Zoom(
		center: Leaflet.LatLng,
		zoom_level: number,
		duration: number
	): Promise<void> {
		const map = this.leaflet_map;
		const leaflet = this.leaflet_module;
		if (!map || !leaflet) throw new Error(String_Error.SVG_MAP_NOT_SET_UP);
		if (!Number.isFinite(center.lat) || !Number.isFinite(center.lng))
			throw new Error(
				Utils.Format_String(String_Error.INVALID_MAP_COORDINATES, {
					lat: center.lat,
					lng: center.lng,
				})
			);
		if (!Number.isFinite(zoom_level) || !Number.isFinite(duration))
			throw new Error(
				Utils.Format_String(String_Error.INVALID_MAP_ZOOM_DURATION, {
					zoom_level,
					duration,
				})
			);
		this._Cancel_Map_Animation();
		const map_size = map.getSize();
		if (map_size.x <= 0 || map_size.y <= 0) {
			if (this.config.DEBUG) console.warn(String_Error.SKIP_MAP_ANIMATION_NO_SIZE);
			this.map_animation_run = false;
			return;
		}
		if (map.getCenter().equals(center) && map.getZoom() === zoom_level) {
			this.map_animation_run = false;
			return;
		}

		const start_center = map.getCenter();
		const start_zoom = map.getZoom();
		const start_point = map.project(start_center, 0);
		const end_point = map.project(center, 0);
		const start_time = performance.now();
		const duration_ms = Math.max(0, duration * 1000);
		this.map_animation_run = true;

		await new Promise<void>((resolve, reject) => {
			let frame_id: number | null = null;
			const Finish = (): void => {
				if (this.cancel_map_animation === Cancel) {
					this.cancel_map_animation = null;
					this.map_animation_run = false;
				}
				resolve();
			};
			const Cancel = (): void => {
				if (frame_id !== null) cancelAnimationFrame(frame_id);
				Finish();
			};
			const Frame = (now: number): void => {
				if (this.cancel_map_animation !== Cancel) return;
				frame_id = null;

				try {
					const t = duration_ms === 0 ? 1 : Math.min((now - start_time) / duration_ms, 1);
					const eased = this._Ease_In_Out_Quart(t);
					const point = leaflet.point(
						start_point.x + (end_point.x - start_point.x) * eased,
						start_point.y + (end_point.y - start_point.y) * eased
					);
					const current_center = map.unproject(point, 0);
					const current_zoom = start_zoom + (zoom_level - start_zoom) * eased;

					map.setView(current_center, current_zoom, { animate: false });

					if (t < 1) {
						frame_id = requestAnimationFrame(Frame);
					} else {
						Finish();
					}
				} catch (error) {
					if (this.cancel_map_animation === Cancel) {
						this.cancel_map_animation = null;
						this.map_animation_run = false;
					}
					reject(error);
				}
			};

			this.cancel_map_animation = Cancel;
			frame_id = requestAnimationFrame(Frame);
		});
	}

	private _Cancel_Map_Animation(): void {
		this.cancel_map_animation?.();
		this.cancel_map_animation = null;
		this.map_animation_run = false;
	}

	private _Get_Initial_Animation_Duration(): number {
		return (
			(this.client_type === "mobile"
				? this.config.INITIAL_ZOOM_MOVE_TIME_MOBILE
				: this.config.INITIAL_ZOOM_MOVE_TIME_DESKTOP) / 1000
		);
	}

	private _Scale_To_Zoom(scale: number): number {
		if (!Number.isFinite(scale) || scale <= 0)
			throw new Error(Utils.Format_String(String_Error.MAP_ZOOM_SCALE_INVALID, { scale }));
		return Math.log2(scale);
	}

	private _Cancel_Initial_Zoom(): void {
		if (!this.cancel_initial_zoom) return;
		this.initial_zoom_cancelled = true;
		this.cancel_initial_zoom();
		this.cancel_initial_zoom = null;
	}

	private _Find_SVG_Objs_By_Id(id_part: string, full_match = false): SVGElement[] {
		return this.Find_Map_Objs_By_Id(id_part, full_match);
	}
}

export default SVG_Map;
