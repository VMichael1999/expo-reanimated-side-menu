import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  SideMenu,
  themes,
  type SideMenuHelpers,
  type SideMenuSection,
  type SideMenuTheme,
  type SideMenuVariant,
} from 'expo-reanimated-side-menu';

type ThemeName = keyof typeof themes;

interface StyleOption {
  variant: SideMenuVariant;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** The palette each style is shown with. */
  theme: ThemeName;
}

const STYLES: StyleOption[] = [
  {
    variant: 'overlay',
    name: 'Inclinado 3D',
    description: 'El panel encima y la pantalla girada en 3D',
    icon: 'cube-outline',
    theme: 'night',
  },
  {
    variant: 'reveal',
    name: 'Revelar',
    description: 'La pantalla se corre y deja ver el menú detrás',
    icon: 'albums-outline',
    theme: 'slate',
  },
  {
    variant: 'cards',
    name: 'Cartas',
    description: 'La pantalla se inclina como una carta, con dos detrás',
    icon: 'copy-outline',
    theme: 'night',
  },
  {
    variant: 'flip',
    name: 'Giro',
    description: 'La pantalla gira 45° sobre su borde',
    icon: 'sync-outline',
    theme: 'midnight',
  },
  {
    variant: 'push',
    name: 'Empujar',
    description: 'El panel entra y empuja la pantalla',
    icon: 'arrow-forward-outline',
    theme: 'paper',
  },
  {
    variant: 'popup',
    name: 'Pantalla completa',
    description: 'El menú ocupa todo y aparece creciendo',
    icon: 'expand-outline',
    theme: 'midnight',
  },
  {
    variant: 'floating',
    name: 'Flotante',
    description: 'Tarjeta flotante que se pliega a solo iconos',
    icon: 'browsers-outline',
    theme: 'midnight',
  },
  {
    variant: 'rail',
    name: 'Barra lateral',
    description: 'Siempre a la vista; se abre o queda compacta',
    icon: 'reorder-four-outline',
    theme: 'paper',
  },
];

const THEMES: { name: ThemeName; label: string }[] = [
  { name: 'night', label: 'Noche' },
  { name: 'midnight', label: 'Morado' },
  { name: 'ocean', label: 'Azul' },
  { name: 'paper', label: 'Blanco' },
  { name: 'slate', label: 'Pizarra' },
];

