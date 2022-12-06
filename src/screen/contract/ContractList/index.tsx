import React from 'react';
import {FC} from 'react';
import {useRequest} from 'ahooks';
import {Icon} from '@ant-design/react-native';
import {NavigationBar} from '../../../component';
import {getMyContractList} from '../../../apis/contract';
import {View, Text, StyleSheet, SectionList} from 'react-native';
import Loading from '../../common/Loading';
import {UnitNumber} from '../../../component';
import {globalStyleVariables, globalStyles} from '../../../constants/styles';

const ContractList: FC = () => {
  const {data, loading, run} = useRequest(getMyContractList);
  console.log(data?.page, run);

  if (loading) {
    return <Loading />;
  }

  const headerRight = (
    <>
      <Icon name="container" style={[globalStyles.primaryColor, style.header_icon]} />
      <Icon size="lg" name="plus-circle" style={[globalStyles.primaryColor, style.header_icon]} />
    </>
  );
  return (
    <View style={{flex: 1}}>
      <NavigationBar title="合同列表" headerRight={headerRight} />
      <SectionList
        sections={[]}
        extraData={
          <View>
            <View style={style.contract_search}>
              <UnitNumber prefix="共" value={data?.page?.pageTotal} unit="份" />
            </View>
            <View style={style.list}>
              <Text>123</Text>
            </View>
          </View>
        }
        renderItem={() => {
          return <>1</>;
        }}>
        {data?.page?.pageTotal ? (
          <View>
            <View style={style.contract_search}>
              <UnitNumber prefix="共" value={data?.page?.pageTotal} unit="份" />
            </View>
            <View style={style.list}>
              <Text>123</Text>
            </View>
          </View>
        ) : (
          <View style={style.contract}>
            <View style={style.contract_dot}>
              <Icon name="solution" color="black" size="md" />
            </View>
            <Text style={{color: globalStyleVariables.TEXT_COLOR_SECONDARY}}>还没有商家哦，快去公海看看吧</Text>
          </View>
        )}
      </SectionList>
    </View>
  );
};

const style = StyleSheet.create({
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
  contract_search: {
    height: 90,
    width: '100%',
    borderTopColor: globalStyleVariables.BORDER_COLOR,
    borderTopWidth: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  list: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#fff',
    flex: 1,
  },
});

export default ContractList;
