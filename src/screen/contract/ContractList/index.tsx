import React, {useEffect, useState} from 'react';
import {TouchableOpacity, FlatList} from 'react-native';
import {FC} from 'react';
import {useDebounceFn} from 'ahooks';
import {Icon as AntdIcon} from '@ant-design/react-native';
import {Input, NavigationBar} from '../../../component';
import {View, StyleSheet, Text} from 'react-native';
import {UnitNumber} from '../../../component';
import {globalStyleVariables, globalStyles} from '../../../constants/styles';
import {FakeNavigation, ContractList as ContractListType, RequestAction, Options, ContractAction, ContractStatus, PagedData} from '../../../models';
import {useNavigation} from '@react-navigation/native';
import ModalDropdown from 'react-native-modal-dropdown';
import {PAGE_SIZE} from '../../../constants';
import {useContractDispatcher} from '../../../helper/hooks';
import Icon from '../../../component/Form/Icon';
import Loading from '../../../component/Loading';
import {cleanTime} from '../../../helper/util';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';

const ContractList: FC = () => {
  const navigation = useNavigation() as FakeNavigation;
  const [contractDispatcher] = useContractDispatcher();

  const [valueType, setValueType] = useState<Options>(null);

  const {contractList, loading, pageIndex} = useSelector<RootState, {contractList: PagedData<ContractListType[]>; loading: boolean; pageIndex: number}>(state => ({
    contractList: state.contract?.contractList,
    loading: state.contract.contractLoading,
    pageIndex: state.contract?.contractList?.page?.pageIndex,
  }));
  const [value, setValue] = useState('');
  const {run} = useDebounceFn(
    async (name: string) => contractDispatcher.loadContractList({pageIndex: 1, pageSize: PAGE_SIZE, multiStore: valueType?.value, name: name, action: RequestAction.other}),
    {wait: 500},
  );

  useEffect(() => {
    if (!contractList?.content?.length) {
      contractDispatcher.loadContractList({pageIndex: 1, pageSize: PAGE_SIZE, action: RequestAction.load});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChangeFilter(e: Options) {
    navigation.navigate({
      name: 'AddContract',
      params: {
        action: ContractAction.ADD,
      },
    });
    setValueType(e);
  }

  const headerRight = (
    <>
      <ModalDropdown
        dropdownStyle={[globalStyles.dropDownItem, {height: 40, width: 80}]}
        renderRow={item => (
          <View style={[globalStyles.dropDownText]}>
            <Text>{item?.label}</Text>
          </View>
        )}
        options={[{label: '新建合同', value: 1}]}
        defaultValue={valueType?.label}
        onSelect={(_, text) => handleChangeFilter(text)}>
        <View style={[{flexDirection: 'row'}]}>
          <AntdIcon name="plus-circle" style={[globalStyles.primaryColor, styles.header_icon]} />
        </View>
      </ModalDropdown>
    </>
  );
  const getColor = (status: number) => {
    switch (status) {
      case ContractStatus.SignSuccess:
        return '#4AB87D';
      case ContractStatus.Resolved:
        return '#4AB87D';
      default:
        return '#999999';
    }
  };

  const renderItem = ({item, index}: {item: ContractListType; index: number}) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.5}
        style={{backgroundColor: '#fff', paddingLeft: globalStyleVariables.MODULE_SPACE, paddingRight: globalStyleVariables.MODULE_SPACE}}
        onPress={() => {
          navigation.navigate({
            name: 'ViewContract',
            params: {
              id: item.id,
              action: item.status === ContractStatus.SignSuccess ? ContractAction.VIEW : ContractAction.EDIT,
              status: item.status,
            },
          });
        }}>
        <View style={{marginTop: 10, paddingBottom: 10}}>
          <View>
            <Text style={[globalStyles.fontPrimary]}>{item?.name}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={[{color: getColor(item?.status)}, globalStyles.moduleMarginTop]}>
              {item?.statusStr}
              {cleanTime(item?.createdTime)}
            </Text>
            <Text>签约时间:{cleanTime(item?.createdTime)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <View>
        <Loading active={loading} />
        <NavigationBar title="合同列表" headerRight={headerRight} />

        <View style={[globalStyles.lineHorizontal]} />
        <View style={[styles.header]}>
          <View>
            <UnitNumber prefix="共" value={contractList?.page?.pageTotal} unit="份" />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 100}}>
              <Input
                placeholder="搜索"
                value={value}
                extra={<Icon name="FYLM_all_search" color="#f4f4f4" />}
                onChange={e => {
                  setValue(e);
                  run(e);
                }}
                textAlign="left"
              />
            </View>
          </View>
        </View>
        <FlatList
          data={contractList?.content}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={[globalStyles.containerCenter, {flex: 1}]}>
              <Text>暂无数据</Text>
            </View>
          }
          ListFooterComponent={
            <View style={[globalStyles.containerCenter, {flex: 1, marginTop: globalStyleVariables.MODULE_SPACE, marginBottom: globalStyleVariables.MODULE_SPACE}]}>
              <Text style={[globalStyles.fontTertiary, {textAlign: 'center'}]}>已经到底</Text>
            </View>
          }
          numColumns={1}
          refreshing={false}
          onRefresh={() => {
            contractDispatcher.loadContractList({pageIndex: 1, pageSize: PAGE_SIZE, multiStore: valueType?.value, name: value, action: RequestAction.other});
          }}
          onEndReached={() => {
            contractDispatcher.loadContractList({pageIndex: pageIndex + 1, pageSize: PAGE_SIZE, multiStore: valueType?.value, name: value, action: RequestAction.load});
          }}
        />
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
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: globalStyleVariables.MODULE_SPACE,
    paddingRight: globalStyleVariables.MODULE_SPACE,
    marginBottom: globalStyleVariables.MODULE_SPACE,
  },
});

export default ContractList;
