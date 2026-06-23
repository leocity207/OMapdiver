<script lang="ts">
	import type { Network, Station } from "$lib/types/network";
	import { Get_Direction_Choices } from "$lib/utils/directions";
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

	let choices = $derived.by(() => Get_Direction_Choices(station, network));
	let default_choice = $derived.by(() => choices.find((c) => !c.is_exceptional)?.id ?? "");
</script>

<ExtendedSwitchSearchbar
	{choices}
	{default_choice}
	{On_Change}
/>