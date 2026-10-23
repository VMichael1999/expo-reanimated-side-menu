# Changelog

## 0.1.0 (unreleased)

First release of `expo-reanimated-side-menu`, extracted from the side menu built for the Run Rider app and turned into a generic package.

### 🎉 New features

- `SideMenu`: side panel that slides in with Reanimated over a fading backdrop, inside a `Modal` so it covers the whole app, navigation bars included.
- Swipe the panel towards its edge to close it (`swipeToClose`), or tap the backdrop, or press the Android back button.
- Item actions run once the menu has finished closing, so the next screen never fights the animation.
- `sections` with optional titles, Ionicons names or your own elements as icons, and `badge` counters.
- `profile` header with avatar, title, subtitle and an optional `onPress`; or your own `header`.
- Highlighted `action` button (`accent` or `outline`), `logout` row and `footerText`.
- `side` (`left` / `right`), `width` (fraction of the screen or points), `openDuration` / `closeDuration`.
- `theme`: every color and the fonts can be overridden; `defaultTheme` is exported.
- The status bar switches to light or dark text to match the panel while the menu is open (`statusBarStyle` to force it).
