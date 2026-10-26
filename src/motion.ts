import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, PanResponder, type GestureResponderHandlers } from 'react-native';
import {
  Easing,
  cancelAnimation,
  runOnJS,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { SafeAreaInsetsContext, initialWindowMetrics } from 'react-native-safe-area-context';

const NO_INSETS = { top: 0, bottom: 0, left: 0, right: 0 };
/** Share of the way back that has to be dragged before letting go closes the menu. */
const SWIPE_CLOSE_DISTANCE = 0.35;
const SWIPE_CLOSE_VELOCITY = 0.6;

/** The app's safe area. Inside a Modal it is lost on iOS, so it comes from the provider. */
export function useInsets() {
  return useContext(SafeAreaInsetsContext) ?? initialWindowMetrics?.insets ?? NO_INSETS;
}

interface MenuProgressOptions {
  visible: boolean;
  openDuration: number;
  closeDuration: number;
  /** Keeps the menu on screen while closed (the rail is always there). */
  keepMounted?: boolean;
}

/**
 * Drives every variant: `progress` goes from 0 (closed) to 1 (open). The menu stays mounted until
 * the closing animation ends, and an action queued with `queue` runs right after that.
 */
export function useMenuProgress({
  visible,
  openDuration,
  closeDuration,
  keepMounted = false,
}: MenuProgressOptions) {
  const [mounted, setMounted] = useState(visible || keepMounted);
  const mountedRef = useRef(visible || keepMounted);
  const progress = useSharedValue(visible ? 1 : 0);
  const pending = useRef<(() => void) | null>(null);
  const keepMountedRef = useRef(keepMounted);
  keepMountedRef.current = keepMounted;

  const finishClose = () => {
    if (!keepMountedRef.current) {
      mountedRef.current = false;
      setMounted(false);
    }
    const next = pending.current;
    pending.current = null;
    next?.();
  };

  useEffect(() => {
    if (visible) {
      // Reopened before it finished closing: the action queued by that close is dropped, or it
      // would run on some later, unrelated close.
      pending.current = null;
      mountedRef.current = true;
      setMounted(true);
      progress.value = withTiming(1, { duration: openDuration, easing: Easing.out(Easing.cubic) });
      return;
    }
    if (!mountedRef.current) return;
    progress.value = withTiming(
      0,
      { duration: closeDuration, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(finishClose)();
      }
    );
    // finishClose only reads refs and setters, so a stale copy behaves the same.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, openDuration, closeDuration, progress]);

  // Switching to or from the rail (the only variant that stays on screen while closed): a closed
  // menu that was kept mounted for the rail must unmount, or the next variant would treat it as
  // open and lay its tap-to-close layer over the screen.
  useEffect(() => {
    if (keepMounted) {
      mountedRef.current = true;
      setMounted(true);
      return;
    }
    if (!visible && mountedRef.current) {
      cancelAnimation(progress);
      progress.value = 0;
      mountedRef.current = false;
      setMounted(false);
    }
    // Only a change of keepMounted matters here; `visible` is handled above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keepMounted]);

  const queue = (action: () => void) => {
    pending.current = action;
  };

  return { progress, mounted, queue };
}

interface CloseSwipeOptions {
  progress: SharedValue<number>;
  /** Points of drag that take the menu from open to closed. */
  distance: number;
  side: 'left' | 'right';
  enabled: boolean;
  onClose: () => void;
}

/**
 * Dragging towards the panel's edge closes the menu: the panel (or the screen, in the variants
 * where the panel waits behind it) follows the finger, and letting go far or fast enough closes it.
 */
export function useCloseSwipe({
  progress,
  distance,
  side,
  enabled,
  onClose,
}: CloseSwipeOptions): GestureResponderHandlers {
  const start = useRef(1);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  return useMemo(() => {
    const towardsEdge = (dx: number) => (side === 'left' ? -dx : dx);
    const isCloseDrag = (dx: number, dy: number) =>
      enabled && towardsEdge(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.5;
    const settle = () => {
      progress.value = withTiming(1, { duration: 160, easing: Easing.out(Easing.cubic) });
    };
    const followFinger = (dx: number) =>
      Math.min(Math.max(start.current - towardsEdge(dx) / Math.max(distance, 1), 0), 1);

    return PanResponder.create({
      // Capture phase: claims horizontal drags before a ScrollView inside can.
      onMoveShouldSetPanResponderCapture: (_, gesture) => isCloseDrag(gesture.dx, gesture.dy),
      onMoveShouldSetPanResponder: (_, gesture) => isCloseDrag(gesture.dx, gesture.dy),
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        cancelAnimation(progress);
        start.current = progress.value;
      },
      onPanResponderMove: (_, gesture) => {
        progress.value = followFinger(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        if (
          followFinger(gesture.dx) < 1 - SWIPE_CLOSE_DISTANCE ||
          towardsEdge(gesture.vx) > SWIPE_CLOSE_VELOCITY
        ) {
          onCloseRef.current();
        } else {
          settle();
        }
      },
      onPanResponderTerminate: settle,
    }).panHandlers;
  }, [progress, distance, side, enabled]);
}

/** The Android back button closes the menu (a Modal already does this on its own). */
export function useBackToClose(active: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!active) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onCloseRef.current();
      return true;
    });
    return () => subscription.remove();
  }, [active]);
}
