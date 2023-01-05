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
import MineDetail from '../screen/mine/MineDetail';
// import {RootStackParamList, ValidRoute} from '../models';
import Cert from '../screen/Cert';
import Browser from '../component/Browser';
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
          <Stack.Screen
            name="MineDetail"
            component={MineDetail}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Cert"
            component={Cert}
            options={{
              headerShown: false,
              animationTypeForReplace: 'pop',
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
          <Stack.Screen
            name="Browser"
            component={Browser}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
export default Navigator;

export const navigationRef = createNavigationContainerRef();

export function isInLogin(): boolean {
  if (navigationRef.isReady()) {
    const routes = navigationRef.getState()?.routes;
    if (routes?.length) {
      const last = routes[routes.length - 1];
      if (last.name === 'Login') {
        return true;
      }
    }
  }
  return false;
}

// // 编程式导航
// export function goLogin(loginParams?: GoLoginParams) {
//   if (isInLogin()) {
//     return;
//   }
//   navigateTo('Login', loginParams?.params, loginParams?.behavior === 'replace');
// }

// export function relaunch() {
//   if (navigationRef.isReady()) {
//     navigationRef.dispatch(StackActions.popToTop());
//   }
// }

// export function relaunchTo(url: ValidRoute, params?: any) {
//   if (navigationRef.isReady()) {
//     navigationRef.dispatch(StackActions.popToTop());
//     navigationRef.dispatch(StackActions.push(url, params));
//   }
// }

// export function navigateTo(url: keyof RootStackParamList, params?: any, redirect = false) {
//   if (navigationRef.isReady()) {
//     if (redirect) {
//       navigationRef.dispatch(StackActions.replace(url, params));
//     } else {
//       navigationRef.dispatch(StackActions.push(url, params));
//     }
//   }
// }

// export function navigateBack() {
//   if (navigationRef.isReady()) {
//     navigationRef.dispatch(StackActions.pop());
//   }
// }