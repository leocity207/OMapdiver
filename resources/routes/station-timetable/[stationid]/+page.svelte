<script lang="ts">
    import type { Color_Map } from "$lib/types/color_map";
    import { Get_Station_Timetable_Options } from "$lib/utils/options.svelte.js";
    import { Get_Global_Options } from "$lib/utils/options.svelte.js";
    import Station_Timetable from "$lib/station-timetable/station_timetable.svelte";
    import type { Timetable_Entry } from "$lib/utils/station_timetable";

    let { data } = $props();

    let color_mode = $derived(
        Get_Global_Options().easy_color_mode ? "easy" : "default"
    ) as Color_Map;

    function Handle_Train_Select(entry: Timetable_Entry) {
        // TODO: open right panel with entry details
    }
</script>

<Station_Timetable
    station={data.station}
    network={data.network_data}
    on_train_select={Handle_Train_Select}
	{color_mode}
/>