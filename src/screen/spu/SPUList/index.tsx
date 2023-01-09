import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, Image, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from '@ant-design/react-native';

import * as api from '../../../apis';
import {NavigationBar} from '../../../component';
import {FakeNavigation, SPUF} from '../../../models';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {getBookingType} from '../../../helper';
import {useNavigation} from '@react-navigation/native';
import {cleanTime, getStatusColor} from '../../../helper/util';
import {useCommonDispatcher} from '../../../helper/hooks';
import Loading from '../../../component/Loading';

const SPUList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [spuList, setSpuList] = useState<SPUF[]>([]);
  const navigation = useNavigation<FakeNavigation>();
  const [commonDispatcher] = useCommonDispatcher();

  async function fetchData(index: number) {
    try {
      setLoading(true);
      const pageSize = 10;
      const res = await api.sku.getSPUList({pageIndex: index, pageSize});
      if (res?.content?.length) {
        setPageIndex(res.page.pageIndex + 1);
      }
      setLoading(false);
      return res;
    } catch (error) {
      commonDispatcher.error(error || '哎呀，出错了~');
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchData(1).then(res => {
      setSpuList(res?.content);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEndReached = async () => {
    const res = await fetchData(pageIndex);
    setSpuList([...spuList, ...res?.content]);
  };

  const onRefresh = async () => {
    const res = await fetchData(1);
    setSpuList(res?.content);
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
              <Image source={{uri: item.poster}} style={{width: 60, height: 80}} />
            </View>
            <View style={{flex: 1, marginLeft: 10}}>
              <View style={globalStyles.containerLR}>
                <View style={{flexDirection: 'row'}}>
                  <Icon name="shop" />
                  <Text>{item.bizName}</Text>
                </View>
                <View style={[globalStyles.tagWrapper, {backgroundColor: getStatusColor(item?.status).bg}]}>
                  <Text style={[globalStyles.tag, {color: getStatusColor(item?.status).color}]}>·{item.statusStr}</Text>
                </View>
              </View>
              <Text style={globalStyles.fontPrimary} numberOfLines={1}>
                {item.spuName}
              </Text>
              <Text style={{color: '#666666'}} numberOfLines={1}>
                {item.categoryName}
              </Text>
              <Text>{`售卖时间:${cleanTime(item.saleBeginTime)}-${cleanTime(item.saleEndTime)}`}</Text>
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
              <View>
                <View style={styles.footer}>
                  {/* <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                    }}>
                    <View style={styles.showSale}>
                      <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_PRIMARY}]}>查看销售详情</Text>
                    </View>
                  </TouchableOpacity> */}
                  {/* <View style={styles.setting}>
                    <Icon name="setting" color={globalStyleVariables.COLOR_PRIMARY} />
                  </View> */}
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  return (
    <>
      <NavigationBar title="商品列表" />
      <View style={{overflow: 'hidden', flex: 1}}>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <Loading active={loading} />
          {!!spuList.length ? (
            <FlatList
              refreshing={loading}
              onRefresh={onRefresh}
              onEndReached={onEndReached}
              numColumns={1}
              renderItem={renderItem}
              keyExtractor={item => 'spu' + item.id}
              data={spuList}
              ListFooterComponent={
                <View style={[globalStyles.containerCenter, {flex: 1, marginTop: globalStyleVariables.MODULE_SPACE, marginBottom: globalStyleVariables.MODULE_SPACE}]}>
                  <Text style={[globalStyles.fontTertiary, {textAlign: 'center'}]}>已经到底</Text>
                </View>
              }
            />
          ) : (
            <View style={[{flex: 1, backgroundColor: '#fff'}, globalStyles.containerCenter]}>
              <Text style={globalStyles.fontTertiary}>暂无商品</Text>
            </View>
          )}
        </SafeAreaView>
      </View>
    </>
  );
};
export default SPUList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: -80,
  },
  freshHeader: {
    height: 80,
    // justifyContent: 'flex-end',
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
