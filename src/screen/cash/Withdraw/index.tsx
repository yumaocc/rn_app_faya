import {Button, Icon} from '@ant-design/react-native';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Input, NavigationBar, UnitNumber} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import ModalDropdown from 'react-native-modal-dropdown';
import {useCommonDispatcher, useUserDispatcher, useWallet} from '../../../helper/hooks';
import {BankCardStatus, FakeNavigation} from '../../../models';
import LinkButton from '../../../component/LinkButton';
import CutOffRule from '../../../component/CutOffRule';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import * as api from '../../../apis';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
const Withdraw: FC = () => {
  const [walletInfo, updateWallet] = useWallet(); //钱包信息

  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation() as FakeNavigation;
  const wallet = useSelector((state: RootState) => state.user.wallet); //余额
  const [money, setMoney] = useState('');
  const [userDispatcher] = useUserDispatcher();

  const handleClick = (value: {label: string; value: number}) => {
    if (value.value === 1) {
      navigation.navigate('WithdrawalsRecord');
    }
  };
  //处理银行卡卡号
  const slice = (card: string) => {
    return card.slice(card.length - 4, card.length);
  };
  const isReady = useMemo(() => {
    if (Number(money) > 0) {
      return true;
    }
    return false;
  }, [money]);
  useEffect(() => {
    if (!wallet) {
      userDispatcher.getWallet();
    }
  }, [userDispatcher, wallet]);
  //提现
  const handleWithdraw = async () => {
    try {
      await api.user.getWithdrawal({
        money,
        type: 'crm',
      });
      updateWallet();
      navigation.navigate('Success');
    } catch (error) {
      commonDispatcher.error(error || '哎呀，出错了');
    }
  };
  const headerRight = (
    <>
      <ModalDropdown
        dropdownStyle={[globalStyles.dropDownItem, {width: 100, height: 40}]}
        options={[{label: '提现记录', value: 1}]}
        renderRow={item => (
          <View style={[globalStyles.dropDownText]}>
            <Text>{item.label}</Text>
          </View>
        )}
        onSelect={(_, item) => handleClick(item)}>
        <View style={{height: '100%', justifyContent: 'center', paddingHorizontal: 10}}>
          <Icon name="ellipsis" size={26} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
        </View>
      </ModalDropdown>
    </>
  );
  return (
    <>
      <SafeAreaView style={globalStyles.wrapper} edges={['bottom']}>
        <NavigationBar title="提现" headerRight={headerRight} />
        <View style={styles.wrapper}>
          <View style={{marginBottom: 20}}>
            <Text>到账银行卡</Text>
          </View>
          {walletInfo?.status === BankCardStatus.unverified && (
            <TouchableOpacity activeOpacity={0.5} style={[globalStyles.flexNormal, globalStyles.moduleMarginTop, {alignItems: 'center'}]}>
              <Icon name="plus" color="#546DAD" style={{marginRight: globalStyleVariables.MODULE_SPACE}} />
              <Text style={[globalStyles.fontPrimary, globalStyles.primaryColor]}>银行卡尚未认证，请前往pc认证</Text>
            </TouchableOpacity>
          )}

          {walletInfo?.status === BankCardStatus.authenticated && (
            <>
              <View style={[globalStyles.containerLR, {marginBottom: globalStyleVariables.MODULE_SPACE}]}>
                <Text style={globalStyles.fontPrimary}>
                  {walletInfo?.bankCompanyName}&nbsp;({slice(walletInfo?.bankCard)})
                </Text>
              </View>
              <CutOffRule />
              <View style={{marginTop: globalStyleVariables.MODULE_SPACE}}>
                <Text>提现金额</Text>
              </View>
              <View style={[globalStyles.borderBottom, styles.inputWrapper]}>
                <Text style={{fontSize: 40}}>￥</Text>
                <View style={{flex: 1}}>
                  <Input type="number" textAlign="left" style={[{fontSize: 40}]} value={money} onChange={value => setMoney(value)} />
                </View>
              </View>
              <View style={[globalStyles.flexNormal, {alignItems: 'center', marginTop: globalStyleVariables.MODULE_SPACE}]}>
                <UnitNumber style={[globalStyles.fontPrimary]} value={`当前余额${wallet?.balanceYuan},`} unit={'元'} type={'元'} />
                <LinkButton title="全部提现" onPress={() => setMoney(wallet?.balanceYuan)} />
              </View>
              <Button disabled={!isReady} type="primary" style={{marginTop: 122}} onPress={handleWithdraw}>
                确定
              </Button>
            </>
          )}
          {walletInfo?.status !== BankCardStatus.unverified && BankCardStatus.authenticated && (
            <>
              <View style={[globalStyles.moduleMarginTop]}>
                <Text>认证失败，原因：{walletInfo?.reason}</Text>
              </View>
              <View style={globalStyles.moduleMarginTop}>
                <Text>请前往pc认证</Text>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default Withdraw;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#fff',
  },
  fontSize: {
    fontSize: 40,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
});
