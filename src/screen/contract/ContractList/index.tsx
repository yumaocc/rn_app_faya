import React, {useState} from 'react';
import {TouchableOpacity, FlatList} from 'react-native';
import {FC} from 'react';
import {useDebounceFn, useMount} from 'ahooks';
import {Icon as AntdIcon} from '@ant-design/react-native';
import {Input, NavigationBar} from '../../../component';
import {View, StyleSheet, Text} from 'react-native';
import {UnitNumber} from '../../../component';
import {globalStyleVariables, globalStyles} from '../../../constants/styles';
import {FakeNavigation, Options, ContractAction, ContractStatus, ContractList as ContractListType} from '../../../models';
import {useNavigation} from '@react-navigation/native';
import ModalDropdown from 'react-native-modal-dropdown';
import {useContractDispatcher} from '../../../helper/hooks';
import Icon from '../../../component/Form/Icon';
import Loading from '../../../component/Loading';
import {cleanTime, getLoadingStatusText} from '../../../helper/util';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import {MerchantList} from '../../../models/merchant';
import Empty from '../../../component/Empty';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ContractList: FC = () => {
  const navigation = useNavigation() as FakeNavigation;
  const [contractDispatcher] = useContractDispatcher();
  const [valueType, setValueType] = useState<Options>(null);
  const contractData = useSelector<RootState, MerchantList<ContractListType[]>>(state => state.contract.contractList);
  const loading = useSelector<RootState, boolean>(state => state.contract.contractLoading);
  const [value, setValue] = useState('');
  const {bottom} = useSafeAreaInsets();
  const {run} = useDebounceFn(async (name: string) => contractDispatcher.loadContractList({index: 0, name: name, replace: true, pull: false}), {
    wait: 500,
  });

  useMount(() => {
    if (!contractData?.content?.length) {
      contractDispatcher.loadContractList({index: 0, replace: false, pull: true});
    }
  });

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

  const renderItem = ({item}: {item: ContractListType}) => {
    return (
      <TouchableOpacity
        key={item.id}
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
      <Loading active={loading} />
      <NavigationBar title="合同列表" headerRight={headerRight} />

      <View style={[globalStyles.lineHorizontal]} />
      <View style={[styles.header]}>
        <View>
          <UnitNumber prefix="共" value={contractData?.page?.pageTotal} unit="份" />
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
        data={contractData?.content}
        renderItem={renderItem}
        ListEmptyComponent={<Empty />}
        ListFooterComponentStyle={[{height: bottom * 2}, globalStyles.containerCenter]}
        ListFooterComponent={!!contractData?.content?.length && <Text style={[{textAlign: 'center'}, globalStyles.fontSize12]}>{getLoadingStatusText(contractData?.status)}</Text>}
        numColumns={1}
        refreshing={loading}
        onRefresh={() => {
          contractDispatcher.loadContractList({index: 0, name: value, replace: true, pull: true});
        }}
        onEndReached={() => {
          contractDispatcher.loadContractList({index: contractData?.page?.pageIndex, name: value, replace: false, pull: true});
        }}
      />
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
