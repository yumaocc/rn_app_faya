import React from 'react';
import {View, Text, Button} from 'react-native';
import {useUserDispatcher} from '../../helper/hooks';

const Home: React.FC = () => {
  const [userDispatcher] = useUserDispatcher();
  return (
    <View>
      <Text>Home</Text>
      <Button
        title="退出登录"
        onPress={() => {
          userDispatcher.logout();
        }}
      />
    </View>
  );
};
export default Home;
