import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {FC} from 'react';
import {ListView} from '@ant-design/react-native';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {PlusButton} from '../../../../../component';
import * as api from '../../../../../apis';
import {globalStyles, globalStyleVariables} from '../../../../../constants/styles';
import {ContractList, FakeNavigation} from '../../../../../models';

interface CommodityListProps {
  id: number;
}

type StartFetchFunction = (rowData: any[], pageSize: number) => void;
type abortFetchFunction = () => void;
const CommodityList: FC<CommodityListProps> = ({id}) => {
  const navigation = useNavigation() as FakeNavigation;
  const [len, setLen] = useState(0);
  async function fetchData(pageIndex = 1, startFetch: StartFetchFunction, abortFetch: abortFetchFunction) {
    try {
      const pageSize = 5;
      const res = await api.contract.getContractList({pageIndex, pageSize, id});
      const rowData: ContractList[] = res.content;
      setLen(res.page.pageTotal);
      startFetch(rowData, pageSize);
    } catch (error) {
      abortFetch();
    }
  }
  const renderItem = (item: ContractList) => {
    return (
      <View style={[styles.content]}>
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
        <ListView refreshViewStyle={styles.freshHeader} numColumns={1} renderItem={renderItem} keyExtractor={item => '' + item.id} onFetch={fetchData} />
      </SafeAreaView>
    </>
  );
};
export default CommodityList;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    flex: 1,
  },
  freshHeader: {
    height: 30,
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
