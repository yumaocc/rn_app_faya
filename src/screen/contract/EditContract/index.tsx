import React, {useEffect} from 'react';
import {View, ScrollView, useWindowDimensions, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Steps, NavigationBar} from '../../../component';
import {useParams, useRefCallback, useContractDispatcher} from '../../../helper/hooks';
import {globalStyleVariables} from '../../../constants/styles';
import {useForm, Controller} from 'react-hook-form';
import Base from './Base';
import SKU from './SKU';
import Booking from './Booking';
import {BookingType, BoolEnum, Contract, ContractAction, ContractDetailEnum, ContractStatus} from '../../../models';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import {COMPANY_NAME} from '../../../constants';

import {generateContractFormPatch} from '../../../helper';

const steps = [
  {title: '基础信息', key: 'base'},
  {title: '商品设置', key: 'sku'},
  {title: '预约与购买', key: 'booking'},
];
const defaultValues = {
  partyAName: COMPANY_NAME,
  bookingReq: {
    bookingType: BookingType.URL,
    bookingCanCancel: BoolEnum.TRUE,
  },
  skuInfoReq: {
    skuInfo: [
      {
        skuName: '',
        skuDetails: [
          {
            name: '',
            nums: '',
            price: '',
          },
        ],
        skuSettlementPrice: '',
        skuStock: '',
      },
    ],
  },
};

const EditSPU: React.FC = () => {
  const {id, action} = useParams<{id: number; action: ContractAction; status: ContractStatus}>();
  const [currentKey, setCurrentKey] = React.useState('base');
  const {bottom} = useSafeAreaInsets();
  const {width: windowWidth} = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback<ScrollView>();
  const {
    control,
    getValues,
    setValue,
    watch,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<any>({
    defaultValues,
    mode: 'all',
  });

  const [contractDispatcher] = useContractDispatcher();
  const contractDetail = useSelector<RootState, Contract>(state => state.contract.currentContract);

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

  useEffect(() => {
    contractDispatcher.loadCurrentContract(id);
    return () => {
      contractDispatcher.endEdit();
    };
  }, [contractDispatcher, id]);

  useEffect(() => {
    if (contractDetail) {
      const formData = generateContractFormPatch(contractDetail);
      setValue('bookingReq.saleBeginTime', formData.bookingReq.saleBeginTime);
      setValue('bookingReq.saleEndTime', formData.bookingReq.saleEndTime);
      setValue('bookingReq.useEndTime', formData.bookingReq.useEndTime);
      setValue('bookingReq.useBeginTime', formData.bookingReq.useBeginTime);
      setValue('bookingReq.bookingBeginTime', formData.bookingReq.bookingBeginTime);
      setValue('skuInfoReq.skuInfo', formData.skuInfoReq.skuInfo);
      const keys = Object.keys(formData);
      keys.forEach(item => {
        const key = item as ContractDetailEnum;
        setValue(key, formData[key]);
      });
    }
  }, [contractDetail, setValue]);

  function handleChangeStep(currentKey: string, nextKey: string) {
    if (nextKey !== 'base') {
      const {bizUserId} = getValues();
      if (!bizUserId) {
        setError('bizUserId', {type: 'required', message: '请选择商家'});
        return false;
      }
    }
    return true;
  }

  return (
    <>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}} keyboardVerticalOffset={-bottom + 30}>
        <NavigationBar title={'签结算合同'} />
        <Steps steps={steps} currentKey={currentKey} onChange={setCurrentKey} onBeforeChangeKey={handleChangeStep} />
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}}
          ref={setRef}
          horizontal
          snapToInterval={windowWidth}
          scrollEnabled={false}>
          <View style={[{width: windowWidth, padding: globalStyleVariables.MODULE_SPACE}]}>
            <ScrollView keyboardShouldPersistTaps="always">
              <Base errors={errors} watch={watch} setValue={setValue} getValues={getValues} control={control} Controller={Controller} onNext={() => setCurrentKey('sku')} />
            </ScrollView>
          </View>
          <View style={{width: windowWidth}}>
            <ScrollView keyboardShouldPersistTaps="always">
              <SKU
                handleSubmit={handleSubmit}
                errors={errors}
                watch={watch}
                action={action}
                setValue={setValue}
                getValues={getValues}
                control={control}
                onNext={() => setCurrentKey('booking')}
              />
            </ScrollView>
          </View>
          <View style={{width: windowWidth}}>
            <ScrollView keyboardShouldPersistTaps="always">
              <Booking
                action={action}
                watch={watch}
                setValue={setValue}
                getValues={getValues}
                control={control}
                Controller={Controller}
                handleSubmit={handleSubmit}
                errors={errors}
                onNext={() => setCurrentKey('detail')}
              />
            </ScrollView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};
export default EditSPU;

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
  },
});
