import { Label } from "@/components/ui/label";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function ToggleSwitch({ 
  checked, 
  onChange, 
  label, 
  description, 
  disabled = false 
}: ToggleSwitchProps) {
  if (label || description) {
    return (
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          {label && (
            <Label htmlFor={label} className="text-base">
              {label}
            </Label>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            aria-label={label}
          />
          <div className={`w-11 h-6 bg-gray-200 rounded-full peer ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'peer-checked:bg-emerald-600'
          } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:bg-white after:rounded-full after:transition-all`}></div>
        </label>
      </div>
    );
  }

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
        checked ? "peer-checked:bg-emerald-600" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}></div>
    </label>
  );
}
