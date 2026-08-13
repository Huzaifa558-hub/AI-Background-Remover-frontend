/**
 * Convenience hook — re-exports everything from ToastContext.
 * Use this in components instead of importing from the context directly.
 *
 *   const { showToast } = useToast()
 */
export { useToastContext as useToast } from '../contexts/ToastContext'
