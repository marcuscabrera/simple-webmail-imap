import { Progress } from "@/components/ui/progress";
import { HardDrive } from "lucide-react";

interface StorageIndicatorProps {
  usedGB: number;
  totalGB: number;
}

export function StorageIndicator({ usedGB, totalGB }: StorageIndicatorProps) {
  const percentage = (usedGB / totalGB) * 100;
  const availableGB = totalGB - usedGB;
  
  const getProgressColor = () => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 75) return "bg-amber-500";
    return "bg-sidebar-primary";
  };

  return (
    <div className="px-3 py-3 space-y-2">
      <div className="flex items-center gap-2 text-xs text-sidebar-foreground/70">
        <HardDrive className="h-3.5 w-3.5" />
        <span>Armazenamento</span>
      </div>
      
      <Progress 
        value={percentage} 
        className="h-1.5 bg-sidebar-accent"
        indicatorClassName={getProgressColor()}
      />
      
      <div className="flex justify-between text-xs">
        <span className="text-sidebar-foreground/70">
          {usedGB.toFixed(1)} GB usados
        </span>
        <span className="text-sidebar-foreground/50">
          {availableGB.toFixed(1)} GB livres
        </span>
      </div>
      
      <p className="text-[10px] text-sidebar-foreground/50">
        de {totalGB} GB totais
      </p>
    </div>
  );
}
