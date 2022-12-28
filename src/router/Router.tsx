import React from 'react';
import {createNavigationContainerRef} from '@react-navigation/native';

import TabNavigator from '../screen/tabs/TabNavigator';
import Login from '../screen/common/Login';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/reducers';
import {Stack} from './config'; //commonScreenOptions
// import ContractList from '../screen/contract/ContractList';
// import EditContract from '../screen/contract/EditContract';
import RouterSPU from './RouterSPU';
import RouterMerchant from './RouterMerchant';
import RouteContract from './RouterContract';
import RouterCash from './RouterCash';
import IconTest from '../screen/IconTest/IconTest';
const Navigator: React.FC = () => {
  const token = useSelector((state: RootState) => state.common.token);
  const isLogout = useSelector((state: RootState) => state.user.isLogout);
  return (
    <Stack.Navigator>
      {token ? (
        <>
          <Stack.Screen
            name="Tab"
            component={TabNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="IconTest"
            component={IconTest}
            options={{
              headerShown: false,
            }}
          />
          {RouterSPU}
          {RouterMerchant}
          {RouteContract}
          {RouterCash}
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
              animationTypeForReplace: isLogout ? 'pop' : 'push',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
export default Navigator;

export const navigationRef = createNavigationContainerRef();

// 编程式导航
export function navigate<Params = any>(name: string, params?: Params) {
  if (navigationRef.isReady()) {
    navigationRef.current?.navigate(name as unknown as never, params as unknown as never);
  }
}
