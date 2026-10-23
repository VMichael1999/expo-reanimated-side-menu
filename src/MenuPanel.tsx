import Ionicons from '@expo/vector-icons/Ionicons';
import { Fragment, isValidElement, useState, type ReactElement, type ReactNode } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { MenuIcon } from './MenuIcon';
import { fontStyle, isDarkColor } from './theme';
import type {
  SideMenuAction,
  SideMenuBlock,
  SideMenuHelpers,
  SideMenuItem,
  SideMenuLogout,
  SideMenuProfile,
  SideMenuSection,
  SideMenuSlot,
  SideMenuTheme,
} from './types';

/**
 * How the items are drawn: `default` for the drawers, `floating` for the rounded card (selected
 * item lifted with a border and a shadow) and `rail` for the docked menu (selected item marked
 * with a line on its edge).
 */
export type PanelLook = 'default' | 'floating' | 'rail';

const DEFAULT_ORDER: SideMenuBlock[] = [
  'header',
  'sections',
  'action',
  'logout',
  'profile',
  'footerText',
  'footer',
];

export interface MenuPanelProps {
  theme: SideMenuTheme;
  look: PanelLook;
  compact: boolean;
  helpers: SideMenuHelpers;
  paddingTop: number;
  paddingBottom: number;
  sections: SideMenuSection[];
  selectedKey?: string;
  profile?: SideMenuProfile;
  profilePosition: 'top' | 'bottom';
  header?: SideMenuSlot;
  action?: SideMenuAction;
  logout?: SideMenuLogout;
  footerText?: string;
  footer?: SideMenuSlot;
  content?: SideMenuSlot;
  order?: SideMenuBlock[];
  /** Drawn at the very bottom, after everything else (e.g. the collapse button). */
  accessory?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Everything inside the panel; the variants only decide where the panel goes and how it moves. */
export function MenuPanel({
  theme,
  look,
  compact,
  helpers,
  paddingTop,
  paddingBottom,
  sections,
  selectedKey,
  profile,
  profilePosition,
  header,
  action,
  logout,
  footerText,
  footer,
  content,
  order = DEFAULT_ORDER,
  accessory,
  style,
}: MenuPanelProps) {
  // A UIScrollView takes over any drag on iOS, swipe-to-close included, so the list only scrolls
  // when its content does not fit.
  const [listHeight, setListHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const renderSlot = (slot: SideMenuSlot): ReactNode =>
    typeof slot === 'function' ? slot(helpers) : slot;
  const regular = fontStyle(theme.fonts.regular, '400');
  const semibold = fontStyle(theme.fonts.semibold, '600');
  const bold = fontStyle(theme.fonts.bold, '700');
  const padding = look === 'default' ? 16 : compact ? 8 : 12;

  if (content !== undefined) {
    return (
      <View
        style={[styles.panel, { paddingTop, paddingBottom, paddingHorizontal: padding }, style]}>
        {renderSlot(content)}
        {accessory}
      </View>
    );
  }

  const topProfile = profile && profilePosition === 'top' ? profile : undefined;
  const bottomProfile = profile && profilePosition === 'bottom' ? profile : undefined;

  const blocks: Record<SideMenuBlock, () => ReactNode> = {
    header: () => {
      const node =
        header !== undefined
          ? renderSlot(header)
          : topProfile
            ? renderTopProfile(topProfile)
            : null;
      if (node === null || node === undefined) return null;
      return (
        <>
          {node}
          {look !== 'rail' ? (
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
          ) : null}
        </>
      );
    },
    sections: () => (
      <ScrollView
        scrollEnabled={contentHeight > listHeight + 1}
        bounces={false}
        onLayout={(event) => setListHeight(event.nativeEvent.layout.height)}
        onContentSizeChange={(_, height) => setContentHeight(height)}
        style={styles.sections}
        contentContainerStyle={styles.sectionsContent}
        showsVerticalScrollIndicator={false}>
        {sections.map((section, index) => (
          <View key={section.key} style={styles.section}>
            {look === 'rail' && index > 0 ? (
              <View style={[styles.railDivider, { backgroundColor: theme.divider }]} />
            ) : null}
            {section.title && !compact ? (
              <Text
                style={[
                  look === 'rail' ? styles.railSectionTitle : styles.sectionTitle,
                  bold,
                  { color: theme.textMuted },
                ]}
                numberOfLines={1}>
                {look === 'rail' ? section.title.toUpperCase() : section.title}
              </Text>
            ) : null}
            {section.items?.map((item) => renderItem(item))}
            {section.content !== undefined ? renderSlot(section.content) : null}
          </View>
        ))}
      </ScrollView>
    ),
    action: () => (action ? renderAction(action) : null),
    logout: () =>
      logout ? (
        <>
          <View style={[styles.divider, { backgroundColor: theme.divider }]} />
          {renderRow({
            key: 'logout',
            label: logout.label ?? 'Log out',
            icon: logout.icon ?? 'log-out-outline',
            color: theme.danger,
            onPress: logout.onPress,
          })}
        </>
      ) : null,
    profile: () => (bottomProfile ? renderBottomProfile(bottomProfile) : null),
    footerText: () =>
      footerText && !compact ? (
        <Text style={[styles.footerText, regular, { color: theme.textMuted }]}>{footerText}</Text>
      ) : null,
    footer: () => (footer !== undefined ? renderSlot(footer) : null),
  };

  return (
    <View style={[styles.panel, { paddingTop, paddingBottom, paddingHorizontal: padding }, style]}>
      {order.map((block) => (
        <Fragment key={block}>{blocks[block]()}</Fragment>
      ))}
      {accessory}
    </View>
  );

  function renderTopProfile(item: SideMenuProfile) {
    const centered = look === 'floating';
    const size = centered ? (compact ? 44 : 72) : 60;
    return (
      <Pressable
        style={[styles.profile, centered && styles.profileCentered]}
        onPress={item.onPress ? () => helpers.closeThen(item.onPress!) : undefined}
        disabled={!item.onPress}
        accessibilityRole={item.onPress ? 'button' : undefined}
        accessibilityLabel={item.accessibilityLabel ?? item.title}>
        <Avatar avatar={item.avatar} size={size} theme={theme} />
        {compact ? null : (
          <View style={[styles.profileText, centered && styles.profileTextCentered]}>
            <Text
              style={[styles.profileTitle, bold, { color: theme.text }, centered && styles.center]}
              numberOfLines={1}>
              {item.title}
            </Text>
            {item.subtitle ? (
              <Text
                style={[
                  styles.profileSubtitle,
                  regular,
                  { color: theme.textSecondary },
                  centered && styles.center,
                ]}
                numberOfLines={1}>
                {item.subtitle}
              </Text>
            ) : null}
          </View>
        )}
        {item.onPress && !centered ? (
          <Ionicons name="chevron-forward" size={20} color={theme.text} />
        ) : null}
      </Pressable>
    );
  }

  function renderBottomProfile(item: SideMenuProfile) {
    return (
      <Pressable
        style={[
          styles.profileCard,
          compact ? styles.profileCardCompact : { borderColor: theme.divider },
        ]}
        onPress={item.onPress ? () => helpers.closeThen(item.onPress!) : undefined}
        disabled={!item.onPress}
        accessibilityRole={item.onPress ? 'button' : undefined}
        accessibilityLabel={item.accessibilityLabel ?? item.title}>
        <Avatar avatar={item.avatar} size={40} theme={theme} />
        {compact ? null : (
          <>
            <View style={styles.profileText}>
              <Text style={[styles.cardTitle, semibold, { color: theme.text }]} numberOfLines={1}>
                {item.title}
              </Text>
              {item.subtitle ? (
                <Text
                  style={[styles.cardSubtitle, regular, { color: theme.textSecondary }]}
                  numberOfLines={1}>
                  {item.subtitle}
                </Text>
              ) : null}
            </View>
            <Ionicons name="ellipsis-horizontal" size={18} color={theme.textSecondary} />
          </>
        )}
      </Pressable>
    );
  }

  function renderItem(item: SideMenuItem) {
    return renderRow(item, item.key === selectedKey);
  }

  function renderRow(item: SideMenuItem, selected = false) {
    const dimmed = selectedKey !== undefined && !selected && item.color === undefined;
    const color = item.color ?? (dimmed ? theme.textSecondary : theme.text);
    const labelFont = look === 'default' || selected ? bold : regular;
    const onPress = item.onPress;
    return (
      <Pressable
        key={item.key}
        onPress={onPress ? () => helpers.closeThen(onPress) : undefined}
        disabled={!onPress}
        style={({ pressed }) => [
          styles.item,
          look === 'floating' && styles.floatingItem,
          look === 'rail' && styles.railItem,
          compact && styles.itemCompact,
          selected && { backgroundColor: theme.itemSelected },
          selected &&
            look === 'floating' && [styles.floatingSelected, { borderColor: theme.divider }],
          pressed && !selected && { backgroundColor: theme.itemPressed },
        ]}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityState={{ selected }}
        accessibilityLabel={item.accessibilityLabel ?? item.label}>
        {selected && look === 'rail' ? (
          <View style={[styles.selectedLine, { backgroundColor: theme.accent }]} />
        ) : null}
        {item.render ? (
          item.render({ ...helpers, selected, color })
        ) : (
          <>
            {item.icon ? (
              <View>
                <MenuIcon icon={item.icon} size={look === 'default' ? 22 : 20} color={color} />
                {compact && item.badge !== undefined ? (
                  <View
                    style={[styles.badgeDot, { backgroundColor: item.badgeColor ?? theme.accent }]}
                  />
                ) : null}
              </View>
            ) : null}
            {compact ? null : (
              <>
                <View style={styles.itemText}>
                  <Text
                    style={[
                      styles.itemLabel,
                      look !== 'default' && styles.itemLabelSmall,
                      labelFont,
                      { color },
                    ]}
                    numberOfLines={1}>
                    {item.label}
                  </Text>
                  {item.subtitle ? (
                    <Text
                      style={[styles.itemSubtitle, regular, { color: theme.textMuted }]}
                      numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                  ) : null}
                </View>
                {item.trailing !== undefined ? (
                  item.trailing
                ) : item.badge !== undefined ? (
                  <Badge value={item.badge} color={item.badgeColor ?? theme.accent} theme={theme} />
                ) : null}
              </>
            )}
          </>
        )}
      </Pressable>
    );
  }

  function renderAction(item: SideMenuAction) {
    const accent = item.variant !== 'outline';
    const color = accent ? theme.onAccent : theme.text;
    return (
      <Pressable
        onPress={() => helpers.closeThen(item.onPress)}
        style={({ pressed }) => [
          styles.action,
          compact && styles.actionCompact,
          accent
            ? { backgroundColor: theme.accent }
            : { borderWidth: 1, borderColor: theme.divider },
          pressed && styles.actionPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={item.accessibilityLabel ?? item.label}>
        {item.icon ? <MenuIcon icon={item.icon} size={20} color={color} /> : null}
        {compact ? null : (
          <>
            <Text style={[styles.actionLabel, semibold, { color }]} numberOfLines={1}>
              {item.label}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={color} style={styles.actionArrow} />
          </>
        )}
      </Pressable>
    );
  }
}

function Avatar({
  avatar,
  size,
  theme,
}: {
  avatar?: ImageSourcePropType | ReactElement;
  size: number;
  theme: SideMenuTheme;
}) {
  const frame = { width: size, height: size, borderRadius: size / 2 };
  return (
    <View style={[styles.avatar, frame, { backgroundColor: theme.avatarBackground }]}>
      {!avatar ? (
        <Ionicons name="person" size={Math.round(size * 0.56)} color={theme.text} />
      ) : isValidElement(avatar) ? (
        avatar
      ) : (
        <Image source={avatar as ImageSourcePropType} style={frame} />
      )}
    </View>
  );
}

function Badge({
  value,
  color,
  theme,
}: {
  value: string | number;
  color: string;
  theme: SideMenuTheme;
}) {
  // A badge color of your own gets whichever text reads on it; the accent keeps `onAccent`.
  const textColor =
    color === theme.accent ? theme.onAccent : isDarkColor(color) ? '#FFFFFF' : '#111519';
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={[styles.badgeText, fontStyle(theme.fonts.bold, '700'), { color: textColor }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  railDivider: {
    height: 1,
    marginHorizontal: 4,
    marginBottom: 14,
  },
  sections: {
    flex: 1,
  },
  sectionsContent: {
    paddingVertical: 8,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  railSectionTitle: {
    fontSize: 11,
    letterSpacing: 1.2,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  profileCentered: {
    flexDirection: 'column',
    paddingVertical: 12,
    gap: 10,
  },
  profileText: {
    flex: 1,
  },
  profileTextCentered: {
    flex: 0,
    alignSelf: 'stretch',
  },
  center: {
    textAlign: 'center',
  },
  profileTitle: {
    fontSize: 18,
    marginBottom: 2,
  },
  profileSubtitle: {
    fontSize: 14,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 40,
    padding: 8,
    paddingRight: 16,
    marginTop: 12,
  },
  profileCardCompact: {
    justifyContent: 'center',
    borderWidth: 0,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 14,
  },
  cardSubtitle: {
    fontSize: 11.5,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 4,
  },
  floatingItem: {
    gap: 18,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 8,
  },
  floatingSelected: {
    shadowColor: '#000000',
    shadowOpacity: 0.28,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  railItem: {
    gap: 14,
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 2,
  },
  itemCompact: {
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  selectedLine: {
    position: 'absolute',
    left: 0,
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  itemText: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
  },
  itemSubtitle: {
    fontSize: 12.5,
    marginTop: 1,
  },
  itemLabelSmall: {
    fontSize: 15,
  },
  badge: {
    minWidth: 24,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11.5,
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  action: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  actionCompact: {
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionLabel: {
    flexShrink: 1,
    fontSize: 15.5,
  },
  actionArrow: {
    marginLeft: 'auto',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 8,
  },
});
