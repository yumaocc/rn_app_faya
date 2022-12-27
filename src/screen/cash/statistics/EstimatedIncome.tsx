import React, {useEffect, useState} from 'react';
import {useDebounceFn} from 'ahooks';
import {View, Text, StyleSheet, Image, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon as AntdIcon} from '@ant-design/react-native';
import * as api from '../../../apis';
import {Input, NavigationBar} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {CommissionDetail, Picker, RequestAction, SearchParam} from '../../../models';
import {useCommonDispatcher, useSummaryDispatcher} from '../../../helper/hooks';
import {date, PAGE_SIZE} from '../../../constants';
import Title from '../../../component/Title';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import Loading from '../../../component/Loading';
import Icon from '../../../component/Form/Icon';
import {formatMoment} from '../../../helper';
import moment, {Moment} from 'moment';
import ModalDropdown from 'react-native-modal-dropdown';

const EstimatedIncome: React.FC = () => {
  const [data, setData] = useState<CommissionDetail[]>([]);
  const [valueType, setValueType] = useState<Picker>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [commonDispatcher] = useCommonDispatcher();
  const [summaryDispatcher] = useSummaryDispatcher();
  const commissionToday = useSelector((state: RootState) => state.summary);
  const [value, setValue] = useState('');
  const {run} = useDebounceFn(async (name: string) => getData({pageIndex: 1, name}, RequestAction.other));

  useEffect(() => {
    if (!commissionToday) {
      summaryDispatcher.loadCommissionToday();
    }
  }, [commissionToday, summaryDispatcher]);

  useEffect(() => {
    getData(
      {
        pageIndex: 1,
      },
      RequestAction.load,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async (params: SearchParam, action?: RequestAction) => {
    try {
      setLoading(true);
      const res = await api.summary.getExpectCommissionOrder({...params, pageSize: PAGE_SIZE});
      if (action === RequestAction.other) {
        setData(res.content);
      } else {
        setData(list => [...list, ...res.content]);
      }
      if (res.content.length) {
        setPageIndex(pageIndex => pageIndex + 1);
      }
    } catch (error) {
      commonDispatcher.error(error);
    }
    setLoading(false);
  };
  const pullUp = (index?: number) => {
    let start: Moment = null;
    let end: Moment = null;
    if (valueType?.value) {
      start = moment().startOf(valueType?.value);
      end = moment().endOf(valueType?.value);
    }
    getData(
      {
        beginTime: formatMoment(start),
        endTime: formatMoment(end),
        name: value,
        pageIndex: index || pageIndex,
      },
      RequestAction.load,
    );
  };

  function handleChangeFilter(e: Picker) {
    setValueType(e);
    const start: Moment = moment().startOf(valueType?.value);
    const end: Moment = moment().endOf(valueType?.value);
    console.log('value', e);
    console.log(start);
    console.log(end);
    setPageIndex(1);
    getData(
      {
        beginTime: formatMoment(start),
        endTime: formatMoment(end),
        pageIndex: 1,
      },
      RequestAction.other,
    );
  }

  const headerRight = (
    <View style={{width: 100}}>
      <Input
        placeholder="搜索"
        value={value}
        extra={<Icon name="FYLM_all_search" color="#f4f4f4" />}
        onChange={e => {
          setValue(e);
          setPageIndex(1);
          run(e);
        }}
        textAlign="left"
      />
    </View>
  );
  return (
    <>
      <SafeAreaView style={globalStyles.wrapper}>
        <Loading active={loading} />
        <NavigationBar title="预计收益" headerRight={headerRight} />
        <View style={{overflow: 'hidden', flex: 1}}>
          <View style={[globalStyles.containerLR, styles.header]}>
            <Title title="预计收益总额" unit="元" type={'money'} value={Number(commissionToday?.commissionExpect?.moneyYuan)} />
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
                {valueType?.value ? <Text>{valueType?.label}</Text> : <Text>筛选</Text>}
                <AntdIcon name="caret-down" color="#030303" size="lg" style={[{marginLeft: 7}, globalStyles.fontPrimary]} />
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
                          <AntdIcon name="shop" />
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
            keyExtractor={item => ' ' + item?.spuId}
            onEndReached={() => pullUp()}
          />
        </View>
        {/* <View style={[globalStyles.containerCenter, {margin: globalStyleVariables.MODULE_SPACE}]}>
          <Text style={globalStyles.fontTertiary}>已经到底了</Text>
        </View> */}
      </SafeAreaView>
    </>
  );
};
export default EstimatedIncome;

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
