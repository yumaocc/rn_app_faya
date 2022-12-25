import {Button} from '@ant-design/react-native';
import React, {useMemo, useState} from 'react';
import {Control, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {ScrollView, View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {Checkbox, Footer, Form, FormTitle, Modal, PlusButton, SectionGroup, Select} from '../../../../component';
import {BoolOptions} from '../../../../constants';
import {findItem, getBookingType} from '../../../../helper';
import {useCodeTypes, useCommonDispatcher, useMerchantBookingModel} from '../../../../helper/hooks';
import {BookingModel, BoolEnum, SPUForm} from '../../../../models';
import {RootState} from '../../../../redux/reducers';
import {styles} from '../style';

import BuyNotice from './BuyNotice';

interface BookingProps {
  onNext?: () => void;
  control?: Control<SPUForm, any>;
  setValue?: UseFormSetValue<SPUForm>;
  getValues?: UseFormGetValues<SPUForm>;
  watch?: UseFormWatch<SPUForm>;
}

const Booking: React.FC<BookingProps> = ({onNext}) => {
  // const [showAddNotice, setShowAddNotice] = useState(false);
  // const [template, setTemplate] = useState<{type: SKUBuyNoticeType; list: string[]}>({type: 'BOOKING', list: []});
  // const [customNotice, setCustomNotice] = useState<string>('');
  const [showBinding, setShowBinding] = useState(false); // 显示预约型号
  // const [hasClickedModelLink, setHasClickedModelLink] = useState(false); // 是否点击了预约型号

  const contractDetail = useSelector((state: RootState) => state.contract.currentContract);
  const merchantDetail = useSelector((state: RootState) => state.merchant.currentMerchant);

  const form = Form.useFormInstance();
  const [bindingForm] = Form.useForm();

  const [codeTypes] = useCodeTypes();
  // const [buyNotices] = useSKUBuyNotice();
  const [bookingModal] = useMerchantBookingModel(merchantDetail?.id);
  const [commonDispatcher] = useCommonDispatcher();
  const modelList = useMemo<BookingModel[]>(() => form.getFieldValue('modelList') || [], [form]);

  async function onCheck() {
    console.log(form.getFieldsValue());
    onNext && onNext();
  }

  function openBindingModal() {
    if (!merchantDetail?.id || !contractDetail?.id) {
      return commonDispatcher.error('请先选择商家和合同');
    }
    bindingForm.setFieldsValue({
      contractSkuIds: [],
    });
    setShowBinding(true);
  }
  function handleSubmitBinding() {
    const newModel = bindingForm.getFieldsValue();
    const oldModelList: BookingModel[] = form.getFieldValue('modelList');
    const oldValue = findItem<{modelId: number}>(oldModelList, e => e.modelId === newModel.modelId);
    let newList;
    if (oldValue) {
      newList = oldModelList.map(e => (e.modelId === newModel.modelId ? {...e, ...newModel} : e));
    } else {
      newList = [...oldModelList, newModel];
    }
    form.setFieldsValue({modelList: newList});
    setShowBinding(false);
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <SectionGroup style={[{marginTop: 16}, styles.sectionGroupStyle]}>
          <FormTitle title="预约设置" />
          <Form.Item label="预约类型">
            <Text>{getBookingType(contractDetail?.bookingReq?.bookingType)}</Text>
          </Form.Item>
          <Form.Item label="可提前几天预约">
            <Text>{contractDetail?.bookingReq?.bookingEarlyDay || '-'}天</Text>
          </Form.Item>
          <Form.Item label="预约开始时间">
            <Text>{contractDetail?.bookingReq?.bookingBeginTime}</Text>
          </Form.Item>
          <Form.Item label="可取消预约">
            <Select disabled value={contractDetail?.bookingReq?.bookingCanCancel} options={BoolOptions} />
          </Form.Item>
          {contractDetail?.bookingReq?.bookingCanCancel === BoolEnum.TRUE && (
            <Form.Item label="需提前几天取消预约">
              <Text>{contractDetail?.bookingReq?.bookingCancelDay || '-'}天</Text>
            </Form.Item>
          )}
          <Form.Item label="绑定预约型号" vertical>
            <View style={{flexDirection: 'row'}}>
              <PlusButton title="绑定预约型号" style={{marginRight: 20}} onPress={openBindingModal} />
            </View>
            <View>
              {modelList.map((model, index) => {
                const bookingItem = findItem(bookingModal, item => item.id === model.modelId);
                return (
                  <View key={index} style={styles.modelCard}>
                    <Text>{bookingItem?.name}</Text>
                    {model.contractSkuIds?.map(skuId => {
                      const skuItem = findItem(contractDetail?.skuInfoReq?.skuInfo, item => item.contractSkuId === skuId);
                      return <Text key={skuId}>{skuItem?.skuName}</Text>;
                    })}
                  </View>
                );
              })}
            </View>
          </Form.Item>
        </SectionGroup>

        <SectionGroup style={styles.sectionGroupStyle}>
          <FormTitle title="发码设置" />
          <Form.Item label="发码方式">
            <Select disabled value={contractDetail?.bookingReq?.codeType} options={codeTypes.map(item => ({label: item.name, value: item.codeType}))} />
          </Form.Item>
        </SectionGroup>
        <BuyNotice />

        <Footer />
        <View style={styles.button}>
          <Button type="primary" onPress={onCheck}>
            下一步
          </Button>
        </View>
      </ScrollView>
      <Modal title="绑定预约型号" visible={showBinding} onOk={handleSubmitBinding} onClose={() => setShowBinding(false)}>
        <View>
          <Form form={bindingForm}>
            <Form.Item label="选择预约型号" name="modelId">
              <Select options={bookingModal?.map(item => ({label: item.name, value: item.id}))} />
            </Form.Item>
            <Form.Item label="可使用的套餐" vertical name="contractSkuIds">
              <Checkbox.Group
                options={
                  contractDetail?.skuInfoReq?.skuInfo?.map(e => {
                    return {label: e.skuName, value: e.contractSkuId};
                  }) || []
                }
              />
            </Form.Item>
          </Form>
        </View>
      </Modal>
    </>
  );
};
// Booking.defaultProps = {
// };
export default Booking;
