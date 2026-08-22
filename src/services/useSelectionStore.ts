import { create } from 'zustand'
import type { PersonType } from '../components/person/Person.tsx'

type SelectionState = {
  selected: Map<string, PersonType>
  toggle: (person: PersonType) => void
  clear: () => void
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selected: new Map(),

  toggle: (person) =>
    set((state) => {
      const next = new Map(state.selected)

      if (next.has(person.url)) {
        next.delete(person.url)
      } else {
        next.set(person.url, person)
      }

      return { selected: next }
    }),

  clear: () => set({ selected: new Map() }),
}))
