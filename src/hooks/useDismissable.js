import { useEffect } from 'react'

/**
 * Dismiss an open popover when the user clicks outside of it or presses Escape.
 */
export function useDismissable(ref, isOpen, onDismiss) {
  useEffect(() => {
    if (!isOpen) return undefined

    function handlePointerDown(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onDismiss()
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onDismiss()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref, isOpen, onDismiss])
}
