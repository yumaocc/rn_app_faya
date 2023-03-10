import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, Image, FlatList} from 'react-native';
import {Icon} from '@ant-design/react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as api from '../../../apis';
import {NavigationBar} from '../../../component';
import {FakeNavigation, SPUF} from '../../../models';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {getBookingType} from '../../../helper';
import {useNavigation} from '@react-navigation/native';
import {cleanTime, getStatusColor} from '../../../helper/util';
import {useCommonDispatcher} from '../../../helper/hooks';
import Empty from '../../../component/Empty';
import {useMount} from 'ahooks';
import Loading from '../../../component/Loading';
import {MerchantList} from '../../../models/merchant';

const SPUList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [spuList, setSpuList] = useState<MerchantList<SPUF[]>>({status: 'none', content: []});
  const navigation = useNavigation<FakeNavigation>();
  const [commonDispatcher] = useCommonDispatcher();

  const {bottom} = useSafeAreaInsets();
  async function fetchData(index: number, replace?: boolean) {
    try {
      if (replace) {
        setLoading(true);
      }
      setFooterLoading(true);
      const pageSize = 10;
      const pageIndex = replace ? 1 : index + 1;
      const res = await api.sku.getSPUList({pageIndex, pageSize});
      setPageIndex(pageIndex);
      if (replace) {
        setSpuList({content: res.content});
      } else {
        setSpuList({content: [...spuList?.content, ...res.content]});
      }
      setFooterLoading(false);
    } catch (error) {
      commonDispatcher.error(error || '哎呀，出错了~');
    }
    setLoading(false);
  }
  useMount(() => {
    fetchData(0, false);
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
            <View>
              <Image source={{uri: item.poster}} style={{width: 60, height: 60, borderRadius: 5}} />
            </View>
            <View style={{flex: 1, marginLeft: 11.5}}>
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
      <Loading active={loading} />
      <NavigationBar title="商品列表" />
      <FlatList
        style={[{flex: 1, backgroundColor: '#f4f4f4'}]}
        refreshing={loading}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        numColumns={1}
        renderItem={renderItem}
        ListEmptyComponent={!loading && <Empty />}
        keyExtractor={item => 'spu' + item.id}
        data={spuList?.content}
        // ListFooterComponentStyle={[{height: Platform.OS === 'ios' ? bottom * 2 : 40}, globalStyles.containerCenter]}
        ListFooterComponent={
          !!spuList?.content?.length && (
            <View style={{paddingBottom: bottom}}>
              <View style={[{paddingVertical: 15}]}>
                <Text style={[{textAlign: 'center'}, globalStyles.fontTertiary]}>{footerLoading ? '加载中...' : '没有更多了'}</Text>
              </View>
            </View>
          )
        }
      />
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
