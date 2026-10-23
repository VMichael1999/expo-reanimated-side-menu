import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  SideMenu,
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
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.topBar}>
        <Pressable
          onPress={() => setOpen(true)}
          style={styles.menuButton}
          accessibilityRole="button"
          accessibilityLabel="Abrir menú">
          <Ionicons name="menu" size={24} color="#111519" />
        </Pressable>
        <Text style={styles.title}>{screen}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>expo-reanimated-side-menu</Text>
        <Text style={styles.cardText}>
          Modo actual: {delivery ? 'delivery' : 'viajes'}. Desliza el panel hacia su borde para
          cerrarlo.
        </Text>
        <Option label="Abrir desde la derecha" value={rightSide} onChange={setRightSide} />
        <Option label="Tema claro" value={light} onChange={setLight} />
        <Pressable
          onPress={() => setOpen(true)}
          style={styles.openButton}
          accessibilityRole="button">
          <Text style={styles.openButtonText}>Abrir menú</Text>
        </Pressable>
      </View>

      <SideMenu
        visible={open}
        onClose={() => setOpen(false)}
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
        closeLabel="Cerrar menú"
      />
    </SafeAreaView>
  );
}

function Option({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.option}>
      <Text style={styles.optionLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F4F6',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111519',
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111519',
  },
  cardText: {
    fontSize: 14,
    color: '#5B6470',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLabel: {
    fontSize: 15,
    color: '#111519',
  },
  openButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111519',
    alignItems: 'center',
    justifyContent: 'center',
  },
  openButtonText: {
    color: '#D4E838',
    fontSize: 15,
    fontWeight: '700',
  },
});
