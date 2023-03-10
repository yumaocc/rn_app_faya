import {Icon as AntdIcon, Popover} from '@ant-design/react-native';
import {useMount} from 'ahooks';
import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView, RefreshControl} from 'react-native';
import * as api from '../../../apis';
// import {Input} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useCommonDispatcher} from '../../../helper/hooks';
import {MyMerchantF, Options} from '../../../models';
import Card from './Card';
// import Icon from '../../../component/Form/Icon';
import Empty from '../../../component/Empty';
import {SearchForm} from '../../../models/common';
import Loading from '../../../component/Loading';
import Icon from '../../../component/Form/Icon';
// import {getLoadingStatusText} from '../../../helper/util';

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
  const [footerLoading, setFooterLoading] = useState(false);
  const [len, setLen] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterVal, setFilterVal] = useState<Options>(null);
  const [value] = useState('');
  const [commonDispatcher] = useCommonDispatcher();

  const getData = async (params: SearchForm, replace?: boolean, isPullDown = false) => {
    try {
      const {index, ...param} = params;
      setFooterLoading(true);
      const pageIndex = replace ? 1 : index + 1;
      const pageSize = 10;
      if (isPullDown) {
        setLoading(true);
      }
      const res = await api.merchant.getMyMerchants({...param, pageIndex, pageSize});
      setFooterLoading(false);
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

  // const {run} = useDebounceFn(async (name: string) => getData({index: 1, name}, true, true));

  const onChangeFilter = (value: Options) => {
    setFilterVal(value);
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
          <Popover
            overlay={
              <>
                {options.map(item => (
                  <Popover.Item style={[{width: 80}]} key={item.label} value={item.value}>
                    <Text style={{textAlign: 'center'}}>{item.label}</Text>
                  </Popover.Item>
                ))}
              </>
            }
            triggerStyle={{paddingVertical: 6}}
            onSelect={node => {
              onChangeFilter(node);
            }}>
            <View style={[{flexDirection: 'row'}]}>
              <Text>{filterVal?.label ? filterVal?.label : '筛选'}</Text>
              <AntdIcon name="caret-down" color="#030303" style={[{marginLeft: 7}, globalStyles.fontPrimary]} />
            </View>
          </Popover>
          <View style={globalStyles.dividingLine} />
          <Icon name="FYLM_all_search" color="#999999" />
          {/* <View style={globalStyles.dividingLine} />
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
          </View> */}
        </View>
      </View>

      <FlatList
        data={merchantList || []}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={() => {
          getData({index: pageIndex, multiStore: filterVal?.value, name: value});
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponentStyle={[{height: 40}, globalStyles.containerCenter]}
        renderItem={({item}) => <Card merchant={item} key={item.id} style={globalStyles.marginBottom} />}
        ListEmptyComponent={!loading && <Empty text="还没有商家哦" icon={'shop'} />}
        ListFooterComponent={!!merchantList?.length && <Text style={[{textAlign: 'center'}, globalStyles.fontTertiary]}>{footerLoading ? '加载中...' : '没有更多了哦'}</Text>}
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
