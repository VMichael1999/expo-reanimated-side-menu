import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useRef } from 'react';
import { PanResponder, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { useInsets } from '../motion';
import type { LayoutProps } from './shared';

const TOGGLE_SIZE = 26;

/**
 * Always on screen next to the content: `visible` switches it between open
 * and compact. The button on its edge toggles it, and the handle can be dragged either way.
 */
export function RailLayout({
  visible,
  progress,
  theme,
  side,
  frame,
  renderPanel,
  children,
  rail,
  onClose,
  onOpen,
  closeLabel,
  testID,
}: LayoutProps) {
  const insets = useInsets();
  const compactWidth = rail?.compactWidth ?? 64;
  const openWidth = Math.max(
    compactWidth,
    Math.min(rail?.openWidth ?? 250, Math.round(frame.width * 0.7))
  );
  const resizable = rail?.resizable ?? true;
  const span = openWidth - compactWidth;

  const start = useRef(0);
  const callbacks = useRef({ onOpen, onClose, visible });
  callbacks.current = { onOpen, onClose, visible };

  const handle = useMemo(() => {
    const outward = (dx: number) => (side === 'left' ? dx : -dx);
    const settle = () => {
      progress.value = withTiming(callbacks.current.visible ? 1 : 0, {
        duration: 160,
        easing: Easing.out(Easing.cubic),
      });
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        cancelAnimation(progress);
        start.current = progress.value;
      },
      onPanResponderMove: (_, gesture) => {
        progress.value = Math.min(Math.max(start.current + outward(gesture.dx) / span, 0), 1);
      },
      onPanResponderRelease: () => {
        const open = progress.value > 0.5;
        const { visible: wasOpen, onOpen: open_, onClose: close } = callbacks.current;
        if (open && !wasOpen && open_) open_();
        else if (!open && wasOpen) close();
        else settle();
      },
      onPanResponderTerminate: settle,
    }).panHandlers;
  }, [progress, side, span]);

  const railStyle = useAnimatedStyle(() => ({
    width: compactWidth + progress.value * span,
  }));
  const edgeStyle = useAnimatedStyle(() => ({
    [side]: compactWidth + progress.value * span - TOGGLE_SIZE / 2,
  }));

  const toggle = () => (visible ? onClose() : onOpen?.());
  const pointsOutward = (side === 'left') !== visible;

  return (
    <View style={[styles.root, side === 'right' && styles.reverse]} testID={testID}>
      <Animated.View
        style={[
          styles.rail,
          { backgroundColor: theme.background, borderColor: theme.divider },
          side === 'left' ? styles.borderRight : styles.borderLeft,
          railStyle,
        ]}>
        {renderPanel({
          compact: !visible,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 8,
        })}
      </Animated.View>

      <View style={styles.content}>{children}</View>

      {resizable ? (
        <Animated.View
          {...handle}
          style={[styles.handle, { top: insets.top + 80 }, edgeStyle]}
          accessibilityLabel="Resize menu"
        />
      ) : null}

      <Animated.View style={[styles.toggleWrap, { top: insets.top + 24 }, edgeStyle]}>
        <Pressable
          onPress={toggle}
          hitSlop={10}
          style={[styles.toggle, { backgroundColor: theme.background, borderColor: theme.divider }]}
          accessibilityRole="button"
          accessibilityLabel={visible ? closeLabel : 'Open menu'}>
          <Ionicons
            name={pointsOutward ? 'chevron-forward' : 'chevron-back'}
            size={16}
            color={theme.text}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  reverse: {
    flexDirection: 'row-reverse',
  },
  rail: {
    overflow: 'hidden',
  },
  borderRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  borderLeft: {
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flex: 1,
  },
  handle: {
    position: 'absolute',
    bottom: 80,
    width: TOGGLE_SIZE,
  },
  toggleWrap: {
    position: 'absolute',
  },
  toggle: {
    width: TOGGLE_SIZE,
    height: TOGGLE_SIZE,
    borderRadius: TOGGLE_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
