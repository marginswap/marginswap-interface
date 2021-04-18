import { MutableRefObject, useEffect, useRef } from 'react'

const useClickOutside = <T extends HTMLElement>(
  func: (...args: unknown[]) => unknown,
  args?: unknown
): MutableRefObject<T | null> => {
  const ref = useRef<T>(null)

  const handleClickOutside = (e: MouseEvent): void => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      func(args)
    }
  }

  useEffect((): (() => void) => {
    document.body.addEventListener('mousedown', handleClickOutside)
    return (): void => {
      document.body.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return ref
}

export default useClickOutside
