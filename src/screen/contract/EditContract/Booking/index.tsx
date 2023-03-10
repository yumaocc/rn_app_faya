import {Button} from '@ant-design/react-native';
import React, {FC, useContext} from 'react';
import _ from 'lodash';
import {Control, FieldErrorsImpl, UseFormGetValues, UseFormHandleSubmit, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {View} from 'react-native';
import {DatePicker, Form, FormTitle, Input, SectionGroup, Select} from '../../../../component';
import {cleanContractForm} from '../../../../helper';
import {useCodeTypes, useCommonDispatcher, useContractDispatcher} from '../../../../helper/hooks';
import {formattingCodeType} from '../../../../helper/util';
import {BookingType, BoolEnum, ContractAction, FormControlC} from '../../../../models';
import {ErrorMessage} from '@hookform/error-message';
import * as api from '../../../../apis';
import {styles} from './style';
import {useNavigation} from '@react-navigation/native';
import {FormDisabledContext} from '../../../../component/Form/Context';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface BookingProps {
  onNext?: () => void;
  Controller: FormControlC;
  control: Control<any, any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  watch: UseFormWatch<any>;
  action: ContractAction;
  errors: Partial<FieldErrorsImpl<any>>;
  // status: ;
  handleSubmit: UseFormHandleSubmit<any>;
}

const Booking: FC<BookingProps> = ({Controller, control, watch, getValues, action, handleSubmit, errors}) => {
  const bookingType = watch('bookingReq.bookingType');
  const {bottom} = useSafeAreaInsets();
  const disabledContext = useContext(FormDisabledContext);
  const bookingCanCancel = watch('bookingReq.bookingCanCancel');
  const [commonDispatcher] = useCommonDispatcher();
  const [contractDispatcher] = useContractDispatcher();
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
      contractDispatcher.loadContractList({index: 1, replace: true});
      commonDispatcher.success(action === ContractAction.ADD ? '????????????' : '????????????');
      navigation.canGoBack() && navigation.goBack();
    } catch (error) {
      commonDispatcher.error(error || '??????????????????~');
    }
  };

  const getError = (value: any) => {
    const res = _.flatMap(value, e =>
      e?.message ? e : _.flatMap(e, item => (item?.message ? item : _.flatMap(item, element => (element?.message ? element : _.flatMap(element, e => e))))),
    );
    commonDispatcher.info(res[0]?.message || '??????????????????~');
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
        <FormTitle title="????????????" />
        <View style={[styles.composeItemWrapper]}>
          <Controller
            control={control}
            rules={{required: '???????????????????????????'}}
            name="bookingReq.saleBeginTime"
            render={({field: {value, onChange}}) => (
              <Form.Item
                label="??????????????????"
                showAsterisk
                errorElement={<ErrorMessage name={'bookingReq.saleBeginTime'} errors={errors} />}
                style={styles.composeItem}
                hiddenBorderBottom
                hiddenBorderTop>
                <DatePicker mode="datetime" value={value} onChange={onChange} />
              </Form.Item>
            )}
          />
          <Controller
            control={control}
            rules={{required: '???????????????????????????'}}
            name="bookingReq.saleEndTime"
            render={({field: {value, onChange}}) => (
              <Form.Item
                showAsterisk
                label="??????????????????"
                errorElement={<ErrorMessage name={'bookingReq.saleEndTime'} errors={errors} />}
                style={styles.composeItem}
                hiddenBorderBottom>
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
              <Form.Item label="??????????????????" style={styles.composeItem} hiddenBorderBottom hiddenBorderTop>
                <DatePicker mode="datetime" value={value} onChange={onChange} />
              </Form.Item>
            )}
          />
          <Controller
            control={control}
            name="bookingReq.useEndTime"
            render={({field: {value, onChange}}) => (
              <Form.Item label="??????????????????" style={styles.composeItem} hiddenBorderBottom>
                <DatePicker mode="datetime" value={value} onChange={onChange} />
              </Form.Item>
            )}
          />
        </View>
        <FormTitle title="????????????" />
        <Controller
          control={control}
          name="bookingReq.bookingType"
          render={({field: {value, onChange}}) => (
            <Form.Item label="????????????" hiddenBorderBottom>
              <Select
                value={value}
                onChange={onChange}
                options={[
                  {
                    label: '????????????',
                    value: BookingType.NONE,
                  },
                  {
                    label: '????????????',
                    value: BookingType.PHONE,
                  },
                  {
                    label: '????????????',
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
                <Form.Item label="????????????????????????" hiddenBorderBottom>
                  <Input value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              control={control}
              name="bookingReq.bookingBeginTime"
              render={({field: {value, onChange}}) => (
                <Form.Item label="??????????????????" hiddenBorderBottom hiddenBorderTop>
                  <DatePicker mode="datetime" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              control={control}
              name="bookingReq.bookingCanCancel"
              render={({field: {value, onChange}}) => (
                <Form.Item label="??????????????????" hiddenBorderBottom hiddenBorderTop>
                  <Select
                    options={[
                      {
                        label: '?????????',
                        value: BoolEnum.TRUE,
                      },
                      {
                        label: '????????????',
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
                  <Form.Item label="????????????????????????">
                    <Input value={value} onChange={onChange} />
                  </Form.Item>
                )}
              />
            )}
          </>
        )}
      </SectionGroup>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="????????????" />
        <Controller
          name="bookingReq.codeType"
          control={control}
          render={({field: {value, onChange}}) => (
            <Form.Item label="????????????">
              <Select value={value} onChange={onChange} options={formattingCodeType(codeTypes)} />
            </Form.Item>
          )}
        />
      </SectionGroup>
      {disabledContext?.disabled ? null : (
        <View style={{marginBottom: bottom}}>
          <Button style={{margin: 10}} type="primary" onPress={onHandleSubmit}>
            ??????????????????
          </Button>
        </View>
      )}
    </>
  );
};
export default Booking;
