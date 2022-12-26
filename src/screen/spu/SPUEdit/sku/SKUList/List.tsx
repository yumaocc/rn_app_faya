import React from 'react';
import {useFieldArray, Controller, Control, UseFormSetValue, UseFormGetValues, UseFormWatch} from 'react-hook-form';
import {Text, View} from 'react-native';
import {FormTitle, SelfText} from '../../../../../component';
import {globalStyles} from '../../../../../constants/styles';
interface ListProps {
  next: number;
  control?: Control<any, any>;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  watch?: UseFormWatch<any>;
}
const List: React.FC<ListProps> = ({next, control}) => {
  const {fields} = useFieldArray({
    control: control,
    name: `skuList.${next}.skuDetails`,
  });
  return (
    <>
      <View style={[{borderRadius: 5, backgroundColor: '#00000008', padding: 10}]}>
        <FormTitle style={{backgroundColor: 'transparent'}} title={`套餐${next + 1}内容`} />
        <View style={[globalStyles.containerLR]}>
          <Text style={[globalStyles.fontTertiary, {flex: 1}]}>名称</Text>
          <Text style={[globalStyles.fontTertiary, {flex: 1}]}>数量</Text>
          <Text style={[globalStyles.fontTertiary, {flex: 1}]}>价格</Text>
        </View>
        {fields.map((item, index) => {
          return (
            <View style={[globalStyles.containerLR, globalStyles.moduleMarginTop]} key={item.id}>
              <Controller name={`skuList.${next}.skuDetails.${index}.name`} control={control} render={({field: {value}}) => <SelfText style={{flex: 1}} value={value} />} />
              <Controller name={`skuList.${next}.skuDetails.${index}.nums`} control={control} render={({field: {value}}) => <SelfText value={value} style={{flex: 1}} />} />
              <Controller name={`skuList.${next}.skuDetails.${index}.price`} control={control} render={({field: {value}}) => <SelfText style={{flex: 1}} value={value + '元'} />} />
            </View>
          );
        })}
      </View>
    </>
  );
};
export default List;
