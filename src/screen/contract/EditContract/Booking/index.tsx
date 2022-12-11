import {Button} from '@ant-design/react-native';
import React, {FC} from 'react';
import {Control, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {View} from 'react-native';
import {DatePicker, Form, FormTitle, Input, SectionGroup, Select} from '../../../../component';
import {cleanContractForm} from '../../../../helper';
import {useCodeTypes, useCommonDispatcher} from '../../../../helper/hooks';
import {formattingCodeType} from '../../../../helper/util';
import {BookingType, BoolEnum, Contract, ContractAction, FakeNavigation, FormControlC} from '../../../../models';
import * as api from '../../../../apis';
import {styles} from './style';
import {useNavigation} from '@react-navigation/native';

interface BookingProps {
  onNext: () => void;
  Controller: FormControlC;
  control: Control<Contract, any>;
  setValue: UseFormSetValue<Contract>;
  getValues: UseFormGetValues<Contract>;
  watch: UseFormWatch<Contract>;
  action: ContractAction;
}

const Booking: FC<BookingProps> = ({Controller, control, watch, getValues, action}) => {
  const bookingType = watch('bookingReq.bookingType');
  const bookingCanCancel = watch('bookingReq.bookingCanCancel');
  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation() as FakeNavigation;
  const [codeTypes] = useCodeTypes();

  const handleSubmit = async () => {
    try {
      const form = getValues();
      const formData = cleanContractForm(form);
      if (action === ContractAction.EDIT) {
        await api.contract.editContract(formData);
      }
      if (action === ContractAction.ADD) {
        await api.contract.createContract(formData);
      }

      commonDispatcher.success('签约成功');
      navigation.navigate('Tab');
    } catch (error) {
      commonDispatcher.error(error || '签约失败');
    }
  };
  return (
    <>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="上线时间" />
        <View style={[styles.composeItemWrapper]}>
          <Controller
            control={control}
            name="bookingReq.saleBeginTime"
            render={({field: {value, onChange}}) => (
              <Form.Item label="开始时间" style={styles.composeItem} hiddenBorderBottom hiddenBorderTop>
                <DatePicker mode="datetime" value={value} onChange={onChange} />
              </Form.Item>
            )}
          />
          <Controller
            control={control}
            name="bookingReq.saleEndTime"
            render={({field: {value, onChange}}) => (
              <Form.Item label="结束时间" style={styles.composeItem} hiddenBorderBottom>
                <DatePicker mode="datetime" value={value} onChange={onChange} />
              </Form.Item>
            )}
          />
        </View>
        <View style={styles.composeItemWrapper}>
          <Controller
            control={control}
            name="bookingReq.useBeginTime"
            render={({field: {value, onChange}}) => (
              <Form.Item label="使用开始时间" style={styles.composeItem} hiddenBorderBottom hiddenBorderTop>
                <DatePicker mode="datetime" value={value} onChange={onChange} />
              </Form.Item>
            )}
          />
          <Controller
            control={control}
            name="bookingReq.useEndTime"
            render={({field: {value, onChange}}) => (
              <Form.Item label="使用结束时间" style={styles.composeItem} hiddenBorderBottom>
                <DatePicker mode="datetime" value={value} onChange={onChange} />
              </Form.Item>
            )}
          />
        </View>
        <FormTitle title="预约设置" />
        <Controller
          control={control}
          name="bookingReq.bookingType"
          render={({field: {value, onChange}}) => (
            <Form.Item label="预约方式" hiddenBorderBottom>
              <Select
                value={value}
                onChange={onChange}
                options={[
                  {
                    label: '无需预约',
                    value: BookingType.NONE,
                  },
                  {
                    label: '电话预约',
                    value: BookingType.PHONE,
                  },
                  {
                    label: '网址预约',
                    value: BookingType.URL,
                  },
                ]}
              />
            </Form.Item>
          )}
        />
        {bookingType === BookingType.URL && (
          <>
            <Controller
              control={control}
              name="bookingReq.bookingEarlyDay"
              render={({field: {value, onChange}}) => (
                <Form.Item label="需要提前几天预约" hiddenBorderBottom>
                  <Input value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              control={control}
              name="bookingReq.bookingBeginTime"
              render={({field: {value, onChange}}) => (
                <Form.Item label="开始预约时间" hiddenBorderBottom hiddenBorderTop>
                  <DatePicker mode="datetime" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              control={control}
              name="bookingReq.bookingCanCancel"
              render={({field: {value, onChange}}) => (
                <Form.Item label="是否可以取消" hiddenBorderBottom hiddenBorderTop>
                  <Select
                    options={[
                      {
                        label: '可取消',
                        value: BoolEnum.TRUE,
                      },
                      {
                        label: '不可取消',
                        value: BoolEnum.FALSE,
                      },
                    ]}
                    value={value}
                    onChange={onChange}
                  />
                </Form.Item>
              )}
            />
            {!!bookingCanCancel && (
              <Controller
                name="bookingReq.bookingCancelDay"
                control={control}
                render={({field: {value, onChange}}) => (
                  <Form.Item label="需要提前几天取消">
                    <Input value={value} onChange={onChange} />
                  </Form.Item>
                )}
              />
            )}
          </>
        )}
      </SectionGroup>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="发码设置" />
        <Controller
          name="bookingReq.codeType"
          control={control}
          render={({field: {value, onChange}}) => (
            <Form.Item label="发码方式">
              <Select value={value} onChange={onChange} options={formattingCodeType(codeTypes)} />
            </Form.Item>
          )}
        />
      </SectionGroup>
      <Button style={{margin: 10}} type="primary" onPress={handleSubmit}>
        立即发起签约
      </Button>
    </>
  );
};
export default Booking;
