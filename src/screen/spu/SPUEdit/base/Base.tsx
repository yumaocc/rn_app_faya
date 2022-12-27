// import moment from 'moment';
import {Button, Icon} from '@ant-design/react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Control, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {FormTitle, SectionGroup, Form, Input, Select, DatePicker, Footer, Cascader} from '../../../../component';
import {globalStyleVariables} from '../../../../constants/styles';
import {useMerchantDispatcher, useContractDispatcher, useSPUCategories} from '../../../../helper/hooks';
import {BoolEnum} from '../../../../models';
import {RootState} from '../../../../redux/reducers';
import {styles} from '../style';
import Label from '../../../../component/Lable';
import {Controller} from 'react-hook-form';
import SelectShop from './SelectShop';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {findItem, momentFromDateTime} from '../../../../helper/util';

interface BaseProps {
  onNext?: () => void;
  control?: Control<any, any>;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  watch?: UseFormWatch<any>;
}

const Base: React.FC<BaseProps> = ({onNext, control, getValues, setValue, watch}) => {
  const bizUserId = watch('bizUserId');
  const contractId = watch('contractId');
  const canUseShopIds = watch('canUseShopIds');

  const currentMerchant = useSelector((state: RootState) => state.merchant.currentMerchant);
  const merchantList = useSelector((state: RootState) => state.merchant.merchantSearchList);
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);
  const contractList = useSelector((state: RootState) => state.contract.contractSearchList);
  const [showUseShop, setShowUseShop] = useState(false);

  const [SPUCategories] = useSPUCategories();
  const [merchantDispatcher] = useMerchantDispatcher();
  const [contractDispatcher] = useContractDispatcher();

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
  useEffect(() => {
    if (bizUserId) {
      contractDispatcher.loadContractSearchList({id: bizUserId});
    }
  }, [bizUserId, contractDispatcher]);
  useEffect(() => {
    merchantDispatcher.loadCurrentMerchantPublic(19);
  }, [bizUserId, merchantDispatcher]);

  useEffect(() => {
    if (contractId) {
      contractDispatcher.loadCurrentContract(contractId);
    }
  }, [contractDispatcher, contractId]);

  useEffect(() => {
    if (currentContract) {
      setValue('saleBeginTime', momentFromDateTime(currentContract.bookingReq.saleBeginTime));
      setValue('saleEndTime', momentFromDateTime(currentContract.bookingReq.saleEndTime));
      setValue('stockAmount', currentContract.skuInfoReq.spuStock);
      setValue('skuList', currentContract.skuInfoReq.skuInfo);
      setValue('spuName', currentContract.spuInfoReq.spuName);
    }
  }, [currentContract, setValue]);
  function onCheck() {
    // console.log(form.getFieldsValue());
    onNext && onNext();
  }
  // useEffect(() => {
  //   if (merchantList) {
  //     setValue('bizUserId', spuDetail.bizUserId);
  //   }
  // }, [merchantList, setValue, spuDetail?.bizUserId]);

  // function handleChangeMerchant(merchantId?: number) {
  //   merchantDispatcher.loadCurrentMerchantPrivate(merchantId);
  //   form.setFieldsValue({
  //     contractId: undefined,
  //     canUseShopIds: [],
  //   });
  //   if (merchantId) {
  //     contractDispatcher.loadContractSearchList({id: merchantId});
  //   }
  //   clearDirtyFormData();
  // }

  // function handleChangeContract(contractId?: number) {
  //   contractDispatcher.loadCurrentContract(contractId);
  //   clearDirtyFormData();
  // }
  // function handleConfirmShops() {
  //   const shopIds = canUseShopRef.current?.getValue() || [];
  //   form.setFieldValue('canUseShopIds', shopIds);
  // }
  interface ListProps {
    value: number[];
  }
  const List: React.FC<ListProps> = props => {
    const shopList = props.value.map(item => findItem(canUseShopList, e => e.id === item));
    return (
      <>
        {shopList.map((item, index) =>
          item ? (
            <View key={index} style={styles.shopItem}>
              <Text numberOfLines={1}>{item?.shopName}</Text>
            </View>
          ) : null,
        )}
      </>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <SectionGroup style={[{marginTop: 0}, styles.sectionGroupStyle]}>
        <FormTitle title="商家信息" />
        <Controller
          control={control}
          name="bizUserId"
          render={({field: {value, onChange}}) => (
            <Label label="选择商家">
              <Select onChange={onChange} value={value} options={merchantList.map((e: {name: any; id: any}) => ({label: e.name, value: e.id}))} placeholder="选择商家" />
            </Label>
          )}
        />

        <Controller
          control={control}
          name="contractId"
          render={({field: {value, onChange}}) => (
            <Label label="选择合同">
              <Select onChange={onChange} value={value} options={contractList.map(e => ({label: e.name, value: e.id}))} placeholder="选择合同" />
            </Label>
          )}
        />

        <Label label="可消费店铺">
          <TouchableOpacity activeOpacity={0.5} onPress={() => setShowUseShop(true)}>
            <View style={style.childrenWrapper}>
              {canUseShopIds?.length ? <Text>已选择</Text> : <Text style={style.placeholder}>请选择</Text>}
              <Icon name="caret-right" style={style.arrow} />
            </View>
          </TouchableOpacity>
        </Label>

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

        {/* <Form.Item
          label="选择店铺"
          extra={
            canUseShopList?.length ? (
              <View style={styles.shopList}>
                <View style={[styles.shopItem, {borderBottomColor: '#e5e5e5', borderBottomWidth: 1}]}>
                  <Text>已选{0}家</Text>
                </View>
                <View>
                  {canUseShopList.map(shop => {
                    return (
                      <View key={shop.id} style={styles.shopItem}>
                        <Text numberOfLines={1}>{shop.shopName}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null
          }>
          <TouchableWithoutFeedback onPress={() => setShowUseShop(true)}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[{fontSize: 15, color: globalStyleVariables.TEXT_COLOR_TERTIARY}]}>请选择</Text>
              <Icon style={{transform: [{rotate: '90deg'}], marginLeft: 3, color: '#000', fontSize: 10}} name="caret-right" />
            </View>
          </TouchableWithoutFeedback>
        </Form.Item> */}
      </SectionGroup>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="商品基础信息" />
        <Controller
          control={control}
          name="spuName"
          render={({field: {value, onChange}}) => (
            <Form.Item label="商品名称">
              <Input placeholder="商品名称" value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="subName"
          render={({field: {value, onChange}}) => (
            <Form.Item label="商品副标题">
              <Input placeholder="商品副标题" value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
        <Form.Item label="商品分类">
          <Cascader value={currentContract?.spuInfoReq?.spuCategoryIds} disabled options={SPUCategories} labelKey="name" valueKey="id" placeholder="商品分类" />
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
          defaultValue={40}
          render={({field: {value, onChange}}) => (
            <Form.Item label="初始销量" desc="为了xxx而显示的销量">
              <Input placeholder="请输入" type="number" value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="baseShareCount"
          defaultValue={20}
          render={({field: {value, onChange}}) => (
            <Form.Item label="初始分享量" desc="为了xxx而显示的分享量">
              <Input placeholder="请输入" type="number" value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
      </SectionGroup>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="上线时间" />
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
              <DatePicker mode="datetime" value={value} onChange={onChange} />
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
