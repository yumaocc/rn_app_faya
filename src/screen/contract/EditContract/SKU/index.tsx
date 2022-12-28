import React, {FC, useEffect, useState} from 'react';
import {Control, useFieldArray, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Cascader, Form, FormTitle, Input, SectionGroup, Select, Switch} from '../../../../component';
import {globalStyles, globalStyleVariables} from '../../../../constants/styles';
import {useSPUCategories} from '../../../../helper/hooks';
import {convertNumber2Han, formattingGoodsCategory} from '../../../../helper/util';
import {BuyLimitType, Contract, ContractAction, InvoiceType} from '../../../../models';
import SKUContent from './SKUContent';

import {Controller} from 'react-hook-form';
import {Button} from '@ant-design/react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/reducers';
interface SKUProps {
  onNext: () => void;
  control: Control<Contract, any>;
  setValue: UseFormSetValue<Contract>;
  getValues: UseFormGetValues<Contract>;
  watch: UseFormWatch<Contract>;
  action: ContractAction;
}

const SKU: FC<SKUProps> = ({control, watch, onNext, getValues, setValue, action}) => {
  useSPUCategories();
  const SPUCategories = useSelector((state: RootState) => {
    return formattingGoodsCategory(state.sku.categories);
  });
  const [moreMeals, setMoreMeals] = useState(true);
  const {fields, remove, append} = useFieldArray({
    name: 'skuInfoReq.skuInfo',
    control: control,
  });

  const openSkuStock = watch('skuInfoReq.openSkuStock');

  //设置商品分类
  const spuCategoryIds = useSelector<RootState, number[]>(state => state.contract.currentContract?.spuInfoReq.spuCategoryIds);
  useEffect(() => {
    if (SPUCategories && action === ContractAction.EDIT) {
      setValue('spuInfoReq.spuCategoryIds', spuCategoryIds);
    }
  }, [SPUCategories, action, setValue, spuCategoryIds]);
  //增加一个套餐
  const addSkuInfo = () => {
    append({
      skuName: 'asdf',
      skuDetails: [
        {
          name: '',
          nums: '',
          price: '',
        },
      ],
      skuSettlementPrice: '',
      skuStock: '',
    });
  };
  // 预约
  const buyLimitTypeIsShow = (index: number) => {
    const {
      skuInfoReq: {skuInfo},
    } = getValues();
    if (skuInfo[index].buyLimitType === BuyLimitType.NONE) {
      return false;
    }
    return true;
  };

  //删除一个套餐
  const delSkuInfo = (index: number) => {
    remove(index);
  };

  return (
    <View style={{paddingBottom: 10, backgroundColor: 'white'}}>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="商品基础信息" />
        <Controller
          control={control}
          name="spuInfoReq.spuName"
          render={({field}) => (
            <Form.Item label="商品名称">
              <Input {...field} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="spuInfoReq.spuCategoryIds"
          render={({field: {value, onChange}}) => (
            <Form.Item label="商品分类">
              <Cascader value={value || []} onChange={onChange} options={SPUCategories} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="spuInfoReq.invoiceType"
          defaultValue={InvoiceType.PLATFORM}
          render={({field: {value, onChange}}) => (
            <Form.Item label="开票类型">
              <Select value={value} onChange={onChange} options={[{label: '平台模式（商家开发票给消费者）', value: InvoiceType.PLATFORM}]} />
            </Form.Item>
          )}
        />
      </SectionGroup>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="套餐设置" />
        <Controller
          control={control}
          rules={{required: true}}
          name="skuInfoReq.spuStock"
          render={({field: {value, onChange}}) => (
            <Form.Item label="商品总库存">
              <Input value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
        <Form.Item label="设置多套餐">
          <Switch checked={moreMeals} onChange={value => setMoreMeals(value)} />
        </Form.Item>

        <Controller
          control={control}
          rules={{required: true}}
          name="skuInfoReq.openSkuStock"
          render={({field: {value, onChange}}) => (
            <Form.Item label="套餐单独设置库存">
              <Switch checked={value} onChange={onChange} />
            </Form.Item>
          )}
        />
        {fields.map((item, index) => {
          return (
            <SectionGroup style={styles.sectionGroup} key={item.id}>
              <FormTitle
                title={`套餐${convertNumber2Han(index + 1)}设置`}
                headerRight={
                  <View style={{flexDirection: 'row'}}>
                    {moreMeals && (
                      <>
                        <TouchableOpacity onPress={addSkuInfo}>
                          <Text style={{marginRight: globalStyleVariables.MODULE_SPACE, color: globalStyleVariables.COLOR_PRIMARY}}>复制</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => delSkuInfo(index)}>
                          <Text style={{color: globalStyleVariables.COLOR_ERROR}}>删除</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                }
              />
              <Controller
                control={control}
                rules={{required: true}}
                name={`skuInfoReq.skuInfo.${index}.skuName`}
                render={({field: {value, onChange}}) => (
                  <Form.Item label="套餐名称">
                    <Input value={value} onChange={onChange} />
                  </Form.Item>
                )}
              />
              <Controller
                control={control}
                rules={{required: true}}
                name={`skuInfoReq.skuInfo.${index}.skuSettlementPrice`}
                render={({field: {value, onChange}}) => (
                  <Form.Item label="套餐结算价">
                    <Input value={value} onChange={onChange} />
                  </Form.Item>
                )}
              />
              {openSkuStock && (
                <Controller
                  control={control}
                  rules={{required: true}}
                  name={`skuInfoReq.skuInfo.${index}.skuStock`}
                  render={({field: {value, onChange}}) => (
                    <Form.Item label="套餐库存">
                      <Input value={value} onChange={onChange} />
                    </Form.Item>
                  )}
                />
              )}

              <Controller
                control={control}
                rules={{required: true}}
                defaultValue={BuyLimitType.NONE || 0}
                name={`skuInfoReq.skuInfo.${index}.buyLimitType`}
                render={({field: {value, onChange}}) => (
                  <Form.Item label="购买上限">
                    <View style={styles.buyLimitType}>
                      <Select
                        value={value}
                        onChange={onChange}
                        options={[
                          {
                            label: '不限购',
                            value: BuyLimitType.NONE,
                          },
                          {
                            label: '1个身份证',
                            value: BuyLimitType.ID_CARD,
                          },
                          {
                            label: '一个手机号',
                            value: BuyLimitType.PHONE,
                          },
                        ]}
                      />
                      {buyLimitTypeIsShow(index) && (
                        <View style={[{width: 100}, globalStyles.moduleMarginLeft]}>
                          <Controller
                            control={control}
                            rules={{required: true}}
                            name={`skuInfoReq.skuInfo.${index}.buyLimitNum`}
                            render={({field: {value, onChange}}) => <Input style={{width: 30}} value={value} onChange={onChange} extra="份" />}
                          />
                        </View>
                      )}
                    </View>
                  </Form.Item>
                )}
              />

              <SKUContent title={`套餐${convertNumber2Han(index + 1)}内容`} control={control} next={index} />
            </SectionGroup>
          );
        })}
      </SectionGroup>
      <Button style={{margin: 10}} type="primary" onPress={onNext}>
        下一步
      </Button>
    </View>
  );
};
export default SKU;

export const styles = StyleSheet.create({
  sectionGroup: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingTop: 13,
  },
  buyLimitType: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
