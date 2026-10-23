import type { ReactElement, ReactNode } from 'react';
import type { ImageSourcePropType } from 'react-native';
import type Ionicons from '@expo/vector-icons/Ionicons';

/** An Ionicons name (`'home-outline'`) or any element you want to draw as the icon. */
export type SideMenuIcon = keyof typeof Ionicons.glyphMap | ReactElement;

export interface SideMenuItem {
  key: string;
  label: string;
  icon?: SideMenuIcon;
  /** Color of the label and icon. Defaults to `theme.text`. */
  color?: string;
  /** Runs once the menu has finished closing, so the next screen never fights the animation. */
  onPress: () => void;
  /** Small pill on the right, e.g. a counter of unread notifications. */
  badge?: string | number;
  /** Background of the badge. Defaults to `theme.accent`. */
  badgeColor?: string;
  accessibilityLabel?: string;
}

export interface SideMenuSection {
  key: string;
  /** Small caption above the items. Leave it out for a section without a title. */
  title?: string;
  items: SideMenuItem[];
}

export interface SideMenuProfile {
  title: string;
  subtitle?: string;
  /** An image or any element. Without it, a person icon is shown. */
  avatar?: ImageSourcePropType | ReactElement;
  /** With it, the whole header is pressable and shows a chevron. */
  onPress?: () => void;
  /**
   * `top` draws it as the panel header; `bottom` as a rounded card at the foot of the panel.
   * Defaults to `bottom` in the `rail` variant and `top` everywhere else.
   */
  position?: 'top' | 'bottom';
  accessibilityLabel?: string;
}

export interface SideMenuAction {
  label: string;
  icon?: SideMenuIcon;
  onPress: () => void;
  /** `accent` fills the button with the accent color; `outline` draws only the border. */
  variant?: 'accent' | 'outline';
  accessibilityLabel?: string;
}

export interface SideMenuLogout {
  label?: string;
  icon?: SideMenuIcon;
  onPress: () => void;
}

export interface SideMenuFonts {
  regular?: string;
  semibold?: string;
  bold?: string;
}

export interface SideMenuTheme {
  /** Panel background. */
  background: string;
  text: string;
  /** Profile subtitle, and unselected items when there is a `selectedKey`. */
  textSecondary: string;
  /** Section titles and footer text. */
  textMuted: string;
  divider: string;
  avatarBackground: string;
  /** Background of a pressed item. */
  itemPressed: string;
  /** Background of the item matching `selectedKey`. */
  itemSelected: string;
  accent: string;
  onAccent: string;
  danger: string;
  /** Color laid over the screen behind the menu. */
  backdrop: string;
  /** Ghost layers behind the screen in the `cards` variant. */
  layer: string;
  fonts: SideMenuFonts;
}

export type SideMenuThemeOverrides = Partial<Omit<SideMenuTheme, 'fonts'>> & {
  fonts?: SideMenuFonts;
};

/** Handed to your own `header`, `footer` and `content` so they can close the menu. */
export interface SideMenuHelpers {
  close: () => void;
  /** Closes the menu and runs `action` once it is out of the way. */
  closeThen: (action: () => void) => void;
  /** Whether the panel is showing icons only (`floating` and `rail` variants). */
  compact: boolean;
}

/** Your own content: an element, or a function that receives the helpers. */
export type SideMenuSlot = ReactNode | ((helpers: SideMenuHelpers) => ReactNode);

/**
 * How the menu is presented:
 * - `overlay`: the panel slides over your screen, which turns in 3D behind it (see `scene`).
 * - `reveal`: the panel waits behind your screen, which slides aside and shrinks.
 * - `cards`: like `reveal`, but the screen tilts like a card with two ghost cards behind it.
 * - `flip`: the screen swings away in 3D on its outer edge.
 * - `push`: the panel slides in and pushes your screen aside.
 * - `popup`: the menu fills the screen, fading and growing in.
 * - `floating`: a rounded card floating over your screen, with an icons-only compact mode.
 * - `rail`: always on screen next to your content; `visible` switches it between open and compact.
 */
export type SideMenuVariant =
  'overlay' | 'reveal' | 'cards' | 'flip' | 'push' | 'popup' | 'floating' | 'rail';

export type SideMenuSceneEffect = 'tilt' | 'slide' | 'none';

/** How your screen (the `children`) moves aside while the `overlay` menu opens. */
export interface SideMenuScene {
  /**
   * `tilt` shifts, shrinks and turns the screen in 3D (the default); `slide` only pushes it aside
   * by the panel's width; `none` leaves it where it is.
   */
  effect?: SideMenuSceneEffect;
  /** How far the screen moves: a fraction of the screen (`0.54`) or points. */
  offset?: number;
  /** Size of the screen when the menu is open, from 0 to 1. */
  scale?: number;
  /** How much the screen turns away from the panel, in degrees. */
  rotate?: number;
  /** Corner radius of the screen when the menu is open. */
  borderRadius?: number;
}

/** Widths of the `rail` variant, in points. */
export interface SideMenuRail {
  /** Width when compact (`visible` false). Defaults to `64`. */
  compactWidth?: number;
  /** Width when open (`visible` true). Defaults to `250`, never more than 70% of the screen. */
  openWidth?: number;
  /** Shows a handle on the edge to drag the rail open or compact. Defaults to `true`. */
  resizable?: boolean;
}

export interface SideMenuProps {
  /** Whether the menu is open. In the `rail` variant: open (`true`) or compact (`false`). */
  visible: boolean;
  /** Called when the backdrop is tapped, the menu is swiped away or the Android back button is pressed. */
  onClose: () => void;
  /** Called when the menu asks to open itself: the `rail` handle and toggle button. */
  onOpen?: () => void;
  /** Defaults to `overlay`. */
  variant?: SideMenuVariant;
  /** Your screen. Every variant except `popup` and `floating` moves or resizes it. */
  children?: ReactNode;
  scene?: SideMenuScene;
  rail?: SideMenuRail;
  sections?: SideMenuSection[];
  /** Key of the item to highlight as the current one. */
  selectedKey?: string;
  profile?: SideMenuProfile;
  /** Replaces the profile header with your own content. */
  header?: SideMenuSlot;
  /** Highlighted button under the sections, e.g. to switch between two modes of the app. */
  action?: SideMenuAction;
  logout?: SideMenuLogout;
  /** Small centered text at the bottom, e.g. the app version. */
  footerText?: string;
  /** Your own content at the very bottom of the panel. */
  footer?: SideMenuSlot;
  /** Replaces everything inside the panel with your own content. */
  content?: SideMenuSlot;
  /** Drawn behind the screen in the variants where the panel waits behind it, e.g. a gradient. */
  backdrop?: ReactNode;
  /** Edge the menu slides in from. Defaults to `left`. */
  side?: 'left' | 'right';
  /** A fraction of the screen (`0.78`) or a width in points (`300`). Defaults to `0.78`. */
  width?: number;
  theme?: SideMenuThemeOverrides;
  /** Drag the menu or the screen towards the panel's edge to close it. Defaults to `true`. */
  swipeToClose?: boolean;
  /** Milliseconds. Defaults to `240`. */
  openDuration?: number;
  /** Milliseconds. Defaults to `200`. */
  closeDuration?: number;
  /** Status bar text while the menu is open. Defaults to light on dark panels and dark on light ones. */
  statusBarStyle?: 'light-content' | 'dark-content';
  /** Accessibility label of the backdrop and close buttons. Defaults to `'Close menu'`. */
  closeLabel?: string;
  testID?: string;
}
