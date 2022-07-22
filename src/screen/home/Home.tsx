import React from 'react';
import {View, Text, Button} from 'react-native';
import {useUserDispatcher} from '../../helper/hooks';
import {Button as AButton} from '@rneui/themed';

const Home: React.FC = () => {
  const [userDispatcher] = useUserDispatcher();
  return (
    <View>
      <Text>Home</Text>
      <AButton title="测试" />
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
