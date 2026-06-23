import type { Network, Station } from "$lib/types/network";
import type { Extended_Switch_Choice } from "$lib/types/switch";

export function Get_Direction_Choices(
    station: Station,
    network: Network
): Extended_Switch_Choice[] {
    // Normal: unique destination IDs from directions values
    const normal_ids = new Set(Object.values(station.directions));

    // All reachable stations via every line this station belongs to
    const reachable_ids = new Set<string>();
    for (const line_id of station.lines) {
        const line = network.lines[line_id];
        if (!line) continue;
        for (const station_id of line.stations) {
            reachable_ids.add(station_id);
        }
    }

    // Exceptional: reachable but not normal and not the station itself
    const exceptional_ids = new Set(
        [...reachable_ids].filter(
            (id) => !normal_ids.has(id) && id !== station.id
        )
    );

    const To_Choice = (id: string, is_exceptional: boolean): Extended_Switch_Choice | null => {
        const s = network.stations[id];
        if (!s) return null;
        return { id, label: s.label, is_exceptional };
    };

    const normal = [...normal_ids]
        .map((id) => To_Choice(id, false))
        .filter((c): c is Extended_Switch_Choice => c !== null)
        .sort((a, b) => a.label.localeCompare(b.label));

    const exceptional = [...exceptional_ids]
        .map((id) => To_Choice(id, true))
        .filter((c): c is Extended_Switch_Choice => c !== null)
        .sort((a, b) => a.label.localeCompare(b.label));

    return [...normal, ...exceptional];
}