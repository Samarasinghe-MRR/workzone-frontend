import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export default function Loader({ size = "md", className, text }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2
        className={cn("animate-spin text-emerald-600", sizeClasses[size])}
      />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}
