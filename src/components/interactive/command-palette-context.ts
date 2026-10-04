import { createContext } from 'react'

export type CommandPaletteContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

export const CommandPaletteContext = createContext<CommandPaletteContextValue | undefined>(undefined)
