import React, {useEffect, useState} from 'react';
// import {useDebounceFn} from 'ahooks';
import {View, Text, StyleSheet, Image, FlatList, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon as AntdIcon} from '@ant-design/react-native';
import * as api from '../../../apis';
import {NavigationBar} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {CommissionDetail, Picker, SearchParam} from '../../../models';
import {useCommonDispatcher, useSummaryDispatcher} from '../../../helper/hooks';
// import {date} from '../../../constants';
import Title from '../../../component/Title';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import Loading from '../../../component/Loading';
// import Icon from '../../../component/Form/Icon';
import {formatMoment} from '../../../helper';
import moment from 'moment';
// import ModalDropdown from 'react-native-modal-dropdown';
import {useMount, useUnmount} from 'ahooks';
import {LoadingState} from '../../../models/common';
import {getLoadingStatusText} from '../../../helper/util';
import Empty from '../../../component/Empty';

const EstimatedIncome: React.FC = () => {
  const [data, setData] = useState<CommissionDetail[]>([]);
  const [valueType, setValueType] = useState<Picker>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [commonDispatcher] = useCommonDispatcher();
  const [status, setStatus] = useState<LoadingState>('none');
  const {bottom} = useSafeAreaInsets();
  const [summaryDispatcher] = useSummaryDispatcher();
  const commissionToday = useSelector((state: RootState) => state.summary);

  useEffect(() => {
    if (!commissionToday) {
      summaryDispatcher.loadCommissionToday();
    }
  }, [commissionToday, summaryDispatcher]);

  const getData = async (params: SearchParam, replace: boolean) => {
    try {
      setStatus('loading');
      setLoading(true);
      const {index, ...param} = params;
      const pageIndex = replace ? 1 : index + 1;
      const res = await api.summary.getCommissionOrder({...param, pageSize: 10, pageIndex});
      setStatus(res.content?.length < 10 ? 'noMore' : 'none');
      if (replace) {
        setData(res.content);
      } else {
        setData(list => [...list, ...res.content]);
      }
      setPageIndex(pageIndex);
    } catch (error) {
      commonDispatcher.error(error);
    }
    setLoading(false);
  };

  useMount(() => {
    getData(
      {
        index: 1,
      },
      false,
    );
  });
  useUnmount(() => {
    return () => {
      summaryDispatcher.endEdit();
    };
  });

  const pullUp = () => {
    setValueType(null);
    getData({index: 0}, true);
  };
  const pullDown = () => {
    let start: any = null;
    let end: any = null;
    if (valueType?.value) {
      start = moment().startOf(valueType.value);
      end = moment().endOf(valueType.value);
    }
    getData({index: pageIndex, beginTime: formatMoment(start), endTime: formatMoment(end)}, false);
  };

  // function handleChangeFilter(e: Picker) {
  //   setValueType(e);
  //   const start: Moment = moment().startOf(e.value);
  //   const end: Moment = moment().endOf(e.value);
  //   setPageIndex(1);
  //   getData(
  //     {
  //       beginTime: formatMoment(start),
  //       endTime: formatMoment(end),
  //       pageIndex: 0,
  //     },
  //     true,
  //   );
  // }

  const headerRight = (
    <View style={{width: 100}}>
      {/* <Input
        placeholder="搜索"
        value={value}
        extra={<Icon name="FYLM_all_search" color="#f4f4f4" />}
        onChange={e => {
          setValue(e);
          setPageIndex(1);
          run(e);
        }}
        textAlign="left"
      /> */}
    </View>
  );
  return (
    <>
      <Loading active={loading} />
      <NavigationBar title="预计收益" headerRight={headerRight} />
      <View style={{overflow: 'hidden', flex: 1}}>
        <View style={[globalStyles.containerLR, styles.header]}>
          <Title title="预计收益总额" unit="元" type={'money'} value={Number(commissionToday?.commissionExpect?.moneyYuan)} />
          {/* <ModalDropdown
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
          </ModalDropdown> */}
        </View>

        <FlatList
          data={data}
          renderItem={({item}) => (
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

                  <Text style={[globalStyles.fontSize12]}>{`售卖时间：${item.saleBeginTime} - ${item.saleEndTime}`}</Text>
                  <Text style={[globalStyles.fontSize12]}>{`成交时间：${item.paidTime}`}</Text>
                  <View style={[{marginTop: globalStyleVariables.MODULE_SPACE, backgroundColor: '#f4f4f4', padding: 10, borderRadius: 5, flex: 1}, globalStyles.containerLR]}>
                    <View>
                      <Text>{'订单提成'}</Text>
                    </View>
                    <Text>{item?.moneyYuan || 0}元</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          refreshing={false}
          ListFooterComponent={!!data?.length && <Text style={[{textAlign: 'center'}, globalStyles.fontTertiary]}>{getLoadingStatusText(status)}</Text>}
          onRefresh={() => {
            pullUp();
          }}
          ListEmptyComponent={<Empty />}
          ListFooterComponentStyle={[{height: Platform.OS === 'ios' ? bottom * 2 : 40}, globalStyles.containerCenter]}
          onEndReached={pullDown}
          keyExtractor={(_, index) => index + 'estimated'}
        />
      </View>
      {/* </SafeAreaView> */}
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
