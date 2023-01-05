import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {NavigationBar} from '../../../component';
import {useParams, useContractDispatcher} from '../../../helper/hooks';
import {globalStyleVariables} from '../../../constants/styles';
import {useForm, Controller} from 'react-hook-form';
import Base from './Base';
import SKU from './SKU';
import Booking from './Booking';
import {BookingType, BoolEnum, Contract, ContractAction, ContractDetailEnum, ContractStatus, FakeNavigation, Options} from '../../../models';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import {COMPANY_NAME} from '../../../constants';

import {generateContractFormPatch} from '../../../helper';
import {FormDisabledContext} from '../../../component/Form/Context';
import DropDown from '../../../component/DropDown';
import {useNavigation} from '@react-navigation/native';

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

const ViewContract: React.FC = () => {
  const {id, action, status} = useParams<{id: number; action: ContractAction; status: ContractStatus}>();
  const {
    control,
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: {errors},
  } = useForm<any>({
    defaultValues,
    mode: 'all',
  });
  const [dropDown] = useState<Options>();
  const navigation = useNavigation() as FakeNavigation;
  const [contractDispatcher] = useContractDispatcher();
  const contractDetail = useSelector<RootState, Contract>(state => state.contract.currentContract);

  // 自动切换到指定step

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
  const headerRight = (
    <>
      <DropDown
        iconName="ellipsis"
        options={[{label: '编辑合同', value: 1}]}
        value={dropDown}
        onChange={() => {
          navigation.navigate({
            name: 'EditContract',
            params: {
              id: id,
              action: ContractAction.EDIT,
            },
          });
        }}
      />
    </>
  );

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#f4f4f4'}} edges={['bottom']}>
        <NavigationBar title={'签结算合同'} headerRight={status === ContractStatus.SignSuccess ? null : headerRight} />

        <FormDisabledContext.Provider value={{disabled: true}}>
          <ScrollView style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}}>
            <View>
              <Base errors={errors} watch={watch} setValue={setValue} getValues={getValues} control={control} Controller={Controller} />
            </View>
            <View>
              <SKU handleSubmit={handleSubmit} errors={errors} watch={watch} action={action} setValue={setValue} getValues={getValues} control={control} />
            </View>
            <View>
              <Booking
                action={action}
                watch={watch}
                setValue={setValue}
                getValues={getValues}
                control={control}
                Controller={Controller}
                handleSubmit={handleSubmit}
                errors={errors}
                // status={status} ContractStatus
              />
            </View>
          </ScrollView>
        </FormDisabledContext.Provider>
      </SafeAreaView>
    </>
  );
};
export default ViewContract;

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
  },
});
