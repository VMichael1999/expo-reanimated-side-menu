# expo-reanimated-side-menu

🌐 [English](https://github.com/VMichael1999/expo-reanimated-side-menu/blob/main/README.md) | **Español**

Un menú lateral cuidado para **Expo** y **React Native** con **ocho estilos** en un solo componente: el panel encima de una pantalla girada en 3D, una pantalla que se aparta para mostrar el menú, cartas inclinadas, un giro 3D, un empuje, un menú a pantalla completa, una tarjeta flotante que se pliega a solo iconos y una barra lateral fija. Todo corre con Reanimated, se cierra deslizando, y lo que va dentro del panel lo decides tú.

[![CI](https://github.com/VMichael1999/expo-reanimated-side-menu/actions/workflows/ci.yml/badge.svg)](https://github.com/VMichael1999/expo-reanimated-side-menu/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/VMichael1999/expo-reanimated-side-menu/blob/main/LICENSE)
![Plataformas: iOS | Android](https://img.shields.io/badge/platforms-iOS%20%7C%20Android-111519)

## Capturas de pantalla

Tomadas con la [app de ejemplo](#app-de-ejemplo), el panel de una tienda en línea, en un simulador iPhone 17 Pro Max.

| `overlay` | `reveal` | `cards` | `flip` |
| :---: | :---: | :---: | :---: |
| <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/overlay.png" width="170" alt="Panel encima del dashboard, que gira en 3D detrás"/> | <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/reveal.png" width="170" alt="El dashboard se aparta y se achica para mostrar el menú"/> | <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/cards.png" width="170" alt="El dashboard inclinado como una carta con dos cartas fantasma detrás"/> | <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/flip.png" width="170" alt="El dashboard girado 45 grados en 3D"/> |
| **`push`** | **`popup`** | **`floating`** | **`rail`** |
| <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/push.png" width="170" alt="Un panel blanco empujando el dashboard"/> | <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/popup.png" width="170" alt="Menú morado a pantalla completa con botón para cerrar"/> | <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/floating.png" width="170" alt="Menú en tarjeta flotante morada"/> | <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/rail.png" width="170" alt="Barra lateral blanca abierta junto al dashboard"/> |

Modos compactos: <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/floating-compact.png" width="120" alt="Tarjeta flotante plegada a solo iconos"/> <img src="https://raw.githubusercontent.com/VMichael1999/expo-reanimated-side-menu/main/docs/screenshots/rail-compact.png" width="120" alt="Barra lateral plegada a solo iconos"/>

## Características

- **Ocho estilos** con una sola API: cambias `variant` y las mismas secciones, perfil y tema se presentan de otra forma.
- Corre con **Reanimated**, en el hilo de la interfaz, y sigue tu dedo: **desliza** el panel (o la pantalla) de vuelta para cerrarlo.
- **Las acciones se ejecutan cuando el menú ya se cerró**, así navegar nunca choca con la animación.
- **Todo lo de dentro es opcional y reemplazable**: perfil, secciones con título, **contadores** del color que quieras, la opción en la que estás (`selectedKey`), un **botón destacado**, la fila de **cerrar sesión**, el texto del pie, o tu propio `header`, `footer` o el `content` completo.
- **Paletas listas** (`themes`) y **temas** para todos los colores y fuentes.
- Se abre por la **izquierda o la derecha**; el botón atrás de Android lo cierra; la **barra de estado** sigue el color del panel.
- Escrito en TypeScript y sin código nativo propio: funciona en Expo Go.

## Estilos

| `variant` | Qué hace | Inspirado en |
| --- | --- | --- |
| `overlay` (por defecto) | El panel entra encima de tu pantalla, que se corre, se achica y gira en 3D detrás (`scene`). | — |
| `reveal` | El panel espera detrás de tu pantalla, que se aparta el 75% y se achica al 85%; el panel crece a su sitio. | [flutter_advanced_drawer](https://github.com/alex-melnyk/flutter_advanced_drawer) |
| `cards` | Como `reveal`, pero la pantalla se inclina 12° como una carta, con dos cartas fantasma detrás. | [awesome_drawer_bar](https://github.com/AppCheap/awesome_drawer_bar) (`scaleRight` con sombras) |
| `flip` | La pantalla gira 45° en 3D sobre su borde exterior. | [awesome_drawer_bar](https://github.com/AppCheap/awesome_drawer_bar) (`rotate3dOut`) |
| `push` | El panel entra y empuja tu pantalla, oscureciéndola. | [awesome_drawer_bar](https://github.com/AppCheap/awesome_drawer_bar) (`stack`) |
| `popup` | El menú ocupa toda la pantalla, aparece con fundido y creciendo, con un botón para cerrar. | [awesome_drawer_bar](https://github.com/AppCheap/awesome_drawer_bar) (`popUp`) |
| `floating` | Una tarjeta redondeada flotando sobre la app, con un botón para plegarla a solo iconos. | [sidebarx](https://github.com/Frezyx/sidebarx) |
| `rail` | Siempre en pantalla junto a tu contenido; `visible` la cambia entre abierta y compacta. Un botón y un tirador en su borde la abren o pliegan. | [flutter_side_menu](https://github.com/resfandiari/flutter_side_menu) |

## Requisitos

| Paquete | Versión |
| --- | --- |
| `react-native` | 0.74 o superior |
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

Envuelve la pantalla que abre el menú; esa pantalla es la que se aparta:

```tsx
import { useState } from 'react';
import { Button, View } from 'react-native';
import { SideMenu, themes } from 'expo-reanimated-side-menu';

export function Panel({ navigation }) {
  const [abierto, setAbierto] = useState(false);
  const [pantalla, setPantalla] = useState('inicio');
  const ir = (clave: string) => () => {
    setPantalla(clave);
    navigation.navigate(clave);
  };

  return (
    <SideMenu
      variant="reveal"
      theme={themes.slate}
      visible={abierto}
      onClose={() => setAbierto(false)}
      selectedKey={pantalla}
      profile={{ title: 'Andrea Ríos', subtitle: 'andrea@tienda.pe', onPress: ir('perfil') }}
      sections={[
        {
          key: 'main',
          title: 'Principal',
          items: [
            { key: 'inicio', label: 'Inicio', icon: 'grid-outline', onPress: ir('inicio') },
            { key: 'pedidos', label: 'Pedidos', icon: 'receipt-outline', badge: 12, onPress: ir('pedidos') },
          ],
        },
      ]}
      logout={{ label: 'Cerrar sesión', onPress: cerrarSesion }}
      footerText="Versión 2.4"
      closeLabel="Cerrar menú">
      {/* Tu pantalla */}
      <View style={{ flex: 1 }}>
        <Button title="Menú" onPress={() => setAbierto(true)} />
      </View>
    </SideMenu>
  );
}
```

El menú es controlado: tú manejas `visible` y lo vuelves a `false` en `onClose`. Al tocar una opción se llama primero a `onClose` y el `onPress` de la opción se ejecuta cuando el menú ya se fue (la `rail` nunca se cierra, así que lo ejecuta en el acto).

Dale un color de fondo a tu pantalla: en los estilos en que se aparta, alrededor se ve el color del panel.

## Guía

### Elegir un estilo

Pasa `variant`. Cada uno reutiliza todo lo demás que pases, así que probarlos es cambiar una palabra. La [app de ejemplo](#app-de-ejemplo) tiene un switch por estilo, además de las paletas.

El estilo `overlay` también acepta un `scene` para la pantalla detrás del panel:

```tsx
<SideMenu scene={{ effect: 'tilt' }} ...>   {/* por defecto: corrida, achicada y girada en 3D */}
<SideMenu scene={{ effect: 'slide' }} ...>  {/* empujada el ancho del panel */}
<SideMenu scene={{ effect: 'none' }} ...>   {/* se queda donde está */}
<SideMenu scene={{ effect: 'tilt', offset: 0.6, scale: 0.8, rotate: 12, borderRadius: 32 }} ...>
```

En `reveal`, `cards`, `flip` y `push` el panel espera detrás de tu pantalla; dibuja algo detrás con `backdrop` (por ejemplo un degradado). Tocar o arrastrar la pantalla cierra el menú.

### La barra lateral

`rail` siempre está visible. `visible` significa abierta (con textos) y `false` compacta (solo iconos); pásale también `onOpen`, porque el botón y el tirador de su borde pueden pedir abrirla:

```tsx
<SideMenu
  variant="rail"
  visible={barraAbierta}
  onOpen={() => setBarraAbierta(true)}
  onClose={() => setBarraAbierta(false)}
  rail={{ compactWidth: 64, openWidth: 250, resizable: true }}
  ...>
  <Panel />
</SideMenu>
```

En la barra, el `profile` va abajo como una tarjeta redondeada, y los títulos de sección se dibujan en mayúsculas con un separador entre secciones.

### La tarjeta flotante

`floating` se abre expandida, y el botón de su pie la pliega a solo iconos y de vuelta. Los contadores se vuelven puntos mientras está plegada.

### Secciones y opciones

Cada sección tiene una `key`, un `title` opcional y sus `items`. El `icon` de una opción es un nombre de [Ionicons](https://icons.expo.fyi) o cualquier elemento:

```tsx
{ key: 'carrito', label: 'Carrito', icon: <MiIconoCarrito />, badge: 2, onPress: abrirCarrito }
{ key: 'chat', label: 'Chat', icon: 'chatbubble-outline', badge: 8, badgeColor: '#FFC21A', onPress: abrirChat }
{ key: 'borrar', label: 'Eliminar cuenta', icon: 'trash-outline', color: '#E5484D', onPress: eliminarCuenta }
```

`selectedKey` marca la opción en la que estás: lleva un fondo (una línea en su borde en la barra lateral, un efecto elevado en la tarjeta flotante) y las demás se atenúan.

### Perfil

`profile` dibuja un avatar, un título y un subtítulo. `avatar` acepta una imagen (`require(...)` o `{ uri }`) o un elemento; sin él se muestra el icono de una persona. Con `onPress` se vuelve un botón. `position: 'bottom'` lo convierte en una tarjeta redondeada al pie del panel (lo normal en la barra lateral).

### Botón destacado, cerrar sesión y pie

`action` es un botón a todo el ancho bajo las secciones (`accent` u `outline`). `logout` agrega una fila en el color de peligro (`label` por defecto es `'Log out'`). `footerText` agrega un texto pequeño y centrado, como la versión de la app.

### Tu propio contenido

Todas las piezas son opcionales: deja fuera lo que no necesites. Y hay tres espacios para tu propio contenido:

- `header`: reemplaza la cabecera de perfil.
- `footer`: se agrega al final del panel.
- `content`: reemplaza todo lo que hay dentro del panel.

Cada uno acepta un elemento, o una función que recibe `close`, `closeThen` y `compact` (si el panel muestra solo iconos):

```tsx
<SideMenu
  header={({ compact }) => (compact ? <Logo /> : <LogoConBuscador />)}
  footer={({ closeThen }) => (
    <Button title="Ayuda" onPress={() => closeThen(() => navigation.navigate('Ayuda'))} />
  )}
  ...
/>
```

### Temas

Parte de una paleta, o cambia cualquier color o fuente; el resto mantiene su valor por defecto:

```tsx
import { themes } from 'expo-reanimated-side-menu';

<SideMenu theme={themes.paper} ... />
<SideMenu theme={{ ...themes.midnight, accent: '#FF5C8A' }} ... />
<SideMenu theme={{ fonts: { regular: 'Inter-Regular', semibold: 'Inter-SemiBold', bold: 'Inter-Bold' } }} ... />
```

| Paleta | Aspecto |
| --- | --- |
| `night` (por defecto) | Panel oscuro, acento lima. |
| `midnight` | Morado profundo, acento violeta. |
| `ocean` | Azul intenso, texto blanco. |
| `paper` | Panel blanco, acento azul. |
| `slate` | Gris azulado, para los estilos en que el panel espera detrás de la pantalla. |

Sin `fonts` se usa la fuente del sistema con el grosor adecuado.

### Lado, ancho y tiempos

```tsx
<SideMenu side="right" width={320} openDuration={300} closeDuration={220} swipeToClose={false} ... />
```

Un `width` hasta `1` es una fracción de la pantalla (por defecto `0.78`); los valores mayores son puntos. La lista solo se desplaza cuando sus opciones no caben; mientras quepan, arrastrar en cualquier parte del panel lo cierra.

## Referencia de la API

### Props de `SideMenu`

| Prop | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- |
| `visible` | `boolean` | | Abierto o cerrado; en la `rail`, abierta o compacta. |
| `onClose` | `() => void` | | Toque en el fondo o la pantalla, deslizar, atrás en Android, o antes de ejecutar una opción. |
| `onOpen` | `() => void` | | El botón y el tirador de la barra piden abrirla. |
| `variant` | `SideMenuVariant` | `'overlay'` | Uno de los [estilos](#estilos). |
| `children` | `ReactNode` | | Tu pantalla. |
| `scene` | `SideMenuScene` | `{ effect: 'tilt' }` | Solo `overlay`: `effect`, `offset`, `scale`, `rotate`, `borderRadius`. |
| `rail` | `SideMenuRail` | | `compactWidth`, `openWidth`, `resizable`. |
| `sections` | `SideMenuSection[]` | `[]` | Grupos de opciones con título. |
| `selectedKey` | `string` | | Clave de la opción en la que estás. |
| `profile` | `SideMenuProfile` | | Avatar, título, subtítulo, `onPress`, `position`. |
| `header` | `SideMenuSlot` | | Reemplaza el perfil de arriba. |
| `action` | `SideMenuAction` | | Botón destacado: `label`, `icon`, `onPress`, `variant`. |
| `logout` | `SideMenuLogout` | | `label`, `icon`, `onPress`. |
| `footerText` | `string` | | Texto pequeño al final. |
| `footer` | `SideMenuSlot` | | Tu propio contenido al final. |
| `content` | `SideMenuSlot` | | Reemplaza todo lo de dentro del panel. |
| `backdrop` | `ReactNode` | | Se dibuja detrás de la pantalla en `reveal`, `cards`, `flip` y `push`. |
| `side` | `'left' \| 'right'` | `'left'` | Borde desde el que se abre. |
| `width` | `number` | `0.78` | Fracción de la pantalla, o puntos. |
| `theme` | `SideMenuThemeOverrides` | | Colores y fuentes. |
| `swipeToClose` | `boolean` | `true` | Arrastrar para cerrar. |
| `openDuration` | `number` | `240` | Milisegundos. |
| `closeDuration` | `number` | `200` | Milisegundos. |
| `statusBarStyle` | `'light-content' \| 'dark-content'` | según `theme.background` | Texto de la barra de estado mientras está abierto. |
| `closeLabel` | `string` | `'Close menu'` | Etiqueta de accesibilidad del fondo y los botones de cerrar. |
| `testID` | `string` | | El fondo recibe `${testID}-backdrop`. |

### Claves del tema

`background`, `text`, `textSecondary`, `textMuted`, `divider`, `avatarBackground`, `itemPressed`, `itemSelected`, `accent`, `onAccent`, `danger`, `backdrop`, `layer` (las cartas fantasma) y `fonts` (`regular`, `semibold`, `bold`).

## App de ejemplo

La carpeta [`example`](https://github.com/VMichael1999/expo-reanimated-side-menu/tree/main/example) tiene una app de Expo: el panel de una tienda en línea con una tarjeta **Estilo del menú**, un switch por estilo (al activar uno se apaga el anterior), las paletas y el lado. Carga el paquete directamente desde `src`:

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

## Créditos

Los estilos `reveal`, `cards`, `flip`, `push`, `popup`, `floating` y `rail` son reimplementaciones en React Native de los diseños de estos paquetes de Flutter. No se copió código; gracias a sus autores por las ideas:

- [flutter_advanced_drawer](https://github.com/alex-melnyk/flutter_advanced_drawer) de Oleksandr Melnyk (BSD-3-Clause).
- [awesome_drawer_bar](https://github.com/AppCheap/awesome_drawer_bar) de medyas (MIT).
- [sidebarx](https://github.com/Frezyx/sidebarx) de Stanislav Ilin (MIT).
- [flutter_side_menu](https://github.com/resfandiari/flutter_side_menu) de Reza Esfandiari (BSD-3-Clause).

## Licencia

[MIT](https://github.com/VMichael1999/expo-reanimated-side-menu/blob/main/LICENSE) © Michael Valdiviezo
