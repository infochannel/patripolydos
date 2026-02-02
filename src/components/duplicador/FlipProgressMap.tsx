import { motion } from "framer-motion";
import { Check, Lock, Coins, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFlipLevel } from "./FlipLevelCard";

interface FlipProgressMapProps {
  currentFlip: number;
  maxFlips: number;
  actionLogs: { flip: number }[];
}

export function FlipProgressMap({ currentFlip, maxFlips, actionLogs }: FlipProgressMapProps) {
  const formatAmount = (flip: number) => {
    const amount = Math.pow(2, flip - 1);
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return `${amount}`;
  };

  const hasActionsForFlip = (flip: number) => {
    return actionLogs.some(log => log.flip === flip);
  };

  return (
    <div className="relative">
      {/* Journey path */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: maxFlips }, (_, i) => {
          const flip = i + 1;
          const isCompleted = flip < currentFlip;
          const isCurrent = flip === currentFlip;
          const isLocked = flip > currentFlip;
          const hasActions = hasActionsForFlip(flip);
          const level = getFlipLevel(flip);

          return (
            <motion.div
              key={flip}
              className="relative"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              {/* Connector line */}
              {flip < maxFlips && (
                <div 
                  className={cn(
                    "absolute top-1/2 -right-1 w-2 h-0.5",
                    isCompleted ? "bg-green-500" : "bg-muted"
                  )}
                />
              )}

              {/* Flip node */}
              <motion.div
                className={cn(
                  "relative w-12 h-12 rounded-xl flex flex-col items-center justify-center cursor-default transition-all duration-300",
                  isCompleted && "bg-green-500/20 border-2 border-green-500 shadow-lg shadow-green-500/20",
                  isCurrent && "bg-primary/20 border-2 border-primary shadow-lg shadow-primary/30 ring-2 ring-primary/50 ring-offset-2 ring-offset-background",
                  isLocked && "bg-muted/50 border border-muted-foreground/20"
                )}
                whileHover={!isLocked ? { scale: 1.1 } : {}}
                animate={isCurrent ? { 
                  boxShadow: [
                    "0 0 0 0 hsl(var(--primary) / 0.4)",
                    "0 0 0 8px hsl(var(--primary) / 0)",
                  ]
                } : {}}
                transition={isCurrent ? {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut"
                } : {}}
              >
                {/* Status icon */}
                {isCompleted ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : isCurrent ? (
                  <Target className="h-4 w-4 text-primary animate-pulse" />
                ) : (
                  <Lock className="h-3 w-3 text-muted-foreground/50" />
                )}
                
                {/* Flip number */}
                <span className={cn(
                  "text-[10px] font-bold",
                  isCompleted && "text-green-600",
                  isCurrent && "text-primary",
                  isLocked && "text-muted-foreground/50"
                )}>
                  {flip}
                </span>

                {/* Amount badge on hover effect */}
                {!isLocked && (
                  <motion.div
                    className="absolute -bottom-6 text-[9px] font-medium whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className={cn(
                      isCompleted ? "text-green-600" : "text-primary"
                    )}>
                      {formatAmount(flip)}€
                    </span>
                  </motion.div>
                )}

                {/* Actions indicator */}
                {hasActions && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Coins className="h-2 w-2 text-yellow-900" />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-10 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500" />
          <span>Completado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary/20 border border-primary" />
          <span>Actual</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-muted/50 border border-muted-foreground/20" />
          <span>Bloqueado</span>
        </div>
      </div>
    </div>
  );
}
