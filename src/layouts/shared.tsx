import type { ReactNode } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import type { EffectFrame } from '../effects';
import type { ResolvedScene } from '../theme';
import type { SideMenuRail, SideMenuTheme } from '../types';

export interface PanelOptions {
  compact: boolean;
  paddingTop: number;
  paddingBottom: number;
  accessory?: ReactNode;
}

/** What SideMenu hands to every layout. */
export interface LayoutProps {
  visible: boolean;
  progress: SharedValue<number>;
  mounted: boolean;
  theme: SideMenuTheme;
  side: 'left' | 'right';
  frame: EffectFrame;
  /** Draws the panel's contents; each layout decides where they go. */
  renderPanel: (options: PanelOptions) => ReactNode;
  children?: ReactNode;
  backdrop?: ReactNode;
  scene: ResolvedScene | null;
  rail?: SideMenuRail;
  onClose: () => void;
  onOpen?: () => void;
  closeLabel: string;
  swipeToClose: boolean;
  /** The status bar to show while the menu is open (only rendered while it is mounted). */
  statusBar: ReactNode;
  testID?: string;
}

/**
 * Status bar while the menu is open. It is rendered outside any Modal: on iOS a modal reads the
 * style only when it is presented. Unmounting it brings the app's own style back.
 */
export function MenuStatusBar({ barStyle }: { barStyle: 'light-content' | 'dark-content' }) {
  return <StatusBar barStyle={barStyle} animated />;
}

export const fill = StyleSheet.absoluteFill;
