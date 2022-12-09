import React, {FC} from 'react';
import {Control, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {View} from 'react-native';
import {DatePicker, Form, FormTitle, Input, SectionGroup, Select} from '../../../../component';
import {useCodeTypes} from '../../../../helper/hooks';
import {formattingCodeType} from '../../../../helper/util';
import {BookingType, BoolEnum, Contract, FormControlC} from '../../../../models';
import {styles} from './style';
interface BookingProps {
  onNext: () => void;
  Controller: FormControlC;
  control: Control<Contract, any>;
  setValue: UseFormSetValue<Contract>;
  getValues: UseFormGetValues<Contract>;
  watch: UseFormWatch<Contract>;
}
const Booking: FC<BookingProps> = ({Controller, control, watch}) => {
  const bookingType = watch('bookingReq.bookingType');
  const bookingCanCancel = watch('bookingReq.bookingCanCancel');
  const [codeTypes] = useCodeTypes();
  return (
    <>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="上线时间" />
        <View style={styles.composeItemWrapper}>
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
              <Form.Item label="结束时间" name="_saleEndTime" style={styles.composeItem} hiddenBorderBottom>
                <DatePicker mode="datetime" value={value} onChange={onChange} />
              </Form.Item>
            )}
          />
        </View>
      </SectionGroup>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="预约设置" />
        <Controller
          control={control}
          name="bookingReq.bookingType"
          defaultValue={BookingType.URL}
          render={({field: {value, onChange}}) => (
            <Form.Item label="预约方式" style={styles.composeItem} hiddenBorderBottom>
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
                <Form.Item label="需要提前几天预约" style={styles.composeItem} hiddenBorderBottom>
                  <Input value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              control={control}
              name="bookingReq.bookingBeginTime"
              render={({field: {value, onChange}}) => (
                <Form.Item label="开始预约时间" style={styles.composeItem} hiddenBorderBottom hiddenBorderTop>
                  <DatePicker mode="datetime" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              control={control}
              name="bookingReq.bookingCanCancel"
              render={({field: {value, onChange}}) => (
                <Form.Item label="是否可以取消" style={styles.composeItem} hiddenBorderBottom hiddenBorderTop>
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
            {bookingCanCancel === BoolEnum && (
              <Controller name="bookingReq.bookingCancelDay" control={control} render={({field: {value, onChange}}) => <Input value={value} onChange={onChange} />} />
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
    </>
  );
};
export default Booking;
