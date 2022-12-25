import {Button} from '@ant-design/react-native';
import React from 'react';
import {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationBar} from '../../../../../../component';
import {globalStyles, globalStyleVariables} from '../../../../../../constants/styles';
import {useCommonDispatcher, useMerchantDispatcher, useParams} from '../../../../../../helper/hooks';
import {ShopForm} from '../../../../../../models';
import * as api from '../../../../../../apis';
import {useNavigation} from '@react-navigation/native';

const ShopDetail: FC = () => {
  const {shopDetail, id} = useParams<{shopDetail: ShopForm; id: number}>();
  const [commonDispatcher] = useCommonDispatcher();
  const [merchantDispatcher] = useMerchantDispatcher();
  const navigation = useNavigation();
  const delShop = async (shopId: number) => {
    try {
      await api.merchant.deleteShop(shopId);
      commonDispatcher.success('删除成功');
      merchantDispatcher.loadCurrentMerchantPrivate(id);
      navigation.goBack();
    } catch (error) {
      commonDispatcher.error('哎呀，出错了~');
    }
  };
  return (
    <>
      <NavigationBar title="店铺详情" />
      <View style={[globalStyles.moduleMarginTop, styles.wrapper]}>
        <View>
          <View style={[globalStyles.containerLR, globalStyles.borderBottom, {paddingBottom: globalStyleVariables.MODULE_SPACE}, globalStyles.moduleMarginTop]}>
            <Text>店铺名称</Text>
            <Text>{shopDetail?.shopName}</Text>
          </View>
          <View style={[globalStyles.containerLR, globalStyles.borderBottom, {paddingBottom: globalStyleVariables.MODULE_SPACE}, globalStyles.moduleMarginTop]}>
            <Text>店铺地址</Text>
            <Text>{shopDetail?.addressDetail}</Text>
          </View>
          <View style={[globalStyles.containerLR, {paddingBottom: globalStyleVariables.MODULE_SPACE}, globalStyles.moduleMarginTop]}>
            <Text>店铺电话</Text>
            <Text>{shopDetail?.contactPhone}</Text>
          </View>
        </View>
      </View>
      <View style={[{margin: globalStyleVariables.MODULE_SPACE}, styles.button]}>
        <Button style={{borderColor: 'red'}} onPress={() => delShop(shopDetail.id)} type="ghost">
          <Text style={{color: 'red'}}> 删除</Text>
        </Button>
      </View>
    </>
  );
};

export default ShopDetail;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    padding: globalStyleVariables.MODULE_SPACE,
  },
  button: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
