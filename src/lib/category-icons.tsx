import type { LucideIcon } from "lucide-react";
import {
  Droplets,
  Hammer,
  Leaf,
  Sparkles,
  Wind,
  Zap,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  Droplets,
  Zap,
  Sparkles,
  Wind,
  Hammer,
  Leaf,
};

export function getCategoryIcon(iconKey: string): LucideIcon {
  return categoryIcons[iconKey] ?? Sparkles;
}