const SCREEN_TITLES: Record<string, string> = {
  home: 'Inicio',
  orders: 'Pedidos',
  products: 'Productos',
  customers: 'Clientes',
  reports: 'Reportes',
  campaigns: 'Campañas',
  notifications: 'Notificaciones',
  settings: 'Ajustes',
  profile: 'Mi cuenta',
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
  const [screen, setScreen] = useState('home');
  const [style, setStyle] = useState<StyleOption>(STYLES[0]);
  const [themeName, setThemeName] = useState<ThemeName | null>(null);
  const [rightSide, setRightSide] = useState(false);
  const [alerts, setAlerts] = useState(true);
  const theme: SideMenuTheme = themes[themeName ?? style.theme];

  const chooseStyle = (option: StyleOption) => {
    setOpen(false);
    setStyle(option);
    setThemeName(null);
  };

  const go = (key: string) => () => setScreen(key);
  const sections: SideMenuSection[] = [
    {
      key: 'main',
      title: 'Principal',
      items: [
        { key: 'home', label: 'Inicio', icon: 'grid-outline', onPress: go('home') },
        {
          key: 'orders',
          label: 'Pedidos',
          icon: 'receipt-outline',
          badge: 12,
          onPress: go('orders'),
        },
        { key: 'products', label: 'Productos', icon: 'cube-outline', onPress: go('products') },
        { key: 'customers', label: 'Clientes', icon: 'people-outline', onPress: go('customers') },
      ],
    },
    {
      key: 'insights',
      title: 'Análisis',
      items: [
        {
          key: 'reports',
          label: 'Reportes',
          subtitle: 'Actualizado hace 5 min',
          icon: 'bar-chart-outline',
          onPress: go('reports'),
        },
        {
          key: 'campaigns',
          label: 'Campañas',
          icon: 'megaphone-outline',
          badge: 3,
          badgeColor: '#FFC21A',
          onPress: go('campaigns'),
        },
      ],
    },
    { key: 'promo', content: <PromoCard theme={theme} /> },
    {
      key: 'account',
      title: 'Cuenta',
      items: [
        {
          key: 'notifications',
          label: 'Notificaciones',
          icon: 'notifications-outline',
          badge: 24,
          badgeColor: '#B6F36A',
          onPress: go('notifications'),
        },
        {
          key: 'alerts',
          label: 'Alertas de stock',
          icon: 'alert-circle-outline',
          trailing: <Switch value={alerts} onValueChange={setAlerts} />,
        },
        { key: 'settings', label: 'Ajustes', icon: 'settings-outline', onPress: go('settings') },
      ],
    },
  ];

  const isRail = style.variant === 'rail';

  return (
    <SideMenu
      variant={style.variant}
      visible={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      side={rightSide ? 'right' : 'left'}
      theme={theme}
      sections={sections}
      selectedKey={screen}
      profile={{
        title: 'Michael Valdiviezo',
        subtitle: 'michael@tiendanova.pe',
        avatar: <Initials theme={theme} />,
        onPress: go('profile'),
      }}
      header={isRail ? (helpers) => <RailHeader theme={theme} helpers={helpers} /> : undefined}
      action={
        isRail
          ? undefined
          : { label: 'Nueva venta', icon: 'add-circle-outline', onPress: go('orders') }
      }
      logout={isRail ? undefined : { label: 'Cerrar sesión', onPress: go('home') }}
      footerText="Tienda Nova · v2.4"
      closeLabel="Cerrar menú">
      <Dashboard
        title={SCREEN_TITLES[screen]}
        onMenu={() => setOpen((current) => !current)}
        menuOpen={open}
        style={style}
        onStyle={chooseStyle}
        themeName={themeName ?? style.theme}
        onTheme={setThemeName}
        rightSide={rightSide}
        onRightSide={setRightSide}
      />
    </SideMenu>
  );
}

/** Logo, search and a two-tab switch, folded down to the logo when the rail is compact. */
function RailHeader({ theme, helpers }: { theme: SideMenuTheme; helpers: SideMenuHelpers }) {
  const [tab, setTab] = useState<'store' | 'team'>('store');
  if (helpers.compact) {
    return (
      <View style={styles.railHeaderCompact}>
        <Ionicons name="layers-outline" size={26} color={theme.text} />
        <Ionicons name="search-outline" size={22} color={theme.textSecondary} />
      </View>
    );
  }
  return (
    <View style={styles.railHeader}>
      <View style={styles.brandRow}>
        <Ionicons name="layers-outline" size={26} color={theme.text} />
        <Text style={[styles.brand, { color: theme.text }]}>
          Nova <Text style={[styles.brandVersion, { color: theme.textMuted }]}>v2.4</Text>
        </Text>
        <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
      </View>
      <View style={[styles.segment, { borderColor: theme.divider }]}>
        {(['store', 'team'] as const).map((key) => {
          const active = tab === key;
          return (
            <Pressable
              key={key}
              onPress={() => setTab(key)}
              style={[styles.segmentItem, active && { backgroundColor: theme.accent }]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}>
              <Text
                style={[
                  styles.segmentText,
                  { color: active ? theme.onAccent : theme.textSecondary },
                ]}>
                {key === 'store' ? 'TIENDA' : 'EQUIPO'}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** A free block between two sections. */
function PromoCard({ theme }: { theme: SideMenuTheme }) {
  return (
    <View style={[styles.promo, { backgroundColor: theme.accent }]}>
      <Ionicons name="rocket-outline" size={22} color={theme.onAccent} />
      <View style={styles.flex}>
        <Text style={[styles.promoTitle, { color: theme.onAccent }]}>Plan Pro</Text>
        <Text style={[styles.promoText, { color: theme.onAccent }]}>
          Reportes avanzados y 0% de comisión
        </Text>
      </View>
    </View>
  );
}

function Initials({ theme }: { theme: SideMenuTheme }) {
  return <Text style={[styles.initials, { color: theme.text }]}>MV</Text>;
}

interface DashboardProps {
  title: string;
  onMenu: () => void;
  menuOpen: boolean;
  style: StyleOption;
  onStyle: (style: StyleOption) => void;
  themeName: ThemeName;
  onTheme: (name: ThemeName) => void;
  rightSide: boolean;
  onRightSide: (value: boolean) => void;
}

const KPIS = [
  {
    label: 'Ventas',
    value: 'S/ 12 480',
    change: '+12%',
    icon: 'trending-up-outline',
    tint: '#E8F0FF',
  },
  { label: 'Pedidos', value: '342', change: '+8%', icon: 'receipt-outline', tint: '#FFF4DC' },
  { label: 'Clientes', value: '1 208', change: '+5%', icon: 'people-outline', tint: '#E6F8EC' },
  {
    label: 'Ticket medio',
    value: 'S/ 36,5',
    change: '+3%',
    icon: 'pricetag-outline',
    tint: '#F3E8FF',
  },
] as const;

const WEEK = [42, 64, 51, 78, 69, 92, 58];
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const ORDERS = [
  { id: '#4821', customer: 'Lucía Paredes', total: 'S/ 89,90', status: 'Pagado', color: '#1F9D55' },
  { id: '#4820', customer: 'Diego Salas', total: 'S/ 154,00', status: 'Enviado', color: '#3D5AFE' },
  {
    id: '#4819',
    customer: 'Valeria Núñez',
    total: 'S/ 42,50',
    status: 'Pendiente',
    color: '#E08600',
  },
];

function Dashboard({
  title,
  onMenu,
  menuOpen,
  style,
  onStyle,
  themeName,
  onTheme,
  rightSide,
  onRightSide,
}: DashboardProps) {
  const insets = useSafeAreaInsets();
  const isRail = style.variant === 'rail';
  const peak = Math.max(...WEEK);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        {isRail ? null : (
          <Pressable
            onPress={onMenu}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Abrir menú">
            <Ionicons name="menu" size={22} color="#15171A" />
          </Pressable>
        )}
        <View style={styles.flex}>
          <Text style={styles.kicker}>Tienda Nova</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={20} color="#15171A" />
          <View style={styles.dot} />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Hola, Michael 👋</Text>
        <Text style={styles.muted}>Así va tu tienda esta semana.</Text>

        <View style={styles.kpis}>
          {KPIS.map((kpi) => (
            <View key={kpi.label} style={[styles.card, styles.kpi]}>
              <View style={[styles.kpiIcon, { backgroundColor: kpi.tint }]}>
                <Ionicons name={kpi.icon} size={18} color="#15171A" />
              </View>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
              <Text style={styles.kpiValue} numberOfLines={1}>
                {kpi.value}
              </Text>
              <Text style={styles.kpiChange}>{kpi.change} vs. semana pasada</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ventas de la semana</Text>
          <View style={styles.chart}>
            {WEEK.map((value, index) => (
              <View key={index} style={styles.barColumn}>
                <View
                  style={[
                    styles.bar,
                    { height: `${(value / peak) * 100}%` },
                    index === 5 && styles.barPeak,
                  ]}
                />
                <Text style={styles.barLabel}>{DAYS[index]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, styles.styleCard]}>
          <Text style={styles.cardTitle}>Estilo del menú</Text>
          <Text style={styles.muted}>
            {isRail
              ? 'Usa la flecha del borde para abrir o compactar la barra.'
              : `Toca ☰ para ${menuOpen ? 'cerrar' : 'abrir'} el menú.`}
          </Text>
          {STYLES.map((option) => {
            const active = option.variant === style.variant;
            return (
              <Pressable
                key={option.variant}
                onPress={() => onStyle(option)}
                style={[styles.styleRow, active && styles.styleRowActive]}
                accessibilityRole="switch"
                accessibilityState={{ checked: active }}
                accessibilityLabel={option.name}>
                <View style={[styles.styleIcon, active && styles.styleIconActive]}>
                  <Ionicons name={option.icon} size={18} color={active ? '#FFFFFF' : '#15171A'} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.styleName}>{option.name}</Text>
                  <Text style={styles.styleDescription}>{option.description}</Text>
                </View>
                <Switch
                  value={active}
                  onValueChange={(on) => {
                    if (on) onStyle(option);
                  }}
                  trackColor={{ true: '#3D5AFE' }}
                />
              </Pressable>
            );
          })}

          <Text style={[styles.cardTitle, styles.subTitle]}>Tema</Text>
          <View style={styles.chips}>
            {THEMES.map((item) => {
              const active = item.name === themeName;
              return (
                <Pressable
                  key={item.name}
                  onPress={() => onTheme(item.name)}
                  style={[styles.chip, active && styles.chipActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}>
                  <View
                    style={[styles.swatch, { backgroundColor: themes[item.name].background }]}
                  />
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={() => onRightSide(!rightSide)}
            style={styles.styleRow}
            accessibilityRole="switch"
            accessibilityState={{ checked: rightSide }}>
            <View style={styles.flex}>
              <Text style={styles.styleName}>Abrir desde la derecha</Text>
            </View>
            <Switch
              value={rightSide}
              onValueChange={onRightSide}
              trackColor={{ true: '#3D5AFE' }}
            />
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pedidos recientes</Text>
          {ORDERS.map((order) => (
            <View key={order.id} style={styles.order}>
              <View style={styles.flex}>
                <Text style={styles.orderCustomer}>{order.customer}</Text>
                <Text style={styles.muted}>
                  {order.id} · {order.total}
                </Text>
              </View>
              <View style={[styles.status, { backgroundColor: `${order.color}1A` }]}>
                <Text style={[styles.statusText, { color: order.color }]}>{order.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  content: {
    paddingHorizontal: 16,
    gap: 14,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#F4F6FA',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5484D',
  },
  kicker: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#15171A',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#15171A',
    marginTop: 4,
  },
  muted: {
    fontSize: 13,
    color: '#6B7280',
  },
  kpis: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  kpi: {
    flexBasis: '47%',
    flexGrow: 1,
    gap: 4,
  },
  kpiIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  kpiLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#15171A',
  },
  kpiChange: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#1F9D55',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#15171A',
  },
  subTitle: {
    marginTop: 10,
  },
  chart: {
    height: 140,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  barColumn: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 6,
  },
  bar: {
    width: '100%',
    maxHeight: 112,
    borderRadius: 8,
    backgroundColor: '#C9D6FF',
  },
  barPeak: {
    backgroundColor: '#3D5AFE',
  },
  barLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  styleCard: {
    gap: 8,
  },
  styleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  styleRowActive: {
    backgroundColor: '#EEF2FF',
  },
  styleIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F1F3F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleIconActive: {
    backgroundColor: '#3D5AFE',
  },
  styleName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#15171A',
  },
  styleDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    backgroundColor: '#F1F3F6',
  },
  chipActive: {
    backgroundColor: '#15171A',
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15171A',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  order: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  orderCustomer: {
    fontSize: 15,
    fontWeight: '600',
    color: '#15171A',
  },
  status: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  promo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 4,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  promoText: {
    fontSize: 12.5,
    opacity: 0.85,
  },
  initials: {
    fontSize: 16,
    fontWeight: '700',
  },
  railHeader: {
    gap: 14,
    paddingTop: 4,
    paddingBottom: 18,
  },
  railHeaderCompact: {
    alignItems: 'center',
    gap: 18,
    paddingTop: 4,
    paddingBottom: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 4,
  },
  brand: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  brandVersion: {
    fontSize: 10,
    fontWeight: '500',
  },
  segment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 3,
  },
  segmentItem: {
    flex: 1,
    height: 36,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});
