// import moment from 'moment';
import {Button, Icon as AntdIcon} from '@ant-design/react-native';
import Icon from '../../../../component/Form/Icon';
import React, {useEffect, useMemo, useState} from 'react';
import {Control, FieldErrorsImpl, UseFormGetValues, UseFormHandleSubmit, UseFormSetError, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {ScrollView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {FormTitle, SectionGroup, Form, Input, Select, DatePicker, Footer, Cascader} from '../../../../component';
import {globalStyles, globalStyleVariables} from '../../../../constants/styles';
import {useMerchantDispatcher, useContractDispatcher, useSPUCategories, useCommonDispatcher} from '../../../../helper/hooks';
import {BoolEnum, ContractList} from '../../../../models';
import {RootState} from '../../../../redux/reducers';
import {styles} from '../style';
import {ErrorMessage} from '@hookform/error-message';
import {Controller} from 'react-hook-form';
import SelectShop from './SelectShop';
import {findItem, getSitesIndex, momentFromDateTime} from '../../../../helper/util';
import {useLoadAllSite, useLoadCity} from '../../../../helper/hooks/common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface BaseProps {
  onNext?: () => void;
  control?: Control<any, any>;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  watch?: UseFormWatch<any>;
  errors?: Partial<FieldErrorsImpl<any>>;
  handleSubmit?: UseFormHandleSubmit<any>;
  setError?: UseFormSetError<any>;
}
interface ListProps {
  value: number[];
}
const Base: React.FC<BaseProps> = ({onNext, control, getValues, setValue, watch, errors, setError}) => {
  const bizUserId = watch('bizUserId');
  const [isShow, setIsShow] = useState(false);
  const contractId = watch('contractId');
  const canUseShopIds = watch('canUseShopIds');
  const [cityList] = useLoadCity();
  const [sites] = useLoadAllSite();
  const {bottom} = useSafeAreaInsets();
  const currentMerchant = useSelector((state: RootState) => state.merchant.currentMerchant);
  const merchantList = useSelector((state: RootState) => state.merchant.merchantSearchList);
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);
  const contractList = useSelector((state: RootState) => state.contract.contractSearchList);
  const [showUseShop, setShowUseShop] = useState(false);
  const [SPUCategories] = useSPUCategories();
  const [merchantDispatcher] = useMerchantDispatcher();
  const [contractDispatcher] = useContractDispatcher();
  const [commonDispatcher] = useCommonDispatcher();

  const canUseShopList = useMemo(() => {
    const shopList = currentMerchant?.shopList || [];
    return shopList.filter(e => {
      return bizUserId === e.bizUserId;
    });
  }, [bizUserId, currentMerchant?.shopList]);

  //????????????
  useEffect(() => {
    merchantDispatcher.loadMerchantSearchList({});
  }, [merchantDispatcher]);

  //?????????????????????????????????
  useEffect(() => {
    if (bizUserId) {
      contractDispatcher.loadContractSearchList({id: bizUserId});
    }
  }, [bizUserId, contractDispatcher]);
  //??????????????????
  useEffect(() => {
    merchantDispatcher.loadCurrentMerchantPublic(bizUserId);
  }, [bizUserId, merchantDispatcher]);

  //????????????????????????????????????
  useEffect(() => {
    setValue('contractId', null);
  }, [bizUserId, setValue]);

  //????????????
  useEffect(() => {
    if (contractId) {
      contractDispatcher.loadCurrentContract(contractId);
    }
  }, [contractDispatcher, contractId]);

  //????????????????????????
  useEffect(() => {
    if (currentContract) {
      setValue('saleBeginTime', momentFromDateTime(currentContract.bookingReq.saleBeginTime));
      setValue('saleEndTime', momentFromDateTime(currentContract.bookingReq.saleEndTime));
      setValue('stockAmount', currentContract.skuInfoReq.spuStock);
      setValue('skuList', currentContract.skuInfoReq.skuInfo);
      setValue('spuName', currentContract.spuInfoReq.spuName);
    }
  }, [currentContract, setValue]);

  //????????????
  useEffect(() => {
    if (sites?.length > 0 && currentMerchant?.locationWithCompanyId) {
      if (currentMerchant?.locationWithCompanyId > 0) {
        const res = getSitesIndex(sites, currentMerchant?.locationWithCompanyId);
        setValue('areaInfo', res);
      }
    }
  }, [sites, currentMerchant?.locationWithCompanyId, setValue]);

  function onCheck() {
    const {bizUserId, contractId} = getValues();
    if (!bizUserId) {
      setError('bizUserId', {type: 'required', message: '???????????????'});
      commonDispatcher.info('??????????????????');
      return;
    }
    if (!contractId) {
      setError('contractId', {type: 'required', message: '???????????????'});
      commonDispatcher.info('???????????????');
      return;
    }
    onNext && onNext();
  }

  //???????????????????????????
  const canUseShopIdsIsShow = () => {
    if (contractId) {
      setShowUseShop(true);
      return;
    }
    commonDispatcher.info('??????????????????');
  };
  //????????????
  const delTheShop = (id: number) => {
    const {canUseShopIds} = getValues();
    const newCanUseShopIdS = canUseShopIds.filter((item: number) => item !== id);
    setValue('canUseShopIds', newCanUseShopIdS);
  };
  const cleanContract = (list: ContractList[]) => {
    const res = list?.map(e => {
      return {label: e.name, value: e.id};
    });
    return res;
  };

  const List: React.FC<ListProps> = props => {
    const shopList = props.value.map(item => findItem(canUseShopList, e => e.id === item));
    return (
      <>
        {shopList.map(item =>
          item ? (
            <View key={item.id} style={[styles.shopItem, globalStyles.containerLR]}>
              <Text numberOfLines={1}>{item?.shopName}</Text>
              <TouchableOpacity activeOpacity={0.5} onPress={() => delTheShop(item.id)}>
                <Icon name="del" color="red" />
              </TouchableOpacity>
            </View>
          ) : null,
        )}
      </>
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      <SectionGroup style={[{marginTop: 0}, styles.sectionGroupStyle]}>
        <FormTitle title="????????????" borderTop />
        <Controller
          control={control}
          name="bizUserId"
          rules={{required: '???????????????'}}
          render={({field: {value, onChange}}) => (
            <Form.Item label="????????????" errorElement={<ErrorMessage name={'bizUserId'} errors={errors} />}>
              <Select onChange={onChange} value={value} options={merchantList?.map((e: {name: any; id: any}) => ({label: e.name, value: e.id}))} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="areaInfo"
          render={({field}) => (
            <Form.Item label="????????????">
              <Cascader textColor disabled={true} value={field.value} onChange={field.onChange} options={cityList || []} />
            </Form.Item>
          )}
        />

        <Controller
          control={control}
          name="contractId"
          rules={{required: '???????????????'}}
          render={({field: {value, onChange}}) => (
            <Form.Item label="????????????" errorElement={<ErrorMessage name={'contractId'} errors={errors} />}>
              <Select onChange={onChange} value={value} options={cleanContract(contractList) || []} placeholder="?????????" />
            </Form.Item>
          )}
        />

        <Form.Item label="???????????????">
          <TouchableOpacity activeOpacity={0.5} onPress={canUseShopIdsIsShow}>
            <View style={style.childrenWrapper}>
              {canUseShopIds?.length ? <Text>?????????</Text> : <Text style={style.placeholder}>?????????</Text>}
              <AntdIcon name="caret-right" style={style.arrow} />
            </View>
          </TouchableOpacity>
        </Form.Item>

        {!!canUseShopIds?.length ? (
          <View style={styles.shopList}>
            <View style={[styles.shopItem, {borderBottomColor: '#e5e5e5', borderBottomWidth: 1}]}>
              <Text>??????{canUseShopIds?.length}???</Text>
            </View>
            <View>
              <Controller control={control} name={'canUseShopIds'} render={({field: {value}}) => <List value={value} />} />
            </View>
          </View>
        ) : null}
      </SectionGroup>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="??????????????????" borderTop />
        <Controller
          control={control}
          name="spuName"
          rules={{required: '?????????????????????'}}
          render={({field: {value, onChange}}) => (
            <Form.Item showAsterisk label="????????????" style={{backgroundColor: isShow ? 'red' : 'white'}} errorElement={<ErrorMessage name={'spuName'} errors={errors} />}>
              <Input
                placeholder="?????????"
                value={value}
                onChange={onChange}
                onFocus={() => {
                  setIsShow(true);
                  setTimeout(() => {
                    setIsShow(false);
                    console.log(1);
                  }, 300);
                }}
              />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="subName"
          render={({field: {value, onChange}}) => (
            <Form.Item label="???????????????">
              <Input placeholder="?????????" value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
        <Form.Item label="????????????">
          <Cascader textColor value={currentContract?.spuInfoReq?.spuCategoryIds} disabled={true} options={SPUCategories} labelKey="name" valueKey="id" placeholder="????????????" />
        </Form.Item>
        <Controller
          control={control}
          defaultValue={BoolEnum.FALSE}
          name="needExpress"
          render={({field: {value, onChange}}) => (
            <Form.Item label="????????????" desc="?????????????????????????????????????????????">
              <Select
                value={value}
                onChange={onChange}
                options={[
                  {label: '???', value: BoolEnum.TRUE},
                  {label: '???', value: BoolEnum.FALSE},
                ]}
              />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          defaultValue={BoolEnum.FALSE}
          name="needIdCard"
          render={({field: {value, onChange}}) => (
            <Form.Item label="?????????" desc="??????????????????????????????????????????">
              <Select
                value={value}
                onChange={onChange}
                options={[
                  {label: '???', value: BoolEnum.TRUE},
                  {label: '???', value: BoolEnum.FALSE},
                ]}
              />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="baseSaleAmount"
          defaultValue={134}
          render={({field: {value, onChange}}) => (
            <Form.Item label="????????????" desc="??????xxx??????????????????">
              <Input placeholder="?????????" type="number" value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="baseShareCount"
          defaultValue={84}
          render={({field: {value, onChange}}) => (
            <Form.Item label="???????????????" desc="??????xxx?????????????????????">
              <Input placeholder="?????????" type="number" value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
      </SectionGroup>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="????????????" borderTop />
        <Form.Item label="????????????" vertical desc={`???????????????${currentContract?.bookingReq?.saleBeginTime || 'N/A'}-${currentContract?.bookingReq?.saleEndTime || 'N/A'}`}>
          <View style={styles.composeItemWrapper}>
            <Controller
              name="saleBeginTime"
              control={control}
              render={({field: {value, onChange}}) => (
                <Form.Item label="????????????" style={styles.composeItem} hiddenBorderBottom hiddenBorderTop>
                  <DatePicker mode="datetime" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              name="saleEndTime"
              control={control}
              render={({field: {value, onChange}}) => (
                <Form.Item label="????????????" style={styles.composeItem} hiddenBorderBottom>
                  <DatePicker mode="datetime" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
          </View>
        </Form.Item>

        <Form.Item label="????????????" vertical>
          <Text>{`${currentContract?.bookingReq?.useBeginTime || 'N/A'}-${currentContract?.bookingReq?.useEndTime || 'N/A'}`}</Text>
        </Form.Item>
        <Controller
          name="showBeginTime"
          control={control}
          render={({field: {value, onChange}}) => (
            <Form.Item label="????????????" desc="?????????????????????????????????????????????????????????">
              <DatePicker placeholder="?????????" mode="datetime" value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
      </SectionGroup>
      <SelectShop getValues={getValues} shopList={canUseShopList} setValue={setValue} open={showUseShop} setOpen={(value: boolean) => setShowUseShop(value)} />

      <Footer />
      <View style={[styles.button, {marginBottom: bottom}]}>
        <Button type="primary" onPress={onCheck}>
          ?????????
        </Button>
      </View>
    </ScrollView>
  );
};

Base.defaultProps = {
  // title: 'Base',
};
export default Base;

const style = StyleSheet.create({
  placeholder: {
    color: globalStyleVariables.TEXT_COLOR_TERTIARY,
    fontSize: 15,
  },
  childrenWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    transform: [{rotate: '90deg'}],
    marginLeft: 3,
    color: '#000',
    fontSize: 10,
  },
});
