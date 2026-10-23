# Changelog

## 0.2.0 (2026-10-23)

### 🎉 New features

- `order`: choose which blocks of the panel are shown and in what order (`header`, `sections`, `action`, `logout`, `profile`, `footerText`, `footer`), and place `divider` lines wherever you want, as many as you want. With your own `order`, only the dividers you list are drawn.
- `divider` on a section draws a line above it.
- Sections can hold your own `content`, under their items or on their own as a free block between sections; `items` is now optional.
- Items: `subtitle`, `trailing` (any element at the end of the row, e.g. a switch), `render` (draw the whole row yourself) and an optional `onPress` for rows that are not pressable.
- `panelStyle`: padding, background and borders of the panel's inner container.

## 0.1.0 (2026-10-22)

First release of `expo-reanimated-side-menu`, extracted from the side menu built for the Run Rider app and turned into a generic package.

### 🎉 New features

- `variant`: eight ways to present the same menu. `overlay` (the default), plus React Native versions of the designs of four Flutter packages: `reveal` (flutter_advanced_drawer), `cards`, `flip`, `push` and `popup` (awesome_drawer_bar), `floating` (sidebarx) and `rail` (flutter_side_menu).
- `floating` folds down to icons only with the button at its foot; `rail` stays on screen, open or compact, with a toggle button and a drag handle on its edge (`rail`, `onOpen`).
- `selectedKey` highlights the current item; `badgeColor` colors a badge; `profile.position: 'bottom'` draws the profile as a card at the foot of the panel.
- `themes`: ready-made palettes (`night`, `midnight`, `ocean`, `paper`, `slate`).
- `backdrop`: drawn behind the screen in the variants where the panel waits behind it.

- `SideMenu`: side panel that slides in with Reanimated over a fading backdrop, inside a `Modal` so it covers the whole app, navigation bars included.
- `children` and `scene`: the wrapped screen moves aside while the menu opens, turned in 3D (`tilt`, the default), pushed (`slide`) or still (`none`), with adjustable `offset`, `scale`, `rotate` and `borderRadius`.
- Swipe the panel towards its edge to close it (`swipeToClose`), or tap the backdrop, or press the Android back button.
- Item actions run once the menu has finished closing, so the next screen never fights the animation.
- `sections` with optional titles, Ionicons names or your own elements as icons, and `badge` counters.
- `profile` header with avatar, title, subtitle and an optional `onPress`.
- Every piece is optional; `header`, `footer` and `content` take your own elements, or functions that receive `close` and `closeThen`. Items can have their own `color`.
- Highlighted `action` button (`accent` or `outline`), `logout` row and `footerText`.
- `side` (`left` / `right`), `width` (fraction of the screen or points), `openDuration` / `closeDuration`.
- `theme`: every color and the fonts can be overridden; `defaultTheme` is exported.
- The status bar switches to light or dark text to match the panel while the menu is open (`statusBarStyle` to force it).
