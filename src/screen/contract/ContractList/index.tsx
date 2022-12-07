import React from 'react';
import {TextInput} from 'react-native';
import {FC} from 'react';
import {useRequest} from 'ahooks';
import {Icon, List} from '@ant-design/react-native';
import {NavigationBar} from '../../../component';
import {getMyContractList} from '../../../apis/contract';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import Loading from '../../common/Loading';
import {UnitNumber} from '../../../component';
import {globalStyleVariables, globalStyles} from '../../../constants/styles';
import {BoolEnum, SearchParam} from '../../../models';

const ContractList: FC = () => {
  const {data, loading, run} = useRequest(
    async (params: SearchParam) => {
      return getMyContractList(params);
    },
    {
      debounceWait: 500,
    },
  );

  if (loading) {
    return <Loading />;
  }
  if (!data?.page?.pageTotal) {
    return (
      <View style={styles.contract}>
        <View style={styles.contract_dot}>
          <Icon name="solution" color="black" size="md" />
        </View>
        <Text style={{color: globalStyleVariables.TEXT_COLOR_SECONDARY}}>还没有商家哦，快去公海看看吧</Text>
      </View>
    );
  }

  const headerRight = (
    <>
      <Icon name="container" style={[globalStyles.primaryColor, styles.header_icon]} />
      <Icon size="lg" name="plus-circle" style={[globalStyles.primaryColor, styles.header_icon]} />
    </>
  );
  return (
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
      <ScrollView style={{marginTop: 10}}>
        <List>
          {data?.content?.map(item => (
            <List.Item key={item.id} style={{marginTop: 10, paddingBottom: 10}}>
              <View>
                <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>{item?.name}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                {item?.status === BoolEnum.TRUE ? (
                  <Text style={{color: '#4AB87D'}}>生效中{item?.createdTime}</Text>
                ) : (
                  <Text style={{color: '#999999'}}>已失效{item?.createdTime}</Text>
                )}
                <Text>{item?.createdTime}</Text>
              </View>
            </List.Item>
          ))}
        </List>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contract: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header_icon: {
    fontSize: 25,
    color: 'black',
    marginRight: globalStyleVariables.MODULE_SPACE,
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

// {data?.page?.pageTotal ? (
//   <View>
//     <View style={style.contract_search}>
//       <UnitNumber prefix="共" value={data?.page?.pageTotal} unit="份" />
//     </View>
//     <View style={style.list}>
//       <Text>123</Text>
//     </View>
//   </View>
// ) : (
//   <View style={style.contract}>
//     <View style={style.contract_dot}>
//       <Icon name="solution" color="black" size="md" />
//     </View>
//     <Text style={{color: globalStyleVariables.TEXT_COLOR_SECONDARY}}>还没有商家哦，快去公海看看吧</Text>
//   </View>
// )}
