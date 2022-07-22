import {ReactNode} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

/**
 * @deprecated rn 不支持
 */
export interface RouteItem {
  path: string;
  component: ReactNode;
}

/**
 * @deprecated rn 不支持
 */
interface NavigationItemObject {
  title: string;
  to?: string;
}

/**
 * @deprecated rn 不支持
 */
export type NavigationItem = NavigationItemObject | string;

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

export type Props = NativeStackScreenProps<RootStackParamList>;
