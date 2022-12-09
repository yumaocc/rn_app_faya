import React, {FC} from 'react';
import {Control, useFieldArray} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {Form, FormTitle, Input, PlusButton} from '../../../../component';
import {Contract, FormControlC} from '../../../../models';
interface SKUContentProps {
  next: number;
  control: Control<Contract, any>;
  Controller: FormControlC;
}
const SKUContent: FC<SKUContentProps> = ({next, control, Controller}) => {
  const {fields, append} = useFieldArray({
    control,
    name: `skuInfoReq.skuInfo.${next}.skuDetails`,
  });
  const addSku = () => {
    append({
      name: '超级套餐',
      nums: '100',
      price: 123,
      id: 12,
      skuId: '12',
    });
  };
  return (
    <>
      {fields.map((item, index) => {
        return (
          <>
            <FormTitle title="套餐内容" />
            <Controller
              control={control}
              name={`skuInfoReq.skuInfo.${next}.skuDetails.${index}.name`}
              render={({field: {value, onChange}}) => (
                <Form.Item label="套餐内容">
                  <Input value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              control={control}
              name={`skuInfoReq.skuInfo.${next}.skuDetails.${index}.nums`}
              render={({field: {value, onChange}}) => (
                <Form.Item label="套餐数量">
                  <Input value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              control={control}
              name={`skuInfoReq.skuInfo.${next}.skuDetails.${index}.price`}
              render={({field: {value, onChange}}) => (
                <Form.Item label="套餐价格">
                  <Input value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
          </>
        );
      })}
      <PlusButton title="新建一条套餐内容" onPress={addSku} />
    </>
  );
};
export default SKUContent;

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
