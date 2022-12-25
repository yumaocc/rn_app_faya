import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDebounceFn} from 'ahooks';
import {View, Text, StyleSheet, Image, FlatList, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from '@ant-design/react-native';
import * as api from '../../../apis';
import {Input, NavigationBar} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {CommissionDetail, Picker} from '../../../models';
import {useCommonDispatcher, useSummaryDispatcher} from '../../../helper/hooks';
import {date, PAGE_SIZE} from '../../../constants';
import Title from '../../../component/Title';
import ModalDropdown from 'react-native-modal-dropdown';
import {Moment} from 'moment';
import moment from 'moment';
import {formatMoment} from '../../../helper';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';

enum Action {
  load = 1,
  other = 2,
}
//今日收益页面
const TodayEarnings: React.FC = () => {
  const [valueType, setValueType] = useState<Picker>(null);
  const [data, setData] = useState<CommissionDetail[]>([]);
  const {width: windowWidth} = useWindowDimensions();
  const [commonDispatcher] = useCommonDispatcher();
  const [summaryDispatcher] = useSummaryDispatcher();
  const pageIndex = useRef(1);
  const commissionToday = useSelector((state: RootState) => state.summary);
  const [value, setValue] = useState('');
  const {run} = useDebounceFn(
    async () => {
      pageIndex.current = 1;
      getData(Action.other);
    },
    {wait: 500},
  );

  function handleChangeFilter(e: Picker) {
    setValueType(e);
    pageIndex.current = 1;
    getData(Action.other);
  }
  const getData = useCallback(
    async (action: Action) => {
      try {
        const start: Moment = moment().startOf(valueType?.value);
        const end: Moment = moment().endOf(valueType?.value);
        if (action === Action.load) {
          const res = await api.summary.getCommissionOrder({
            beginTime: valueType?.value ? formatMoment(start) : '',
            endTime: valueType?.value ? formatMoment(end) : '',
            pageSize: PAGE_SIZE,
            pageIndex: pageIndex.current,
            name: value,
          });
          setData([...data, ...res.content]);
        } else {
          const res = await api.summary.getCommissionOrder({
            beginTime: formatMoment(start),
            endTime: formatMoment(end),
            pageSize: PAGE_SIZE,
            pageIndex: pageIndex.current,
            name: value,
          });
          setData([...res.content]);
        }
        pageIndex.current++;
      } catch (error) {
        commonDispatcher.error('哎呀，出错了');
      }
    },
    [commonDispatcher, data, value, valueType?.value],
  );

  useEffect(() => {
    if (!commissionToday) {
      summaryDispatcher.loadCommissionToday();
    }
  }, [commissionToday, summaryDispatcher]);

  useEffect(() => {
    getData(Action.load);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const headerRight = (
    <View style={[globalStyles.containerLR]}>
      <Input
        value={value}
        onChange={e => {
          setValue(e);
          run();
        }}
      />
      <Icon name="alert" />
    </View>
  );
  return (
    <>
      <SafeAreaView style={globalStyles.wrapper}>
        <NavigationBar title="收益订单" headerRight={headerRight} />
        <View style={{overflow: 'hidden', flex: 1}}>
          <View style={[{width: windowWidth, padding: globalStyleVariables.MODULE_SPACE}, globalStyles.containerLR]}>
            <View>
              <Title title="今日收益" unit="元" type={'money'} value={commissionToday?.commissionToday?.moneyYuan} />
            </View>
            <ModalDropdown
              dropdownStyle={globalStyles.dropDownItem}
              renderRow={item => (
                <View style={[globalStyles.dropDownText]}>
                  <Text>{item?.label}</Text>
                </View>
              )}
              options={date}
              defaultValue={valueType?.label}
              onSelect={(_, text) => handleChangeFilter(text as Picker)}>
              <View style={[{flexDirection: 'row'}]}>
                <Text>{valueType?.label}</Text>
                <Icon name="caret-down" color="#030303" size="lg" style={[{marginLeft: 7}, globalStyles.fontPrimary]} />
              </View>
            </ModalDropdown>
          </View>
          <FlatList
            data={data}
            renderItem={({item}) => (
              <>
                <View style={styles.spuContainer}>
                  <View style={{flexDirection: 'row', marginBottom: globalStyleVariables.MODULE_SPACE}}>
                    <View style={{paddingTop: 10}}>
                      <Image source={{uri: item.poster}} style={{width: 60, height: 80}} />
                    </View>
                    <View style={{flex: 1, marginLeft: 10}}>
                      <View style={globalStyles.containerLR}>
                        <View style={{flexDirection: 'row'}}>
                          <Icon name="shop" />
                          <Text style={globalStyles.fontPrimary}>{item.bizName}</Text>
                        </View>
                        {item?.status === 3 && (
                          <View style={globalStyles.tagWrapper}>
                            <Text style={globalStyles.tag}>·&nbsp;{item.statusStr}</Text>
                          </View>
                        )}
                        {item?.status === 1 && (
                          <View style={styles.tagWrapper}>
                            <Text style={styles.tag}>·&nbsp;{item.statusStr}</Text>
                          </View>
                        )}
                        {item?.status === 2 && (
                          <View style={globalStyles.tagWrapper}>
                            <Text style={globalStyles.tag}>·&nbsp;{item.statusStr}</Text>
                          </View>
                        )}
                      </View>
                      <Text numberOfLines={1}>{item.spuName}</Text>

                      <Text style={[globalStyles.fontSize12]}>{`售卖开始时间：${item.saleBeginTime}`}</Text>
                      <Text style={[globalStyles.fontSize12]}>{`售卖结束时间：${item.saleEndTime}`}</Text>
                      <Text style={[globalStyles.fontSize12]}>{`成交时间：${item.paidTime}`}</Text>
                      <View style={{marginTop: globalStyleVariables.MODULE_SPACE, backgroundColor: '#f4f4f4', padding: 10, borderRadius: 5}}>
                        <Text>{`订单提成${item?.moneyYuan || 0}元`}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}
            keyExtractor={(item, index) => ' ' + index}
            onEndReached={() => getData(Action.load)}
          />
        </View>
      </SafeAreaView>
    </>
  );
};
export default TodayEarnings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  freshHeader: {
    height: 80,
  },
  spuContainer: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#fff',
    padding: globalStyleVariables.MODULE_SPACE,
  },
  footer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    height: 36,
  },
  setting: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showSale: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: '100%',
  },
  tagWrapper: {
    backgroundColor: 'rgba(74, 184, 125, 0.2)',
  },
  tag: {
    color: ' #4AB87D',
  },
  header: {
    backgroundColor: '#fff',
    padding: globalStyleVariables.MODULE_SPACE,
  },
});
