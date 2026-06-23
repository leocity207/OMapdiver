import { SvelteMap } from "svelte/reactivity";

export interface Searchable {
    id: string;
    label: string;
}

export function create_search_state<T extends Searchable>(
    get_items: () => T[]
) {
    let search_text = $state("");
    let focused = $state(false);
    let current_focus = $state(-1);

    let filtered = $derived.by(() => {
        const query = search_text.trim().toLowerCase();
        if (!query) return get_items();
        return get_items().filter(item =>
            item.label.toLowerCase().includes(query)
        );
    });

    function handle_key_down(
        e: KeyboardEvent,
        on_select: (item: T) => void,
        on_open?: () => void
    ) {
        if (!focused || filtered.length === 0) {
            if (e.key === "Enter") {
                e.preventDefault();
                focused = true;
                on_open?.();
            }
            return;
        }
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                current_focus = (current_focus + 1) % filtered.length;
                break;
            case "ArrowUp":
                e.preventDefault();
                current_focus = (current_focus - 1 + filtered.length) % filtered.length;
                break;
            case "Enter":
                e.preventDefault();
                if (current_focus >= 0 && current_focus < filtered.length)
                    on_select(filtered[current_focus]);
                break;
            case "Escape":
                e.preventDefault();
                focused = false;
                current_focus = -1;
                break;
            case "Tab":
                focused = false;
                current_focus = -1;
                break;
        }
    }

    function handle_select(item: T, on_select: (item: T) => void) {
        search_text = item.label;
        focused = false;
        current_focus = -1;
        on_select(item);
    }

    function handle_focus() {
        focused = true;
    }

    function handle_blur() {
        setTimeout(() => {
            focused = false;
            current_focus = -1;
        }, 100);
    }

    function handle_input() {
        focused = true;
        current_focus = -1;
    }

    function reset() {
        search_text = "";
        focused = false;
        current_focus = -1;
    }

    return {
        get search_text() { return search_text; },
        set search_text(v: string) { search_text = v; },
        get focused() { return focused; },
        set focused(v: boolean) { focused = v; },
        get current_focus() { return current_focus; },
        get filtered() { return filtered; },
        handle_key_down,
        handle_select,
        handle_focus,
        handle_blur,
        handle_input,
        reset,
    };
}