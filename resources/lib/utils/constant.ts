export enum String_Error {
	NULL_MAP = "map should not be null",
	NULL_SHADOWROOT = "shadow root should not be null",
	NULL_NETWORK_DATA = "network data should not be null",
	NULL_STATIONS = "stations should not be null",
	NULL_HIGHLIGHTED_LINE_CODES = "highlighted line code should not be null",
	NULL_OBJECT = "Object should not be null",
	MAP_LOADING_FAILED = "Failed to load SVG map {filename}: {status}",
	MAP_NOT_SVG = "The map at {filename} is not a valid SVG document.",
	MIN_MAX_ERROR_ZOOM = "MAX_ZOOM_OUT must not be greater than MAX_ZOOM_IN.",
	SVG_MAP_NOT_SET_UP = "The SVG map must be set up before adding event handlers.",
	SVG_MAP_NOT_LOADED = "The SVG map has not been loaded.",
	SVG_MAP_LOADED_SUCCESSFULLY = "SVG map loaded successfully.",
	SKIPPING_INITIAL_MAP_ANIMATION = "Skipping initial map animation because the Leaflet container has no size.",
	INVALID_MAP_COORDINATES = "Cannot animate to invalid map coordinates: ${lat}, ${lng}",
	INVALID_MAP_ZOOM_DURATION = "Cannot animate to an invalid zoom or duration: (${zoom_level}, ${duration})",
	SKIP_MAP_ANIMATION_NO_SIZE = "Skipping map animation while the map has no size.",
	MAP_ZOOM_SCALE_INVALID = "Map zoom scale must be greater than zero; received ${scale}."
	
}
