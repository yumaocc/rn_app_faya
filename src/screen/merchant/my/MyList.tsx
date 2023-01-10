import {Icon as AntdIcon} from '@ant-design/react-native';
import {useDebounceFn, useMount} from 'ahooks';
import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView, RefreshControl} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import * as api from '../../../apis';
import {Input} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useCommonDispatcher} from '../../../helper/hooks';
import {MyMerchantF, Options} from '../../../models';
import Card from './Card';
import Icon from '../../../component/Form/Icon';
import Empty from '../../../component/Empty';
import {LoadingState, SearchForm} from '../../../models/common';
import Loading from '../../../component/Loading';
import {getLoadingStatusText} from '../../../helper/util';

const options = [
  {
    label: '单店',
    value: 1,
  },
  {
    label: '多店',
    value: 2,
  },
];
const MyList: React.FC = () => {
  const [merchantList, setMerchantList] = useState<MyMerchantF[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [status, setStatus] = useState<LoadingState>('none');
  const [len, setLen] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valueType, setValueType] = useState<Options>(null);
  const [value, setValue] = useState('');
  const [commonDispatcher] = useCommonDispatcher();

  const getData = async (params: SearchForm, replace?: boolean, isPullDown = false) => {
    try {
      const {index, ...param} = params;
      setStatus('loading');
      const pageIndex = replace ? 1 : index + 1;
      const pageSize = 10;
      if (isPullDown) {
        setLoading(true);
      }
      const res = await api.merchant.getMyMerchants({...param, pageIndex, pageSize});
      setStatus(res.content?.length < pageSize ? 'noMore' : 'none');

      if (replace) {
        setMerchantList(res.content);
      } else {
        setMerchantList([...merchantList, ...res.content]);
      }
      setPageIndex(pageIndex);
      setLen(res.page.pageTotal);
    } catch (error) {
      commonDispatcher.error(error);
    }
    setLoading(false);
  };

  useMount(() => {
    getData({index: 0}, true, true);
  });

  const {run} = useDebounceFn(async (name: string) => getData({index: 1, name}, true, true));

  const handleChangeFilter = (value: Options) => {
    setValueType(value);
    getData({index: 0, multiStore: value.value}, true, true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getData({index: 1}, true);
    setRefreshing(false);
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
              <AntdIcon name="caret-down" color="#030303" style={[{marginLeft: 7}, globalStyles.fontPrimary]} />
            </View>
          </ModalDropdown>
          <View style={globalStyles.dividingLine} />
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
        data={merchantList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[globalStyleVariables.COLOR_PRIMARY]}
            titleColor={globalStyleVariables.COLOR_PRIMARY}
            tintColor={globalStyleVariables.COLOR_PRIMARY}
          />
        }
        onEndReached={() => {
          getData({index: pageIndex, multiStore: valueType?.value, name: value});
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponentStyle={[{height: 40}, globalStyles.containerCenter]}
        renderItem={({item}) => <Card merchant={item} key={item.id} style={globalStyles.moduleMarginTop} />}
        ListEmptyComponent={!loading && <Empty text="还没有商家哦" icon={'shop'} />}
        ListFooterComponent={<Text style={[{textAlign: 'center'}, globalStyles.fontTertiary]}>{getLoadingStatusText(status)}</Text>}
      />
    </SafeAreaView>
  );
};

export default MyList;

const styles = StyleSheet.create({
  container: {},
  header: {
    height: 45,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingLeft: globalStyleVariables.MODULE_SPACE,
    paddingRight: globalStyleVariables.MODULE_SPACE,
  },
});
