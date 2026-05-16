import { COLORS, COLORS_DARK } from "../constants/theme";
import { useThemeStore } from "../store/theme";

export function useColors() {
  const isDark = useThemeStore((s) => s.isDark);
  return isDark ? COLORS_DARK : COLORS;
}
