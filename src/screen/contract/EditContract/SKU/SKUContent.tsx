import {InputItem} from '@ant-design/react-native';
import React, {FC} from 'react';
import {Control, useFieldArray, Controller} from 'react-hook-form';
import {StyleSheet, Text, View} from 'react-native';
import {PlusButton} from '../../../../component';
import {globalStyleVariables} from '../../../../constants/styles';
import {Contract} from '../../../../models';
interface SKUContentProps {
  next: number;
  control: Control<Contract, any>;
  title: string;
}
const SKUContent: FC<SKUContentProps> = ({next, control, title}) => {
  const {fields, append} = useFieldArray({
    control,
    name: `skuInfoReq.skuInfo.${next}.skuDetails`,
  });
  const addSku = () => {
    append({
      name: '',
      nums: '',
      price: '',
    });
  };
  return (
    <View style={styles.wrapper}>
      <View style={[styles.title]}>
        <View style={styles.bar} />
        <Text>{title}</Text>
      </View>
      {fields.map((item, index) => {
        return (
          <>
            <View style={styles.content}>
              <Controller
                control={control}
                name={`skuInfoReq.skuInfo.${next}.skuDetails.${index}.name`}
                render={({field: {value, onChange}}) => <InputItem keyboardType="default" allowFontScaling={true} placeholder="请输入" value={value} onChange={onChange} />}
              />
              <Controller
                control={control}
                name={`skuInfoReq.skuInfo.${next}.skuDetails.${index}.nums`}
                render={({field: {value, onChange}}) => <InputItem placeholder="请输入" value={value} onChange={onChange} />}
              />
              <Controller
                control={control}
                name={`skuInfoReq.skuInfo.${next}.skuDetails.${index}.price`}
                render={({field: {value, onChange}}) => <InputItem placeholder="请输入" value={value} onChange={onChange} />}
              />
            </View>
          </>
        );
      })}
      <PlusButton title="新建一条套餐内容" style={{justifyContent: 'center'}} onPress={addSku} />
    </View>
  );
};
export default SKUContent;

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.03);',
    borderRadius: 5,
    padding: 10,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 20,
  },
  bar: {
    width: 2,
    height: 12,
    marginRight: 5,
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
  },
  content: {
    borderBottomColor: 'rgba(0, 0, 0, 0.03)',
    borderBottomWidth: 1,
    marginBottom: globalStyleVariables.MODULE_SPACE,
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
