import { ReactElement } from 'react'
import { useAtomValue } from 'jotai'

import { mouseModeAtom } from '@renderer/jotai/mouse'

import { Absolute } from './absolute'
import { Relative } from './relative'

export const Mouse = (): ReactElement => {
  const mouseMode = useAtomValue(mouseModeAtom)

  return <>{mouseMode === 'relative' ? <Relative /> : <Absolute />}</>
}
