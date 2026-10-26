import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { slideInPanel } from '../effects';
import { useCloseSwipe, useInsets } from '../motion';
import { fill, type LayoutProps } from './shared';

const MARGIN = 10;
const COMPACT_WIDTH = 70;

/**
 * A rounded card floating over the app, with a button at its foot to fold it down to icons only
 * and back.
 */
export function FloatingLayout({
  visible,
  progress,
  mounted,
  theme,
  side,
  frame,
  renderPanel,
  children,
  onClose,
  closeLabel,
  swipeToClose,
  statusBar,
  testID,
}: LayoutProps) {
  const insets = useInsets();
  const [compact, setCompact] = useState(false);
  const expandedWidth = Math.min(frame.panelWidth, 240);
  const width = useSharedValue(expandedWidth);
  const swipe = useCloseSwipe({
    progress,
    distance: expandedWidth + MARGIN,
    side,
    enabled: swipeToClose,
    onClose,
  });

  // Opens expanded every time.
  useEffect(() => {
    if (!visible) return;
    setCompact(false);
    width.value = expandedWidth;
  }, [visible, expandedWidth, width]);

  const toggle = () => {
    const next = !compact;
    setCompact(next);
    width.value = withTiming(next ? COMPACT_WIDTH : expandedWidth, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  };

  const cardStyle = useAnimatedStyle(() => ({
    width: width.value,
    ...slideInPanel(progress.value, width.value + MARGIN, frame),
  }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  const toggleButton: ReactNode = (
    <Pressable
      onPress={toggle}
      hitSlop={8}
      style={[styles.toggle, compact ? styles.toggleCenter : styles.toggleEnd]}
      accessibilityRole="button"
      accessibilityLabel={compact ? 'Expand menu' : 'Collapse menu'}>
      <Ionicons
        name={(side === 'left') === compact ? 'chevron-forward' : 'chevron-back'}
        size={20}
        color={theme.textSecondary}
      />
    </Pressable>
  );

  return (
    <>
      {children}
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
              styles.card,
              {
                top: insets.top + MARGIN,
                bottom: insets.bottom + MARGIN,
                [side]: MARGIN,
                backgroundColor: theme.background,
              },
              cardStyle,
            ]}>
            {renderPanel({
              compact,
              paddingTop: 8,
              paddingBottom: 4,
              accessory: toggleButton,
            })}
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    borderRadius: 20,
    overflow: 'hidden',
  },
  toggle: {
    flexDirection: 'row',
    padding: 14,
  },
  toggleEnd: {
    justifyContent: 'flex-end',
  },
  toggleCenter: {
    justifyContent: 'center',
  },
});
