import React, {useEffect} from 'react';
import moment from 'moment';
import {FC} from 'react';
import * as apis from '../../../apis';
import {formatMoment} from '../../../helper';
import {NavigationBar, Select} from '../../../component';
import Title from '../../../component/Title';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {HistoricalEarningsData} from '../../../models';
import {getAllMonth} from '../../../helper/util';
import {useCommonDispatcher} from '../../../helper/hooks';
import Empty from '../../../component/Empty';
import {useCallback} from 'react';

const HistoricalEarnings: FC = () => {
  const [historyData, setHistoryData] = useState<HistoricalEarningsData>();
  const [time, setTime] = useState();
  const [commonDispatcher] = useCommonDispatcher();
  const [loading, setLoading] = useState(false);

  const getListData = useCallback(
    async (time: any) => {
      try {
        setLoading(true);
        const start = formatMoment(moment().startOf(time));
        const end = formatMoment(moment().endOf(time));
        const res = await apis.user.getHistoricalIncome({
          beginTime: start,
          endTime: end,
        });
        setHistoryData(res);
      } catch (error) {
        commonDispatcher.error(error || '哎呀，出错了~');
      }
      setLoading(false);
    },
    [commonDispatcher],
  );

  useEffect(() => {
    apis.user
      .getHistoricalIncomeView()
      .then((res: HistoricalEarningsData) => setHistoryData(res))
      .catch(err => commonDispatcher.error(err || '哎呀，出错了~'));
  }, [commonDispatcher]);

  useEffect(() => {
    getListData(time);
  }, [getListData, time]);

  return (
    <>
      <NavigationBar title="历史收益" />
      <View style={styles.wrapper}>
        <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
          <Title title="历史收益总额" unit="元" type={'money'} value={Number(historyData?.moneyYuan)} />
        </View>
        <View style={styles.selector}>
          <Select options={getAllMonth()} value={time} onChange={setTime} placeholder="请选择" />
        </View>
        {loading && <ActivityIndicator color="#546DAD" style={{position: 'absolute', top: '50%', left: '50%'}} />}
        <FlatList
          style={{flex: 1}}
          data={historyData?.list}
          ListEmptyComponent={!loading && <Empty style={{marginTop: 300}} />}
          renderItem={({item, index}) => {
            return (
              <View key={index} style={[styles.item, globalStyles.borderBottom]}>
                <Text style={globalStyles.fontPrimary}>{item?.dateStr}</Text>
                <Text style={globalStyles.fontPrimary}>{item?.moneyYuan}&nbsp;元</Text>
              </View>
            );
          }}
        />
      </View>
    </>
  );
};

export default HistoricalEarnings;
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    flex: 1,
  },
  selector: {
    height: 40,
    backgroundColor: '#f4f4f4',
    paddingLeft: 15,
    justifyContent: 'center',
  },
  item: {
    marginHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  popoverMenu: {
    padding: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 100,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: globalStyleVariables.BORDER_COLOR,
  },
  popoverItem: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popoverText: {
    fontSize: 15,
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
});
