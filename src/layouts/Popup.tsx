import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { popupPanel } from '../effects';
import { useInsets } from '../motion';
import type { LayoutProps } from './shared';

/** The menu fills the screen, fading and growing in, with a close button in the corner. */
export function PopupLayout({
  progress,
  mounted,
  theme,
  renderPanel,
  children,
  onClose,
  closeLabel,
  statusBar,
  testID,
}: LayoutProps) {
  const insets = useInsets();
  const panelStyle = useAnimatedStyle(() => popupPanel(progress.value));

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
        <Animated.View style={[styles.root, { backgroundColor: theme.background }, panelStyle]}>
          <View style={styles.content}>
            {renderPanel({
              compact: false,
              paddingTop: insets.top + 64,
              paddingBottom: insets.bottom + 16,
            })}
          </View>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            style={[styles.close, { top: insets.top + 12, backgroundColor: theme.itemPressed }]}
            accessibilityRole="button"
            accessibilityLabel={closeLabel}
            testID={testID ? `${testID}-close` : undefined}>
            <Ionicons name="close" size={22} color={theme.text} />
          </Pressable>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  close: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
