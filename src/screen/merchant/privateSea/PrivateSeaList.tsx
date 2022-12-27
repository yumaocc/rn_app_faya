import {Icon} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import {useDebounceFn} from 'ahooks';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import * as api from '../../../apis';
import {Input, PlusButton} from '../../../component';
import {PAGE_SIZE} from '../../../constants';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useCommonDispatcher, useHomeSummary} from '../../../helper/hooks';
import {FakeNavigation, MerchantAction, MerchantCreateType, MerchantF, Options, RequestAction, SearchParam} from '../../../models';
import Card from './Card';
import Loading from '../../../component/Loading';

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

const PrivateSeaList: React.FC = () => {
  const [valueType, setValueType] = useState<Options>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary] = useHomeSummary();
  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation() as FakeNavigation;
  const [merchantList, setMerchantList] = React.useState<MerchantF[]>([]);
  const [pullDown, setPullDown] = useState(false);

  const getData = async (params: SearchParam, action?: RequestAction) => {
    try {
      setLoading(true);
      const res = await api.merchant.getPrivateSeaMerchants({...params, pageSize: PAGE_SIZE});
      if (action === RequestAction.other) {
        setMerchantList(res.content);
      } else {
        setMerchantList(list => [...list, ...res.content]);
      }
      setPageIndex(pageIndex => pageIndex + 1);
    } catch (error) {
      commonDispatcher.error(error);
    }
    setLoading(false);
  };

  const {run} = useDebounceFn(async (name: string) => getData({pageIndex: 1, name}, RequestAction.other));

  useEffect(() => {
    getData({pageIndex: 1});
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
      <View style={[styles.header]}>
        <Text style={(globalStyles.moduleMarginLeft, {flex: 1})}>
          我的私海&nbsp;
          <Text style={globalStyles.fontPrimary}>{`${summary?.privateSeaNums || 0}/${summary?.privateSeaLimit || 0}`}</Text>
        </Text>

        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}>
          <ModalDropdown
            dropdownStyle={[globalStyles.dropDownItem, {height: 80}]}
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
          <View style={styles.dividingLine} />
          <View style={{width: 80, backgroundColor: '#f4f4f4'}}>
            <Input
              placeholder="搜索"
              value={value}
              onChange={e => {
                setValue(e);
                run(e);
                setPageIndex(1);
              }}
              textAlign="left"
            />
          </View>
        </View>
      </View>

      <PlusButton
        style={styles.createButton}
        title="新增私海商家"
        onPress={() => {
          navigation.navigate({
            name: 'AddMerchant',
            params: {
              type: MerchantCreateType.PRIVATE_SEA,
              action: MerchantAction.ADD,
            },
          });
        }}
      />
      <FlatList
        refreshing={pullDown}
        onRefresh={async () => {
          setPullDown(true);
          await getData({pageIndex: 1}, RequestAction.other);
          setPullDown(false);
        }}
        data={merchantList}
        renderItem={({item}) => <Card merchant={item} key={item.id} style={globalStyles.moduleMarginTop} />}
        onEndReached={() => getData({pageIndex: pageIndex, multiStore: valueType?.value, name: value})}
      />
    </SafeAreaView>
  );
};
export default PrivateSeaList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  dividingLine: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginLeft: globalStyleVariables.MODULE_SPACE,
    marginRight: globalStyleVariables.MODULE_SPACE,
  },
  header: {
    width: '100%',
    height: 45,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingLeft: globalStyleVariables.MODULE_SPACE,
    paddingRight: globalStyleVariables.MODULE_SPACE,
  },
  createButton: {
    margin: globalStyleVariables.MODULE_SPACE,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 40,
  },
});
