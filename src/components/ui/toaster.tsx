import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white text-black border rounded p-4 shadow"
        >
          {toast.title && <div className="font-semibold">{toast.title}</div>}
          {toast.description && <div className="text-sm">{toast.description}</div>}

          <button
            className="mt-2 text-sm text-blue-600"
            onClick={() => dismiss(toast.id)}
          >
            Close
          </button>
        </div>
      ))}
    </div>
  )
}
