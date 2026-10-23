# expo-reanimated-side-menu

🌐 [English](https://github.com/VMichael1999/expo-reanimated-side-menu/blob/main/README.md) | **Español**

Un menú lateral (drawer) cuidado para **Expo** y **React Native**. Entra deslizándose con Reanimated sobre un fondo que se oscurece, se cierra arrastrándolo, y trae cabecera de perfil, secciones con título, contadores, un botón destacado y la opción de cerrar sesión. Todos los colores y fuentes se pueden cambiar.

[![CI](https://github.com/VMichael1999/expo-reanimated-side-menu/actions/workflows/ci.yml/badge.svg)](https://github.com/VMichael1999/expo-reanimated-side-menu/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/VMichael1999/expo-reanimated-side-menu/blob/main/LICENSE)
![Plataformas: iOS | Android](https://img.shields.io/badge/platforms-iOS%20%7C%20Android-111519)

## Capturas de pantalla

Tomadas con la [app de ejemplo](#app-de-ejemplo) en un simulador iPhone 17 Pro Max.

<p align="center">
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/01-dark.png" width="200" alt="Menú oscuro con perfil, secciones, el botón destacado y cerrar sesión"/>
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/02-light.png" width="200" alt="El mismo menú con un tema claro"/>
  <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/03-right.png" width="200" alt="Menú que se abre desde la derecha"/>
</p>

1. **Tema por defecto**: panel oscuro con acento lima.
2. **Tema claro**: basta un objeto `theme`.
3. **`side="right"`**: se abre desde el otro borde.

## Características

- Entra y sale con **Reanimated**, en el hilo de la interfaz.
- **Deslizar para cerrar**: arrastra el panel hacia su borde; si lo sueltas pasado un tercio, o con un gesto rápido, se cierra.
- Se dibuja en un `Modal`, así que tapa toda la app, cabeceras y barras de pestañas incluidas. El botón atrás de Android lo cierra.
- Mientras está abierto, pone la **barra de estado** en claro u oscuro según el panel.
- **Las acciones se ejecutan cuando el menú ya se cerró**, así navegar nunca choca con la animación.
- **Cabecera de perfil** con avatar, título y subtítulo, o la tuya propia.
- **Secciones** con título opcional, **contadores**, un **botón destacado** y la fila de **cerrar sesión**.
- Se abre desde la **izquierda o la derecha**, con el **ancho** que quieras.
- **Temas** para todos los colores y fuentes; también acepta tus propios iconos.
- Escrito en TypeScript y sin código nativo propio: funciona en Expo Go.

## Requisitos

| Paquete | Versión |
| --- | --- |
| `react-native-reanimated` | 3.6 o superior (incluida la 4.x) |
| `react-native-safe-area-context` | 4 o superior |
| `@expo/vector-icons` | 14 o superior, con `expo-font` |

Instálalos con el comando de abajo; `expo-font` y `expo-asset` cargan la fuente de los iconos. En una app de React Native sin Expo, instala y configura Reanimated siguiendo [su guía](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started).

## Instalación

```sh
npx expo install expo-reanimated-side-menu react-native-reanimated react-native-safe-area-context @expo/vector-icons expo-font expo-asset
```

Envuelve tu app en `SafeAreaProvider` (Expo Router ya lo hace). El menú toma de ahí los márgenes seguros, porque dentro de un `Modal` iOS los pierde.

## Inicio rápido

```tsx
import { useState } from 'react';
import { Button } from 'react-native';
import { SideMenu } from 'expo-reanimated-side-menu';

export function Inicio({ navigation }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <Button title="Menú" onPress={() => setAbierto(true)} />
      <SideMenu
        visible={abierto}
        onClose={() => setAbierto(false)}
        profile={{ title: 'Mi perfil', subtitle: '+51 999 999 888', onPress: () => navigation.navigate('Perfil') }}
        sections={[
          {
            key: 'main',
            title: 'Navegación',
            items: [
              { key: 'viajes', label: 'Mis viajes', icon: 'time-outline', onPress: () => navigation.navigate('Viajes') },
              { key: 'avisos', label: 'Notificaciones', icon: 'notifications-outline', badge: 3, onPress: () => navigation.navigate('Avisos') },
            ],
          },
        ]}
        logout={{ label: 'Cerrar sesión', onPress: cerrarSesion }}
        footerText="Versión 1.0.0"
        closeLabel="Cerrar menú"
      />
    </>
  );
}
```

El menú es controlado: tú manejas `visible` y lo vuelves a `false` en `onClose`. Al tocar una opción se llama primero a `onClose` y el `onPress` de la opción se ejecuta cuando el panel ya desapareció.

## Guía

### Secciones y opciones

Cada sección tiene una `key`, un `title` opcional y sus `items`. El `icon` de una opción es un nombre de [Ionicons](https://icons.expo.fyi) o cualquier elemento:

```tsx
{ key: 'carrito', label: 'Carrito', icon: <MiIconoCarrito />, badge: 2, onPress: abrirCarrito }
```

### Cabecera

`profile` dibuja un avatar, un título y un subtítulo. `avatar` acepta una imagen (`require(...)` o `{ uri }`) o un elemento; sin él se muestra el icono de una persona. Con `onPress`, la cabecera muestra una flecha y se vuelve un botón.

Si necesitas algo totalmente distinto, pasa tu propio elemento en `header`.

### Botón destacado

`action` es un botón a todo el ancho bajo las secciones, útil para cambiar entre dos modos de una app:

```tsx
action={{
  label: modoDelivery ? 'Volver a viajes' : 'Modo delivery',
  icon: modoDelivery ? 'car-outline' : 'bag-outline',
  variant: modoDelivery ? 'outline' : 'accent',
  onPress: cambiarModo,
}}
```

### Cerrar sesión y pie

`logout` agrega abajo una fila en el color de peligro (`label` por defecto es `'Log out'`). `footerText` agrega un texto pequeño y centrado debajo, como la versión de la app.

### Lado, ancho y tiempos

```tsx
<SideMenu side="right" width={320} openDuration={300} closeDuration={220} swipeToClose={false} ... />
```

La lista solo se desplaza cuando sus opciones no caben; mientras quepan, arrastrar en cualquier parte del panel lo cierra.

Un `width` hasta `1` es una fracción de la pantalla (por defecto `0.78`); los valores mayores son puntos. Nunca pasa del ancho de la pantalla.

### Temas

Cambia cualquier color o fuente; el resto mantiene su valor por defecto:

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

Sin `fonts` se usa la fuente del sistema con el grosor adecuado. `defaultTheme` se exporta por si quieres partir de él.

## Referencia de la API

### Props de `SideMenu`

| Prop | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- |
| `visible` | `boolean` | | Si el menú está abierto. |
| `onClose` | `() => void` | | Toque en el fondo, deslizar, atrás en Android, o antes de ejecutar una opción. |
| `sections` | `SideMenuSection[]` | | El contenido del menú. |
| `profile` | `SideMenuProfile` | | Avatar, título, subtítulo y `onPress`. |
| `header` | `ReactNode` | | Reemplaza a `profile`. |
| `action` | `SideMenuAction` | | Botón destacado: `label`, `icon`, `onPress`, `variant`. |
| `logout` | `SideMenuLogout` | | `label`, `icon`, `onPress`. |
| `footerText` | `string` | | Texto pequeño al final. |
| `side` | `'left' \| 'right'` | `'left'` | Borde desde el que entra. |
| `width` | `number` | `0.78` | Fracción de la pantalla, o puntos. |
| `theme` | `SideMenuThemeOverrides` | | Colores y fuentes. |
| `swipeToClose` | `boolean` | `true` | Arrastrar para cerrar. |
| `openDuration` | `number` | `240` | Milisegundos. |
| `closeDuration` | `number` | `200` | Milisegundos. |
| `statusBarStyle` | `'light-content' \| 'dark-content'` | según `theme.background` | Texto de la barra de estado mientras está abierto. |
| `closeLabel` | `string` | `'Close menu'` | Etiqueta de accesibilidad del fondo. |
| `testID` | `string` | | El fondo recibe `${testID}-backdrop`. |

### Claves del tema

`background`, `text`, `textSecondary`, `textMuted`, `divider`, `avatarBackground`, `itemPressed`, `accent`, `onAccent`, `danger`, `backdrop` y `fonts` (`regular`, `semibold`, `bold`).

## App de ejemplo

La carpeta [`example`](https://github.com/VMichael1999/expo-reanimated-side-menu/tree/main/example) tiene una app de Expo que carga el paquete directamente desde `src`, con interruptores para el lado y el tema:

```sh
npm install
cd example
npm install
npx expo run:ios   # o: npx expo run:android
```

## Desarrollo

```sh
npm install
npm run typecheck
npm test
npm run build
```

Sin [Watchman](https://facebook.github.io/watchman/), Metro puede no ver los cambios en `src` mientras corre el ejemplo; reinícialo con `npx expo start --clear`.

## Licencia

[MIT](https://github.com/VMichael1999/expo-reanimated-side-menu/blob/main/LICENSE) © Michael Valdiviezo
