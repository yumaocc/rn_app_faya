import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, FlatList, useWindowDimensions, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon as AntdIcon} from '@ant-design/react-native';
import * as api from '../../../apis';
import {NavigationBar} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {CommissionDetail, Picker, SearchParam} from '../../../models';
import {useCommonDispatcher, useSummaryDispatcher} from '../../../helper/hooks';
import {date} from '../../../constants';
import Title from '../../../component/Title';
import ModalDropdown from 'react-native-modal-dropdown';
import {Moment} from 'moment';
import moment from 'moment';
import {formatMoment} from '../../../helper';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import Loading from '../../../component/Loading';
import {useMount} from 'ahooks';
import Empty from '../../../component/Empty';
import {getLoadingStatusText} from '../../../helper/util';
import {LoadingState} from '../../../models/common';

//今日收益页面
const TodayEarnings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<LoadingState>('none');
  const {bottom} = useSafeAreaInsets();
  const [valueType, setValueType] = useState<Picker>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [data, setData] = useState<CommissionDetail[]>([]);
  const {width: windowWidth} = useWindowDimensions();
  const [summaryDispatcher] = useSummaryDispatcher();
  const [commonDispatcher] = useCommonDispatcher();
  const commissionToday = useSelector((state: RootState) => state.summary);

  useEffect(() => {
    summaryDispatcher.loadCommissionToday();
  }, [summaryDispatcher]);

  useMount(() => {
    getData(
      {
        index: 0,
      },
      false,
    );
  });

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

  function handleChangeFilter(e: Picker) {
    setValueType(e);
    const start: Moment = moment().startOf(e.value);
    const end: Moment = moment().endOf(e.value);
    setPageIndex(1);
    getData(
      {
        beginTime: formatMoment(start),
        endTime: formatMoment(end),
        pageIndex: 0,
      },
      true,
    );
  }
  const pullDown = () => {
    let start: any = null;
    let end: any = null;
    if (valueType?.value) {
      start = moment().startOf(valueType.value);
      end = moment().endOf(valueType.value);
    }

    getData({index: pageIndex, beginTime: formatMoment(start), endTime: formatMoment(end)}, false);
  };

  const pullUp = (index?: number) => {
    setValueType(null);
    getData(
      {
        index,
      },
      true,
    );
  };
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
      <NavigationBar title="收益订单" headerRight={headerRight} />
      <View style={{overflow: 'hidden', flex: 1}}>
        <View style={[{width: windowWidth, padding: globalStyleVariables.MODULE_SPACE, backgroundColor: '#fff'}, globalStyles.containerLR]}>
          <Title title="今日收益" unit="元" type={'money'} value={Number(commissionToday?.commissionToday?.moneyYuan)} />
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
          refreshing={false}
          ListFooterComponent={!!data?.length && <Text style={[{textAlign: 'center'}, globalStyles.fontTertiary]}>{getLoadingStatusText(status)}</Text>}
          onRefresh={() => pullUp(0)}
          ListEmptyComponent={<Empty />}
          ListFooterComponentStyle={[{height: Platform.OS === 'ios' ? bottom * 2 : 40}, globalStyles.containerCenter]}
          onEndReached={pullDown}
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
          keyExtractor={(item, index) => ' ' + index}
        />
      </View>
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
