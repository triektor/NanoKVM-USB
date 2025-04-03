// mouse cursor style
import { atom } from 'jotai'

export const mouseStyleAtom = atom('cursor-default')

// mouse mode: absolute or relative
export const mouseModeAtom = atom('absolute')

// mouse scroll direction: 1 or -1
export const scrollDirectionAtom = atom(1)
