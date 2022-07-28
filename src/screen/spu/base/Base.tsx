// import moment from 'moment';
import {Button} from '@ant-design/react-native';
import React, {useEffect} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {FormTitle, SectionGroup, Form, Input, Select, DatePicker, Footer} from '../../../component';
import {globalStyles} from '../../../constants/styles';
import {useMerchantDispatcher, useContractDispatcher} from '../../../helper/hooks';
import {BoolEnum} from '../../../models';
import {RootState} from '../../../redux/reducers';
import {styles} from '../style';

interface BaseProps {
  onNext?: () => void;
}

const Base: React.FC<BaseProps> = ({onNext}) => {
  // const currentMerchant = useSelector((state: RootState) => state.merchant.currentMerchant);
  const merchantList = useSelector((state: RootState) => state.merchant.merchantSearchList);
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);
  const contractList = useSelector((state: RootState) => state.contract.contractSearchList);

  const form = Form.useFormInstance();
  // const [SPUCategories] = useSPUCategories();
  const [merchantDispatcher] = useMerchantDispatcher();
  const [contractDispatcher] = useContractDispatcher();

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

  return (
    <ScrollView style={styles.container}>
      <Button
        onPress={() => {
          console.log(form.getFieldsValue());
        }}>
        检查
      </Button>
      <SectionGroup style={[{marginTop: 0}, styles.sectionGroupStyle]}>
        <FormTitle title="商家信息" />
        <Form.Item label="选择商家" name="bizUserId">
          <Select onChange={handleChangeMerchant} options={merchantList.map(e => ({label: e.name, value: e.id}))} placeholder="选择商家" />
        </Form.Item>
        <Form.Item name="contractId" label="选择合同">
          <Select onChange={handleChangeContract} options={contractList.map(e => ({label: e.name, value: e.id}))} placeholder="选择合同" />
        </Form.Item>
        {/* todo: 可用店铺选择 */}
      </SectionGroup>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="商品基础信息" />
        <Form.Item label="商家名称" name="spuName">
          <Input placeholder="商品名称" />
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
        <Form.Item label="售卖开始时间" name="_saleBeginTime">
          <DatePicker mode="datetime" />
        </Form.Item>
        <Form.Item label="售卖结束时间" name="_saleEndTime">
          <DatePicker mode="datetime" />
        </Form.Item>
        <Form.Item label="使用时间">
          <Text style={globalStyles.fontTertiary} numberOfLines={1}>
            {currentContract?.bookingReq?.useBeginTime}-{currentContract?.bookingReq?.useEndTime}
          </Text>
        </Form.Item>
      </SectionGroup>
      <Footer />
      <View style={styles.button}>
        <Button type="primary" onPress={onCheck}>
          下一步
        </Button>
      </View>
    </ScrollView>
  );
};
Base.defaultProps = {
  // title: 'Base',
};
export default Base;
