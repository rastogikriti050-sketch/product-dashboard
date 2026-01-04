type Props = {
  view: "grid" | "list"
  onChange: (view: "grid" | "list") => void
}

export function ViewToggle({ view, onChange }: Props) {
  return (
    <div className="flex gap-2">
      <button
        className={view === "grid" ? "font-bold" : ""}
        onClick={() => onChange("grid")}
      >
        Grid
      </button>
      <button
        className={view === "list" ? "font-bold" : ""}
        onClick={() => onChange("list")}
      >
        List
      </button>
    </div>
  )
}
