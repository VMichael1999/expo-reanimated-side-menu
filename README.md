# expo-reanimated-side-menu

🌐 **English** | [Español](https://github.com/VMichael1999/expo-reanimated-side-menu/blob/main/README.es.md)

A polished side menu (drawer) for **Expo** and **React Native**. It slides in with Reanimated over a fading backdrop, closes with a swipe, and comes with a profile header, titled sections, badges, a highlighted action button and a logout row. Every color and font can be changed.

[![CI](https://github.com/VMichael1999/expo-reanimated-side-menu/actions/workflows/ci.yml/badge.svg)](https://github.com/VMichael1999/expo-reanimated-side-menu/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/VMichael1999/expo-reanimated-side-menu/blob/main/LICENSE)
![Platforms: iOS | Android](https://img.shields.io/badge/platforms-iOS%20%7C%20Android-111519)

## Screenshots

Taken with the [example app](#example-app) on an iPhone 17 Pro Max simulator.

<p align="center">
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/01-dark.png" width="200" alt="Dark menu with profile, sections, the accent action and logout"/>
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/02-light.png" width="200" alt="The same menu with a light theme"/>
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/03-right.png" width="200" alt="Menu opening from the right edge"/>
</p>

1. **Default theme**: dark panel with a lime accent.
2. **Light theme**: just a `theme` object.
3. **`side="right"`**: opens from the other edge.

## Features

- Slides in and out with **Reanimated**, on the UI thread.
- **Swipe to close**: drag the panel towards its edge; let go past a third of it, or flick it, and it closes.
- Rendered in a `Modal`, so it covers the whole app, headers and tab bars included. The Android back button closes it.
- Switches the **status bar** to light or dark text to match the panel while it is open.
- **Actions run after the menu closes**, so navigating never fights the closing animation.
- **Profile header** with avatar, title and subtitle, or your own header.
- **Sections** with optional titles, **badges**, a highlighted **action** button and a **logout** row.
- Opens from the **left or right**, with any **width**.
- **Theming** of every color and font; works with your own icons too.
- Written in TypeScript, no native code of its own: works in Expo Go.

## Requirements

| Package | Version |
| --- | --- |
| `react-native-reanimated` | 3.6 or later (4.x included) |
| `react-native-safe-area-context` | 4 or later |
| `@expo/vector-icons` | 14 or later, with `expo-font` |

Install them with the command below; `expo-font` and `expo-asset` load the icon font. In a bare React Native app, install and set up Reanimated following [its guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started).

## Installation

```sh
npx expo install expo-reanimated-side-menu react-native-reanimated react-native-safe-area-context @expo/vector-icons expo-font expo-asset
```

Wrap your app in `SafeAreaProvider` (Expo Router already does it). The menu reads the safe area from it, because a `Modal` loses it on iOS.

## Quick start

```tsx
import { useState } from 'react';
import { Button } from 'react-native';
import { SideMenu } from 'expo-reanimated-side-menu';

export function Home({ navigation }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button title="Menu" onPress={() => setOpen(true)} />
      <SideMenu
        visible={open}
        onClose={() => setOpen(false)}
        profile={{ title: 'My profile', subtitle: '+1 555 0100', onPress: () => navigation.navigate('Profile') }}
        sections={[
          {
            key: 'main',
            title: 'Navigation',
            items: [
              { key: 'trips', label: 'My trips', icon: 'time-outline', onPress: () => navigation.navigate('Trips') },
              { key: 'inbox', label: 'Inbox', icon: 'mail-outline', badge: 3, onPress: () => navigation.navigate('Inbox') },
            ],
          },
        ]}
        logout={{ onPress: signOut }}
        footerText="Version 1.0.0"
      />
    </>
  );
}
```

The menu is controlled: you own `visible` and set it back to `false` in `onClose`. Tapping an item calls `onClose` first and runs the item's `onPress` once the panel is gone.

## Guide

### Sections and items

Each section has a `key`, an optional `title` and its `items`. An item's `icon` is an [Ionicons](https://icons.expo.fyi) name or any element:

```tsx
{ key: 'cart', label: 'Cart', icon: <MyCartIcon />, badge: 2, onPress: openCart }
```

### Header

`profile` draws an avatar, a title and a subtitle. `avatar` takes an image (`require(...)` or `{ uri }`) or an element; without it a person icon is shown. With `onPress`, the header shows a chevron and becomes a button.

For something else entirely, pass your own `header` element instead.

### Highlighted action

`action` is a full-width button under the sections, handy to switch between two modes of an app:

```tsx
action={{
  label: deliveryMode ? 'Back to rides' : 'Delivery mode',
  icon: deliveryMode ? 'car-outline' : 'bag-outline',
  variant: deliveryMode ? 'outline' : 'accent',
  onPress: toggleMode,
}}
```

### Logout and footer

`logout` adds a row in the danger color at the bottom (`label` defaults to `'Log out'`). `footerText` adds a small centered text below it, such as the app version.

### Side, width and timing

```tsx
<SideMenu side="right" width={320} openDuration={300} closeDuration={220} swipeToClose={false} ... />
```

The list scrolls only when its items don't fit; while they fit, a drag anywhere on the panel closes it.

`width` up to `1` is a fraction of the screen (the default is `0.78`); larger values are points. It never goes past the screen.

### Theming

Override any color or font; the rest keep their defaults:

```tsx
<SideMenu
  theme={{
    background: '#FFFFFF',
    text: '#111519',
    textSecondary: '#5B6470',
    textMuted: '#8A939E',
    divider: '#E6E9ED',
    accent: '#3D5AFE',
    onAccent: '#FFFFFF',
    fonts: { regular: 'Inter-Regular', semibold: 'Inter-SemiBold', bold: 'Inter-Bold' },
  }}
  ...
/>
```

Without `fonts`, the system font is used at the right weights. `defaultTheme` is exported if you want to build on it.

## API reference

### `SideMenu` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | | Whether the menu is open. |
| `onClose` | `() => void` | | Backdrop tap, swipe, Android back, or before an item runs. |
| `sections` | `SideMenuSection[]` | | The menu content. |
| `profile` | `SideMenuProfile` | | Avatar, title, subtitle and `onPress`. |
| `header` | `ReactNode` | | Replaces `profile`. |
| `action` | `SideMenuAction` | | Highlighted button: `label`, `icon`, `onPress`, `variant`. |
| `logout` | `SideMenuLogout` | | `label`, `icon`, `onPress`. |
| `footerText` | `string` | | Small text at the bottom. |
| `side` | `'left' \| 'right'` | `'left'` | Edge it slides from. |
| `width` | `number` | `0.78` | Fraction of the screen, or points. |
| `theme` | `SideMenuThemeOverrides` | | Colors and fonts. |
| `swipeToClose` | `boolean` | `true` | Drag to close. |
| `openDuration` | `number` | `240` | Milliseconds. |
| `closeDuration` | `number` | `200` | Milliseconds. |
| `statusBarStyle` | `'light-content' \| 'dark-content'` | from `theme.background` | Status bar text while open. |
| `closeLabel` | `string` | `'Close menu'` | Accessibility label of the backdrop. |
| `testID` | `string` | | The backdrop gets `${testID}-backdrop`. |

### Theme keys

`background`, `text`, `textSecondary`, `textMuted`, `divider`, `avatarBackground`, `itemPressed`, `accent`, `onAccent`, `danger`, `backdrop` and `fonts` (`regular`, `semibold`, `bold`).

## Example app

The [`example`](https://github.com/VMichael1999/expo-reanimated-side-menu/tree/main/example) folder has an Expo app that loads the package straight from `src`, with switches for the side and the theme:

```sh
npm install
cd example
npm install
npx expo run:ios   # or: npx expo run:android
```

## Development

```sh
npm install
npm run typecheck
npm test
npm run build
```

Without [Watchman](https://facebook.github.io/watchman/), Metro may miss edits in `src` while the example is running; restart it with `npx expo start --clear`.

## License

[MIT](https://github.com/VMichael1999/expo-reanimated-side-menu/blob/main/LICENSE) © Michael Valdiviezo
