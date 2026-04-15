export interface App_Config_Type {

	/**
	 * Tells if we should display the network map app
	 */
	HAVE_NETWORK_MAP: boolean,

	/**
	 * Tells if we should display line schedule app
	 */
	HAVE_LINE_TIMETABLE: boolean,

	/**
	 * Tells if we should display station schedule app
	 */
	HAVE_STATION_SCHEDULES: boolean 
}

/**
 * Base configuration for the SVG map Object
 */
export interface Config_Type {

	/**
	 * if debug log should be enabled
	 */
	DEBUG: boolean,

	/**
	 * Initial Zoom value if we cannot zoom on object ID
	 */
	INITIAL_ZOOM : number,
	/**
	 * Initial object ID to center the view on
	 */
	INITIAL_CENTERING_OBJECT_ID: string,

	/**
	 * add this to bound zoom calculation to not be on the canvas border
	 */
	INITIAL_ADDITIONAL_BOUND_ZOOM_SPACE_DESKTOP : number,
	INITIAL_ADDITIONAL_BOUND_ZOOM_SPACE_MOBILE : number,
	ADDITIONAL_BOUND_ZOOM_SPACE_MOBILE: number,
	ADDITIONAL_BOUND_ZOOM_SPACE_DESKTOP: number,

	/**
	 * max zoom in by scrolling
	 */
	MAX_ZOOM_IN : number,

	/**
	 * max zoom out, never reached, because the max zoom out is restricted if the map would not cover the canvas
	 */
	MAX_ZOOM_OUT : number,

	/**
	 *  min animation time in ms
	 */
	MIN_MAP_ANIMATION_TIME_DESKTOP : number, // min animation time in ms
	MIN_MAP_ANIMATION_TIME_MOBILE : number, // min animation time in ms

	/**
	 *  max animation time in ms
	 */
	MAX_MAP_ANIMATION_TIME_DESKTOP : number, // max animaton time in ms
	MAX_MAP_ANIMATION_TIME_MOBILE : number, // max animaton time in ms

	/**
	 * Initial zoom move delay before starting the animation in ms
	 */
	INITIAL_ZOOM_MOVE_DELAY : number,

	/**
	 * Initial animation duration in ms
	 */
	INITIAL_ZOOM_MOVE_TIME_DESKTOP : number,
	INITIAL_ZOOM_MOVE_TIME_MOBILE : number,

	/**
	 * Initial zoom step to be added to the current zoom to get the correct zoom
	 */
	INITIAL_ZOOM_MOVE_STEP_DESKTOP : number,
	INITIAL_ZOOM_MOVE_STEP_MOBILE : number,

	/**
	 * add this to bound zoom calculation to not be on the canvas border
	 */
	ADDITIONAL_SINGLE_BOUND_ZOOM_SPACE_DESKTOP : number,
	ADDITIONAL_SINGLE_BOUND_ZOOM_SPACE_MOBILE : number,

	/**
	 * add this as visible space margin, for the object is visible in canvas check
	 */
	ADDITIONAL_VISIBLE_SPACE_MARGIN_DESKTOP : number,
	ADDITIONAL_VISIBLE_SPACE_MARGIN_MOBILE : number,

	/**
	 * default easing animation
	 */
	DEFAULT_ANIMATION_EASING : string,

	/**
	 * if the transition between animation should be hard or eased
	 */
	HARD_ANIMATION_TRANSITION: boolean,

	/**
	 * factor to multiplicate the scale result when the user scrol
	 */
	PINCH_STEP_FACTOR : number,

	/**
	 * max difference between tap coordinates to recognize click on a element
	 */
	TAP_MAX_DIFF : number,
}

/**
 * Config for the Network Page object
 */
export interface Network_Config_Type {

	/**
	 * Track or Line prefix ID
	 */
	TRACK_PREFIX_ID: string,

	/**
	 * Line label prefix ID
	 */
	LINE_LABEL_PREFIX_ID: string,

	/**
	 * Station Icon prefix ID
	 */
	STATION_PREFIX_ID: string,

	/**
	 * Station label Prefix ID
	 */
	STATION_LABEL_PREFIX_ID: string,

	/**
	 * Color change animation time (lines, labels)
	 * When the user select
	 */
	COLOR_ANIMATION_TIME : number,

	/**
	 * Color to use when a line is disabled
	 */
	DISABLE_ELEMENT_COLOR: string
}