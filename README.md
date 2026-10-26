# expo-reanimated-side-menu

🌐 **English** | [Español](https://github.com/VMichael1999/expo-reanimated-side-menu/blob/main/README.es.md)

A polished side menu for **Expo** and **React Native** with **eight presentation styles** behind one component: a panel over a screen turned in 3D, a screen that slides away to reveal the menu, tilted cards, a 3D flip, a push, a full-screen popup, a floating card that folds to icons, and a docked rail. Everything runs on Reanimated, closes with a swipe, and everything inside the panel is up to you.

[![CI](https://github.com/VMichael1999/expo-reanimated-side-menu/actions/workflows/ci.yml/badge.svg)](https://github.com/VMichael1999/expo-reanimated-side-menu/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/VMichael1999/expo-reanimated-side-menu/blob/main/LICENSE)
![Platforms: iOS | Android](https://img.shields.io/badge/platforms-iOS%20%7C%20Android-111519)

## Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/overlay.png" width="23%" alt="overlay"/>
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/reveal.png" width="23%" alt="reveal"/>
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/cards.png" width="23%" alt="cards"/>
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/flip.png" width="23%" alt="flip"/>
</p>
<p align="center"><code>overlay</code> &nbsp;·&nbsp; <code>reveal</code> &nbsp;·&nbsp; <code>cards</code> &nbsp;·&nbsp; <code>flip</code></p>

<p align="center">
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/push.png" width="23%" alt="push"/>
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/popup.png" width="23%" alt="popup"/>
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/floating.png" width="23%" alt="floating"/>
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/rail.png" width="23%" alt="rail"/>
</p>
<p align="center"><code>push</code> &nbsp;·&nbsp; <code>popup</code> &nbsp;·&nbsp; <code>floating</code> &nbsp;·&nbsp; <code>rail</code></p>

<p align="center">
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/floating-compact.png" width="23%" alt="floating compact"/>
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/rail-compact.png" width="23%" alt="rail compact"/>
</p>
<p align="center"><code>floating</code> (compact) &nbsp;·&nbsp; <code>rail</code> (compact)</p>

## Features

- **Eight styles** with one API: switch `variant` and the same sections, profile and theme are presented differently.
- Runs on **Reanimated**, on the UI thread, and follows your finger: **swipe** the panel (or the screen) back to close.
- **Actions run after the menu closes**, so navigating never fights the closing animation.
- **100% customizable content**: choose which blocks appear and in what order (`order`), put your own content between sections, give items subtitles, switches or a fully custom look, or replace the whole panel. Ready-made pieces included: profile, titled sections, **badges** in any color, the item you are on (`selectedKey`), a highlighted **action** button, a **logout** row and footer text.
- **Ready-made palettes** (`themes`) and full **theming** of every color and font.
- Opens from the **left or right**; the Android back button closes it; the **status bar** follows the panel color.
- Written in TypeScript, no native code of its own: works in Expo Go.

## Styles

| `variant` | What it does |
| --- | --- |
| `overlay` (default) | The panel slides over your screen, which shifts, shrinks and turns in 3D behind it (`scene`). |
| `reveal` | The panel waits behind your screen, which slides 75% away and shrinks to 85%; the panel grows into place. |
| `cards` | Like `reveal`, but the screen tilts 12° like a card, with two ghost cards behind it. |
| `flip` | The screen swings 45° away in 3D on its outer edge. |
| `push` | The panel slides in and pushes your screen aside, dimming it. |
| `popup` | The menu fills the screen, fading and growing in, with a close button. |
| `floating` | A rounded card floating over the app, with a button to fold it down to icons. |
| `rail` | Always on screen next to your content; `visible` switches it between open and compact. A button and a handle on its edge open or fold it. |

## Requirements

| Package | Version |
| --- | --- |
| `react-native` | 0.74 or later |
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

Wrap the screen that opens the menu; that screen is what moves aside:

```tsx
import { useState } from 'react';
import { Button, View } from 'react-native';
import { SideMenu, themes } from 'expo-reanimated-side-menu';

export function Dashboard({ navigation }) {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState('home');
  const go = (key: string) => () => {
    setScreen(key);
    navigation.navigate(key);
  };

  return (
    <SideMenu
      variant="reveal"
      theme={themes.slate}
      visible={open}
      onClose={() => setOpen(false)}
      selectedKey={screen}
      profile={{ title: 'Michael Valdiviezo', subtitle: 'michael@store.com', onPress: go('profile') }}
      sections={[
        {
          key: 'main',
          title: 'Main',
          items: [
            { key: 'home', label: 'Home', icon: 'grid-outline', onPress: go('home') },
            { key: 'orders', label: 'Orders', icon: 'receipt-outline', badge: 12, onPress: go('orders') },
          ],
        },
      ]}
      logout={{ onPress: signOut }}
      footerText="Version 2.4">
      {/* Your screen */}
      <View style={{ flex: 1 }}>
        <Button title="Menu" onPress={() => setOpen(true)} />
      </View>
    </SideMenu>
  );
}
```

The menu is controlled: you own `visible` and set it back to `false` in `onClose`. Tapping an item calls `onClose` first and runs the item's `onPress` once the menu is gone (the `rail` never closes, so it runs it right away).

Give your screen a background color: in the styles where the screen moves away, the panel color shows around it.

## Guide

### Choosing a style

Pass `variant`. Each one reuses everything else you pass, so trying them is a one-word change. The [example app](#example-app) has a switch for each, plus the palettes.

The `overlay` style also takes a `scene` for the screen behind the panel:

```tsx
<SideMenu scene={{ effect: 'tilt' }} ...>   {/* default: shifted, shrunk and turned in 3D */}
<SideMenu scene={{ effect: 'slide' }} ...>  {/* pushed aside by the panel's width */}
<SideMenu scene={{ effect: 'none' }} ...>   {/* stays where it is */}
<SideMenu scene={{ effect: 'tilt', offset: 0.6, scale: 0.8, rotate: 12, borderRadius: 32 }} ...>
```

In `reveal`, `cards`, `flip` and `push` the panel waits behind your screen; draw something behind it with `backdrop` (e.g. a gradient). Tapping or dragging the screen closes the menu.

### The rail

`rail` is always visible. `visible` means open (labels shown) and `false` means compact (icons only); give it `onOpen` too, because its edge button and handle can ask to open:

```tsx
<SideMenu
  variant="rail"
  visible={railOpen}
  onOpen={() => setRailOpen(true)}
  onClose={() => setRailOpen(false)}
  rail={{ compactWidth: 64, openWidth: 250, resizable: true }}
  ...>
  <Dashboard />
</SideMenu>
```

In the rail the `profile` sits at the bottom as a rounded card, and section titles are drawn in capitals with a divider between sections.

### The floating card

`floating` opens expanded, and the button at its foot folds it down to icons and back. Badges become dots while folded.

### Sections and items

Each section has a `key`, an optional `title` and its `items`. An item's `icon` is an [Ionicons](https://icons.expo.fyi) name or any element:

```tsx
{ key: 'cart', label: 'Cart', icon: <MyCartIcon />, badge: 2, onPress: openCart }
{ key: 'chat', label: 'Chat', icon: 'chatbubble-outline', badge: 8, badgeColor: '#FFC21A', onPress: openChat }
{ key: 'delete', label: 'Delete account', icon: 'trash-outline', color: '#E5484D', onPress: deleteAccount }
```

`selectedKey` marks the item you are on: it gets a background (a line on its edge in the rail, a lifted look in the floating card) and the rest are dimmed.

### Profile

`profile` draws an avatar, a title and a subtitle. `avatar` takes an image (`require(...)` or `{ uri }`) or an element; without it a person icon is shown. With `onPress` it becomes a button. `position: 'bottom'` turns it into a rounded card at the foot of the panel (the default in the rail).

### Highlighted action, logout and footer

`action` is a full-width button under the sections (`accent` or `outline`). `logout` adds a row in the danger color (`label` defaults to `'Log out'`). `footerText` adds a small centered text, such as the app version.

### Your own content: you decide what goes in and where

Everything inside the panel is yours to choose.

**1. Pick the blocks, their order and the lines between them.** `order` lists the blocks from top to bottom; whatever you leave out is hidden, and `divider` draws a line wherever you put it, as many times as you like:

```tsx
<SideMenu order={['header', 'divider', 'sections', 'action']} ... />          // no logout, one line
<SideMenu order={['logout', 'divider', 'header', 'sections', 'footer']} ... /> // logout on top
<SideMenu order={['header', 'sections', 'logout']} ... />                      // no lines at all
```

With your own `order`, only the dividers you list are drawn. Without it, every block is shown, with a line under the header and another above the logout row.

| Block | What it draws |
| --- | --- |
| `header` | Your `header`, or the profile when it sits at the top |
| `sections` | The sections and their items (the part that scrolls) |
| `action` | The highlighted button |
| `logout` | The logout row |
| `profile` | The profile card, when `profile.position` is `'bottom'` |
| `footerText` | The small footer text |
| `footer` | Your `footer` |
| `divider` | A line; repeat it as often as you want |

A section can also draw a line above itself with `divider: true` (or drop the one the rail adds with `divider: false`).

**2. Put anything between the sections.** A section can hold your own `content`, under its items or on its own:

```tsx
sections={[
  { key: 'main', title: 'Main', items: [...] },
  { key: 'promo', content: <PromoBanner /> },          // a free block between sections
  { key: 'more', title: 'More', items: [...], content: <Text>Need help? Write to us</Text> },
]}
```

**3. Shape each item.** Add a `subtitle`, put a switch or any element at the end with `trailing`, leave out `onPress` for rows that only hold a control, or draw the whole row with `render`:

```tsx
{ key: 'plan', label: 'Plan', subtitle: 'Pro until May', icon: 'star-outline', onPress: openPlan }
{ key: 'dark', label: 'Dark mode', icon: 'moon-outline', trailing: <Switch value={dark} onValueChange={setDark} /> }
{ key: 'store', label: 'My store', onPress: openStore, render: ({ selected, color }) => <StoreRow active={selected} tint={color} /> }
```

A row drawn with `render` keeps its press handling and its selected background.

**4. Your own header, footer, or the whole panel.**

- `header`: replaces the profile header.
- `footer`: added at the bottom of the panel.
- `content`: replaces everything inside the panel, for a fully custom layout.

Each one (and a section's `content`) takes an element, or a function that receives `close`, `closeThen` and `compact` (whether the panel shows icons only):

```tsx
<SideMenu
  header={({ compact }) => (compact ? <Logo /> : <LogoWithSearch />)}
  footer={({ closeThen }) => (
    <Button title="Help" onPress={() => closeThen(() => navigation.navigate('Help'))} />
  )}
  ...
/>
```

**5. Style the panel.** `panelStyle` sets the padding, background or borders of the panel's inner container:

```tsx
<SideMenu panelStyle={{ paddingHorizontal: 24, borderRightWidth: 1, borderColor: '#E5E7EB' }} ... />
```

### Theming

Start from a palette, or override any color or font; the rest keep their defaults:

```tsx
import { themes } from 'expo-reanimated-side-menu';

<SideMenu theme={themes.paper} ... />
<SideMenu theme={{ ...themes.midnight, accent: '#FF5C8A' }} ... />
<SideMenu theme={{ fonts: { regular: 'Inter-Regular', semibold: 'Inter-SemiBold', bold: 'Inter-Bold' } }} ... />
```

| Palette | Look |
| --- | --- |
| `night` (default) | Dark panel, lime accent. |
| `midnight` | Deep purple, violet accent. |
| `ocean` | Strong blue, white text. |
| `paper` | White panel, blue accent. |
| `slate` | Blue-grey, for the styles where the panel waits behind the screen. |

Without `fonts`, the system font is used at the right weights.

### Side, width and timing

```tsx
<SideMenu side="right" width={320} openDuration={300} closeDuration={220} swipeToClose={false} ... />
```

`width` up to `1` is a fraction of the screen (the default is `0.78`); larger values are points. The list inside scrolls only when its items don't fit; while they fit, a drag anywhere on the panel closes it.

## API reference

### `SideMenu` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | | Open or closed; in the `rail`, open or compact. |
| `onClose` | `() => void` | | Backdrop or screen tap, swipe, Android back, or before an item runs. |
| `onOpen` | `() => void` | | The rail's button and handle ask to open. |
| `variant` | `SideMenuVariant` | `'overlay'` | One of the [styles](#styles). |
| `children` | `ReactNode` | | Your screen. |
| `scene` | `SideMenuScene` | `{ effect: 'tilt' }` | `overlay` only: `effect`, `offset`, `scale`, `rotate`, `borderRadius`. |
| `rail` | `SideMenuRail` | | `compactWidth`, `openWidth`, `resizable`. |
| `sections` | `SideMenuSection[]` | `[]` | Titled groups of items. |
| `selectedKey` | `string` | | Key of the item you are on. |
| `profile` | `SideMenuProfile` | | Avatar, title, subtitle, `onPress`, `position`. |
| `header` | `SideMenuSlot` | | Replaces the top profile. |
| `action` | `SideMenuAction` | | Highlighted button: `label`, `icon`, `onPress`, `variant`. |
| `logout` | `SideMenuLogout` | | `label`, `icon`, `onPress`. |
| `footerText` | `string` | | Small text at the bottom. |
| `footer` | `SideMenuSlot` | | Your own content at the very bottom. |
| `content` | `SideMenuSlot` | | Replaces everything inside the panel. |
| `order` | `SideMenuBlock[]` | all blocks | Which blocks show, top to bottom. |
| `panelStyle` | `StyleProp<ViewStyle>` | | Padding, background, borders of the panel. |
| `backdrop` | `ReactNode` | | Drawn behind the screen in `reveal`, `cards`, `flip` and `push`. |
| `side` | `'left' \| 'right'` | `'left'` | Edge it opens from. |
| `width` | `number` | `0.78` | Fraction of the screen, or points. |
| `theme` | `SideMenuThemeOverrides` | | Colors and fonts. |
| `swipeToClose` | `boolean` | `true` | Drag to close. |
| `openDuration` | `number` | `240` | Milliseconds. |
| `closeDuration` | `number` | `200` | Milliseconds. |
| `statusBarStyle` | `'light-content' \| 'dark-content'` | from `theme.background` | Status bar text while open. |
| `closeLabel` | `string` | `'Close menu'` | Accessibility label of the backdrop and close buttons. |
| `testID` | `string` | | The backdrop gets `${testID}-backdrop`. |

### Theme keys

`background`, `text`, `textSecondary`, `textMuted`, `divider`, `avatarBackground`, `itemPressed`, `itemSelected`, `accent`, `onAccent`, `danger`, `backdrop`, `layer` (the ghost cards) and `fonts` (`regular`, `semibold`, `bold`).

## Example app

The [`example`](https://github.com/VMichael1999/expo-reanimated-side-menu/tree/main/example) folder has an Expo app: the dashboard of an online store with a **Menu style** card, one switch per style (turning one on turns the previous one off), the palettes, and the side. It loads the package straight from `src`:

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
