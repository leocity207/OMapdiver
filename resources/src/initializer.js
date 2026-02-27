import App_Container from './app/app-container.js';
import App from './app/app.js';
import Network_Map_Page from './page/network-map-page.js';
import Train_Animation from './loader/Train_Animation.js';
import { App_Config} from "../resources-config/config.js";
import Timetables_Page from './page/time_tables_page.js';


async function Initialize() {
	let expanding_list = App_Container.Create();
	document.getElementById('root').appendChild(expanding_list);

	let loader = Train_Animation.Create();
	if(App_Config.HAVE_NETWORK_MAP)
	{
		let map_page = Network_Map_Page.Create();
		let app = App.Create(loader,map_page,null);
		expanding_list.Add_App(app);
		Initialize_Network(app);
		app.Loading();
		await app.Page.Initialize_Map();
		app.Loaded();
		await app.Page.Initial_Zoom_Move();
	}
	if(App_Config.HAVE_STATION_SCHEDULES)
	{
		throw new Error("Not yet implemented");
	}
	if(App_Config.HAVE_LINE_TIMETABLE)
	{
		let timetable_page = Timetables_Page.Create();
		let app = App.Create(loader,timetable_page,null);
		app.Loading();
		timetable_page.Initialize_Timetable();
		app.Loaded();
	}
}

Initialize();
