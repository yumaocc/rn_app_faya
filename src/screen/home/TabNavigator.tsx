import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from '@ant-design/react-native';
import Home from './tabs/Home';
import Merchant from './tabs/Merchant';
import {primary} from '../../constants/theme';

const Tab = createBottomTabNavigator();

interface TabItemProps {
  focused: boolean;
  color: string;
  size: number;
}

const tabOptions = {
  activeColor: primary,
  items: [
    {
      name: 'Home',
      label: '首页',
      renderIcon: ({color, size}: TabItemProps) => (
        <Icon name="home" color={color} size={size} />
      ),
      component: Home,
    },
    {
      name: 'Merchant',
      label: '商家',
      renderIcon: ({color, size}: TabItemProps) => (
        <Icon name="shop" color={color} size={size} />
      ),
      component: Merchant,
    },
  ],
};

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: tabOptions.activeColor,
      }}>
      {tabOptions.items.map(tabItem => {
        return (
          <Tab.Screen
            key={tabItem.name}
            name={tabItem.name}
            component={tabItem.component}
            options={{
              headerShown: false,
              tabBarLabel: tabItem.label,
              tabBarIcon: tabItem.renderIcon,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};
export default TabNavigator;
