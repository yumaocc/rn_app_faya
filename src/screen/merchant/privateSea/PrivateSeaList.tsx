import {Icon} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import {useDebounceFn} from 'ahooks';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import ModalDropdown from 'react-native-modal-dropdown';
import * as api from '../../../apis';
import {Input, PlusButton} from '../../../component';
import {PAGE_SIZE} from '../../../constants';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useCommonDispatcher, useHomeSummary} from '../../../helper/hooks';
import {FakeNavigation, MerchantAction, MerchantCreateType, MerchantF, Options} from '../../../models';
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
enum Action {
  load = 1,
  other = 2,
}

const PrivateSeaList: React.FC = () => {
  const [valueType, setValueType] = useState<Options>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary] = useHomeSummary();
  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation() as FakeNavigation;
  const [merchantList, setMerchantList] = React.useState<MerchantF[]>([]);

  const searchList = async (action: Action, index?: number) => {
    try {
      setLoading(true);
      const data = await api.merchant.getPrivateSeaMerchants({
        pageIndex: index || pageIndex,
        pageSize: PAGE_SIZE,
        name: value,
        multiStore: valueType?.value,
      });
      setPageIndex(pageIndex + 1);
      if (action === Action.load) {
        setMerchantList([...merchantList, ...data.content]);
      } else {
        setMerchantList([...data.content]);
      }
    } catch (error) {
      commonDispatcher.error(error);
    }
    setLoading(false);
  };

  const {run} = useDebounceFn(async (index: number) => searchList(Action.other, index), {wait: 500});

  useEffect(() => {
    searchList(Action.load);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeFilter = (value: Options) => {
    console.log(value);
    setValueType(value);
    setPageIndex(1);
    searchList(Action.other, 1);
  };

  return (
    <SafeAreaView style={[globalStyles.wrapper, styles.container]}>
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
          <View>
            <Input
              placeholder="搜索"
              value={value}
              onChange={e => {
                setValue(e);
                run(1);
                setPageIndex(1);
              }}
              textAlign="left"
              style={{position: 'absolute', left: -10}}
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
        refreshing={loading}
        data={merchantList}
        renderItem={({item}) => <Card merchant={item} key={item.id} style={globalStyles.moduleMarginTop} />}
        onEndReached={() => searchList(Action.load)}
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
