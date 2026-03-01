// components/top-panel.js
// Top_Panel: a top-fixed panel that can be opened/closed (via Base_Panel)
// and toggled between "full" and "compact" sizes.
//
// Naming conventions and shape follow your existing codebase:
// - class name: Top_Panel
// - custom element name: "top-panel"
// - methods similar to Open_Station_Info / Open_Line_Info style for content injection
//
// Dependencies:
// - import Base_Panel from "../components/panel.js";
// - import Utils from "../utils/utils.js";
//
// Place this file alongside your other components.

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
 * - Open_Top_Content(nodeOrElement) -> clears panel content and appends the provided node
 * - Toggle_Size() / Set_Size(size) / Get_Size()
 *
 */
class Top_Panel extends Base_Panel {

    constructor() {
        super();

        // attach stylesheet to this shadow root
        Utils.Add_Stylesheet(this.shadowRoot, "style/top-panel.css");

        // mark base-panel as 'top' so css can position it
        const basePanel = Utils.Get_Subnode(this.shadowRoot, ".base-panel");
        basePanel.classList.add("top");

        // ensure there's a content wrapper we can use consistently
        this.contentWrapper = Utils.Create_Element_With_Class
            ? Utils.Create_Element_With_Class('div', 'top-panel-content')
            : document.createElement('div');
        this.contentWrapper.classList.add('top-panel-content');

        // We'll append contentWrapper into basePanel
        basePanel.appendChild(this.contentWrapper);

        // create the compact/full size toggle button (visible in compact)
        this.sizeToggle = document.createElement('button');
        this.sizeToggle.type = 'button';
        this.sizeToggle.className = 'size-toggle';
        this.sizeToggle.setAttribute('aria-expanded', 'true');
        this.sizeToggle.setAttribute('title', 'Toggle panel size (compact/full)');
        this.sizeToggle.innerHTML = Top_Panel.DoubleArrowSVG(); // visually the double-arrow glyph

        // append toggle to base panel so it's always available for clicks
        basePanel.appendChild(this.sizeToggle);

        // internal state: default to full
        this.panelSize = 'full';
        this.setAttribute('panel-size', this.panelSize);

        // event handlers
        this.sizeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.Toggle_Size();
        });

        // keyboard accessibility (Enter / Space)
        this.sizeToggle.addEventListener('keydown', (e) => {
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
     * Replace the content of the top panel with the provided node or element.
     * Accepts an Element, DocumentFragment, or string (string will be wrapped in a div).
     *
     * @param {Element|DocumentFragment|string} content
     */
    Open_Top_Content(content) {
        this.Open(); // ensure panel is open (visible)
        const base_panel = Utils.Get_Subnode(this.shadowRoot, ".base-panel");

        // clear existing children of the wrapper
        while (this.contentWrapper.firstChild)
            this.contentWrapper.removeChild(this.contentWrapper.firstChild);

        if (typeof content === 'string') {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = content;
            // move children into the contentWrapper
            while (wrapper.firstChild) this.contentWrapper.appendChild(wrapper.firstChild);
        } else if (content instanceof DocumentFragment || content instanceof Element) {
            this.contentWrapper.appendChild(content);
        } else {
            // fallback: toString and append as text node
            this.contentWrapper.appendChild(document.createTextNode(String(content)));
        }

        // ensure size when new content is opened: expand to full by default
        this.Set_Size('full');
    }

    /**
     * Toggle between 'full' and 'compact'
     * @returns {string} new size
     */
    Toggle_Size() {
        const newSize = this.panelSize === 'full' ? 'compact' : 'full';
        this.Set_Size(newSize);
        return newSize;
    }

    /**
     * Set a specific size: 'full' or 'compact'
     * @param {string} size
     */
    Set_Size(size) {
        const allowed = ['full', 'compact'];
        if (!allowed.includes(size)) throw Error("Top_Panel.Set_Size: invalid size '" + size + "'");
        this.panelSize = size;
        this.setAttribute('panel-size', size);

        const base_panel = Utils.Get_Subnode(this.shadowRoot, ".base-panel");
        if (size === 'compact') {
            base_panel.classList.add('compact');
            this.sizeToggle.setAttribute('aria-expanded', 'false');
        } else {
            base_panel.classList.remove('compact');
            this.sizeToggle.setAttribute('aria-expanded', 'true');
        }
    }

    /**
     * Get current size
     * @returns {string}
     */
    Get_Size() {
        return this.panelSize;
    }

    /**
     * Provide a small inline double-arrow SVG used by the toggle button.
     * Kept as a static method so it can be replaced/overridden in tests.
     */
    static DoubleArrowSVG() {
        // compact visual: two chevrons pointing down to indicate "expand".
        // When panel is full, css rotates the SVG to point up if desired.
        return `
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                    <polyline points="6 5 12 11 18 5"></polyline>
                </g>
            </svg>`;
    }

    /**
     * Optional: When node is connected to DOM, restore size from attribute if present
     */
    connectedCallback() {
        const sizeAttr = this.getAttribute('panel-size');
        if (sizeAttr === 'compact' || sizeAttr === 'full') {
            this.Set_Size(sizeAttr);
        } else {
            // default
            this.Set_Size(this.panelSize);
        }
    }
}

// Define the custom element
customElements.define('top-panel', Top_Panel);

export default Top_Panel;