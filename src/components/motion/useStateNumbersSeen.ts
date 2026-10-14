import { useCallback, useContext } from 'react'
import { NumberSessionContext } from './number-sequence-context'

/** Whether a state's numbers have already been shown in this session (read before mounting it). */
export function useStateNumbersSeen() {
  const session = useContext(NumberSessionContext)
  return useCallback((stateId: string) => !session || session.visited.has(`${session.sceneId}#${stateId}`), [session])
}
