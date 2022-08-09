import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, Image, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon, ListView} from '@ant-design/react-native';

import * as api from '../../../apis';
import {NavigationBar} from '../../../component';
import {FakeNavigation, SPUF} from '../../../models';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {getBookingType} from '../../../helper';
import {useNavigation} from '@react-navigation/native';

type StartFetchFunction = (rowData: any[], pageSize: number) => void;
type abortFetchFunction = () => void;

const SPUList: React.FC = () => {
  // const [loading, setLoading] = useState(false);
  const navigation = useNavigation<FakeNavigation>();

  async function fetchData(pageIndex = 1, startFetch: StartFetchFunction, abortFetch: abortFetchFunction) {
    try {
      const pageSize = 5;
      // const skip = (pageIndex - 1) * pageSize;
      const res = await api.sku.getSPUList({pageIndex, pageSize});
      const rowData: SPUF[] = res.content;
      startFetch(rowData, pageSize);
    } catch (error) {
      abortFetch();
    }
  }

  function viewDetail(spuId: number) {
    navigation.navigate('SPUDetail', {id: spuId});
  }

  function renderItem(item: SPUF) {
    const skuList = item.skuList || [];
    const showSKUList = skuList.slice(0, 3);
    return (
      <View style={styles.spuContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            viewDetail(item.id);
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
                <View style={globalStyles.tagWrapper}>
                  <Text style={globalStyles.tag}>{item.statusStr}</Text>
                </View>
              </View>
              <Text numberOfLines={1}>{item.spuName}</Text>
              <Text numberOfLines={1}>{item.categoryName}</Text>
              <Text>{`售卖时间：${item.saleBeginTime}-${item.saleEndTime}`}</Text>
              <Text>{`预约方式：${getBookingType(item.bookingType)}`}</Text>
              <View>
                {showSKUList.map(sku => {
                  return (
                    <View key={sku.skuId} style={{marginTop: globalStyleVariables.MODULE_SPACE, backgroundColor: '#f4f4f4', padding: 10, borderRadius: 5}}>
                      <Text>{sku.skuName}</Text>
                      <Text>{`实销：${sku.saleAmount} / 剩余：${sku.skuRemainingStock} / 库存：${sku.skuStock}`}</Text>
                      <Text>{`结算价：${sku.skuSettlePrice}元`}</Text>
                    </View>
                  );
                })}
              </View>
              <View>
                <View style={styles.footer}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      console.log(1);
                    }}>
                    <View style={styles.showSale}>
                      <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_PRIMARY}]}>查看销售详情</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.setting}>
                    <Icon name="setting" color={globalStyleVariables.COLOR_PRIMARY} />
                  </View>
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
          <ListView refreshViewStyle={styles.freshHeader} numColumns={1} renderItem={renderItem} keyExtractor={item => 'spu' + item.id} onFetch={fetchData} />
        </SafeAreaView>
      </View>
    </>
  );
};
export default SPUList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -80,
  },
  freshHeader: {
    height: 80,
    justifyContent: 'flex-end',
  },
  spuContainer: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#fff',
  },
  footer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    // borderTopWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: globalStyleVariables.BORDER_COLOR,
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
