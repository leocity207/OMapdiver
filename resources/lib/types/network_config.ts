/**
 * Config for the Network Page object
 */
export interface Network_Config_Type {
	/**
	 * Track or Line prefix ID
	 */
	TRACK_PREFIX_ID: string;

	/**
	 * Line label prefix ID
	 */
	LINE_LABEL_PREFIX_ID: string;

	/**
	 * Station Icon prefix ID
	 */
	STATION_PREFIX_ID: string;

	/**
	 * Station label Prefix ID
	 */
	STATION_LABEL_PREFIX_ID: string;

	/**
	 * Color change animation time (lines, labels)
	 * When the user select
	 */
	COLOR_ANIMATION_TIME: number;

	/**
	 * Color to use when a line is disabled
	 */
	DISABLE_ELEMENT_COLOR: string;
}
