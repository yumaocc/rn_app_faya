import {Icon} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import {useDebounceFn} from 'ahooks';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import * as api from '../../../apis';
import {Input, PlusButton} from '../../../component';
import Loading from '../../../component/Loading';
import {PAGE_SIZE} from '../../../constants';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useCommonDispatcher} from '../../../helper/hooks';
import {FakeNavigation, MerchantCreateType, MerchantAction, Options, MerchantF, SearchParam, RequestAction} from '../../../models';
import Card from './Card';

const options = [
  {
    label: '单店',
    value: 0,
  },
  {
    label: '多店',
    value: 1,
  },
];

const PublicSeaList: React.FC = () => {
  const [valueType, setValueType] = useState<Options>(null);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [value, setValue] = useState('');
  const [len, setLen] = useState(0);
  const navigation = useNavigation() as FakeNavigation;
  const [merchantList, setMerchantList] = React.useState<MerchantF[]>([]);
  const [commonDispatcher] = useCommonDispatcher();

  const {run} = useDebounceFn(async (name: string) => getData({pageIndex: 1, name}, RequestAction.other));

  const getData = async (params: SearchParam, action?: RequestAction) => {
    try {
      setLoading(true);
      const res = await api.merchant.getPublicSeaMerchants({...params, pageSize: PAGE_SIZE});
      if (action === RequestAction.other) {
        setMerchantList(res.content);
      } else {
        setMerchantList(list => [...list, ...res.content]);
      }
      setPageIndex(pageIndex => pageIndex + 1);
      setLen(res.page.pageTotal);
    } catch (error) {
      commonDispatcher.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (merchantList) {
      getData({pageIndex: 1});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeFilter = (value: Options) => {
    setValueType(value);
    setPageIndex(1);
    getData({pageIndex: 1, multiStore: value.value}, RequestAction.other);
  };

  return (
    <SafeAreaView style={[globalStyles.wrapper, styles.container]}>
      <Loading active={loading} />
      <View style={[styles.header, globalStyles.containerLR]}>
        <Text style={(globalStyles.moduleMarginLeft, {flex: 1})}>
          <Text style={globalStyles.fontPrimary}>共{len}家</Text>
        </Text>

        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}>
          <ModalDropdown
            dropdownStyle={[globalStyles.dropDownItem, {height: 80, width: 100}]}
            renderRow={item => (
              <View style={[globalStyles.dropDownText]}>
                <Text>{item.label}</Text>
              </View>
            )}
            options={options}
            onSelect={(item, text) => handleChangeFilter(text as Options)}>
            <View style={{flexDirection: 'row'}}>
              {valueType?.label ? <Text>{valueType.label}</Text> : <Text>筛选</Text>}
              <Icon name="caret-down" color="#030303" style={[{marginLeft: 7}, globalStyles.fontPrimary]} />
            </View>
          </ModalDropdown>
          <View style={globalStyles.dividingLine} />
          <View style={{width: 80, backgroundColor: '#f4f4f4'}}>
            <Input
              placeholder="搜索"
              value={value}
              onChange={e => {
                setValue(e);
                setPageIndex(1);
                run(e);
                getData({pageIndex: 1, name: e}, RequestAction.other);
              }}
              textAlign="left"
            />
          </View>
        </View>
      </View>
      <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
        <PlusButton
          style={[styles.createButton, {marginBottom: globalStyleVariables.MODULE_SPACE}]}
          title="新增公海商家"
          onPress={() => {
            navigation.navigate({
              name: 'AddMerchant',
              params: {
                action: MerchantAction.ADD,
                publicId: MerchantCreateType.PUBLIC_SEA,
                identity: MerchantCreateType.PUBLIC_SEA,
              },
            });
          }}
        />
      </View>
      <FlatList
        refreshing={loading}
        onRefresh={() => {
          getData({pageIndex: 1}, RequestAction.other);
        }}
        data={merchantList}
        renderItem={({item, index}) => <Card update={() => getData({pageIndex: 1})} merchant={item} key={index} style={globalStyles.moduleMarginTop} />}
        onEndReached={() => {
          getData({pageIndex: pageIndex, multiStore: valueType?.value, name: value});
        }}
      />
    </SafeAreaView>
  );
};
export default PublicSeaList;

const styles = StyleSheet.create({
  container: {},
  header: {
    height: 45,
    backgroundColor: '#fff',
    paddingLeft: globalStyleVariables.MODULE_SPACE,
    paddingRight: globalStyleVariables.MODULE_SPACE,
  },
  createButton: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 40,
  },
});
