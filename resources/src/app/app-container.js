import App from './app.js';
import Utils from '../utils/utils.js';
import CSS_app_container from '../../style/app-container.css';


/**
 * App_container are element that display *Apps*.
 * When more than one *App* is added to the container  it create a left bare side to switch between app.
 * When multiple *App* are being used it is recommended to set the Icon inside the *App* in order to display it inside the left bare side.
 * Every element contained inside the container is inside a ShadowDom
 * This class create a custome element named "app-container"
 *
 * Structure
 * ---------
 * .. code-block:: html
 *
 * 	<div class='app-window'>
 * 		Main app window
 * 	</div>
 * 	<div class='panel'>
 *  	List of app you can switch on
 * 	</div>
 */
class App_Container extends HTMLElement
{
	/**
	 * The list of app inside the container
	 */
	app_list = [];

	/**
	 * list of tabs inside the tab container
	 */
	tab_list = [];

	/**
	 * The current `App` being displayed
	 */
	current_app_index = -1;

	/**
	 * the panel node displaying selectable app
	 */
	app_selector = undefined;

	/**
	 * the main canva for the `App`
	 */
	app_window = undefined;

	/**
	 * Base template for panel and main app
	 */
	static template_base = (() => {
		const template = document.createElement('template');

		let app_selector = Utils.Create_Element_With_Class('div', 'app-selector');
		let app_window = Utils.Create_Element_With_Class('div', 'app-window');
		
		app_selector.style.display = 'none';

		template.content.append(app_selector, app_window);
		return template;
	})();

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		Utils.Add_Stylesheet(this.shadowRoot, CSS_app_container);
		Utils.Clone_Node_Into(this.shadowRoot,App_Container.template_base);

		this._On_Tab_Key_Down = this._On_Tab_Key_Down.bind(this);
		this.app_selector = Utils.Get_Subnode(this.shadowRoot, '.app-selector');
		this.app_window = Utils.Get_Subnode(this.shadowRoot, '.app-window');
	}

	/**
	* create an App_Container object and initialize it ready to be added to the DOM
	*
	* @return a new instance App_Container ready to be added to the DOM
	*/
	static Create() {
		return document.createElement("app-container");
	}

	/**
	 * Called when node is connected to the dom
	 */
	connectedCallback() {
		this.Render();
	}

	/**
	* add a new app to the container
	* @param {App} new_app the App that should  be added to the container
	*/
	Add_App(new_app) {
		if(!new_app instanceof App)
			throw Error("new_app parameter should be an App object");
		this.app_list.push(new_app);
		this.Render();

		if (this.app_list.length === 1) {
			this._Select_App(0);
		}
	}

	/**
	 * Initialize the DOM of the App_Container element
	 *
	 * When the number of App in the container is superior to 1, it display a left bar to switch between App.
	 *
	 * Call this method should be done after the DOM is ready or when the list of App changed.
	 */
	Render()
	{


		// nettoie le contenu pour éviter les doublons lors de multiple Render()
		this.app_selector.innerHTML = '';
		this.app_window.innerHTML = '';

		// si >1 app on montre la barre de sélection, sinon on la cache
		if (this.app_list.length > 1)
			this.app_selector.style.display = 'flex';
		else
			this.app_selector.style.display = 'none';

		// crée les tabs et injecte les apps (une seule visible à la fois)
		this.tab_list = [];

		for (let i = 0; i < this.app_list.length; i++) {
			const entry = this.app_list[i];

			// add app in the window
			entry.style.display = 'none';
			this.app_window.appendChild(entry);

			// add button
			const tab = document.createElement('button');
			tab.class_name = 'app-tab';
			tab.setAttribute('role', 'tab');
			tab.setAttribute('aria-selected', 'false');
			tab.dataset.index = String(i);
			tab.title = entry.getAttribute('title');


			tab.innerHTML = `<div class="icon">${entry.icon}</div>`;

			// click 
			tab.addEventListener('click', () => {
				this._Select_App(i);
			});

			// keyboard navigation
			tab.addEventListener('keydown', this._On_Tab_Key_Down);

			this.app_selector.appendChild(tab);
			this.tab_list.push(tab);
		}

		// default select app on add or delete
		if (this.current_index >= 0 && this.current_index < this.app_list.length) {
			this._Apply_Selection_Visual(this.current_index);
			this._Show_App(this.current_index);
		} else if (this.app_list.length > 0) {
			this._Select_App(0);
		}
	}

	_Select_App(index) {
		if (index < 0 || index >= this.app_list.length) return;

		// deselect previous app
		if (this.current_app_index >= 0 && this.current_app_index < this.tab_list.length) {
			this.tab_list[this.current_app_index].classList.remove('selected');
			this.tab_list[this.current_app_index].setAttribute('aria-selected', 'false');
		}

		// select the new tab
		this.current_app_index = index;
		this.tab_list[index].classList.add('selected');
		this.tab_list[index].setAttribute('aria-selected', 'true');
		this.tab_list[index].focus();

		this._Show_App(index);
	}

	_Apply_Selection_Visual(index) {
		for (let i = 0; i < this.tab_list.length; i++) {
			const tab = this.tab_list[i];
			if (i === index) {
				tab.classList.add('selected');
				tab.setAttribute('aria-selected', 'true');
			} else {
				tab.classList.remove('selected');
				tab.setAttribute('aria-selected', 'false');
			}
		}
	}

	_Show_App(index) {
		for (let i = 0; i < this.app_list.length; i++)
			this.app_list[i].style.display = (i === index) ? '' : 'none';
	}


	_On_Tab_Key_Down(e) {
		const key = e.key;
		const current = Number(e.currentTarget.dataset.index);
		if (Number.isNaN(current)) return;

		let next = null;
		if (key === 'ArrowDown' || key === 'ArrowRight') {
			next = (current + 1) % this.tab_list.length;
		} else if (key === 'ArrowUp' || key === 'ArrowLeft') {
			next = (current - 1 + this.tab_list.length) % this.tab_list.length;
		} else if (key === 'Home') {
			next = 0;
		} else if (key === 'End') {
			next = this.tab_list.length - 1;
		}

		if (next !== null) {
			e.preventDefault();
			this._Select_App(next);
		}
	}
}

customElements.define("app-container", App_Container);

export default App_Container;
