import Ionicons from '@expo/vector-icons/Ionicons';
import {
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import {
  Image,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaInsetsContext, initialWindowMetrics } from 'react-native-safe-area-context';

import { MenuIcon } from './MenuIcon';
import { fontStyle, isDarkColor, resolveTheme, resolveWidth } from './theme';
import type { SideMenuProps } from './types';

const NO_INSETS = { top: 0, bottom: 0, left: 0, right: 0 };
/** Share of the panel that has to be dragged away before letting go closes it. */
const SWIPE_CLOSE_DISTANCE = 0.35;
const SWIPE_CLOSE_VELOCITY = 0.6;

export function SideMenu({
  visible,
  onClose,
  sections,
  profile,
  header,
  action,
  logout,
  footerText,
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
  // Inside a Modal the native safe area is lost on iOS, so the insets come from the app's provider.
  const insets = useContext(SafeAreaInsetsContext) ?? initialWindowMetrics?.insets ?? NO_INSETS;

  const [mounted, setMounted] = useState(visible);
  const mountedRef = useRef(visible);
  // 0 = fully open, panelWidth = fully closed.
  const offset = useSharedValue(visible ? 0 : panelWidth);
  const dragStart = useRef(0);
  const pendingAction = useRef<(() => void) | null>(null);
  // A UIScrollView takes over any drag on iOS, swipe-to-close included, so the list only scrolls
  // when its content does not fit.
  const [listHeight, setListHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const finishClose = () => {
    mountedRef.current = false;
    setMounted(false);
    const next = pendingAction.current;
    pendingAction.current = null;
    next?.();
  };

  useEffect(() => {
    if (visible) {
      if (!mountedRef.current) offset.value = panelWidth;
      mountedRef.current = true;
      setMounted(true);
      offset.value = withTiming(0, { duration: openDuration, easing: Easing.out(Easing.cubic) });
      return;
    }
    if (!mountedRef.current) return;
    offset.value = withTiming(
      panelWidth,
      { duration: closeDuration, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(finishClose)();
      }
    );
    // finishClose only reads refs and setters, so a stale copy behaves the same.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, panelWidth, openDuration, closeDuration, offset]);

  const panResponder = useMemo(() => {
    const towardsEdge = (dx: number) => (side === 'left' ? -dx : dx);
    const isCloseDrag = (dx: number, dy: number) =>
      swipeToClose && towardsEdge(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.5;
    return PanResponder.create({
      // Capture phase: the panel claims horizontal drags before the ScrollView inside it can.
      onMoveShouldSetPanResponderCapture: (_, gesture) => isCloseDrag(gesture.dx, gesture.dy),
      onMoveShouldSetPanResponder: (_, gesture) => isCloseDrag(gesture.dx, gesture.dy),
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        cancelAnimation(offset);
        dragStart.current = offset.value;
      },
      onPanResponderMove: (_, gesture) => {
        const next = dragStart.current + towardsEdge(gesture.dx);
        offset.value = Math.min(Math.max(next, 0), panelWidth);
      },
      onPanResponderRelease: (_, gesture) => {
        const dragged = dragStart.current + towardsEdge(gesture.dx);
        if (
          dragged > panelWidth * SWIPE_CLOSE_DISTANCE ||
          towardsEdge(gesture.vx) > SWIPE_CLOSE_VELOCITY
        ) {
          onCloseRef.current();
        } else {
          offset.value = withTiming(0, { duration: 160, easing: Easing.out(Easing.cubic) });
        }
      },
      onPanResponderTerminate: () => {
        offset.value = withTiming(0, { duration: 160, easing: Easing.out(Easing.cubic) });
      },
    });
  }, [side, swipeToClose, panelWidth, offset]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: side === 'left' ? -offset.value : offset.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: panelWidth > 0 ? 1 - offset.value / panelWidth : 0,
  }));

  /** Closes the menu and runs `next` once it is out of the way. */
  const closeThen = (next: () => void) => {
    pendingAction.current = next;
    onClose();
  };

  const regular = fontStyle(theme.fonts.regular, '400');
  const semibold = fontStyle(theme.fonts.semibold, '600');
  const bold = fontStyle(theme.fonts.bold, '700');
  const accentAction = action?.variant !== 'outline';
  const actionColor = accentAction ? theme.onAccent : theme.text;

  return (
    <>
      {/* Outside the Modal: on iOS the modal reads the style only when it is presented. Rendered only
          while the menu is mounted, so the app's own style comes back once it closes. */}
      {mounted ? (
        <StatusBar
          barStyle={
            statusBarStyle ?? (isDarkColor(theme.background) ? 'light-content' : 'dark-content')
          }
          animated
        />
      ) : null}
      <Modal
        visible={mounted}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={onClose}
        testID={testID}>
        <View style={styles.root}>
          <Animated.View
            style={[styles.backdrop, { backgroundColor: theme.backdrop }, backdropStyle]}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={closeLabel}
              testID={testID ? `${testID}-backdrop` : undefined}
            />
          </Animated.View>

          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.panel,
              side === 'left' ? styles.panelLeft : styles.panelRight,
              { width: panelWidth, backgroundColor: theme.background },
              panelStyle,
            ]}>
            <View
              style={[
                styles.content,
                { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 },
              ]}>
              {header ??
                (profile ? (
                  <Pressable
                    style={styles.profile}
                    onPress={profile.onPress ? () => closeThen(profile.onPress!) : undefined}
                    disabled={!profile.onPress}
                    accessibilityRole={profile.onPress ? 'button' : undefined}
                    accessibilityLabel={profile.accessibilityLabel ?? profile.title}>
                    <View style={[styles.avatar, { backgroundColor: theme.avatarBackground }]}>
                      <Avatar avatar={profile.avatar} color={theme.text} />
                    </View>
                    <View style={styles.profileText}>
                      <Text
                        style={[styles.profileTitle, bold, { color: theme.text }]}
                        numberOfLines={1}>
                        {profile.title}
                      </Text>
                      {profile.subtitle ? (
                        <Text
                          style={[styles.profileSubtitle, regular, { color: theme.textSecondary }]}
                          numberOfLines={1}>
                          {profile.subtitle}
                        </Text>
                      ) : null}
                    </View>
                    {profile.onPress ? (
                      <Ionicons name="chevron-forward" size={20} color={theme.text} />
                    ) : null}
                  </Pressable>
                ) : null)}

              {header || profile ? (
                <View style={[styles.divider, { backgroundColor: theme.divider }]} />
              ) : null}

              <ScrollView
                scrollEnabled={contentHeight > listHeight + 1}
                bounces={false}
                onLayout={(event) => setListHeight(event.nativeEvent.layout.height)}
                onContentSizeChange={(_, height) => setContentHeight(height)}
                style={styles.sections}
                contentContainerStyle={styles.sectionsContent}
                showsVerticalScrollIndicator={false}>
                {sections.map((section) => (
                  <View key={section.key} style={styles.section}>
                    {section.title ? (
                      <Text style={[styles.sectionTitle, bold, { color: theme.textMuted }]}>
                        {section.title}
                      </Text>
                    ) : null}
                    {section.items.map((item) => (
                      <Pressable
                        key={item.key}
                        onPress={() => closeThen(item.onPress)}
                        style={({ pressed }) => [
                          styles.item,
                          pressed && { backgroundColor: theme.itemPressed },
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={item.accessibilityLabel ?? item.label}>
                        {item.icon ? (
                          <MenuIcon icon={item.icon} size={22} color={theme.text} />
                        ) : null}
                        <Text
                          style={[styles.itemLabel, bold, { color: theme.text }]}
                          numberOfLines={1}>
                          {item.label}
                        </Text>
                        {item.badge !== undefined ? (
                          <View style={[styles.badge, { backgroundColor: theme.accent }]}>
                            <Text style={[styles.badgeText, bold, { color: theme.onAccent }]}>
                              {item.badge}
                            </Text>
                          </View>
                        ) : null}
                      </Pressable>
                    ))}
                  </View>
                ))}
              </ScrollView>

              {action ? (
                <Pressable
                  onPress={() => closeThen(action.onPress)}
                  style={({ pressed }) => [
                    styles.action,
                    accentAction
                      ? { backgroundColor: theme.accent }
                      : { borderWidth: 1, borderColor: theme.divider },
                    pressed && styles.actionPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={action.accessibilityLabel ?? action.label}>
                  {action.icon ? (
                    <MenuIcon icon={action.icon} size={20} color={actionColor} />
                  ) : null}
                  <Text
                    style={[styles.actionLabel, semibold, { color: actionColor }]}
                    numberOfLines={1}>
                    {action.label}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={actionColor}
                    style={styles.actionArrow}
                  />
                </Pressable>
              ) : null}

              {logout ? (
                <>
                  <View style={[styles.divider, { backgroundColor: theme.divider }]} />
                  <Pressable
                    onPress={() => closeThen(logout.onPress)}
                    style={({ pressed }) => [
                      styles.item,
                      pressed && { backgroundColor: theme.itemPressed },
                    ]}
                    accessibilityRole="button">
                    <MenuIcon
                      icon={logout.icon ?? 'log-out-outline'}
                      size={22}
                      color={theme.danger}
                    />
                    <Text style={[styles.itemLabel, bold, { color: theme.danger }]}>
                      {logout.label ?? 'Log out'}
                    </Text>
                  </Pressable>
                </>
              ) : null}

              {footerText ? (
                <Text style={[styles.footer, regular, { color: theme.textMuted }]}>
                  {footerText}
                </Text>
              ) : null}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

function Avatar({ avatar, color }: { avatar?: ImageSourcePropType | ReactElement; color: string }) {
  if (!avatar) return <Ionicons name="person" size={34} color={color} />;
  if (isValidElement(avatar)) return avatar;
  return <Image source={avatar as ImageSourcePropType} style={styles.avatarImage} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  // absoluteFillObject no longer exists in recent React Native, so the edges are spelled out.
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  panelLeft: {
    left: 0,
  },
  panelRight: {
    right: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 60,
    height: 60,
  },
  profileText: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 18,
    marginBottom: 2,
  },
  profileSubtitle: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  sections: {
    flex: 1,
  },
  sectionsContent: {
    paddingVertical: 8,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 4,
  },
  itemLabel: {
    flex: 1,
    fontSize: 16,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
  },
  action: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionLabel: {
    flexShrink: 1,
    fontSize: 15.5,
  },
  actionArrow: {
    marginLeft: 'auto',
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 8,
  },
});
