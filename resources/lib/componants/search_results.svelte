<script lang="ts" generics="T extends { id: string; label: string }">
    import type { Snippet } from "svelte";

    let {
        items,
        current_focus,
        search_text,
        on_select,
        on_keydown,
        empty_label = "No results",
        row,
    } = $props<{
        items: T[];
        current_focus: number;
        search_text: string;
        on_select: (item: T) => void;
        on_keydown: (e: KeyboardEvent) => void;
        empty_label?: string;
        row?: Snippet<[T]>;
    }>();
</script>

{#each items as item, index (item.id)}
    <div
        class="search-result-item"
        class:is-active={index === current_focus}
        onclick={() => on_select(item)}
        onkeydown={on_keydown}
        role="option"
        tabindex={index}
        aria-selected={index === current_focus}
    >
        {#if row}
            {@render row(item)}
        {:else}
            <strong>{item.label.substring(0, search_text.length)}</strong
            >{item.label.substring(search_text.length)}
        {/if}
    </div>
{/each}

{#if items.length === 0}
    <div class="search-result-empty">{empty_label}</div>
{/if}

<style>
    .search-result-item {
        padding: 5px;
        cursor: pointer;
        border-bottom: 0.5px solid #aaaaaa;

        &:hover,
        &.is-active {
            background-color: #e9e9e9;
        }
    }

    .search-result-empty {
        padding: 0.5rem 0.75rem;
        font-size: 0.9rem;
        color: #999;
        text-align: center;
    }
</style>