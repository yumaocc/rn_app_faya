import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MerchantCreateType, RootStackParamList} from '../models';
import {createNavigationContainerRef} from '@react-navigation/native';

import TabNavigator from '../screen/tabs/TabNavigator';
import Login from '../screen/common/Login';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/reducers';

import AddMerchant from '../screen/merchant/AddMerchant';
import EditContract from '../screen/contract/EditContract';
import EditSPU from '../screen/spu/EditSPU';

const Stack = createNativeStackNavigator<RootStackParamList>();
const commonScreenOptions = {
  headerBackTitleVisible: false,
};

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
            name="AddMerchant"
            component={AddMerchant}
            initialParams={{type: MerchantCreateType.PUBLIC_SEA}}
            options={{
              ...commonScreenOptions,
              title: '新增商家',
            }}
          />
          <Stack.Screen
            name="EditContract"
            component={EditContract}
            options={{
              ...commonScreenOptions,
              title: '编辑合同',
            }}
          />
          <Stack.Screen
            name="AddContract"
            component={EditContract}
            options={{
              ...commonScreenOptions,
              title: '新增合同',
            }}
          />
          <Stack.Screen
            name="EditSPU"
            component={EditSPU}
            options={{
              ...commonScreenOptions,
              title: '编辑商品',
            }}
          />
          <Stack.Screen
            name="AddSPU"
            component={EditSPU}
            options={{
              ...commonScreenOptions,
              title: '新增商品',
            }}
          />
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
    navigationRef.current?.navigate(
      name as unknown as never,
      params as unknown as never,
    );
  }
}
