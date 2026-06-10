import { ref } from 'vue'

/**
 * Shared arrow-key navigation for roving-tabindex groups (the WAI-ARIA
 * radiogroup and tablist patterns): Right/Down moves forward, Left/Up moves
 * backward, wrapping at the ends. The caller renders the items, keeps the
 * single tab stop on the active one, and decides what activating an index
 * means (select a radio, switch a tab); this owns the index arithmetic and
 * the focus bookkeeping.
 *
 * @param {() => number} count        Item count in the group.
 * @param {() => number} activeIndex  Index currently holding the tab stop.
 * @param {(index: number) => void} onMove  Activate the item at `index` (focus is handled here).
 * @returns {{
 *   setItemRef: (el: object|null, index: number) => void,
 *   onKeydown: (e: KeyboardEvent) => void,
 * }} `setItemRef` collects per-item template refs (`:ref="(el) => setItemRef(el, i)"`);
 *    `onKeydown` attaches to the group container.
 */
export function useRovingFocus(count, activeIndex, onMove) {
  // Refs may be DOM elements or component instances exposing focus().
  const itemRefs = ref([])
  function setItemRef(el, index) {
    itemRefs.value[index] = el
  }
  function onKeydown(e) {
    const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown'
    const backward = e.key === 'ArrowLeft' || e.key === 'ArrowUp'
    if (!forward && !backward) return
    e.preventDefault()
    const next = (activeIndex() + (forward ? 1 : -1) + count()) % count()
    onMove(next)
    itemRefs.value[next]?.focus()
  }
  return { setItemRef, onKeydown }
}
