import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {Stepper, SwipeAction, Checkbox} from '@ant-design/react-native';
import {Form, FormTitle, Input, Modal, PlusButton, SectionGroup, SelfText} from '../../../../../component';
import {globalStyles, globalStyleVariables} from '../../../../../constants/styles';
import {convertNumber2Han, findItem, getBuyLimitStr, getDirectCommissionRange, getEarnCommissionRange} from '../../../../../helper';
import {PackagedSKU} from '../../../../../models';
import {RootState} from '../../../../../redux/reducers';
import {ErrorMessage} from '@hookform/error-message';
import {styles} from '../../style';
import List from './List';
import * as apis from '../../../../../apis';
import {Control, UseFormGetValues, UseFormSetValue, UseFormWatch, Controller, useFieldArray, useForm, FieldErrorsImpl, UseFormSetError} from 'react-hook-form';

interface SKUListProps {
  control?: Control<any, any>;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  watch?: UseFormWatch<any>;
  errors?: Partial<FieldErrorsImpl<any>>;
  setError?: UseFormSetError<any>;
}

interface PackListProps {
  value: PackagedSKU[];
}
const SKUList: React.FC<SKUListProps> = ({control, setValue, getValues, errors, setError}) => {
  const [isShowPackageModal, setIsShowPackageModal] = useState(false);
  const spuDetail = useSelector((state: RootState) => state.sku.currentSPU);
  const skuInfo = useSelector((state: RootState) => state.contract.currentContract?.skuInfoReq?.skuInfo);
  const contractDetail = useSelector((state: RootState) => state.contract.currentContract);
  const packListForm = useForm({
    mode: 'all',
  });
  const [packageListEdit, setPackageListEdit] = useState(-1);

  const packArray = useFieldArray({
    control: packListForm.control,
    name: 'sku',
  });

  const {fields} = useFieldArray({
    control: control,
    name: 'skuList',
  });

  useEffect(() => {
    if (isShowPackageModal) {
      packListForm.setValue('sku', skuInfo);
    }
  }, [isShowPackageModal, packListForm, skuInfo]);

  useEffect(() => {
    if (spuDetail) {
      spuDetail.skuList.map(item => {
        packListForm.setValue('sku.list', item.list);
      });
    }
  }, [packListForm, spuDetail]);

  //删除组合套餐
  function deletePackage(index: number) {
    const {packageList = []} = getValues();
    const newPackageList = packageList.filter((_: any, idx: number) => index !== idx);
    setValue('packageList', newPackageList);
  }

  //新增组合套餐
  async function onSubmitPackage() {
    const res = packListForm.getValues();
    const skus: any = [];
    res.skus.forEach((item: any, index: number) => {
      if (item?._selected) {
        skus.push({contractSkuId: res.sku[index].contractSkuId, nums: item.nums});
      }
    });
    // if (skus?.length === 0) {
    //   packListForm.setError('packageList', {type: 'value', message: '请选择一个套餐'});
    //   return;
    // }
    // const packageListNums = skus.reduce((pre: number, idx: any) => pre + idx.nums, 0);
    // if (packageListNums < 2) {
    //   packListForm.setError('packageNums', {type: 'value', message: '如果只选择一个套餐，套餐数量必须大于1'});
    //   return;
    // }

    const formData = {
      show: 1,
      packageName: res.packageName,
      skus: skus,
    };

    let {packageList = []} = getValues();
    if (packageListEdit !== -1) {
      packageList = packageList.map((item: any, idx: number) => {
        if (idx === packageListEdit) {
          return formData;
        }
        return item;
      });
      setValue('packageList', [...packageList]);
      setPackageListEdit(-1);
      packListForm.reset();
    } else {
      setValue('packageList', [...packageList, formData]);
    }
    packListForm.reset({skus: []});
    setIsShowPackageModal(false);
  }
  //编辑组合套餐
  const editPackageList = (index: number, item: PackagedSKU) => {
    const skus: any[] = [];
    item.skus.forEach(item => {
      skus.push({_selected: true, ...item});
      return item;
    });
    setIsShowPackageModal(true);
    setPackageListEdit(index);
    packListForm.setValue('skus', skus);
    packListForm.setValue('packageName', item.packageName);
  };

  const PackageList: React.FC<PackListProps> = props => {
    const {value} = props;
    return (
      <>
        {value?.map((item, index) => (
          <SectionGroup key={index} style={styles.sectionGroupStyle}>
            <FormTitle title={`组合套餐${convertNumber2Han(index + 1)}`} />
            <SwipeAction
              right={[
                {
                  text: '编辑',
                  color: 'white',
                  backgroundColor: globalStyleVariables.COLOR_PRIMARY,
                  onPress: () => editPackageList(index, item),
                },
                {
                  text: '删除',
                  color: 'white',
                  backgroundColor: globalStyleVariables.COLOR_DANGER,
                  onPress: () => deletePackage(index),
                },
              ]}>
              <View style={{margin: globalStyleVariables.MODULE_SPACE}} key={item.id}>
                <View>
                  <Text style={globalStyles.fontSecondary}>名称：{item.packageName}</Text>
                </View>
                <View style={{margin: globalStyleVariables.MODULE_SPACE}}>
                  {item?.skus?.map((sku, index) => {
                    let skuItem;
                    if (spuDetail) {
                      skuItem = findItem(spuDetail?.skuList, item => item.skuId === sku.skuId);
                      if (!skuItem?.skuName) {
                        skuItem = findItem(contractDetail?.skuInfoReq?.skuInfo, item => item.contractSkuId === sku.contractSkuId);
                      }
                    } else {
                      skuItem = findItem(contractDetail?.skuInfoReq?.skuInfo, item => item.contractSkuId === sku.contractSkuId);
                    }
                    return (
                      <View key={index}>
                        <Text style={globalStyles.fontTertiary}>{`${skuItem?.skuName} * ${sku.nums}`}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </SwipeAction>
          </SectionGroup>
        ))}
      </>
    );
  };

  return (
    <View>
      {fields.map((item, index) => {
        return (
          <SectionGroup key={item.id} style={styles.sectionGroupStyle}>
            <FormTitle title={`套餐${convertNumber2Han(index + 1)}设置`} borderTop />
            <Controller
              name={`skuList.${index}.skuName`}
              control={control}
              render={({field: {value}}) => (
                <Form.Item label="套餐名称">
                  <SelfText value={value} />
                </Form.Item>
              )}
            />
            <Form.Item label="套餐结算价（元）">
              <SelfText value={contractDetail?.skuInfoReq?.skuInfo[index]?.skuSettlementPrice} />
            </Form.Item>
            <Controller
              name={`skuList.[${index}].originPrice`}
              control={control}
              rules={{required: '请输入套餐门市价'}}
              render={({field: {value, onChange}}) => (
                <Form.Item label="套餐门市价（元）" errorElement={<ErrorMessage name={`skuList.[${index}].originPrice`} errors={errors} />}>
                  <Input placeholder="请输入" type="number" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              name={`skuList.${index}.salePrice`}
              control={control}
              rules={{
                required: '请输入',
                validate: async (value = 0) => {
                  try {
                    const settlePrice = contractDetail?.skuInfoReq?.skuInfo[index]?.skuSettlementPrice;
                    const res = await apis.sku.getSalePrice({settlePrice, salePrice: value});
                    if (value < Number(res?.minSalePriceYuan)) {
                      const message = `套餐价格不能低于${res?.minSalePriceYuan} `;
                      setError(`skuList.${index}.salePrice`, {type: 'validate', message: message});
                      return Promise.reject({message: message});
                    }
                  } catch (error: any) {
                    setError(`skuList.${index}.salePrice`, {type: 'validate', message: error.message});
                    return Promise.reject({message: '套餐价格过低'});
                  }
                  return true;
                },
              }}
              render={({field: {value, onChange}}) => (
                <Form.Item label="套餐售价（元）" errorElement={<ErrorMessage name={`skuList.${index}.salePrice`} errors={errors} />}>
                  <Input placeholder="请输入" type="number" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              name={`skuList.${index}.directSalesCommission`}
              control={control}
              rules={{
                required: '请输入',
                validate: async value => {
                  try {
                    const {skuList} = getValues();
                    const {earnCommission = 0, salePrice = 0} = skuList[index];
                    const settlementPrice = contractDetail?.skuInfoReq?.skuInfo[index]?.skuSettlementPrice;
                    if (salePrice === 0) {
                      setError(`skuList.${index}.salePrice`, {type: 'value', message: '请先输入售价'});
                      return true;
                    }
                    const res = await apis.sku.getSalePrice({
                      salePrice: salePrice,
                      settlePrice: settlementPrice,
                    });

                    const maxShareCommission = Number(res.maxShareCommissionYuan) || 0;
                    const [min, max] = getDirectCommissionRange(maxShareCommission, earnCommission);
                    if (value < min) {
                      setError(`skuList.${index}.directSalesCommission`, {type: 'validate', message: `直售佣金不能小于${min}元`});
                      return Promise.reject(`直售佣金不能小于${min}元`);
                    }
                    if (value > max) {
                      setError(`skuList.${index}.directSalesCommission`, {type: 'validate', message: `直售佣金不能大于${max}元`});
                      return Promise.reject(`直售佣金不能大于${max}元`);
                    }
                    return true;
                  } catch (error: any) {
                    setError(`skuList.${index}.directSalesCommission`, {type: 'validate', message: error.message});
                    return Promise.reject({message: '套餐价格过低'});
                  }
                },
              }}
              render={({field: {value, onChange}}) => (
                <Form.Item label="直售佣金（元）" errorElement={<ErrorMessage name={`skuList.${index}.directSalesCommission`} errors={errors} />}>
                  <Input placeholder="请输入" type="number" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              name={`skuList.[${index}].earnCommission`}
              control={control}
              rules={{
                required: '请输入',
                validate: async value => {
                  try {
                    const {skuList} = getValues();
                    const {directSalesCommission = 0, salePrice = 0} = skuList[index];
                    if (salePrice === 0) {
                      setError(`skuList.${index}.salePrice`, {type: 'value', message: '请先输入售价'});
                      return true;
                    }
                    const settlementPrice = contractDetail?.skuInfoReq?.skuInfo[index]?.skuSettlementPrice;
                    const res = await apis.sku.getSalePrice({
                      salePrice: salePrice,
                      settlePrice: settlementPrice,
                    });
                    const maxShareCommission = Number(res.maxShareCommissionYuan) || 0;
                    const [min, max] = getEarnCommissionRange(maxShareCommission, directSalesCommission);
                    if (value < min) {
                      setError(`skuList.${index}.earnCommission`, {type: 'validate', message: `躺赚佣金不能小于${min}元`});
                      return Promise.reject(`躺赚佣金不能小于${min}元`);
                    }
                    if (value > max) {
                      setError(`skuList.${index}.earnCommission`, {type: 'validate', message: `躺赚佣金不能大于${max}元`});
                      return Promise.reject(`躺赚佣金不能大于${max}元`);
                    }
                    return true;
                  } catch (error: any) {
                    // commonDispatcher.info(error.message || '哎呀，出错了~');
                    setError(`skuList.${index}.earnCommission`, {type: 'validate', message: error.message});
                    return Promise.reject({message: error.message});
                  }
                },
              }}
              render={({field: {value, onChange}}) => (
                <Form.Item label="躺赚佣金（元）" errorElement={<ErrorMessage name={`skuList.${index}.earnCommission`} errors={errors} />}>
                  <Input placeholder="请输入" type="number" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />

            {!!contractDetail?.skuInfoReq?.openSkuStock ? (
              <Controller
                name={`skuList.[${index}].skuStock`}
                control={control}
                rules={{
                  required: '请输入',
                  validate: () => {
                    const {skuList, stockAmount} = getValues();
                    const stockSum = skuList.reduce((pre: number, idx: any) => {
                      const {skuStock = 0} = idx;
                      return pre + skuStock;
                    }, 0);
                    if (stockSum > stockAmount) {
                      setError(`skuList.[${index}].skuStock`, {message: '套餐单独库存不能大于总库存'});
                      return Promise.reject({message: '套餐单独库存不能大于总库存'});
                    }
                    return true;
                  },
                }}
                render={({field: {value, onChange}}) => (
                  <Form.Item label="套餐库存" errorElement={<ErrorMessage name={`skuList.[${index}].skuStock`} errors={errors} />}>
                    <Input placeholder="请输入" type="number" value={value} onChange={onChange} />
                  </Form.Item>
                )}
              />
            ) : (
              <Form.Item label="套餐库存">
                <Text>共享库存</Text>
              </Form.Item>
            )}
            <Form.Item label="购买上限">
              <SelfText value={getBuyLimitStr(contractDetail?.skuInfoReq?.skuInfo[index]?.buyLimitType, contractDetail?.skuInfoReq?.skuInfo[index]?.buyLimitNum)} />
            </Form.Item>
            <List control={control} next={index} />
          </SectionGroup>
        );
      })}
      {/* 组合套餐 */}
      <Controller control={control} name="packageList" render={({field: {value}}) => <PackageList value={value} />} />

      <SectionGroup style={[{paddingVertical: 10, backgroundColor: '#fff'}]}>
        <PlusButton
          style={[globalStyles.containerCenter]}
          onPress={() => {
            setIsShowPackageModal(true);
            packListForm.reset({skus: []});
          }}
          title="组合现有套餐"
        />
      </SectionGroup>

      <Modal
        title="组合套餐"
        visible={isShowPackageModal}
        onOk={packListForm.handleSubmit(onSubmitPackage)}
        onClose={() => {
          setIsShowPackageModal(false);
          packListForm.reset();
        }}>
        <Controller
          control={packListForm.control}
          name="packageName"
          rules={{required: '请输入组合套餐名称'}}
          render={({field: {value, onChange}}) => (
            <>
              <Text style={[globalStyles.fontPrimary, {marginBottom: globalStyleVariables.MODULE_SPACE, marginTop: globalStyleVariables.MODULE_SPACE}]}>组合套餐名称</Text>
              <View style={{backgroundColor: '#f4f4f4'}}>
                <Input textAlign="left" value={value} onChange={onChange} placeholder="请输入" />
              </View>
              <Text style={[globalStyles.error, {marginTop: 5}]}>
                <ErrorMessage name={'packageName'} errors={packListForm.formState.errors} />
              </Text>
            </>
          )}
        />

        <View>
          <View style={[globalStyles.borderBottom]}>
            <Text style={[globalStyles.fontPrimary, {marginBottom: globalStyleVariables.MODULE_SPACE, marginTop: globalStyleVariables.MODULE_SPACE}]}>选择套餐</Text>
          </View>
          {packArray.fields.map((item, index) => {
            const checked = packListForm.watch(`skus[${index}]._selected`);
            return (
              <View key={item.id} style={[{marginBottom: 10}]}>
                <Controller
                  name={`skus[${index}]._selected`}
                  rules={{
                    validate: () => {
                      const skus = packListForm.getValues('skus');
                      let nums = 0;
                      skus.forEach((item: {_selected: boolean; nums: number}) => {
                        if (item?._selected) {
                          nums++;
                        }
                      });
                      if (nums < 1) {
                        packListForm.setError('packageNums', {type: 'value', message: '请选择一个套餐'});
                        return '请选择一个套餐';
                      }
                      packListForm.clearErrors(`skus[${fields.length - 1}]._selected`);
                      return true;
                    },
                  }}
                  control={packListForm.control}
                  render={({field: {value, onChange}}) => (
                    <View style={[globalStyles.moduleMarginTop]}>
                      <Checkbox style={{alignItems: 'flex-start'}} checked={value} onChange={e => onChange(e.target.checked)}>
                        <Controller
                          control={packListForm.control}
                          name={`sku.${index}.skuName`}
                          render={({field: {value}}) => (
                            <View style={{flex: 1}}>
                              <Text>套餐{convertNumber2Han(index + 1)}</Text>
                              <SelfText style={globalStyles.fontSecondary} value={value} />
                              {checked && (
                                <View style={[globalStyles.containerLR, globalStyles.borderTop, {flex: 1, paddingTop: 5, marginTop: 5}]}>
                                  <Text style={[globalStyles.fontTertiary]}>设置份数</Text>
                                  <Controller
                                    name={`skus.${index}.nums`}
                                    control={packListForm.control}
                                    defaultValue={1}
                                    rules={{
                                      validate: () => {
                                        const skus = packListForm.getValues('skus');
                                        const nums = skus.reduce((pre: number, idx: {_selected: boolean; nums: number}) => {
                                          if (idx._selected) {
                                            return pre + idx.nums;
                                          }
                                          return pre;
                                        }, 0);
                                        if (nums < 2) {
                                          packListForm.setError('packageList', {type: 'value', message: '如果只选择一个套餐，套餐数量必须大于1'});
                                          return '如果只选择一个套餐，套餐数量必须大于1';
                                        }
                                        packListForm.clearErrors(`skus.${index}.nums`);
                                        return true;
                                      },
                                    }}
                                    render={({field: {value, onChange}}) => (
                                      <Stepper style={{marginLeft: 65}} value={value} onChange={onChange} styles={stepperStyle} step={1} min={1} />
                                    )}
                                  />
                                </View>
                              )}
                            </View>
                          )}
                        />
                      </Checkbox>
                    </View>
                  )}
                />
                <Text style={[globalStyles.error]}>
                  {index === packArray.fields.length - 1 && <ErrorMessage name={`skus.${index}._selected`} errors={packListForm.formState.errors} />}
                  <ErrorMessage name={`skus.${index}.nums`} errors={packListForm.formState.errors} />
                </Text>
              </View>
            );
          })}

          <Controller name={'packageNums'} control={packListForm.control} render={() => null} />
          <Controller name={'packageList'} control={packListForm.control} render={() => null} />

          {/* {packListForm?.formState?.errors?.packageList && (
            <Text style={[globalStyles.error]}>
              <ErrorMessage name={'packageList'} errors={packListForm.formState.errors} />
            </Text>
          )} */}
          {/* {packListForm?.formState?.errors?.packageNums && (
            <Text style={[globalStyles.error]}>
              <ErrorMessage name={'packageNums'} errors={packListForm.formState.errors} />
            </Text>
          )} */}
        </View>
      </Modal>
    </View>
  );
};
export default SKUList;

const stepperStyle = StyleSheet.create({
  container: {
    flex: 0,
  },
  input: {
    width: 50,
    flex: 0,
  },
  stepWrap: {
    backgroundColor: '#e5e5e5',
    borderWidth: 0,
  },
  stepText: {
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  stepDisabled: {
    backgroundColor: '#e5e5e5',
  },
  disabledStepTextColor: {
    color: globalStyleVariables.TEXT_COLOR_TERTIARY,
  },
});
