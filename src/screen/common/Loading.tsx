import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {globalStyles} from '../../constants/styles';
import {useCommonDispatcher} from '../../helper/hooks';

const Loading: React.FC = () => {
  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    commonDispatcher.initApp();
  }, [commonDispatcher]);

  return (
    <View style={[{paddingTop: 300, alignItems: 'center'}, globalStyles.containerCenter]}>
      <ActivityIndicator animating={true} />
      <Text style={{marginTop: 10}}> 加载中...</Text>
    </View>
  );
};
export default Loading;
