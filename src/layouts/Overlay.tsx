import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { overlayScene, slideInPanel } from '../effects';
import { useCloseSwipe, useInsets } from '../motion';
import { fill, type LayoutProps } from './shared';

/** The panel slides over the app; the wrapped screen turns in 3D behind it (the `scene`). */
export function OverlayLayout({
  progress,
  mounted,
  theme,
  side,
  frame,
  renderPanel,
  children,
  scene,
  onClose,
  closeLabel,
  swipeToClose,
  statusBar,
  testID,
}: LayoutProps) {
  const insets = useInsets();
  const swipe = useCloseSwipe({
    progress,
    distance: frame.panelWidth,
    side,
    enabled: swipeToClose,
    onClose,
  });

  const panelStyle = useAnimatedStyle(() => slideInPanel(progress.value, frame.panelWidth, frame));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sceneStyle = useAnimatedStyle(() => overlayScene(progress.value, scene, frame));

  const menu = (
    <>
      {mounted ? statusBar : null}
      <Modal
        visible={mounted}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={onClose}
        testID={testID}>
        <View style={styles.root}>
          <Animated.View style={[fill, { backgroundColor: theme.backdrop }, backdropStyle]}>
            <Pressable
              style={fill}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={closeLabel}
              testID={testID ? `${testID}-backdrop` : undefined}
            />
          </Animated.View>
          <Animated.View
            {...swipe}
            style={[
              styles.panel,
              side === 'left' ? styles.left : styles.right,
              { width: frame.panelWidth, backgroundColor: theme.background },
              panelStyle,
            ]}>
            {renderPanel({
              compact: false,
              paddingTop: insets.top + 8,
              paddingBottom: insets.bottom + 8,
            })}
          </Animated.View>
        </View>
      </Modal>
    </>
  );

  if (children === undefined) return menu;
  return (
    // The panel color shows around the screen while it is shifted and turned.
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* On the New Architecture the background is a layer of its own, and the half of the screen
          that turns away would be drawn behind it. This plain view keeps the 3D turn inside it;
          collapsable stops React Native from optimizing it away. */}
      <View style={styles.root} collapsable={false}>
        <Animated.View style={[styles.scene, sceneStyle]}>{children}</Animated.View>
      </View>
      {menu}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scene: {
    flex: 1,
    overflow: 'hidden',
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  left: {
    left: 0,
  },
  right: {
    right: 0,
  },
});
