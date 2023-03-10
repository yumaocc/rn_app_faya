import React, {FC, useContext, useEffect, useState} from 'react';
import {Control, FieldErrorsImpl, useFieldArray, UseFormGetValues, UseFormHandleSubmit, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Cascader, Form, FormTitle, Input, SectionGroup, Select, Switch} from '../../../../component';
import {globalStyles, globalStyleVariables} from '../../../../constants/styles';
import {useSPUCategories} from '../../../../helper/hooks';
import {convertNumber2Han, formattingGoodsCategory, isFloatNumber} from '../../../../helper/util';
import {BuyLimitType, ContractAction, InvoiceType} from '../../../../models';
import SKUContent from './SKUContent';
import {ErrorMessage} from '@hookform/error-message';
import {Controller} from 'react-hook-form';
import {Button} from '@ant-design/react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/reducers';
import {FormDisabledContext} from '../../../../component/Form/Context';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
interface SKUProps {
  onNext?: () => void;
  control: Control<any, any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  watch: UseFormWatch<any>;
  action: ContractAction;
  handleSubmit?: UseFormHandleSubmit<any>;
  errors?: Partial<FieldErrorsImpl<any>>;
}

const SKU: FC<SKUProps> = ({control, watch, onNext, getValues, setValue, action, errors}) => {
  const disabledContext = useContext(FormDisabledContext);
  const [moreMeals, setMoreMeals] = useState(true);
  const {bottom} = useSafeAreaInsets();
  const SPUCategories = useSelector((state: RootState) => {
    return formattingGoodsCategory(state.sku.categories);
  });
  useSPUCategories();

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
    if (disabledContext?.disabled) {
      return;
    }
    append({
      skuName: '',
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
          rules={{required: '请输入商品名称'}}
          render={({field: {value, onChange}}) => (
            <Form.Item showAsterisk label="商品名称" errorElement={<ErrorMessage name={'spuInfoReq.spuName'} errors={errors} />}>
              <Input value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="spuInfoReq.spuCategoryIds"
          rules={{required: '请选择商品分类'}}
          render={({field: {value, onChange}}) => (
            <Form.Item showAsterisk label="商品分类" errorElement={<ErrorMessage name={'spuInfoReq.spuCategoryIds'} errors={errors} />}>
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
          rules={{
            required: '请输入商品总库存',
            validate: value => {
              if (isFloatNumber(value)) {
                return '请输入整数';
              }
              return true;
            },
          }}
          name="skuInfoReq.spuStock"
          render={({field: {value, onChange}}) => (
            <Form.Item showAsterisk label="商品总库存" errorElement={<ErrorMessage name={'skuInfoReq.spuStock'} errors={errors} />}>
              <Input value={value} type="number" onChange={onChange} />
            </Form.Item>
          )}
        />
        <Form.Item label="设置多套餐">
          <Switch checked={moreMeals} onChange={value => setMoreMeals(value)} />
        </Form.Item>

        <Controller
          control={control}
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
                        <TouchableOpacity
                          onPress={() => {
                            if (disabledContext?.disabled) {
                              return;
                            }
                            delSkuInfo(index);
                          }}>
                          <Text style={{color: globalStyleVariables.COLOR_ERROR}}>删除</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                }
              />
              <Controller
                control={control}
                rules={{required: '请输入套餐名称'}}
                name={`skuInfoReq.skuInfo.${index}.skuName`}
                render={({field: {value, onChange}}) => (
                  <Form.Item showAsterisk label="套餐名称" errorElement={<ErrorMessage name={`skuInfoReq.skuInfo.${index}.skuName`} errors={errors} />}>
                    <Input value={value} onChange={onChange} />
                  </Form.Item>
                )}
              />
              <Controller
                control={control}
                rules={{
                  required: '请输入套餐结算价',
                  validate: value => {
                    if (isFloatNumber(value)) {
                      return '请输入整数';
                    }
                    return true;
                  },
                }}
                name={`skuInfoReq.skuInfo.${index}.skuSettlementPrice`}
                render={({field: {value, onChange}}) => (
                  <Form.Item showAsterisk label="套餐结算价" errorElement={<ErrorMessage name={`skuInfoReq.skuInfo.${index}.skuSettlementPrice`} errors={errors} />}>
                    <Input textAlign="right" placeholder="请输入" last={true} type="number" value={value} onChange={onChange} />
                  </Form.Item>
                )}
              />
              {openSkuStock && (
                <Controller
                  control={control}
                  rules={{
                    validate: () => {
                      const {skuInfoReq} = getValues();
                      const {spuStock = 0, skuInfo} = skuInfoReq;
                      const skuStockNums = skuInfo.reduce((pre: any, idx: any) => idx.skuStock + pre, 0);
                      if (spuStock < skuStockNums) {
                        return '单独套餐库存不能大于总库存';
                      }
                      return true;
                    },
                  }}
                  name={`skuInfoReq.skuInfo.${index}.skuStock`}
                  render={({field: {value, onChange}}) => (
                    <Form.Item label="套餐库存" errorElement={<ErrorMessage name={`skuInfoReq.skuInfo.${index}.skuStock`} errors={errors} />}>
                      <Input type="number" value={value} onChange={onChange} />
                    </Form.Item>
                  )}
                />
              )}

              <Controller
                control={control}
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
                            defaultValue={null}
                            control={control}
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
      {disabledContext?.disabled ? null : (
        <View style={{marginBottom: bottom}}>
          <Button style={{margin: 10}} type="primary" onPress={onNext}>
            下一步
          </Button>
        </View>
      )}
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
