import {Icon, InputItem} from '@ant-design/react-native';
import React, {FC, useState} from 'react';
import {Control, useFieldArray, Controller} from 'react-hook-form';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {PlusButton} from '../../../../component';
import {globalStyles, globalStyleVariables} from '../../../../constants/styles';
import {Contract} from '../../../../models';
interface SKUContentProps {
  next: number;
  control: Control<Contract, any>;
  title: string;
}
const SKUContent: FC<SKUContentProps> = ({next, control, title}) => {
  const [exampleIsShow, setExampleIsShow] = useState(true);
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
      {exampleIsShow && (
        <View style={[{backgroundColor: '#fff', padding: globalStyleVariables.MODULE_SPACE, borderRadius: 5}, globalStyles.moduleMarginTop]}>
          <View style={[globalStyles.containerLR, {paddingBottom: globalStyleVariables.MODULE_SPACE}, globalStyles.borderBottom]}>
            <Text>示例</Text>
            <TouchableOpacity activeOpacity={0.5} onPress={() => setExampleIsShow(false)}>
              <Icon name="close" style={globalStyles.fontPrimary} />
            </TouchableOpacity>
          </View>
          <View style={[globalStyles.containerLR, globalStyles.moduleMarginTop]}>
            <Text style={globalStyles.fontTertiary}>名称</Text>
            <View style={[globalStyles.containerLR, {width: 120}]}>
              <Text style={globalStyles.fontTertiary}>数量</Text>
              <Text style={globalStyles.fontTertiary}>价格</Text>
            </View>
          </View>
          <View style={[globalStyles.containerLR, globalStyles.moduleMarginTop]}>
            <Text style={globalStyles.fontPrimary}>小酥肉</Text>
            <View style={[globalStyles.containerLR, {width: 160}]}>
              <View style={globalStyles.dividingLine} />
              <Text style={globalStyles.fontPrimary}>1</Text>
              <View style={globalStyles.dividingLine} />
              <Text style={globalStyles.fontPrimary}>99元</Text>
            </View>
          </View>
        </View>
      )}

      {fields.map((item, index) => {
        return (
          <>
            <View key={item.id} style={[globalStyles.containerLR, globalStyles.moduleMarginTop]}>
              <Controller
                control={control}
                name={`skuInfoReq.skuInfo.${next}.skuDetails.${index}.name`}
                render={({field: {value, onChange}}) => (
                  <View style={{flex: 1}}>
                    <InputItem type="number" keyboardType="default" allowFontScaling={true} placeholder="商品名称" value={value} onChange={onChange} />
                  </View>
                )}
              />
              <View style={[globalStyles.containerLR, {width: 170}]}>
                <Controller
                  control={control}
                  name={`skuInfoReq.skuInfo.${next}.skuDetails.${index}.nums`}
                  render={({field: {value, onChange}}) => (
                    <>
                      <View style={globalStyles.dividingLine} />
                      <View style={globalStyles.inputWidth}>
                        <InputItem type="number" placeholder="数量" value={value} onChange={onChange} />
                      </View>
                      <View style={globalStyles.dividingLine} />
                    </>
                  )}
                />
                <Controller
                  control={control}
                  name={`skuInfoReq.skuInfo.${next}.skuDetails.${index}.price`}
                  render={({field: {value, onChange}}) => (
                    <View style={globalStyles.inputWidth}>
                      <InputItem type="number" placeholder="价格" value={value} onChange={onChange} />
                    </View>
                  )}
                />
              </View>
            </View>
          </>
        );
      })}
      <PlusButton title="新建一条套餐内容" style={[{justifyContent: 'center'}, globalStyles.moduleMarginTop]} onPress={addSku} />
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
