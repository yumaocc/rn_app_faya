import React from 'react';
import {View, Text} from 'react-native';
import {NavigationBar} from '../../../component';

const SPUDetail: React.FC = () => {
  return (
    <View style={{flex: 1}}>
      <NavigationBar title="商品详情" />
      <Text>SPUDetail</Text>
    </View>
  );
};
export default SPUDetail;
