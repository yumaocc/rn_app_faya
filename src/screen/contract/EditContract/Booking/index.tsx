import {Button} from '@ant-design/react-native';
import React, {FC} from 'react';
import _ from 'lodash';
import {Control, FieldErrorsImpl, UseFormGetValues, UseFormHandleSubmit, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {View, Text} from 'react-native';
import {DatePicker, Form, FormTitle, Input, SectionGroup, Select} from '../../../../component';
import {cleanContractForm} from '../../../../helper';
import {useCodeTypes, useCommonDispatcher} from '../../../../helper/hooks';
import {formattingCodeType} from '../../../../helper/util';
import {BookingType, BoolEnum, Contract, ContractAction, ContractStatus, FormControlC} from '../../../../models';
import {ErrorMessage} from '@hookform/error-message';
import * as api from '../../../../apis';
import {styles} from './style';
import {useNavigation} from '@react-navigation/native';
import {globalStyles} from '../../../../constants/styles';

interface BookingProps {
  onNext: () => void;
  Controller: FormControlC;
  control: Control<Contract, any>;
  setValue: UseFormSetValue<Contract>;
  getValues: UseFormGetValues<Contract>;
  watch: UseFormWatch<Contract>;
  action: ContractAction;
  errors: Partial<FieldErrorsImpl<any>>;
  status: ContractStatus;
  handleSubmit: UseFormHandleSubmit<any>;
}

const Booking: FC<BookingProps> = ({Controller, control, watch, getValues, action, status, handleSubmit, errors}) => {
  const bookingType = watch('bookingReq.bookingType');
  const bookingCanCancel = watch('bookingReq.bookingCanCancel');
  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation();
  const [codeTypes] = useCodeTypes();

  const submit = async () => {
    try {
      const form = getValues();
      const formData = cleanContractForm(form);
      if (action === ContractAction.EDIT) {
        await api.contract.editContract(formData);
      }
      if (action === ContractAction.ADD) {
        await api.contract.createContract(formData);
      }
      commonDispatcher.success(action === ContractAction.ADD ? '新增成功' : '保存成功');
      navigation.canGoBack() && navigation.goBack();
    } catch (error) {
      commonDispatcher.error(error || '哎呀，出错了~');
    }
  };

  const getError = (value: any) => {
    const res = _.flatMap(value, e =>
      e?.message ? e : _.flatMap(e, item => (item?.message ? item : _.flatMap(item, element => (element?.message ? element : _.flatMap(element, e => e))))),
    );
    commonDispatcher.info(res[0]?.message || '哎呀，出错了~');
  };

  const onHandleSubmit = async () => {
    try {
      const func = handleSubmit(submit, getError);
      await func();
    } catch (error) {
      commonDispatcher.error(error);
    }
  };
  return (
    <>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="上线时间" />
        <View style={[styles.composeItemWrapper]}>
          <Controller
            control={control}
            rules={{required: '请选择售卖开始时间'}}
            name="bookingReq.saleBeginTime"
            render={({field: {value, onChange}}) => (
              <Form.Item label="售卖开始时间" style={styles.composeItem} hiddenBorderBottom hiddenBorderTop>
                <DatePicker mode="datetime" value={value} onChange={onChange} />
                <Text style={globalStyles.error}>
                  <ErrorMessage name={'bookingReq.saleBeginTime'} errors={errors} />
                </Text>
              </Form.Item>
            )}
          />
          <Controller
            control={control}
            rules={{required: '请选择售卖结束时间'}}
            name="bookingReq.saleEndTime"
            render={({field: {value, onChange}}) => (
              <Form.Item label="售卖结束时间" style={styles.composeItem} hiddenBorderBottom>
                <DatePicker mode="datetime" value={value} onChange={onChange} />
                <Text style={globalStyles.error}>
                  <ErrorMessage name={'bookingReq.saleEndTime'} errors={errors} />
                </Text>
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
      {status === ContractStatus.SignSuccess ? null : (
        <Button style={{margin: 10}} type="primary" onPress={onHandleSubmit}>
          立即发起签约
        </Button>
      )}
    </>
  );
};
export default Booking;
