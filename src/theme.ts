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
  itemSelected: 'rgba(255, 255, 255, 0.1)',
  accent: '#D4E838',
  onAccent: '#111519',
  danger: '#FF7A6E',
  backdrop: 'rgba(5, 8, 10, 0.25)',
  layer: 'rgba(255, 255, 255, 0.14)',
  fonts: {},
};

/** Ready-made palettes, to use as they are or to spread into your own `theme`. */
export const themes = {
  /** The default: dark panel with a lime accent. */
  night: defaultTheme,
  /** Deep purple with a violet accent. */
  midnight: {
    ...defaultTheme,
    background: '#2E2E48',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    divider: 'rgba(255, 255, 255, 0.3)',
    avatarBackground: '#464667',
    itemPressed: 'rgba(255, 255, 255, 0.06)',
    itemSelected: '#3E3E61',
    accent: '#685BFF',
    onAccent: '#FFFFFF',
    danger: '#FF8A80',
    backdrop: 'rgba(20, 20, 40, 0.45)',
  },
  /** Strong blue with white text. */
  ocean: {
    ...defaultTheme,
    background: '#0039C6',
    textSecondary: 'rgba(255, 255, 255, 0.72)',
    textMuted: 'rgba(255, 255, 255, 0.6)',
    divider: 'rgba(255, 255, 255, 0.18)',
    avatarBackground: 'rgba(255, 255, 255, 0.2)',
    itemSelected: 'rgba(255, 255, 255, 0.12)',
    accent: '#FFFFFF',
    onAccent: '#0039C6',
    danger: '#FFB4A9',
    backdrop: 'rgba(0, 20, 70, 0.35)',
  },
  /** White panel with a blue accent. */
  paper: {
    ...defaultTheme,
    background: '#FFFFFF',
    text: '#15171A',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    divider: '#E5E7EB',
    avatarBackground: '#F1F3F6',
    itemPressed: '#F3F4F6',
    itemSelected: '#EEF3FF',
    accent: '#0039C6',
    onAccent: '#FFFFFF',
    danger: '#E5484D',
    backdrop: 'rgba(17, 21, 25, 0.35)',
    layer: 'rgba(0, 57, 198, 0.12)',
  },
  /** Blue-grey, made for the variants where the panel waits behind the screen. */
  slate: {
    ...defaultTheme,
    background: '#546E7A',
    textSecondary: 'rgba(255, 255, 255, 0.75)',
    textMuted: 'rgba(255, 255, 255, 0.54)',
    divider: 'rgba(255, 255, 255, 0.2)',
    avatarBackground: 'rgba(0, 0, 0, 0.26)',
    itemSelected: 'rgba(255, 255, 255, 0.14)',
    accent: '#FFFFFF',
    onAccent: '#37474F',
    layer: 'rgba(255, 255, 255, 0.22)',
  },
} satisfies Record<string, SideMenuTheme>;

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
