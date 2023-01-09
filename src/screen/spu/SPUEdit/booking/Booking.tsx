//72数组解构会报错
import {Button, Icon, SwipeAction} from '@ant-design/react-native';
import React, {useState} from 'react';
import {Control, Controller, FieldErrorsImpl, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {Checkbox, Footer, Form, FormTitle, Modal, PlusButton, SectionGroup, Select} from '../../../../component';
import {BoolOptions} from '../../../../constants';
import {globalStyles, globalStyleVariables} from '../../../../constants/styles';
import {findItem, getBookingType} from '../../../../helper';
import {useCodeTypes, useCommonDispatcher, useMerchantBookingModel} from '../../../../helper/hooks';
import {BookingType, BoolEnum} from '../../../../models';
import {RootState} from '../../../../redux/reducers';
import {styles} from '../style';
import {useForm} from 'react-hook-form';
import BookingNotice from './BuyNotice';
import {ErrorMessage} from '@hookform/error-message';
import SelectSiteModal from './SelectSiteModal';

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
  const locationIds = watch('locationIds');
  const [siteModalIsShow, setSiteModalIsShow] = useState(false);
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
    bookingModel.reset();
  }
  const delBookModel = (index: number) => {
    const {modelList} = getValues();
    const newModelList = modelList.filter((item: any, idx: number) => index !== idx);
    setValue('modelList', newModelList);
  };

  const BookingModel: React.FC<ModelListProps> = props => {
    const {value = []} = props;
    return (
      <>
        {value?.map((item, index) => {
          const bookingItem = booking?.filter(e => e?.id === item?.modelId)[0]; ///这里还要找找原因，为什么解构会报错
          return (
            <View key={index} style={[style.module, globalStyles.moduleMarginTop]}>
              <SwipeAction
                right={[
                  {
                    text: '删除',
                    color: 'white',

                    backgroundColor: globalStyleVariables.COLOR_DANGER,
                    onPress: () => delBookModel(index),
                  },
                ]}>
                <Text style={[globalStyles.fontPrimary, globalStyles.borderBottom]}>型号：{bookingItem?.name}</Text>

                {item?.contractSkuIds?.map(skuId => {
                  const skuItem = findItem(contractDetail?.skuInfoReq?.skuInfo, item => item?.contractSkuId === skuId);
                  return (
                    <Text key={skuId} style={[globalStyles.fontTertiary, globalStyles.moduleMarginTop]}>
                      {skuItem?.skuName}
                    </Text>
                  );
                })}
              </SwipeAction>
            </View>
          );
        })}
      </>
    );
  };

  const Site = (props: {value: number[]}) => {
    const {value} = props;
    return (
      <>
        <Text>{value?.length ? `已选${value?.length}个站点` : '请选择上线站点'}</Text>
      </>
    );
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <SectionGroup style={styles.sectionGroupStyle}>
          <FormTitle title="上架渠道" borderTop />
          <Form.Item label="请选择上线站点">
            <Controller
              control={control}
              name="locationIds"
              render={({field: {value}}) => (
                <TouchableOpacity style={globalStyles.containerLR} onPress={() => setSiteModalIsShow(true)}>
                  <Site value={value} />
                  <Icon name="caret-right" style={style.arrow} />
                </TouchableOpacity>
              )}
            />
          </Form.Item>
        </SectionGroup>
        <SectionGroup style={[{marginTop: 16}, styles.sectionGroupStyle]}>
          <FormTitle title="预约设置" borderTop />
          <Form.Item label="预约类型">
            <Text>{getBookingType(contractDetail?.bookingReq?.bookingType)}</Text>
          </Form.Item>
          {contractDetail?.bookingReq?.bookingType !== BookingType.NONE && (
            <>
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
            </>
          )}

          <Form.Item label="绑定预约型号" vertical>
            <View style={{flexDirection: 'row'}}>
              <PlusButton title="绑定预约型号" style={{marginRight: 20}} onPress={openBindingModal} />
            </View>
            <Controller name="modelList" control={control} render={({field: {value}}) => <BookingModel value={value} />} />
          </Form.Item>
        </SectionGroup>

        <SectionGroup style={styles.sectionGroupStyle}>
          <FormTitle title="发码设置" borderTop />
          <Form.Item label="发码方式">
            <Select textColor disabled value={contractDetail?.bookingReq?.codeType} options={codeTypes.map(item => ({label: item.name, value: item.codeType}))} />
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

      <Modal
        title="绑定预约型号"
        visible={showBinding}
        onOk={bookingModel.handleSubmit(handleSubmitBinding)}
        onClose={() => {
          setShowBinding(false);
          bookingModel.reset();
        }}>
        <View>
          <Controller
            name="modelId"
            control={bookingModel.control}
            rules={{required: '请选择型号'}}
            render={({field: {value, onChange}}) => (
              <Form.Item label="选择预约型号" style={{borderTopWidth: 0}} errorElement={<ErrorMessage name={'modelId'} errors={bookingModel.formState.errors} />}>
                <Select value={value} onChange={onChange} options={booking?.map(item => ({label: item.name, value: item.id}))} />
              </Form.Item>
            )}
          />
          <Controller
            name="contractSkuIds"
            control={bookingModel.control}
            rules={{required: '请选择套餐'}}
            render={({field: {value, onChange}}) => (
              <Form.Item label="可使用的套餐" vertical name="contractSkuIds" errorElement={<ErrorMessage name={'contractSkuIds'} errors={bookingModel.formState.errors} />}>
                <Checkbox.Group
                  key="id"
                  value={value}
                  onChange={e => {
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
      <SelectSiteModal
        selectedKeys={locationIds}
        visible={siteModalIsShow}
        onOk={(value: number[]) => {
          setValue('locationIds', value);
          setSiteModalIsShow(false);
        }}
        onClose={() => setSiteModalIsShow(false)}
      />
    </>
  );
};

export default Booking;
const style = StyleSheet.create({
  module: {
    backgroundColor: '#f4f4f4',
    padding: globalStyleVariables.MODULE_SPACE,
  },
  arrow: {
    transform: [{rotate: '90deg'}],
    marginLeft: 3,
    color: '#000',
    fontSize: 10,
  },
});
