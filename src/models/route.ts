import {ReactNode} from 'react';

export interface RouteItem {
  path: string;
  component: ReactNode;
}

interface NavigationItemObject {
  title: string;
  to?: string;
}

export type NavigationItem = NavigationItemObject | string;
