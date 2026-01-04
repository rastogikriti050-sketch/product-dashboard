import { useState } from "react"

type Toast = {
  id: string
  title?: string
  description?: string
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  function toast(toast: Omit<Toast, "id">) {
    setToasts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...toast },
    ])
  }

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return {
    toasts,
    toast,
    dismiss,
  }
}
