// Reanimated 4 needs its native worklets runtime even through its own mock, so the few APIs the menu
// uses are replaced by plain ones: values jump to their target and the end callback fires after the
// animation's duration, so tests can tell "while closing" from "closed" with fake timers.
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  const identity = (value) => value;
  const easing = () => identity;
  return {
    __esModule: true,
    default: { View },
    Easing: { in: easing, out: easing, cubic: identity },
    cancelAnimation: () => {},
    runOnJS: identity,
    useSharedValue: (value) => require('react').useRef({ value }).current,
    useAnimatedStyle: (factory) => factory(),
    withTiming: (value, config, callback) => {
      if (callback) setTimeout(() => callback(true), config?.duration ?? 0);
      return value;
    },
  };
});

// The real icon set loads its font through expo-asset, which has nothing to load in Jest.
jest.mock('@expo/vector-icons/Ionicons', () => {
  const { Text } = require('react-native');
  const Ionicons = ({ name }) => require('react').createElement(Text, null, name);
  Ionicons.glyphMap = {};
  return { __esModule: true, default: Ionicons };
});
