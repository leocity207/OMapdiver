import Displayable from "../utils/displayable.ts";
import Utils from "../utils/utils.ts";
import CSS_fold_plus_minus from '../../style/fold-plus-minus.css';

/**
 * Page are displayable element generaly found inside an App, they are gracefull container
 *
 * This class create a custome element named "app-page"
 */
class Page extends Displayable
{
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		Utils.Add_Stylesheet(this.shadowRoot, 'style/app.css')
	}

	/**
	 * Create a Page object and initialize it.
	 *
	 * @returns {Page} an Page Object
	 */
	static Create() {
		return document.createElement("app-page");
	}
}

customElements.define("app-page", Page);

export default Page;