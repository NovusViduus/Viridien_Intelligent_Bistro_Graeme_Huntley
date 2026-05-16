import { create } from "zustand";

/**
 * Zustand store for managing the app's light/dark theme preference.
 */
export const useThemeStore = create((set, get) => ({
  isDark: false,

  /**
   * Toggles between light and dark mode.
   */
  toggle: () => set((state) => ({ isDark: !state.isDark })),
}));
