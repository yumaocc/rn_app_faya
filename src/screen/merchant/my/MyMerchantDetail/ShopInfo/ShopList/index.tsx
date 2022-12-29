import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {FC} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {NavigationBar} from '../../../../../../component';
import {globalStyles, globalStyleVariables} from '../../../../../../constants/styles';
import {useMerchantDispatcher, useParams} from '../../../../../../helper/hooks';
import {FakeNavigation, ShopForm} from '../../../../../../models';
import {RootState} from '../../../../../../redux/reducers';

const ShopList: FC = () => {
  const [merchantDispatcher] = useMerchantDispatcher();
  const navigation = useNavigation() as FakeNavigation;
  const {id} = useParams<{id: number}>();
  const shopList = useSelector<RootState, ShopForm[]>(state => state.merchant?.currentMerchant?.shopList);
  useEffect(() => {
    if (id) {
      //获取私海数据
      merchantDispatcher.loadCurrentMerchantPrivate(id);
    }
    return () => {
      merchantDispatcher.exitMerchantPage();
    };
  }, [merchantDispatcher, id]);

  return (
    <>
      <SafeAreaView style={[globalStyles.wrapper, {backgroundColor: '#f4f4f4'}]} edges={['bottom']}>
        <NavigationBar title="店铺管理" />
        <View style={[globalStyles.moduleMarginTop, globalStyles.moduleMarginLeft]}>
          <Text style={globalStyles.fontSize12}>共{shopList?.length || 0}家</Text>
        </View>
        <FlatList
          data={shopList}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>
                  navigation.navigate({
                    name: 'ShopDetail',
                    params: {shopDetail: item, id: id},
                  })
                }>
                <View key={item?.id} style={[styles.content, globalStyles.borderBottom]}>
                  <Text style={[globalStyles.fontPrimary, globalStyles.borderBottom]}>{item?.shopName}</Text>
                  <Text style={[globalStyles.fontSize12, globalStyles.moduleMarginTop]}>{item?.addressDetail}</Text>
                  <Text style={[globalStyles.fontSize12, globalStyles.moduleMarginTop]}>{item?.contactPhone}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    </>
  );
};

export default ShopList;

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    margin: globalStyleVariables.MODULE_SPACE,
    padding: globalStyleVariables.MODULE_SPACE,
  },
});
