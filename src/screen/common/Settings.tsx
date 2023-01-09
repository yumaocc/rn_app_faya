import {Button} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet, ScrollView, Linking, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationBar, OperateItem, SectionGroup} from '../../component';
import {globalStyles} from '../../constants/styles';
import {PRIVACY_POLICY_URL, USER_AGREEMENT_URL} from '../../constants/url';
import {useUserDispatcher, useSummaryDispatcher, useContractDispatcher, useMerchantDispatcher} from '../../helper/hooks';
import {FakeNavigation} from '../../models';

const Settings: React.FC = () => {
  const [userDispatcher] = useUserDispatcher();
  const [summaryDispatcher] = useSummaryDispatcher();
  const [contractDispatcher] = useContractDispatcher();
  const [merchantDispatcher] = useMerchantDispatcher();
  const navigation = useNavigation<FakeNavigation>();

  function handleDeleteAccount() {
    Linking.openURL('https://m.faya.life/#/user/account/delete');
  }

  return (
    <View style={styles.container}>
      <NavigationBar title="设置" />
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <ScrollView style={{flex: 1}}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Browser', {url: PRIVACY_POLICY_URL})}>
            <OperateItem title="隐私政策" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Browser', {url: USER_AGREEMENT_URL})}>
            <OperateItem title="入驻协议" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} onPress={handleDeleteAccount}>
            <OperateItem title="注销账号" />
          </TouchableOpacity>
          <SectionGroup>
            <Button
              type="warning"
              style={globalStyles.marginRightLeft}
              onPress={() => {
                userDispatcher.logout();
                summaryDispatcher.endEdit();
                contractDispatcher.logout();
                merchantDispatcher.logout();
              }}>
              退出登录
            </Button>
          </SectionGroup>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
