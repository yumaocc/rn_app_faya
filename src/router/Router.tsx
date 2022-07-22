import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../models';

import Home from '../screen/home/Home';
import Login from '../screen/common/Login';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/reducers';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator: React.FC = () => {
  const token = useSelector((state: RootState) => state.common.token);
  const isLogout = useSelector((state: RootState) => state.user.isLogout);
  return (
    <Stack.Navigator>
      {token ? (
        <>
          <Stack.Screen name="Home" component={Home} />
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