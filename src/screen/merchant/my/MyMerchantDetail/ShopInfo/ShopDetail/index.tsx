import {Button} from '@ant-design/react-native';
import React, {useEffect} from 'react';
import {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Form, Input, NavigationBar} from '../../../../../../component';
import {globalStyles, globalStyleVariables} from '../../../../../../constants/styles';
import {useCommonDispatcher, useMerchantDispatcher, useParams} from '../../../../../../helper/hooks';
import {ShopF, ShopForm} from '../../../../../../models';
import * as api from '../../../../../../apis';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm, Controller} from 'react-hook-form';

const ShopDetail: FC = () => {
  const {shopDetail, id} = useParams<{shopDetail: ShopForm; id: number}>();
  const [commonDispatcher] = useCommonDispatcher();
  const [merchantDispatcher] = useMerchantDispatcher();
  const navigation = useNavigation();
  const {control, getValues, setValue} = useForm();

  useEffect(() => {
    if (shopDetail) {
      for (const key in shopDetail) {
        if (Object.prototype.hasOwnProperty.call(shopDetail, key)) {
          const element = shopDetail[key as keyof ShopForm];
          setValue(key, element);
        }
      }
    }
  }, [setValue, shopDetail]);

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

  const amendShop = async () => {
    try {
      const res = getValues() as ShopF;
      console.log(res);
      await api.merchant.modifyShop(res);
      commonDispatcher.success('修改成功');
      merchantDispatcher.loadCurrentMerchantPrivate(id);
      navigation.goBack();
    } catch (error) {
      commonDispatcher.error(error || '哎呀，出错了~');
    }
  };
  return (
    <>
      <SafeAreaView style={globalStyles.wrapper} edges={['bottom']}>
        <NavigationBar title="店铺详情" />
        <View style={[globalStyles.moduleMarginTop, styles.wrapper]}>
          <View>
            <Controller
              name={'shopName'}
              control={control}
              rules={{required: '请输入商家名称'}}
              render={({field}) => (
                <Form.Item label="商家名称">
                  <Input style={{padding: 0, margin: 0}} placeholder="请输入商家名称" onChange={field.onChange} value={field.value} />
                </Form.Item>
              )}
            />
            <Controller
              name={'contactPhone'}
              control={control}
              rules={{required: '请输入商家电话'}}
              render={({field}) => (
                <Form.Item label="商家电话">
                  <Input style={{padding: 0, margin: 0}} placeholder="请输入商家电话" onChange={field.onChange} value={field.value} />
                </Form.Item>
              )}
            />
            <Controller
              name={'latitude'}
              control={control}
              render={({field}) => (
                <Form.Item label="纬度">
                  <Input type="number" style={{padding: 0, margin: 0}} placeholder="请输入纬度" onChange={field.onChange} value={field.value} />
                </Form.Item>
              )}
            />
            <Controller
              name={'longitude'}
              control={control}
              render={({field}) => (
                <Form.Item label="经度">
                  <Input type="number" style={{padding: 0, margin: 0}} placeholder="请输入经度" onChange={field.onChange} value={field.value} />
                </Form.Item>
              )}
            />
            <Controller
              name={'addressDetail'}
              control={control}
              render={({field}) => (
                <Form.Item label="店铺地址">
                  <Input style={{padding: 0, margin: 0}} placeholder="请输入店铺地址" onChange={field.onChange} value={field.value} />
                </Form.Item>
              )}
            />
          </View>
        </View>
        <View style={[{margin: globalStyleVariables.MODULE_SPACE}, styles.button]}>
          <View style={[globalStyles.containerLR]}>
            <Button style={{borderColor: 'red', flex: 1, marginRight: globalStyleVariables.MODULE_SPACE}} onPress={() => delShop(shopDetail.id)} type="ghost">
              <Text style={{color: 'red'}}> 删除</Text>
            </Button>
            <Button type="primary" style={{width: 200}} onPress={amendShop}>
              保存
            </Button>
          </View>
        </View>
      </SafeAreaView>
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
