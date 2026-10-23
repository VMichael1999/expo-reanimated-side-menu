import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  SideMenu,
  type SideMenuSceneEffect,
  type SideMenuSection,
  type SideMenuThemeOverrides,
} from 'expo-reanimated-side-menu';

const LIGHT_THEME: SideMenuThemeOverrides = {
  background: '#FFFFFF',
  text: '#111519',
  textSecondary: '#5B6470',
  textMuted: '#8A939E',
  divider: '#E6E9ED',
  avatarBackground: '#EEF1F4',
  itemPressed: '#F2F4F6',
  accent: '#3D5AFE',
  onAccent: '#FFFFFF',
  danger: '#E5484D',
  backdrop: 'rgba(17, 21, 25, 0.35)',
};

const EFFECTS: { value: SideMenuSceneEffect; label: string }[] = [
  { value: 'tilt', label: 'Inclinado' },
  { value: 'slide', label: 'Deslizar' },
  { value: 'none', label: 'Ninguno' },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <Demo />
    </SafeAreaProvider>
  );
}

function Demo() {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState('Mapa');
  const [effect, setEffect] = useState<SideMenuSceneEffect>('tilt');
  const [rightSide, setRightSide] = useState(false);
  const [light, setLight] = useState(false);
  const [delivery, setDelivery] = useState(false);

  const go = (name: string) => () => setScreen(name);
  const sections: SideMenuSection[] = [
    {
      key: 'main',
      title: 'Navegación',
      items: [
        { key: 'map', label: 'Mapa', icon: 'home-outline', onPress: go('Mapa') },
        { key: 'trips', label: 'Mis viajes', icon: 'time-outline', onPress: go('Mis viajes') },
        {
          key: 'schedule',
          label: 'Programar viaje',
          icon: 'alarm-outline',
          onPress: go('Programar viaje'),
        },
      ],
    },
    {
      key: 'wallet',
      title: 'Pagos y promociones',
      items: [
        {
          key: 'payment',
          label: 'Métodos de pago',
          icon: 'card-outline',
          onPress: go('Métodos de pago'),
        },
        {
          key: 'promos',
          label: 'Promociones',
          icon: 'pricetag-outline',
          badge: 2,
          onPress: go('Promociones'),
        },
      ],
    },
    {
      key: 'personal',
      title: 'Personales',
      items: [
        {
          key: 'favorites',
          label: 'Direcciones favoritas',
          icon: 'bookmark-outline',
          onPress: go('Direcciones favoritas'),
        },
      ],
    },
    {
      key: 'preferences',
      title: 'Preferencias',
      items: [
        {
          key: 'settings',
          label: 'Configuración',
          icon: 'settings-outline',
          onPress: go('Configuración'),
        },
      ],
    },
  ];

  return (
    <SideMenu
      visible={open}
      onClose={() => setOpen(false)}
      scene={{ effect }}
      side={rightSide ? 'right' : 'left'}
      theme={light ? LIGHT_THEME : undefined}
      profile={{ title: 'Mi perfil', subtitle: '+51 999 999 888', onPress: go('Mi perfil') }}
      sections={sections}
      action={{
        label: delivery ? 'Volver a viajes' : 'Modo delivery',
        icon: delivery ? 'car-outline' : 'bag-outline',
        variant: delivery ? 'outline' : 'accent',
        onPress: () => setDelivery((current) => !current),
      }}
      logout={{ label: 'Cerrar sesión', onPress: go('Sesión cerrada') }}
      footerText="Versión 1.0.0"
      closeLabel="Cerrar menú">
      <HomeScreen
        title={screen}
        mode={delivery ? 'delivery' : 'viajes'}
        onOpenMenu={() => setOpen(true)}
        effect={effect}
        onEffect={setEffect}
        rightSide={rightSide}
        onRightSide={() => setRightSide((current) => !current)}
        light={light}
        onLight={() => setLight((current) => !current)}
      />
    </SideMenu>
  );
}

interface HomeScreenProps {
  title: string;
  mode: string;
  onOpenMenu: () => void;
  effect: SideMenuSceneEffect;
  onEffect: (effect: SideMenuSceneEffect) => void;
  rightSide: boolean;
  onRightSide: () => void;
  light: boolean;
  onLight: () => void;
}

/** A stand-in for the app's home: a map-like area with a sheet of options below. */
function HomeScreen({
  title,
  mode,
  onOpenMenu,
  effect,
  onEffect,
  rightSide,
  onRightSide,
  light,
  onLight,
}: HomeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.map}>
        {Array.from({ length: 9 }, (_, index) => (
          <View key={`h${index}`} style={[styles.street, { top: `${index * 12}%` }]} />
        ))}
        {Array.from({ length: 6 }, (_, index) => (
          <View key={`v${index}`} style={[styles.avenue, { left: `${index * 20}%` }]} />
        ))}
        <View style={[styles.park, { top: '18%', left: '58%' }]} />
        <View style={[styles.park, { top: '52%', left: '8%', width: 90 }]} />
        <View style={styles.pin}>
          <Ionicons name="location" size={34} color="#3D5AFE" />
        </View>

        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <Pressable
            onPress={onOpenMenu}
            style={styles.menuButton}
            accessibilityRole="button"
            accessibilityLabel="Abrir menú">
            <Ionicons name="menu" size={24} color="#111519" />
          </Pressable>
          <View style={styles.titlePill}>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.sheetTitle}>¿A dónde vas?</Text>
        <Text style={styles.sheetText}>
          Modo actual: {mode}. Abre el menú o desliza para cerrarlo.
        </Text>

        <Text style={styles.label}>Efecto de la pantalla</Text>
        <View style={styles.chips}>
          {EFFECTS.map((item) => (
            <Chip
              key={item.value}
              label={item.label}
              active={effect === item.value}
              onPress={() => onEffect(item.value)}
            />
          ))}
        </View>

        <Text style={styles.label}>Opciones</Text>
        <View style={styles.chips}>
          <Chip label="Desde la derecha" active={rightSide} onPress={onRightSide} />
          <Chip label="Tema claro" active={light} onPress={onLight} />
        </View>
      </View>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F4F6',
  },
  map: {
    flex: 1,
    backgroundColor: '#E9ECE6',
    overflow: 'hidden',
  },
  street: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#FFFFFF',
  },
  avenue: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 10,
    backgroundColor: '#FFFFFF',
  },
  park: {
    position: 'absolute',
    width: 120,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#CFE5C4',
  },
  pin: {
    position: 'absolute',
    top: '42%',
    left: '46%',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlePill: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111519',
  },
  sheet: {
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 10,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111519',
  },
  sheetText: {
    fontSize: 14,
    color: '#5B6470',
  },
  label: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#8A939E',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 16,
    backgroundColor: '#F2F4F6',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: '#111519',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111519',
  },
  chipTextActive: {
    color: '#D4E838',
  },
});
