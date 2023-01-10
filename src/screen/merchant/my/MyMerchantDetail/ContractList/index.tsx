import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {FC} from 'react';
import {SafeAreaView, StyleSheet, Text, View, FlatList} from 'react-native';
import {PlusButton} from '../../../../../component';
import * as api from '../../../../../apis';
import {globalStyles, globalStyleVariables} from '../../../../../constants/styles';
import {ContractList as ContractType, FakeNavigation} from '../../../../../models';
import {useCommonDispatcher} from '../../../../../helper/hooks';
import {LoadingState} from '../../../../../models/common';
import Empty from '../../../../../component/Empty';
import {useMount} from 'ahooks';
import {getLoadingStatusText} from '../../../../../helper/util';

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
  const [status, setStatus] = useState<LoadingState>('none');

  const getData = async (index: number, replace?: boolean) => {
    try {
      setStatus('loading');
      const pageIndex = replace ? 1 : index + 1;
      const pageSize = 10;
      const res = await api.contract.getContractList({pageIndex, pageSize, id});
      setStatus(res.content?.length < pageSize ? 'noMore' : 'none');

      if (replace) {
        setContractList([...res.content]);
      } else {
        setContractList([...contractList, ...res.content]);
      }
      setPageIndex(pageIndex);
      setLen(res.page.pageTotal);
    } catch (error) {
      setStatus('none');
      commonDispatcher.error(error);
    }
    setLoading(false);
  };

  useMount(() => {
    getData(0);
  });

  const onRefresh = async () => {
    getData(0, true);
  };

  const onEndReached = async () => {
    getData(pageIndex);
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
        <View style={[globalStyles.containerLR, styles.box]}>
          <Text>共{len}份合同</Text>
          <PlusButton title="新增合同" onPress={() => navigation.navigate('AddContract')} />
        </View>
        <FlatList
          refreshing={loading}
          onRefresh={onRefresh}
          onEndReached={onEndReached}
          data={contractList || []}
          ListEmptyComponent={!loading && <Empty />}
          numColumns={1}
          renderItem={renderItem}
          keyExtractor={item => 'con' + item.id}
          ListFooterComponentStyle={[{height: 40}, globalStyles.containerCenter]}
          ListFooterComponent={!!contractList?.length && <Text style={[{textAlign: 'center'}, globalStyles.fontTertiary]}>{getLoadingStatusText(status)}</Text>}
        />
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
