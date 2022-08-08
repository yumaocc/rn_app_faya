// import moment from 'moment';
import {Button, Icon} from '@ant-design/react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, Text, TouchableWithoutFeedback, View} from 'react-native';
import {useSelector} from 'react-redux';
import {FormTitle, SectionGroup, Form, Input, Select, DatePicker, Footer, Cascader, Modal} from '../../../component';
import {globalStyleVariables} from '../../../constants/styles';
import {useMerchantDispatcher, useContractDispatcher, useSPUCategories} from '../../../helper/hooks';
import {BoolEnum} from '../../../models';
import {RootState} from '../../../redux/reducers';
import {styles} from '../style';
import SelectShop, {ImperativeRef} from './SelectShop';

interface BaseProps {
  onNext?: () => void;
}

const Base: React.FC<BaseProps> = ({onNext}) => {
  const currentMerchant = useSelector((state: RootState) => state.merchant.currentMerchant);
  const merchantList = useSelector((state: RootState) => state.merchant.merchantSearchList);
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);
  const contractList = useSelector((state: RootState) => state.contract.contractSearchList);
  const [showUseShop, setShowUseShop] = useState(false);
  const canUseShopRef = useRef<ImperativeRef>();

  const form = Form.useFormInstance();
  const [SPUCategories] = useSPUCategories();
  const [merchantDispatcher] = useMerchantDispatcher();
  const [contractDispatcher] = useContractDispatcher();

  const canUseShopList = useMemo(() => {
    const shopList = currentMerchant?.shopList || [];
    const ids = form.getFieldValue('canUseShopIds') || [];
    return shopList.filter(e => ids.includes(e.id));
  }, [currentMerchant, form]);

  useEffect(() => {
    merchantDispatcher.loadMerchantSearchList({});
  }, [merchantDispatcher]);

  function onCheck() {
    console.log(form.getFieldsValue());
    onNext && onNext();
  }

  function handleChangeMerchant(merchantId?: number) {
    merchantDispatcher.loadCurrentMerchant(merchantId);
    form.setFieldsValue({
      contractId: undefined,
      canUseShopIds: [],
    });
    if (merchantId) {
      contractDispatcher.loadContractSearchList({id: merchantId});
    }
    clearDirtyFormData();
  }

  function handleChangeContract(contractId?: number) {
    contractDispatcher.loadCurrentContract(contractId);
    clearDirtyFormData();
  }

  // 如果改变了合同或者商家，相关的表单脏数据要删除
  function clearDirtyFormData() {
    form.setFieldsValue({
      packageList: [],
      modelList: [],
    });
  }
  function handleConfirmShops() {
    const shopIds = canUseShopRef.current?.getValue() || [];
    form.setFieldValue('canUseShopIds', shopIds);
  }

  return (
    <ScrollView style={styles.container}>
      <SectionGroup style={[{marginTop: 0}, styles.sectionGroupStyle]}>
        <FormTitle title="商家信息" />
        <Form.Item label="选择商家" name="bizUserId">
          <Select onChange={handleChangeMerchant} options={merchantList.map(e => ({label: e.name, value: e.id}))} placeholder="选择商家" />
        </Form.Item>
        <Form.Item name="contractId" label="选择合同">
          <Select onChange={handleChangeContract} options={contractList.map(e => ({label: e.name, value: e.id}))} placeholder="选择合同" />
        </Form.Item>
        <Form.Item
          label="选择店铺"
          extra={
            canUseShopList.length ? (
              <View style={styles.shopList}>
                <View style={[styles.shopItem, {borderBottomColor: '#e5e5e5', borderBottomWidth: 1}]}>
                  <Text>已选{form.getFieldValue('canUseShopIds').length || 0}家</Text>
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
        </Form.Item>
      </SectionGroup>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="商品基础信息" />
        <Form.Item label="商家名称" name="spuName">
          <Input placeholder="商品名称" />
        </Form.Item>
        <Form.Item label="商品分类">
          <Cascader value={currentContract?.spuInfoReq?.spuCategoryIds} disabled options={SPUCategories} labelKey="name" valueKey="id" placeholder="商品分类" />
        </Form.Item>
        <Form.Item label="收货地址" name="needExpress" desc="开启后，用户下单需填写收货地址">
          <Select
            options={[
              {label: '是', value: BoolEnum.TRUE},
              {label: '否', value: BoolEnum.FALSE},
            ]}
          />
        </Form.Item>
        <Form.Item label="身份证" name="needIdCard" desc="开启后，用户下单需填写身份证">
          <Select
            options={[
              {label: '是', value: BoolEnum.TRUE},
              {label: '否', value: BoolEnum.FALSE},
            ]}
          />
        </Form.Item>
        <Form.Item label="初始销量" name="baseSaleAmount" desc="为了xxx而显示的销量">
          <Input placeholder="请输入" type="number" />
        </Form.Item>
        <Form.Item label="初始分享量" name="baseShareCount" desc="为了xxx而显示的分享量">
          <Input placeholder="请输入" type="number" />
        </Form.Item>
      </SectionGroup>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="上线时间" />
        <Form.Item label="售卖时间" vertical desc={`合同时间：${currentContract?.bookingReq?.saleBeginTime || 'N/A'}-${currentContract?.bookingReq?.saleEndTime || 'N/A'}`}>
          <View style={styles.composeItemWrapper}>
            <Form.Item label="开始时间" name="_saleBeginTime" style={styles.composeItem} hiddenBorderBottom hiddenBorderTop>
              <DatePicker mode="datetime" />
            </Form.Item>
            <Form.Item label="结束时间" name="_saleEndTime" style={styles.composeItem} hiddenBorderBottom>
              <DatePicker mode="datetime" />
            </Form.Item>
          </View>
        </Form.Item>

        <Form.Item label="使用时间" vertical desc={`合同日期：${currentContract?.bookingReq?.useBeginTime || 'N/A'}-${currentContract?.bookingReq?.useEndTime || 'N/A'}`}>
          <View style={styles.composeItemWrapper}>
            <Form.Item label="开始时间" name="_useBeginTime" style={styles.composeItem} hiddenBorderBottom hiddenBorderTop>
              <DatePicker mode="datetime" />
            </Form.Item>
            <Form.Item label="结束时间" name="_useEndTime" style={styles.composeItem} hiddenBorderBottom>
              <DatePicker mode="datetime" />
            </Form.Item>
          </View>
        </Form.Item>
        <Form.Item label="展示时间" name="_showBeginTime" desc="用于提前展示，不提前展示的商品无需设置">
          <DatePicker mode="datetime" />
        </Form.Item>
      </SectionGroup>
      <Footer />
      <View style={styles.button}>
        <Button type="primary" onPress={onCheck}>
          下一步
        </Button>
      </View>
      <Modal visible={showUseShop} onClose={() => setShowUseShop(false)} onOk={handleConfirmShops}>
        <SelectShop value={form.getFieldValue('canUseShopIds')} shopRef={canUseShopRef} />
      </Modal>
    </ScrollView>
  );
};
Base.defaultProps = {
  // title: 'Base',
};
export default Base;
