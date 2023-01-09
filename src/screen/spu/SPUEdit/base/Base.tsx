// import moment from 'moment';
import {Button, Icon as AntdIcon} from '@ant-design/react-native';
import Icon from '../../../../component/Form/Icon';
import React, {useEffect, useMemo, useState} from 'react';
import {Control, FieldErrorsImpl, UseFormGetValues, UseFormHandleSubmit, UseFormSetError, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {ScrollView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {FormTitle, SectionGroup, Form, Input, Select, DatePicker, Footer, Cascader} from '../../../../component';
import {globalStyles, globalStyleVariables} from '../../../../constants/styles';
import {useMerchantDispatcher, useContractDispatcher, useSPUCategories, useCommonDispatcher, useLoadCity} from '../../../../helper/hooks';
import {BoolEnum, ContractList} from '../../../../models';
import {RootState} from '../../../../redux/reducers';
import {styles} from '../style';
import {ErrorMessage} from '@hookform/error-message';
import {Controller} from 'react-hook-form';
import SelectShop from './SelectShop';
import {findItem, getSitesIndex, momentFromDateTime} from '../../../../helper/util';
import {useLoadAllSite} from '../../../../helper/hooks/common';

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
  const contractId = watch('contractId');
  const canUseShopIds = watch('canUseShopIds');
  const {cityList} = useLoadCity();
  const [sites] = useLoadAllSite();

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

  //商家列表
  useEffect(() => {
    merchantDispatcher.loadMerchantSearchList({});
  }, [merchantDispatcher]);

  //加载商家拥有的合同列表
  useEffect(() => {
    if (bizUserId) {
      contractDispatcher.loadContractSearchList({id: bizUserId});
    }
  }, [bizUserId, contractDispatcher]);
  //加载商家信息
  useEffect(() => {
    merchantDispatcher.loadCurrentMerchantPublic(bizUserId);
  }, [bizUserId, merchantDispatcher]);

  //商家变化，要清空合同的值
  useEffect(() => {
    setValue('contractId', null);
  }, [bizUserId, setValue]);

  //加载合同
  useEffect(() => {
    if (contractId) {
      contractDispatcher.loadCurrentContract(contractId);
    }
  }, [contractDispatcher, contractId]);

  //设置合同相应的值
  useEffect(() => {
    if (currentContract) {
      setValue('saleBeginTime', momentFromDateTime(currentContract.bookingReq.saleBeginTime));
      setValue('saleEndTime', momentFromDateTime(currentContract.bookingReq.saleEndTime));
      setValue('stockAmount', currentContract.skuInfoReq.spuStock);
      setValue('skuList', currentContract.skuInfoReq.skuInfo);
      setValue('spuName', currentContract.spuInfoReq.spuName);
    }
  }, [currentContract, setValue]);

  //设置城市
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
      setError('bizUserId', {type: 'required', message: '请选择商家'});
      commonDispatcher.info('请选择商家！');
      return;
    }
    if (!contractId) {
      setError('contractId', {type: 'required', message: '请选择合同'});
      commonDispatcher.info('请选择合同');
      return;
    }
    onNext && onNext();
  }

  //打开店铺选择的函数
  const canUseShopIdsIsShow = () => {
    if (contractId) {
      setShowUseShop(true);
      return;
    }
    commonDispatcher.info('请先选择合同');
  };
  //删除店铺
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
        <FormTitle title="商家信息" borderTop />
        <Controller
          control={control}
          name="bizUserId"
          rules={{required: '请选择商家'}}
          render={({field: {value, onChange}}) => (
            <Form.Item label="选择商家" errorElement={<ErrorMessage name={'bizUserId'} errors={errors} />}>
              <Select onChange={onChange} value={value} options={merchantList?.map((e: {name: any; id: any}) => ({label: e.name, value: e.id}))} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="areaInfo"
          render={({field}) => (
            <Form.Item label="商家城市">
              <Cascader textColor disabled={true} value={field.value} onChange={field.onChange} options={cityList || []} />
            </Form.Item>
          )}
        />

        <Controller
          control={control}
          name="contractId"
          rules={{required: '请选择合同'}}
          render={({field: {value, onChange}}) => (
            <Form.Item label="选择合同" errorElement={<ErrorMessage name={'contractId'} errors={errors} />}>
              <Select onChange={onChange} value={value} options={cleanContract(contractList) || []} placeholder="请选择" />
            </Form.Item>
          )}
        />

        <Form.Item label="可消费店铺">
          <TouchableOpacity activeOpacity={0.5} onPress={canUseShopIdsIsShow}>
            <View style={style.childrenWrapper}>
              {canUseShopIds?.length ? <Text>已选择</Text> : <Text style={style.placeholder}>请选择</Text>}
              <AntdIcon name="caret-right" style={style.arrow} />
            </View>
          </TouchableOpacity>
        </Form.Item>

        {!!canUseShopIds?.length ? (
          <View style={styles.shopList}>
            <View style={[styles.shopItem, {borderBottomColor: '#e5e5e5', borderBottomWidth: 1}]}>
              <Text>已选{canUseShopIds?.length}家</Text>
            </View>
            <View>
              <Controller control={control} name={'canUseShopIds'} render={({field: {value}}) => <List value={value} />} />
            </View>
          </View>
        ) : null}
      </SectionGroup>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="商品基础信息" borderTop />
        <Controller
          control={control}
          name="spuName"
          rules={{required: '请输入商品名称'}}
          render={({field: {value, onChange}}) => (
            <Form.Item showAsterisk label="商品名称" errorElement={<ErrorMessage name={'spuName'} errors={errors} />}>
              <Input placeholder="请输入" value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="subName"
          render={({field: {value, onChange}}) => (
            <Form.Item label="商品副标题">
              <Input placeholder="请输入" value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
        <Form.Item label="商品分类">
          <Cascader textColor value={currentContract?.spuInfoReq?.spuCategoryIds} disabled={true} options={SPUCategories} labelKey="name" valueKey="id" placeholder="商品分类" />
        </Form.Item>
        <Controller
          control={control}
          defaultValue={BoolEnum.FALSE}
          name="needExpress"
          render={({field: {value, onChange}}) => (
            <Form.Item label="收货地址" desc="开启后，用户下单需填写收货地址">
              <Select
                value={value}
                onChange={onChange}
                options={[
                  {label: '是', value: BoolEnum.TRUE},
                  {label: '否', value: BoolEnum.FALSE},
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
            <Form.Item label="身份证" desc="开启后，用户下单需填写身份证">
              <Select
                value={value}
                onChange={onChange}
                options={[
                  {label: '是', value: BoolEnum.TRUE},
                  {label: '否', value: BoolEnum.FALSE},
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
            <Form.Item label="初始销量" desc="为了xxx而显示的销量">
              <Input placeholder="请输入" type="number" value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="baseShareCount"
          defaultValue={84}
          render={({field: {value, onChange}}) => (
            <Form.Item label="初始分享量" desc="为了xxx而显示的分享量">
              <Input placeholder="请输入" type="number" value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
      </SectionGroup>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="上线时间" borderTop />
        <Form.Item label="售卖时间" vertical desc={`合同时间：${currentContract?.bookingReq?.saleBeginTime || 'N/A'}-${currentContract?.bookingReq?.saleEndTime || 'N/A'}`}>
          <View style={styles.composeItemWrapper}>
            <Controller
              name="saleBeginTime"
              control={control}
              render={({field: {value, onChange}}) => (
                <Form.Item label="开始时间" style={styles.composeItem} hiddenBorderBottom hiddenBorderTop>
                  <DatePicker mode="datetime" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              name="saleEndTime"
              control={control}
              render={({field: {value, onChange}}) => (
                <Form.Item label="结束时间" style={styles.composeItem} hiddenBorderBottom>
                  <DatePicker mode="datetime" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
          </View>
        </Form.Item>

        <Form.Item label="使用时间" vertical>
          <Text>{`${currentContract?.bookingReq?.useBeginTime || 'N/A'}-${currentContract?.bookingReq?.useEndTime || 'N/A'}`}</Text>
        </Form.Item>
        <Controller
          name="showBeginTime"
          control={control}
          render={({field: {value, onChange}}) => (
            <Form.Item label="展示时间" desc="用于提前展示，不提前展示的商品无需设置">
              <DatePicker placeholder="请选择" mode="datetime" value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
      </SectionGroup>
      <Footer />
      <View style={styles.button}>
        <Button type="primary" onPress={onCheck}>
          下一步
        </Button>
      </View>
      <SelectShop getValues={getValues} shopList={canUseShopList} setValue={setValue} open={showUseShop} setOpen={(value: boolean) => setShowUseShop(value)} />
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
