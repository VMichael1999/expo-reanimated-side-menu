import Ionicons from '@expo/vector-icons/Ionicons';
import type { StyleProp, TextStyle } from 'react-native';

import type { SideMenuIcon } from './types';

interface MenuIconProps {
  icon: SideMenuIcon;
  size: number;
  color: string;
  style?: StyleProp<TextStyle>;
}

export function MenuIcon({ icon, size, color, style }: MenuIconProps) {
  if (typeof icon !== 'string') return icon;
  return <Ionicons name={icon} size={size} color={color} style={style} />;
}
