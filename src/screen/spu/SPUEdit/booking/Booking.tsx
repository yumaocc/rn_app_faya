import {Button} from '@ant-design/react-native';
import React, {useState} from 'react';
import {Control, Controller, FieldErrorsImpl, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {Checkbox, Footer, Form, FormTitle, Modal, PlusButton, SectionGroup, Select} from '../../../../component';
import {BoolOptions} from '../../../../constants';
import {globalStyles, globalStyleVariables} from '../../../../constants/styles';
import {findItem, getBookingType} from '../../../../helper';
import {useCodeTypes, useCommonDispatcher, useMerchantBookingModel} from '../../../../helper/hooks';
import {BoolEnum} from '../../../../models';
import {RootState} from '../../../../redux/reducers';
import {styles} from '../style';
import {useForm} from 'react-hook-form';
import BookingNotice from './BuyNotice';

interface BookingProps {
  onNext?: () => void;
  control?: Control<any, any>;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  watch?: UseFormWatch<any>;
  errors?: Partial<FieldErrorsImpl<any>>;
}
interface ModelListProps {
  value: {modelId: number; contractSkuIds: number[]}[];
}

const Booking: React.FC<BookingProps> = ({onNext, setValue, watch, control, getValues}) => {
  const [showBinding, setShowBinding] = useState(false); // 显示预约型号
  const bookingModel = useForm();
  const contractDetail = useSelector((state: RootState) => state.contract.currentContract);
  const merchantDetail = useSelector((state: RootState) => state.merchant.currentMerchant);

  const [codeTypes] = useCodeTypes();
  const [booking] = useMerchantBookingModel(merchantDetail?.id);
  const [commonDispatcher] = useCommonDispatcher();

  async function onCheck() {
    onNext && onNext();
  }

  function openBindingModal() {
    if (!merchantDetail?.id || !contractDetail?.id) {
      return commonDispatcher.error('请先选择商家和合同');
    }
    setShowBinding(true);
  }

  function handleSubmitBinding() {
    const res = bookingModel.getValues();
    const {modelList = []} = getValues();
    setValue('modelList', [...modelList, res]);
    setShowBinding(false);
  }

  const BookingModel: React.FC<ModelListProps> = props => {
    const {value} = props;
    return (
      <>
        {value?.map((item, index) => {
          const [bookingItem] = booking?.filter(e => e.id === item.modelId);
          return (
            <>
              <View key={index} style={[style.module, globalStyles.moduleMarginTop]}>
                <Text style={[globalStyles.fontPrimary, globalStyles.borderBottom]}>型号：{bookingItem?.name}</Text>
                {item.contractSkuIds?.map(skuId => {
                  const skuItem = findItem(contractDetail?.skuInfoReq?.skuInfo, item => item.contractSkuId === skuId);
                  return (
                    <Text key={skuId} style={[globalStyles.fontTertiary, globalStyles.moduleMarginTop]}>
                      {skuItem?.skuName}
                    </Text>
                  );
                })}
              </View>
            </>
          );
        })}
      </>
    );
  };

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
            <Controller name="modelList" control={control} render={({field: {value}}) => <BookingModel value={value} />} />
          </Form.Item>
        </SectionGroup>

        <SectionGroup style={styles.sectionGroupStyle}>
          <FormTitle title="发码设置" />
          <Form.Item label="发码方式">
            <Select disabled value={contractDetail?.bookingReq?.codeType} options={codeTypes.map(item => ({label: item.name, value: item.codeType}))} />
          </Form.Item>
        </SectionGroup>

        <BookingNotice setValue={setValue} control={control} watch={watch} getValues={getValues} />
        <Footer />
        <View style={styles.button}>
          <Button type="primary" onPress={onCheck}>
            下一步
          </Button>
        </View>
      </ScrollView>

      <Modal title="绑定预约型号" visible={showBinding} onOk={handleSubmitBinding} onClose={() => setShowBinding(false)}>
        <View>
          <Controller
            name="modelId"
            control={bookingModel.control}
            render={({field: {value, onChange}}) => (
              <Form.Item label="选择预约型号">
                <Select value={value} onChange={onChange} options={booking?.map(item => ({label: item.name, value: item.id}))} />
              </Form.Item>
            )}
          />
          <Controller
            name="contractSkuIds"
            control={bookingModel.control}
            render={({field: {value, onChange}}) => (
              <Form.Item label="可使用的套餐" vertical name="contractSkuIds">
                <Checkbox.Group
                  key="id"
                  value={value}
                  onChange={e => {
                    console.log(e);
                    onChange(e);
                  }}
                  options={
                    contractDetail?.skuInfoReq?.skuInfo?.map(e => {
                      return {label: e.skuName, value: e.contractSkuId};
                    }) || []
                  }
                />
              </Form.Item>
            )}
          />
        </View>
      </Modal>
    </>
  );
};

export default Booking;
const style = StyleSheet.create({
  module: {
    backgroundColor: '#f4f4f4',
    padding: globalStyleVariables.MODULE_SPACE,
  },
});
