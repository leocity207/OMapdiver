import App_Container from './app/app-container';
import App from './app/app';
import Network_Map_Page from './page/network-map-page';
import Train_Animation from './loader/Train_Animation';
import { App_Config} from '../resources-config/config';
import Timetables_Page from './page/time_tables_page';
import Full_Departure_Boards from './page/full_departure_boards';


async function Initialize() {
	let expanding_list = App_Container.Create();
	document.getElementById('root').appendChild(expanding_list);

	let loader = Train_Animation.Create();
	if(App_Config.HAVE_NETWORK_MAP)
	{
		let map_page = Network_Map_Page.Create();
		let app = App.Create(loader, map_page, Network_Map_Page.icon, "Map");
		expanding_list.Add_App(app);
		app.Loading();
		app.Page.Initialize_Map().then(async () => {
			app.Loaded();
			await app.Page.Initial_Zoom_Move();
		});

	}
	if(App_Config.HAVE_STATION_SCHEDULES)
	{
		let departure_board_page = Full_Departure_Boards.Create();
		let app = App.Create(loader, departure_board_page, Full_Departure_Boards.icon, "Departure board");
		expanding_list.Add_App(app);
		app.Loading();
		departure_board_page.Initialize_Departure_Boards().then(async () => {
			app.Loaded();
		});
	}
	if(App_Config.HAVE_LINE_TIMETABLE)
	{
		let timetable_page = Timetables_Page.Create();
		let app = App.Create(loader, timetable_page, Timetables_Page.icon, "Timetable");
		expanding_list.Add_App(app);
		app.Loading();
		timetable_page.Initialize_Timetables().then(async () => {
			app.Loaded();
		});
	}
}

Initialize();
