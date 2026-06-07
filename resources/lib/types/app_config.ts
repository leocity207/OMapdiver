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
	HAVE_STATION_SCHEDULES: boolean,
    
    /**
	 * if debug log should be enabled
	 */
	DEBUG: boolean,
}
