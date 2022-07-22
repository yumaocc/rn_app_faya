import React from 'react';
import {View, Text} from 'react-native';
import {useUserDispatcher} from '../../helper/hooks';
import {Icon, Button} from '@ant-design/react-native';

const Home: React.FC = () => {
  const [userDispatcher] = useUserDispatcher();
  return (
    <View>
      <Text>Home</Text>
      <Icon name="home" />
      <Button
        type="primary"
        onPress={() => {
          userDispatcher.logout();
        }}>
        退出登录
      </Button>
    </View>
  );
};
export default Home;
