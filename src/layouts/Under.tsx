import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import {
  cardsScreen,
  flipScreen,
  pushScreen,
  revealPanel,
  revealScreen,
  slideInPanel,
  type EffectFrame,
} from '../effects';
import { useBackToClose, useCloseSwipe, useInsets } from '../motion';
import { fill, type LayoutProps } from './shared';

export type UnderVariant = 'reveal' | 'cards' | 'flip' | 'push';

/** How far the screen travels when the menu opens, which is also how far a drag has to go back. */
function travel(variant: UnderVariant, frame: EffectFrame) {
  if (variant === 'reveal') return frame.width * 0.75;
  if (variant === 'cards') return frame.width * 0.83;
  if (variant === 'flip') return frame.width * 0.5;
  return frame.panelWidth;
}

/**
 * The panel waits behind the app, and the wrapped screen moves out of the way to show it:
 * `reveal`, `cards`, `flip` and `push`. Tapping or dragging the screen closes the menu.
 */
export function UnderLayout({
  variant,
  visible,
  progress,
  mounted,
  theme,
  side,
  frame,
  renderPanel,
  children,
  backdrop,
  onClose,
  closeLabel,
  swipeToClose,
  statusBar,
  testID,
}: LayoutProps & { variant: UnderVariant }) {
  const insets = useInsets();
  const swipe = useCloseSwipe({
    progress,
    distance: travel(variant, frame),
    side,
    enabled: swipeToClose,
    onClose,
  });
  useBackToClose(visible, onClose);

  // The panel is as wide as the part of it the screen leaves uncovered.
  const panelWidth = variant === 'reveal' ? frame.width * 0.75 : frame.panelWidth;
  const nearEdge = side === 'left' ? 'left' : 'right';
  const farEdge = side === 'left' ? 'right' : 'left';

  const panelStyle = useAnimatedStyle(() => {
    if (variant === 'reveal') return revealPanel(progress.value);
    if (variant === 'push') return slideInPanel(progress.value, frame.panelWidth, frame);
    return {};
  });
  const screenStyle = useAnimatedStyle(() => {
    if (variant === 'reveal') return revealScreen(progress.value, frame);
    if (variant === 'cards') return cardsScreen(progress.value, frame, 0);
    if (variant === 'flip') return flipScreen(progress.value, frame);
    return pushScreen(progress.value, frame);
  });
  const frontCardStyle = useAnimatedStyle(() => cardsScreen(progress.value, frame, 1));
  const backCardStyle = useAnimatedStyle(() => cardsScreen(progress.value, frame, 2));
  const dimStyle = useAnimatedStyle(() => ({ opacity: progress.value * 0.5 }));

  // The screen shrinks and tilts around its edge next to the panel. `flip` sets its own pivot.
  const screenOrigin = variant === 'flip' ? null : { transformOrigin: nearEdge };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]} testID={testID}>
      {mounted ? statusBar : null}
      {backdrop}

      {mounted ? (
        <Animated.View
          style={[
            styles.panel,
            { [nearEdge]: 0, width: panelWidth, transformOrigin: farEdge },
            panelStyle,
          ]}>
          {renderPanel({
            compact: false,
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 8,
          })}
        </Animated.View>
      ) : null}

      {variant === 'cards' ? (
        <View style={fill} pointerEvents="none">
          <Animated.View
            style={[fill, { backgroundColor: theme.layer }, screenOrigin, backCardStyle]}
          />
          <Animated.View
            style={[fill, { backgroundColor: theme.layer }, screenOrigin, frontCardStyle]}
          />
        </View>
      ) : null}

      {/* On the New Architecture the root's background is a layer of its own, and a screen turned
          in 3D would be drawn behind it. This plain view keeps the turn inside it; collapsable
          stops React Native from optimizing it away. */}
      <View style={fill} collapsable={false} pointerEvents="box-none">
        <Animated.View style={[styles.screen, screenOrigin, screenStyle]}>
          {children}
          {mounted && variant === 'push' ? (
            <Animated.View style={[fill, styles.dim, dimStyle]} pointerEvents="none" />
          ) : null}
          {mounted ? (
            // The drag lives on a wrapper: Pressable would replace the gesture handlers with its own.
            <View {...swipe} style={fill}>
              <Pressable
                style={fill}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel={closeLabel}
                testID={testID ? `${testID}-backdrop` : undefined}
              />
            </View>
          ) : null}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  screen: {
    flex: 1,
    overflow: 'hidden',
  },
  dim: {
    backgroundColor: '#000000',
  },
});
