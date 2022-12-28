import moment from 'moment';
import React, {FC, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {formatMoment} from '../../../helper';
import {useSummaryDispatcher} from '../../../helper/hooks';
import ModalDropdown from 'react-native-modal-dropdown';
import {Picker} from '../../../models';
import {RootState} from '../../../redux/reducers';
import {StyleSheet, Text, View} from 'react-native';
import {date} from '../../../constants';
import {Icon} from '@ant-design/react-native';
import CutOffRule from '../../../component/CutOffRule';
import {globalStyles} from '../../../constants/styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationBar} from '../../../component';

const SalesTopList: FC = () => {
  const [valueType, setValueType] = useState<Picker>({label: '日', value: 'day'});
  const [summaryDispatcher] = useSummaryDispatcher();
  const salesTop = useSelector((state: RootState) => state.summary.saleTop);

  useEffect(() => {
    const start = moment().startOf(valueType.value);
    const end = moment().endOf(valueType.value);
    summaryDispatcher.loadSalesTop([formatMoment(start), formatMoment(end)]);
  }, [summaryDispatcher, valueType.value]);

  function handleChangeFilter(e: Picker) {
    setValueType(e);
  }

  return (
    <>
      <SafeAreaView style={globalStyles.wrapper} edges={['bottom']}>
        <NavigationBar title="我的金库" />
        <View style={styles.content}>
          <View style={styles.dropDownMenu}>
            <Text>商品销量排行榜</Text>
            <View style={styles.dropDown}>
              <ModalDropdown
                dropdownStyle={globalStyles.dropDownItem}
                renderRow={item => (
                  <View style={[globalStyles.dropDownText, {borderWidth: 10, borderColor: '#fff'}]}>
                    <Text>{item.label}</Text>
                  </View>
                )}
                options={date}
                defaultValue={valueType.label}
                onSelect={(item, text) => handleChangeFilter(text as Picker)}>
                <View style={{flexDirection: 'row'}}>
                  <Text>{valueType.label}</Text>
                  <Icon name="caret-down" color="#030303" style={[{marginLeft: 7}, globalStyles.fontPrimary]} />
                </View>
              </ModalDropdown>
            </View>
          </View>
          {salesTop.length > 0 ? (
            <>
              {salesTop?.map((item, index) => {
                return (
                  <View key={item.spuId}>
                    <View style={styles.rankList}>
                      <Text style={styles.index}>{index + 1}</Text>
                      <Text>{item.name}</Text>
                      <Text style={{color: '#4AB87D'}}>+{item.allCommissionYuan}&nbsp; 单</Text>
                    </View>
                    <CutOffRule />
                  </View>
                );
              })}
            </>
          ) : (
            <View style={[globalStyles.containerCenter, {flex: 1}]}>
              <Text style={globalStyles.fontPrimary}>暂无数据</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default SalesTopList;

export const styles = StyleSheet.create({
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
  index: {
    fontWeight: '900',
    fontSize: 15,
    color: '#999999',
  },
  rankList: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rankListMoney: {
    color: '#4AB87D',
    fontSize: 12,
  },
  more: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
