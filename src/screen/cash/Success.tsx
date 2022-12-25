import {Button} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import React, {FC} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {NavigationBar} from '../../component';
import {globalStyles} from '../../constants/styles';
import {FakeNavigation} from '../../models';

const Success: FC = () => {
  const navigation = useNavigation() as FakeNavigation;
  return (
    <>
      <SafeAreaView style={globalStyles.wrapper}>
        <NavigationBar title="提现" />
        <View style={[globalStyles.containerCenter]}>
          <Text style={[globalStyles.moduleMarginTop]}>提现成功,正在为您加速处理</Text>
          <Button type="primary" onPress={() => navigation.navigate('Withdraw')}>
            知道了
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Success;
