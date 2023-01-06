import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {FC} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {PlusButton} from '../../../../../component';
import * as api from '../../../../../apis';
import {globalStyles, globalStyleVariables} from '../../../../../constants/styles';
import {ContractList as ContractType, FakeNavigation} from '../../../../../models';
import {FlatList} from 'react-native-gesture-handler';
import {useCommonDispatcher} from '../../../../../helper/hooks';
import Loading from '../../../../../component/Loading';

interface ContractListProps {
  id: number;
}

const ContractList: FC<ContractListProps> = ({id}) => {
  const navigation = useNavigation() as FakeNavigation;
  const [loading, setLoading] = useState(false);
  const [len, setLen] = useState(0);
  const [commonDispatcher] = useCommonDispatcher();
  const [pageIndex, setPageIndex] = useState(1);
  const [contractList, setContractList] = useState<ContractType[]>([]);

  const fetchData = useCallback(
    async (pageIndex = 1) => {
      try {
        setLoading(true);
        const pageSize = 10;
        const res = await api.contract.getContractList({pageIndex, pageSize, id});
        if (res?.content?.length) {
          setPageIndex(pageIndex + 1);
        }
        setLen(res.page.pageTotal);
        setLoading(false);
        return res.content;
      } catch (error) {
        commonDispatcher.error(error || '哎呀，~出错了');
      }
      setLoading(false);
    },
    [commonDispatcher, id],
  );

  useEffect(() => {
    fetchData(1).then(res => {
      setContractList(res);
    });
  }, [fetchData]);

  const onRefresh = async () => {
    const res = await fetchData(pageIndex);
    setContractList(contractList => [...contractList, ...res]);
  };

  const onEndReached = async () => {
    const res = await fetchData(1);
    setContractList(res);
  };

  const renderItem = ({item, index}: {item: ContractType; index: number}) => {
    return (
      <View key={item.id || index} style={[styles.content]}>
        <Text style={[globalStyles.fontPrimary]}>{item.name}</Text>
        <View style={[globalStyles.containerLR, globalStyles.moduleMarginTop]}>
          <Text style={globalStyles.fontTertiary}>签约时间：{item.createdTime}</Text>
          <Text style={globalStyles.fontTertiary}>{item.statusStr}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <Loading active={loading} />
        <View style={[globalStyles.containerLR, styles.box]}>
          <Text>共{len}份合同</Text>
          <PlusButton title="新增合同" onPress={() => navigation.navigate('AddContract')} />
        </View>
        {!!contractList?.length ? (
          <FlatList
            refreshing={loading}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
            data={contractList || []}
            ListEmptyComponent={<Text>暂无数据</Text>}
            numColumns={1}
            renderItem={renderItem}
            keyExtractor={item => 'con' + item.id}
            ListFooterComponent={
              <View style={[globalStyles.containerCenter, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
                <Text style={globalStyles.fontTertiary}>已经到底了</Text>
              </View>
            }
          />
        ) : (
          <View style={[globalStyles.containerCenter]}>
            <Text style={globalStyles.fontTertiary}>暂无数据</Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};
export default ContractList;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    flex: 1,
  },
  freshHeader: {
    height: 60,
  },
  box: {
    margin: globalStyleVariables.MODULE_SPACE,
    borderColor: '#F4F4F4',
    borderWidth: 1,
    padding: globalStyleVariables.MODULE_SPACE,
  },
  content: {
    margin: globalStyleVariables.MODULE_SPACE,
  },
});
