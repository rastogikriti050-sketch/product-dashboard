import { LayoutGrid, List } from "lucide-react"
import { ViewMode } from "@/types/product"
import { Button } from "@/components/ui/button"

type Props = {
  viewMode: ViewMode
  onViewChange: (mode: ViewMode) => void
}

export function ViewToggle({ viewMode, onViewChange }: Props) {
  return (
    <div className="flex rounded-lg border overflow-hidden">
      <Button
        variant={viewMode === "card" ? "default" : "ghost"}
        size="icon"
        onClick={() => onViewChange("card")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>

      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="icon"
        onClick={() => onViewChange("list")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}
