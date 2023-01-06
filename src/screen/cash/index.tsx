// import {Icon as IconImg} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import React, {FC, useEffect} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {NavigationBar} from '../../component';
import CutOffRule from '../../component/CutOffRule';
import Title from '../../component/Title';
import {FontSize, globalStyles, globalStyleVariables} from '../../constants/styles';
import {useSummaryDispatcher, useUserDispatcher} from '../../helper/hooks';
import {FakeNavigation} from '../../models';
import {RootState} from '../../redux/reducers';
import CommodityTop from './rank/CommodityTop';
import SalesTop from './rank/SalesTop';
// import {SvgUri} from 'react-native-svg';
import Icon from '../../component/Form/Icon';
// import {icons} from '../../assets/icon';

const Cash: FC = () => {
  const navigation = useNavigation() as FakeNavigation;
  const commissionToday = useSelector((state: RootState) => state.summary);
  const wallet = useSelector((state: RootState) => state.user.wallet);
  const [userDispatcher] = useUserDispatcher();
  const [summaryDispatcher] = useSummaryDispatcher();

  useEffect(() => {
    summaryDispatcher.loadCommissionToday();
  }, [summaryDispatcher]);

  useEffect(() => {
    if (!wallet) {
      userDispatcher.getWallet();
    }
  }, [userDispatcher, wallet]);

  return (
    <>
      <SafeAreaView style={[globalStyles.wrapper]} edges={['bottom']}>
        <NavigationBar title="我的金库" />
        <ScrollView style={globalStyles.marginRightLeft}>
          {/* <SvgUri uri={icons.success} height={100} width={100} fill="#00000" /> */}
          <View style={styles.wrapper}>
            <View style={styles.content}>
              {/* <Button onPress={() => navigation.navigate('IconTest')}>选择icon：：：测试按钮</Button> */}
              <Title title="余额" unit="元" type={'money'} value={Number(wallet?.balanceYuan)} arrow handleClick={() => console.log()} />
              <CutOffRule />
              <View style={styles.contentOneBtn}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Withdraw')}>
                  <View style={styles.iconBg}>
                    <Icon name="FYLM_mine_jinku_tixianjilu" />
                  </View>
                  <Text style={[{textAlign: 'center'}, FontSize.f15]}>提现</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('WithdrawalsRecord')}>
                  <View>
                    <View style={styles.iconBg}>
                      <Icon name="FYLM_mine_jinku" />
                    </View>
                    <Text style={[{textAlign: 'center'}, FontSize.f15]}>提现记录</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.content}>
              <Title
                title="今日收益"
                unit="元"
                type={'money'}
                value={Number(commissionToday?.commissionToday?.moneyYuan)}
                arrow
                handleClick={() => navigation.navigate('TodayEarnings')}
              />
              <CutOffRule />
              <Title
                title="预计收益"
                unit="元"
                type={'money'}
                value={commissionToday?.commissionExpect?.moneyYuan}
                arrow
                handleClick={() => navigation.navigate('EstimatedIncome')}
              />
              <CutOffRule />
              <Title title="历史总收益" unit="元" type={'money'} value={commissionToday?.commissionHistory?.moneyYuan} arrow />
              <CutOffRule />
            </View>
            <CommodityTop unit="元" title="商品提成排行" />
            <SalesTop unit="单" title="商品销量排行" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default Cash;

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingBottom: globalStyleVariables.MODULE_SPACE,
  },
  content: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 10,
  },
  contentOneBtn: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconBg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropDown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropDownMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropDownItem: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
