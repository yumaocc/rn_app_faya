import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Welcome from '../screen/common/Welcome';
const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={Welcome} />
    </Stack.Navigator>
  );
};
export default Navigator;
