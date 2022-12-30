import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {FC} from 'react';
import {useDebounceFn} from 'ahooks';
import {Icon as AntdIcon} from '@ant-design/react-native';
import {Input, NavigationBar} from '../../../component';
import {View, StyleSheet, Text} from 'react-native';
import {UnitNumber} from '../../../component';
import {globalStyleVariables, globalStyles} from '../../../constants/styles';
import {FakeNavigation, SearchParam, ContractList as ContractListType, RequestAction, Options, ContractAction, ContractStatus} from '../../../models';
import {useNavigation} from '@react-navigation/native';
import * as api from '../../../apis';
import ModalDropdown from 'react-native-modal-dropdown';
import {PAGE_SIZE} from '../../../constants';
import {useCommonDispatcher} from '../../../helper/hooks';
import {FlatList} from 'react-native-gesture-handler';
import Icon from '../../../component/Form/Icon';
import Loading from '../../../component/Loading';
import {cleanTime} from '../../../helper/util';

const ContractList: FC = () => {
  const navigation = useNavigation() as FakeNavigation;
  const [loading, setLoading] = useState(false);
  const [commonDispatcher] = useCommonDispatcher();
  const [valueType, setValueType] = useState<Options>(null);
  const [len, setLen] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [data, setData] = useState<ContractListType[]>([]);
  const [value, setValue] = useState('');
  const {run} = useDebounceFn(async (name: string) => getData({pageIndex: 1, name}, RequestAction.other));

  useEffect(() => {
    getData({pageIndex: 1});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getData = async (params: SearchParam, action?: RequestAction) => {
    try {
      setLoading(true);
      const res = await api.contract.getMyContractList({...params, pageSize: PAGE_SIZE});
      setLen(res?.page?.pageTotal);
      if (action === RequestAction.other) {
        setData(res.content);
      } else {
        setData(list => [...list, ...res.content]);
      }
      if (res.content.length) {
        setPageIndex(pageIndex => pageIndex + 1);
      }
    } catch (error) {
      commonDispatcher.error(error);
    }
    setLoading(false);
  };

  function handleChangeFilter(e: Options) {
    navigation.navigate({
      name: 'AddContract',
      params: {
        action: ContractAction.ADD,
      },
    });
    setValueType(e);
  }
  const pullUp = (index?: number) => {
    getData(
      {
        name: value,
        pageIndex: index || pageIndex,
      },
      RequestAction.load,
    );
  };

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
            name: 'EditContract',
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
      <View style={{flex: 1}}>
        <Loading active={loading} />
        <NavigationBar title="合同列表" headerRight={headerRight} />

        <View style={[globalStyles.lineHorizontal]} />
        <View style={[styles.header]}>
          <View>
            <UnitNumber prefix="共" value={len} unit="份" />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 100}}>
              <Input
                placeholder="搜索"
                value={value}
                extra={<Icon name="FYLM_all_search" color="#f4f4f4" />}
                onChange={e => {
                  setValue(e);
                  setPageIndex(1);
                  run(e);
                }}
                textAlign="left"
              />
            </View>
          </View>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          ListFooterComponent={
            <View style={[globalStyles.containerCenter, {flex: 1, marginTop: globalStyleVariables.MODULE_SPACE, marginBottom: globalStyleVariables.MODULE_SPACE}]}>
              <Text style={[globalStyles.fontTertiary, {textAlign: 'center'}]}>已经到底</Text>
            </View>
          }
          keyExtractor={key => key.id + ''}
          numColumns={1}
          onEndReached={() => pullUp()}
          refreshing={loading}
          onRefresh={() => {
            pullUp(1);
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
