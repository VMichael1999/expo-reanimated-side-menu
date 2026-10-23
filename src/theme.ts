import type { SideMenuScene, SideMenuTheme, SideMenuThemeOverrides } from './types';

/** Dark panel with a lime accent: the look the menu was designed with. */
export const defaultTheme: SideMenuTheme = {
  background: '#111519',
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  divider: 'rgba(255, 255, 255, 0.15)',
  avatarBackground: 'rgba(255, 255, 255, 0.15)',
  itemPressed: 'rgba(255, 255, 255, 0.08)',
  accent: '#D4E838',
  onAccent: '#111519',
  danger: '#FF7A6E',
  backdrop: 'rgba(5, 8, 10, 0.25)',
  fonts: {},
};

export function resolveTheme(overrides?: SideMenuThemeOverrides): SideMenuTheme {
  if (!overrides) return defaultTheme;
  return {
    ...defaultTheme,
    ...overrides,
    fonts: { ...defaultTheme.fonts, ...overrides.fonts },
  };
}

/** A width up to 1 is a fraction of the screen; anything larger is in points. Never wider than the screen. */
export function resolveWidth(width: number, screenWidth: number): number {
  const points = width <= 1 ? screenWidth * width : width;
  return Math.round(Math.min(Math.max(points, 0), screenWidth));
}

/** Font style for a weight: the custom family when there is one, the system font at that weight otherwise. */
export function fontStyle(family: string | undefined, weight: '400' | '600' | '700') {
  return family ? { fontFamily: family } : { fontWeight: weight };
}

/** Whether light text reads better on `color`. Only hex colors are understood; anything else counts as dark. */
export function isDarkColor(color: string): boolean {
  const hex = color.trim().replace('#', '');
  const full =
    hex.length === 3 || hex.length === 4
      ? hex.slice(0, 3).replace(/./g, (c) => c + c)
      : hex.slice(0, 6);
  if (!/^[0-9a-f]{6}$/i.test(full)) return true;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  // Perceived brightness (ITU-R BT.601).
  return r * 0.299 + g * 0.587 + b * 0.114 < 150;
}

export interface ResolvedScene {
  offset: number;
  scale: number;
  rotate: number;
  borderRadius: number;
}

/** The screen shifted, shrunk and turned in 3D: the look the menu was designed with. */
const TILT = { offset: 0.54, scale: 0.86, rotate: 9, borderRadius: 24 };

/** The scene effect in points, or `null` when the screen should stay where it is. */
export function resolveScene(
  scene: SideMenuScene | undefined,
  panelWidth: number,
  screenWidth: number
): ResolvedScene | null {
  const effect = scene?.effect ?? 'tilt';
  if (effect === 'none') return null;
  const preset =
    effect === 'slide' ? { offset: panelWidth, scale: 1, rotate: 0, borderRadius: 0 } : TILT;
  return {
    offset: resolveWidth(scene?.offset ?? preset.offset, screenWidth),
    scale: scene?.scale ?? preset.scale,
    rotate: Math.abs(scene?.rotate ?? preset.rotate),
    borderRadius: scene?.borderRadius ?? preset.borderRadius,
  };
}
