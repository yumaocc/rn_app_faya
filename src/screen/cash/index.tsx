import {Icon} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import React, {FC, useEffect} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {NavigationBar} from '../../component';
import CutOffRule from '../../component/CutOffRule';
import Title from '../../component/Title';
import {FontSize} from '../../constants/styles';
import {useSummaryDispatcher, useUserDispatcher} from '../../helper/hooks';
import {FakeNavigation} from '../../models';
import {RootState} from '../../redux/reducers';
import CommodityList from './CommodityList';
const Cash: FC = () => {
  const navigation = useNavigation() as FakeNavigation;
  const commissionToday = useSelector((state: RootState) => state.summary);
  const wallet = useSelector((state: RootState) => state.user.wallet);
  const [userDispatcher] = useUserDispatcher();
  const [summaryDispatcher] = useSummaryDispatcher();

  useEffect(() => {
    if (!commissionToday) {
      summaryDispatcher.loadCommissionToday();
    }
  }, [commissionToday, summaryDispatcher]);

  useEffect(() => {
    if (!wallet) {
      userDispatcher.getWallet();
    }
  }, [userDispatcher, wallet]);

  return (
    <>
      <NavigationBar title="我的金库" />
      <ScrollView>
        <View style={styles.wrapper}>
          <View style={styles.content}>
            <Title title="余额" unit="元" type={'money'} value={wallet?.balanceYuan} arrow handleClick={() => console.log(111)} />
            <CutOffRule />
            <View style={styles.contentOneBtn}>
              <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Withdraw')}>
                <View style={styles.iconBg}>
                  <Icon name="money-collect" />
                </View>
                <Text style={[{textAlign: 'center'}, FontSize.f15]}>提现</Text>
              </TouchableOpacity>
              <View>
                <View style={styles.iconBg}>
                  <Icon name="money-collect" />
                </View>
                <Text style={[{textAlign: 'center'}, FontSize.f15]}>提现记录</Text>
              </View>
            </View>
          </View>
          <View style={styles.content}>
            <Title title="今日收益" unit="元" type={'money'} value={commissionToday?.commissionToday?.moneyYuan} arrow handleClick={() => console.log(111)} />
            <CutOffRule />
            <Title title="预计收益" unit="元" type={'money'} value={commissionToday?.commissionExpect?.moneyYuan} arrow handleClick={() => console.log(111)} />
            <CutOffRule />
            <Title title="历史总收益" unit="元" type={'money'} value={commissionToday?.commissionHistory?.moneyYuan} arrow handleClick={() => console.log(111)} />
            <CutOffRule />
          </View>

          <CommodityList unit="元" title="商品提成排行" type="commission" />
          <CommodityList unit="单" title="商品销量排行" type="sales" />
        </View>
      </ScrollView>
    </>
  );
};
export default Cash;

export const styles = StyleSheet.create({
  wrapper: {
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
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
