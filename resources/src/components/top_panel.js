import Base_Panel from "../components/panel.js";
import Utils from "../utils/utils.js";

/**
 * Top_Panel
 *
 * - Fixed at the top of the viewport.
 * - Two sizes: "full" (shows full content) and "compact" (small bar with toggle).
 * - Uses attributes:
 *     - panel-size: "full" | "compact"  (reflects current visual size)
 *
 * Public API:
 * - static Create() -> element creation helper
 * - Toggle_Size() / Set_Size(size) / Get_Size()
 *
 */
class Top_Panel extends Base_Panel {

	/**
	 * container content wrapper
	 */
	content_wrapper = null;

	/**
	 * container for button
	 */
	toggle = null;

	/**
	 * Provide a small inline double-arrow SVG used by the toggle button.
	 * Kept as a static method so it can be replaced/overridden in tests.
	 */
	static double_arrow_SVG = (() => {
		// compact visual: two chevrons pointing down to indicate "expand".
		// When panel is full, css rotates the SVG to point up if desired.
		return `
			<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="6 9 12 15 18 9"></polyline>
					<polyline points="6 5 12 11 18 5"></polyline>
				</g>
			</svg>`;
	})();

	static template_arrow_button = (() => {
		let template = document.createElement('template');
		let toggle = document.createElement('button');
		toggle.type = 'button';
		toggle.className = 'size-toggle';
		toggle.setAttribute('aria-expanded', 'true');
		toggle.setAttribute('title', 'Toggle panel size (compact/full)');
		toggle.innerHTML = Top_Panel.double_arrow_SVG; 
		
		template.content.append(toggle);
		return template;
	})();

	constructor() {
		super();

		// attach stylesheet to this shadow root
		Utils.Add_Stylesheet(this.shadowRoot, "style/top-panel.css");
		this.content_wrapper = Utils.Create_Element_With_Class('div', 'top-panel-content');
		this.base_panel.append(this.content_wrapper);
		this.toggle = Utils.Clone_Node_Into(this.base_panel, Top_Panel.template_arrow_button);

		// event handlers
		this.toggle.addEventListener('click', (e) => {
			e.stopPropagation();
			this.Toggle_Size();
		});

		// keyboard accessibility (Enter / Space)
		this.toggle.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				this.Toggle_Size();
			}
		});
	}

	/**
	 * Create helper to keep style consistent with existing components.
	 * @returns {Top_Panel}
	 */
	static Create() {
		return document.createElement('top-panel');
	}

	/**
	 * Toggle between 'full' and 'compact'
	 * @returns {string} new size
	 */
	Toggle_Size()
	{
		if(this.content_wrapper.getAttribute("display") == "block")
			this.content_wrapper.setAttribute("display", "none");
		else
			this.content_wrapper.setAttribute("display", "block");
	}
}

// Define the custom element
customElements.define('top-panel', Top_Panel);

export default Top_Panel;