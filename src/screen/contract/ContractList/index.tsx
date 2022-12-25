import React from 'react';
import {TextInput, TouchableOpacity} from 'react-native';
import {FC} from 'react';
import {useRequest} from 'ahooks';
import {Icon, ListView} from '@ant-design/react-native';
import {NavigationBar} from '../../../component';
import {getMyContractList} from '../../../apis/contract';
import {View, StyleSheet, Text} from 'react-native';
import Loading from '../../common/Loading';
import {UnitNumber} from '../../../component';
import {globalStyleVariables, globalStyles} from '../../../constants/styles';
import {BoolEnum, FakeNavigation, SearchParam, ContractList as ContractListType} from '../../../models';
import {useNavigation} from '@react-navigation/native';
import * as api from '../../../apis';

type StartFetchFunction = (rowData: any[], pageSize: number) => void;
type abortFetchFunction = () => void;

const ContractList: FC = () => {
  const navigation = useNavigation() as FakeNavigation;
  const {data, loading, run} = useRequest(
    async (params: SearchParam) => {
      return getMyContractList(params);
    },
    {
      debounceWait: 500,
    },
  );

  async function fetchData(pageIndex = 1, startFetch: StartFetchFunction, abortFetch: abortFetchFunction) {
    try {
      const pageSize = 10;
      const res = await api.contract.getMyContractList({pageIndex, pageSize});
      const rowData: ContractListType[] = res.content;
      startFetch(rowData, pageSize);
    } catch (error) {
      abortFetch();
    }
  }

  if (loading) {
    return <Loading />;
  }

  const headerRight = (
    <>
      <Icon name="container" style={[globalStyles.primaryColor, styles.header_icon]} />
      <Icon size="lg" name="plus-circle" style={[globalStyles.primaryColor, styles.header_icon]} />
    </>
  );

  const renderItem = (item: ContractListType) => {
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate({
            name: 'EditContract',
            params: {
              id: item.id,
              action: item.status,
            },
          });
        }}>
        <View style={{marginTop: 10, paddingBottom: 10}}>
          <View>
            <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>{item?.name}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {item?.status === BoolEnum.TRUE ? <Text style={{color: '#4AB87D'}}>生效中{item?.createdTime}</Text> : <Text style={{color: '#999999'}}>已失效{item?.createdTime}</Text>}
            <Text>{item?.createdTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <View style={{flex: 1}}>
        <NavigationBar title="合同列表" headerRight={headerRight} />
        <View style={[globalStyles.lineHorizontal]} />
        <View style={[styles.header]}>
          <View>
            <UnitNumber prefix="共" value={data?.page?.pageTotal} unit="份" />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 20, marginRight: 20}}>筛选</Text>
            <View style={{flexDirection: 'row'}}>
              <TextInput placeholder="搜索" onChangeText={name => run({name})} />
              <Icon name="search" />
            </View>
          </View>
        </View>
        <View style={styles.content}>
          <ListView refreshViewStyle={styles.freshHeader} renderItem={renderItem} onFetch={fetchData} keyExtractor={key => key.id + ''} numColumns={1} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contract: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  freshHeader: {
    height: 40,
  },
  header_icon: {
    fontSize: 25,
    color: 'black',
    marginRight: globalStyleVariables.MODULE_SPACE,
  },
  content: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
  },
  contract_dot: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: globalStyleVariables.BORDER_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: globalStyleVariables.MODULE_SPACE,
  },
  list: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    width: '100%',
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default ContractList;
