import React, {useEffect} from 'react';
import {View, ScrollView, useWindowDimensions, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from '@ant-design/react-native';

import {Steps, Form, NavigationBar} from '../../../component';
import {useParams, useRefCallback} from '../../../helper/hooks';
import {globalStyleVariables} from '../../../constants/styles';
import {useForm, Controller} from 'react-hook-form';
import Base from './Base';
import SKU from './SKU';
import Booking from './Booking';
import * as api from '../../../apis';
import {Contract} from '../../../models';
// import {ContractDetailEnum} from '../../../models';

const steps = [
  {title: '基础信息', key: 'base'},
  {title: '商品设置', key: 'sku'},
  {title: '预约与购买', key: 'booking'},
];

const EditSPU: React.FC = () => {
  const {id} = useParams<{id: number}>();
  const [currentKey, setCurrentKey] = React.useState('base');
  const [form] = Form.useForm();
  const {width: windowWidth} = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback<ScrollView>();
  const {control, getValues, setValue, watch} = useForm<Contract>({
    mode: 'onBlur',
  });

  //查看模式，获取指定商家的合同数据
  useEffect(() => {
    api.contract.getContractDetail(id).then(res => {
      setValue('bookingReq', res.bookingReq);
      // setValue('bookingReq', res.bookingReq);
      // const keys = Object.keys(res);
      // keys.forEach(item => {
      //   const key = item as ContractDetailEnum;
      //   setValue(key, res[key]);
      // });
    });
  }, [id, setValue]);

  // 自动切换到指定step
  useEffect(() => {
    if (!isReady) {
      return;
    }
    const index = steps.findIndex(item => item.key === currentKey);
    setTimeout(() => {
      ref.current?.scrollTo({
        x: windowWidth * index,
        y: 0,
        animated: true,
      });
    }, 0);
  }, [currentKey, isReady, ref, windowWidth]);

  function handleChangeStep(currentKey: string, nextKey: string) {
    // if (nextKey !== 'base') {
    //   const merchantId = form.getFieldValue('bizUserId');
    //   const contractId = form.getFieldValue('contractId');
    //   const valid = merchantId && contractId;
    //   if (!valid) {
    //     // commonDispatcher.info('请先选择商家和合同！');
    //   }
    //   return valid;
    // }
    console.log(currentKey, nextKey);
    return true;
  }
  const check = () => {
    const res = getValues();
    console.log(res);
  };

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#f4f4f4'}} edges={['bottom']}>
        <NavigationBar title={'签结算合同'} />
        <Form form={form}>
          <Steps steps={steps} currentKey={currentKey} onChange={setCurrentKey} onBeforeChangeKey={handleChangeStep} />
          <ScrollView style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}} ref={setRef} horizontal snapToInterval={windowWidth} scrollEnabled={false}>
            <View style={[{width: windowWidth, padding: globalStyleVariables.MODULE_SPACE}]}>
              <ScrollView>
                <Base watch={watch} setValue={setValue} getValues={getValues} control={control} Controller={Controller} onNext={() => setCurrentKey('sku')} />
              </ScrollView>
            </View>
            <View style={{width: windowWidth}}>
              <ScrollView>
                <SKU watch={watch} setValue={setValue} getValues={getValues} Controller={Controller} control={control} onNext={() => setCurrentKey('booking')} />
              </ScrollView>
            </View>
            <View style={{width: windowWidth}}>
              <ScrollView>
                <Booking watch={watch} setValue={setValue} getValues={getValues} control={control} Controller={Controller} onNext={() => setCurrentKey('detail')} />
              </ScrollView>
            </View>
          </ScrollView>
          <Button onPress={check} type="warning">
            检查
          </Button>
        </Form>
      </SafeAreaView>
    </>
  );
};
export default EditSPU;

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
  },
});
