import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import type { EffectFrame } from './effects';
import { FloatingLayout } from './layouts/Floating';
import { OverlayLayout } from './layouts/Overlay';
import { PopupLayout } from './layouts/Popup';
import { RailLayout } from './layouts/Rail';
import { MenuStatusBar, type LayoutProps, type PanelOptions } from './layouts/shared';
import { UnderLayout } from './layouts/Under';
import { MenuPanel, type PanelLook } from './MenuPanel';
import { useMenuProgress } from './motion';
import { isDarkColor, resolveScene, resolveTheme, resolveWidth } from './theme';
import type { SideMenuHelpers, SideMenuProps } from './types';

export function SideMenu({
  visible,
  onClose,
  onOpen,
  variant = 'overlay',
  children,
  scene,
  rail,
  sections = [],
  selectedKey,
  profile,
  header,
  action,
  logout,
  footerText,
  footer,
  content,
  order,
  panelStyle,
  backdrop,
  side = 'left',
  width = 0.78,
  theme: themeOverrides,
  swipeToClose = true,
  openDuration = 240,
  closeDuration = 200,
  statusBarStyle,
  closeLabel = 'Close menu',
  testID,
}: SideMenuProps) {
  const theme = useMemo(() => resolveTheme(themeOverrides), [themeOverrides]);
  const { width: screenWidth } = useWindowDimensions();
  const panelWidth = resolveWidth(width, screenWidth);
  const isRail = variant === 'rail';

  const { progress, mounted, queue } = useMenuProgress({
    visible,
    openDuration,
    closeDuration,
    keepMounted: isRail,
  });

  const frame: EffectFrame = useMemo(
    () => ({ width: screenWidth, panelWidth, direction: side === 'left' ? 1 : -1 }),
    [screenWidth, panelWidth, side]
  );
  const resolvedScene = useMemo(
    () => resolveScene(scene, panelWidth, screenWidth),
    [scene, panelWidth, screenWidth]
  );

  /** Closes the menu and runs `next` once it is out of the way. The rail never closes. */
  const closeThen = (next: () => void) => {
    if (isRail) {
      next();
      return;
    }
    queue(next);
    onClose();
  };

  const look: PanelLook = variant === 'floating' ? 'floating' : isRail ? 'rail' : 'default';
  const renderPanel = ({ compact, paddingTop, paddingBottom, accessory }: PanelOptions) => {
    const helpers: SideMenuHelpers = { close: onClose, closeThen, compact };
    return (
      <MenuPanel
        theme={theme}
        look={look}
        compact={compact}
        helpers={helpers}
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
        sections={sections}
        selectedKey={selectedKey}
        profile={profile}
        profilePosition={profile?.position ?? (isRail ? 'bottom' : 'top')}
        header={header}
        action={action}
        logout={logout}
        footerText={footerText}
        footer={footer}
        content={content}
        order={order}
        accessory={accessory}
        style={panelStyle}
      />
    );
  };

  const layout: LayoutProps = {
    visible,
    progress,
    mounted,
    theme,
    side,
    frame,
    renderPanel,
    children,
    backdrop,
    scene: resolvedScene,
    rail,
    onClose,
    onOpen,
    closeLabel,
    swipeToClose,
    statusBar: (
      <MenuStatusBar
        barStyle={
          statusBarStyle ?? (isDarkColor(theme.background) ? 'light-content' : 'dark-content')
        }
      />
    ),
    testID,
  };

  switch (variant) {
    case 'reveal':
    case 'cards':
    case 'flip':
    case 'push':
      // Keyed so that switching between these four starts clean: Reanimated keeps the style keys
      // an effect stops returning (e.g. the panel scale of `reveal`).
      return <UnderLayout key={variant} {...layout} variant={variant} />;
    case 'popup':
      return <PopupLayout {...layout} />;
    case 'floating':
      return <FloatingLayout {...layout} />;
    case 'rail':
      return <RailLayout {...layout} />;
    default:
      return <OverlayLayout {...layout} />;
  }
}
