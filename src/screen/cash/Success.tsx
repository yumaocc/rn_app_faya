import {Button} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import React, {FC} from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationBar} from '../../component';
import Icon from '../../component/Form/Icon';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {FakeNavigation} from '../../models';
const Success: FC = () => {
  const navigation = useNavigation() as FakeNavigation;

  return (
    <>
      <SafeAreaView style={globalStyles.wrapper} edges={['bottom']}>
        <NavigationBar title="提现" />
        <View style={[{flex: 1}, globalStyles.containerCenter]}>
          <Icon name="FYLM_all_feedback_true" style={{marginBottom: globalStyleVariables.MODULE_SPACE}} color="#546DAD" size={100} />
          <Text style={[globalStyles.moduleMarginTop]}>提现成功,正在为您加速处理</Text>
          <Button type="primary" style={{marginTop: globalStyleVariables.MODULE_SPACE}} onPress={() => navigation.navigate('Withdraw')}>
            知道了
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Success;
