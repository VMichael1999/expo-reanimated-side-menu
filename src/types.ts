import type { ReactElement, ReactNode } from 'react';
import type { ImageSourcePropType } from 'react-native';
import type Ionicons from '@expo/vector-icons/Ionicons';

/** An Ionicons name (`'home-outline'`) or any element you want to draw as the icon. */
export type SideMenuIcon = keyof typeof Ionicons.glyphMap | ReactElement;

export interface SideMenuItem {
  key: string;
  label: string;
  icon?: SideMenuIcon;
  /** Runs once the menu has finished closing, so the next screen never fights the animation. */
  onPress: () => void;
  /** Small pill on the right, e.g. a counter of unread notifications. */
  badge?: string | number;
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
  /** Profile subtitle. */
  textSecondary: string;
  /** Section titles and footer text. */
  textMuted: string;
  divider: string;
  avatarBackground: string;
  /** Background of a pressed item. */
  itemPressed: string;
  accent: string;
  onAccent: string;
  danger: string;
  /** Color laid over the screen behind the menu. */
  backdrop: string;
  fonts: SideMenuFonts;
}

export type SideMenuThemeOverrides = Partial<Omit<SideMenuTheme, 'fonts'>> & {
  fonts?: SideMenuFonts;
};

export interface SideMenuProps {
  visible: boolean;
  /** Called when the backdrop is tapped, the menu is swiped away or the Android back button is pressed. */
  onClose: () => void;
  sections: SideMenuSection[];
  profile?: SideMenuProfile;
  /** Replaces the profile header with your own content. */
  header?: ReactNode;
  /** Highlighted button under the sections, e.g. to switch between two modes of the app. */
  action?: SideMenuAction;
  logout?: SideMenuLogout;
  /** Small centered text at the bottom, e.g. the app version. */
  footerText?: string;
  /** Edge the menu slides in from. Defaults to `left`. */
  side?: 'left' | 'right';
  /** A fraction of the screen (`0.78`) or a width in points (`300`). Defaults to `0.78`. */
  width?: number;
  theme?: SideMenuThemeOverrides;
  /** Drag the panel towards its edge to close it. Defaults to `true`. */
  swipeToClose?: boolean;
  /** Milliseconds. Defaults to `240`. */
  openDuration?: number;
  /** Milliseconds. Defaults to `200`. */
  closeDuration?: number;
  /** Status bar text while the menu is open. Defaults to light on dark panels and dark on light ones. */
  statusBarStyle?: 'light-content' | 'dark-content';
  /** Accessibility label of the backdrop. Defaults to `'Close menu'`. */
  closeLabel?: string;
  testID?: string;
}
