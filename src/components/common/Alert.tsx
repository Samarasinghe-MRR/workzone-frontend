import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  type: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  className?: string;
}

const alertStyles = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  error: "bg-red-50 border-red-200 text-red-800",
};

const alertIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
};

export default function Alert({ type, title, message, className }: AlertProps) {
  const Icon = alertIcons[type];

  return (
    <div
      className={cn(
        "flex gap-3 p-4 border rounded-lg",
        alertStyles[type],
        className
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="space-y-1">
        {title && <h4 className="font-medium text-sm">{title}</h4>}
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
