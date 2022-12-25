import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDebounceFn} from 'ahooks';
import {View, Text, StyleSheet, Image, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from '@ant-design/react-native';
import * as api from '../../../apis';
import {Input, NavigationBar} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {CommissionDetail} from '../../../models';
import {useCommonDispatcher, useSummaryDispatcher} from '../../../helper/hooks';
import {PAGE_SIZE} from '../../../constants';
import Title from '../../../component/Title';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';

enum Action {
  load = 1,
  other = 2,
}
const EstimatedIncome: React.FC = () => {
  const [data, setData] = useState<CommissionDetail[]>([]);
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

  const getData = useCallback(
    async (action: Action) => {
      try {
        if (action === Action.load) {
          const res = await api.summary.getExpectCommissionOrder({
            pageSize: PAGE_SIZE,
            pageIndex: pageIndex.current,
            name: value,
          });
          setData([...data, ...res.content]);
        } else {
          const res = await api.summary.getCommissionOrder({
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
    [commonDispatcher, data, value],
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
    </View>
  );
  return (
    <>
      <SafeAreaView style={globalStyles.wrapper}>
        <NavigationBar title="预计收益" headerRight={headerRight} />
        <View style={{overflow: 'hidden', flex: 1}}>
          <View style={[globalStyles.containerLR, styles.header]}>
            <Title title="预计收益总额" unit="元" type={'money'} value={commissionToday?.commissionExpect?.moneyYuan} />
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
        <View style={[globalStyles.containerCenter, {margin: globalStyleVariables.MODULE_SPACE}]}>
          <Text style={globalStyles.fontTertiary}>已经到底了</Text>
        </View>
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
