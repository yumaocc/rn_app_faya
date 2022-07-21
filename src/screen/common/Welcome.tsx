import React from 'react';
import {useEffect} from 'react';
import {View, Text} from 'react-native';
import {useCommonDispatcher} from '../../helper/hooks';

const Welcome: React.FC<Props> = () => {
  const [commonDispatcher] = useCommonDispatcher();
  useEffect(() => {
    commonDispatcher.initApp();
  }, [commonDispatcher]);
  return (
    <View>
      <Text>Welcome</Text>
    </View>
  );
};
export default Welcome;
