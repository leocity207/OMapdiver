<script lang="ts">
	import type { Network, Station } from "$lib/types/network";
	import { Get_Choices_For_Directions } from "$lib/utils/patterns_creator";
	import ExtendedSwitchSearchbar from "$lib/componants/extended_switch_searchbar.svelte";

	let {
		station,
		network,
		On_Change,
	} = $props<{
		station: Station;
		network: Network;
		On_Change: ((station_id: string) => void) | null;
	}>();

	let choices = $derived.by(() => Get_Choices_For_Directions(station, network));
	let default_choice = $derived.by(() =>
		choices.find((c) => c.id === "all")?.id ?? choices.find((c) => !c.is_exceptional)?.id ?? ""
	);
</script>

<ExtendedSwitchSearchbar
	{choices}
	{default_choice}
	{On_Change}
/>