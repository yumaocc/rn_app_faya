import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, Image, FlatList} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon} from '@ant-design/react-native';

import * as api from '../../../apis';
import {NavigationBar} from '../../../component';
import {FakeNavigation, SPUF} from '../../../models';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {getBookingType} from '../../../helper';
import {useNavigation} from '@react-navigation/native';
import {cleanTime, getStatusColor} from '../../../helper/util';
import {useCommonDispatcher} from '../../../helper/hooks';
import {LoadingState} from '../../../models/common';
import ListFooter from '../../../component/ListFooter';
import Empty from '../../../component/Empty';
import {useMount} from 'ahooks';

const SPUList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [status, setStatus] = useState<LoadingState>('none');
  const [spuList, setSpuList] = useState<SPUF[]>([]);
  const navigation = useNavigation<FakeNavigation>();
  const [commonDispatcher] = useCommonDispatcher();
  const {bottom} = useSafeAreaInsets();

  async function fetchData(index: number, replace?: boolean) {
    try {
      if (replace) {
        setLoading(true);
      }
      setStatus('loading');
      const pageSize = 10;
      const res = await api.sku.getSPUList({pageIndex: index, pageSize});
      setStatus(res.content?.length < pageSize ? 'noMore' : 'none');
      if (res?.content?.length) {
        setPageIndex(res.page.pageIndex + 1);
      }
      if (replace) {
        setSpuList(res.content);
      } else {
        setSpuList([...spuList, ...res.content]);
      }
    } catch (error) {
      commonDispatcher.error(error || '哎呀，出错了~');
    }
    setLoading(false);
  }
  useMount(() => {
    fetchData(1, false);
  });

  const onEndReached = () => {
    fetchData(pageIndex, false);
  };

  const onRefresh = async () => {
    fetchData(1, true);
  };

  function viewDetail(item: SPUF) {
    navigation.navigate('SPUDetail', {id: item?.id, status: item?.status, statusStr: item.statusStr});
  }

  function renderItem({item}: {item: SPUF}) {
    const skuList = item.skuList || [];
    const showSKUList = skuList.slice(0, 3);
    return (
      <View style={styles.spuContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            viewDetail(item);
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{paddingTop: 10}}>
              <Image source={{uri: item.poster}} style={{width: 60, height: 80, borderRadius: 5}} />
            </View>
            <View style={{flex: 1, marginLeft: 10}}>
              <View style={globalStyles.containerLR}>
                <View style={[globalStyles.containerRow, {flex: 1, marginRight: 5}]}>
                  <Icon name="shop" />
                  <Text numberOfLines={1} style={{flex: 1}}>
                    {item.bizName}
                  </Text>
                </View>
                <View style={[globalStyles.tagWrapper, {backgroundColor: getStatusColor(item?.status).bg}]}>
                  <Text style={[globalStyles.tag, {color: getStatusColor(item?.status).color}]}>·{item.statusStr}</Text>
                </View>
              </View>
              <Text style={[globalStyles.fontPrimary, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]} numberOfLines={1}>
                {item.spuName}
              </Text>
              {item.categoryName && (
                <Text style={{color: '#666666'}} numberOfLines={1}>
                  {item.categoryName}
                </Text>
              )}
              <Text>{`售卖时间:${cleanTime(item.saleBeginTime)} - ${cleanTime(item.saleEndTime)}`}</Text>
              <Text>{`预约方式:${getBookingType(item.bookingType)}`}</Text>
              <View>
                {showSKUList.map(sku => {
                  return (
                    <View key={sku.skuId} style={{marginTop: globalStyleVariables.MODULE_SPACE, backgroundColor: '#f4f4f4', padding: 10, borderRadius: 5}}>
                      <Text>{sku.skuName}</Text>
                      <Text>{`实销:${sku?.saleAmount} / 剩余：${sku.skuRemainingStock} / 库存：${sku.skuStock}`}</Text>
                      <Text>{`结算价:${sku?.skuSettlePriceYuan}元`}</Text>
                      <Text>{`售价:${sku?.skuSalePriceYuan}元`}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <NavigationBar title="商品列表" />
      <View style={{overflow: 'hidden', flex: 1}}>
        <FlatList
          style={[{flex: 1, backgroundColor: '#f4f4f4'}]}
          refreshing={loading}
          onRefresh={onRefresh}
          onEndReached={onEndReached}
          numColumns={1}
          renderItem={renderItem}
          ListEmptyComponent={<Empty />}
          keyExtractor={item => 'spu' + item.id}
          data={spuList}
          ListFooterComponent={!!spuList?.length && <ListFooter status={status} marginVertical={bottom} />}
        />
      </View>
    </View>
  );
};
export default SPUList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  freshHeader: {
    height: 80,
  },
  spuContainer: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    paddingVertical: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#fff',
  },
  footer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    height: 36,
  },
  setting: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showSale: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: '100%',
  },
});
