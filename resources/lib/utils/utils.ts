/**
 * General Scope for utilitary function
 */
class Utils {
	/**
	 * Transform a RGBA color into a HexString
	 *
	 * @param {String} rgba rgba code like "#1234FE"
	 * @param {Boolean} with_alpha if there are digit for the alpha canal and if it should be transcribed
	 * @returns {String} the hex string of the color
	 */
	static Rgba_To_Hex = (rgba: string): string => {
		if (rgba.indexOf("#") !== -1) return rgba;

		const rgb = rgba.match(
			/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
		);

		if (!rgb) return "";
		const r = parseInt(rgb[1], 10);
		const g = parseInt(rgb[2], 10);
		const b = parseInt(rgb[3], 10);

		const hex =
			"#" +
			r.toString(16).padStart(2, "0") +
			g.toString(16).padStart(2, "0") +
			b.toString(16).padStart(2, "0");

		return hex.toUpperCase();
	};

	/**
	 * check the bound of the value and put it in bound if needed
	 *
	 * @param {Float} value The value to check if in bound
	 * @param {Float} min the min value
	 * @param {Float} max the max value
	 * @returns {Float} rounded value withing the bounds
	 */
	static Round_Bound = (value: number, min: number, max: number): number => {
		return Math.min(Math.max(value, min), max);
	};

	/**
	 * Extracts the first part of a string that consists of two sections separated by a hyphen (`-`).
	 * If the input contains more than two sections (separated by hyphens), only the first two sections are returned.
	 * If the input contains only one section or is already in the form of `X-X`, it returns the input as is.
	 *
	 * @param {string} input - The input string to process. The string should be in the form of `X-X` or `X-X-X` (or similar).
	 * @returns {string} The first two sections of the input string, separated by a hyphen, or the input string itself if no hyphen is present.
	 *
	 * @example
	 * getFirstPart("abc-def");
	 * // Returns: "abc-def"
	 *
	 * @example
	 * getFirstPart("abc-def-ghi");
	 * // Returns: "abc-def"
	 *
	 * @example
	 * getFirstPart("single-part");
	 * // Returns: "single-part"
	 */
	static Get_First_Part = function (input: string): string {
		const match = input.match(/^([^-]+-[^-]+)/);
		return match ? match[0] : input;
	};

	/**
	 * Format minutes as H:MM or :MM
	 * @param {int} total_seconds an integer representing elapsed minutes
	 */
	static Format_Minute(total_seconds: number): string {
		let negative = "";
		let total_minutes = total_seconds / 60;
		if (total_minutes < 0) {
			negative = "-";
			total_minutes = -total_minutes;
		}
		const h = Math.floor(total_minutes / 60);
		const m = total_minutes % 60;
		const mm = m.toString().padStart(2, "0");
		return negative + (h > 0 ? `${h}:${mm}` : `:${mm}`);
	}

	static Lighten_Color(hex: string, percent: number = 0.85): string {
		const color = hex.replace("#", "");

		const r = parseInt(color.slice(0, 2), 16);
		const g = parseInt(color.slice(2, 4), 16);
		const b = parseInt(color.slice(4, 6), 16);

		const lr = Math.round(r + (255 - r) * percent);
		const lg = Math.round(g + (255 - g) * percent);
		const lb = Math.round(b + (255 - b) * percent);

		return `rgb(${lr}, ${lg}, ${lb})`;
	}
}

export default Utils;
