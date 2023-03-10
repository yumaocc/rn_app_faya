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
import {isFloatNumber} from '../../../../../helper/util';

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

  //??????????????????
  function deletePackage(index: number) {
    const {packageList = []} = getValues();
    const newPackageList = packageList.filter((_: any, idx: number) => index !== idx);
    setValue('packageList', newPackageList);
  }

  //??????????????????
  async function onSubmitPackage() {
    const res = packListForm.getValues();
    const skus: any = [];
    res.skus.forEach((item: any, index: number) => {
      if (item?._selected) {
        skus.push({contractSkuId: res.sku[index].contractSkuId, nums: item.nums});
      }
    });

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
  //??????????????????
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
            <FormTitle title={`????????????${convertNumber2Han(index + 1)}`} />
            <SwipeAction
              right={[
                {
                  text: '??????',
                  color: 'white',
                  backgroundColor: globalStyleVariables.COLOR_PRIMARY,
                  onPress: () => editPackageList(index, item),
                },
                {
                  text: '??????',
                  color: 'white',
                  backgroundColor: globalStyleVariables.COLOR_DANGER,
                  onPress: () => deletePackage(index),
                },
              ]}>
              <View style={{margin: globalStyleVariables.MODULE_SPACE}} key={item.id}>
                <View>
                  <Text style={globalStyles.fontSecondary}>?????????{item.packageName}</Text>
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
            <FormTitle title={`??????${convertNumber2Han(index + 1)}??????`} borderTop />
            <Controller
              name={`skuList.${index}.skuName`}
              control={control}
              render={({field: {value}}) => (
                <Form.Item label="????????????">
                  <SelfText value={value} />
                </Form.Item>
              )}
            />
            <Form.Item label="????????????????????????">
              <SelfText value={contractDetail?.skuInfoReq?.skuInfo[index]?.skuSettlementPrice} />
            </Form.Item>
            <Controller
              name={`skuList.[${index}].originPrice`}
              control={control}
              rules={{required: '????????????????????????'}}
              render={({field: {value, onChange}}) => (
                <Form.Item label="????????????????????????" errorElement={<ErrorMessage name={`skuList.[${index}].originPrice`} errors={errors} />}>
                  <Input type="number" placeholder="?????????" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              name={`skuList.${index}.salePrice`}
              control={control}
              rules={{
                required: '?????????',
                validate: async (value = 0) => {
                  try {
                    const settlePrice = contractDetail?.skuInfoReq?.skuInfo[index]?.skuSettlementPrice;
                    const res = await apis.sku.getSalePrice({settlePrice, salePrice: value});
                    if (value < Number(res?.minSalePriceYuan)) {
                      const message = `????????????????????????${res?.minSalePriceYuan} `;
                      setError(`skuList.${index}.salePrice`, {type: 'validate', message: message});
                      return Promise.reject({message: message});
                    }
                  } catch (error: any) {
                    setError(`skuList.${index}.salePrice`, {type: 'validate', message: error.message});
                    return Promise.reject({message: '??????????????????'});
                  }
                  return true;
                },
              }}
              render={({field: {value, onChange}}) => (
                <Form.Item label="?????????????????????" errorElement={<ErrorMessage name={`skuList.${index}.salePrice`} errors={errors} />}>
                  <Input placeholder="?????????" type="number" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              name={`skuList.${index}.directSalesCommission`}
              control={control}
              rules={{
                required: '?????????',
                validate: async value => {
                  try {
                    if (isFloatNumber(value)) {
                      return '???????????????';
                    }
                    const {skuList} = getValues();
                    const {earnCommission = 0, salePrice = 0} = skuList[index];
                    const settlementPrice = contractDetail?.skuInfoReq?.skuInfo[index]?.skuSettlementPrice;
                    if (salePrice === 0) {
                      setError(`skuList.${index}.salePrice`, {type: 'value', message: '??????????????????'});
                      return true;
                    }
                    const res = await apis.sku.getSalePrice({
                      salePrice: salePrice,
                      settlePrice: settlementPrice,
                    });

                    const maxShareCommission = Number(res.maxShareCommissionYuan) || 0;
                    const [min, max] = getDirectCommissionRange(maxShareCommission, earnCommission);
                    if (value < min) {
                      setError(`skuList.${index}.directSalesCommission`, {type: 'validate', message: `????????????????????????${min}???`});
                      return Promise.reject(`????????????????????????${min}???`);
                    }
                    if (value > max) {
                      setError(`skuList.${index}.directSalesCommission`, {type: 'validate', message: `????????????????????????${max}???`});
                      return Promise.reject(`????????????????????????${max}???`);
                    }
                    return true;
                  } catch (error: any) {
                    setError(`skuList.${index}.directSalesCommission`, {type: 'validate', message: error.message});
                    return Promise.reject({message: '??????????????????'});
                  }
                },
              }}
              render={({field: {value, onChange}}) => (
                <Form.Item label="?????????????????????" errorElement={<ErrorMessage name={`skuList.${index}.directSalesCommission`} errors={errors} />}>
                  <Input placeholder="?????????" type="number" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              name={`skuList.[${index}].earnCommission`}
              control={control}
              rules={{
                required: '?????????',
                validate: async value => {
                  try {
                    if (isFloatNumber(value)) {
                      return '???????????????';
                    }
                    const {skuList} = getValues();
                    const {directSalesCommission = 0, salePrice = 0} = skuList[index];
                    if (salePrice === 0) {
                      setError(`skuList.${index}.salePrice`, {type: 'value', message: '??????????????????'});
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
                      setError(`skuList.${index}.earnCommission`, {type: 'validate', message: `????????????????????????${min}???`});
                      return Promise.reject(`????????????????????????${min}???`);
                    }
                    if (value > max) {
                      setError(`skuList.${index}.earnCommission`, {type: 'validate', message: `????????????????????????${max}???`});
                      return Promise.reject(`????????????????????????${max}???`);
                    }
                    return true;
                  } catch (error: any) {
                    // commonDispatcher.info(error.message || '??????????????????~');
                    setError(`skuList.${index}.earnCommission`, {type: 'validate', message: error.message});
                    return Promise.reject({message: error.message});
                  }
                },
              }}
              render={({field: {value, onChange}}) => (
                <Form.Item label="?????????????????????" errorElement={<ErrorMessage name={`skuList.${index}.earnCommission`} errors={errors} />}>
                  <Input placeholder="?????????" type="number" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />

            {!!contractDetail?.skuInfoReq?.openSkuStock ? (
              <Controller
                name={`skuList.[${index}].skuStock`}
                control={control}
                rules={{
                  required: '?????????',
                  validate: () => {
                    const {skuList, stockAmount} = getValues();
                    const stockSum = skuList.reduce((pre: number, idx: any) => {
                      const {skuStock = 0} = idx;
                      return pre + skuStock;
                    }, 0);
                    if (stockSum > stockAmount) {
                      setError(`skuList.[${index}].skuStock`, {message: '???????????????????????????????????????'});
                      return Promise.reject({message: '???????????????????????????????????????'});
                    }
                    return true;
                  },
                }}
                render={({field: {value, onChange}}) => (
                  <Form.Item label="????????????" errorElement={<ErrorMessage name={`skuList.[${index}].skuStock`} errors={errors} />}>
                    <Input placeholder="?????????" type="number" value={value} onChange={onChange} />
                  </Form.Item>
                )}
              />
            ) : (
              <Form.Item label="????????????">
                <Text>????????????</Text>
              </Form.Item>
            )}
            <Form.Item label="????????????">
              <SelfText value={getBuyLimitStr(contractDetail?.skuInfoReq?.skuInfo[index]?.buyLimitType, contractDetail?.skuInfoReq?.skuInfo[index]?.buyLimitNum)} />
            </Form.Item>
            <List control={control} next={index} />
          </SectionGroup>
        );
      })}
      {/* ???????????? */}
      <Controller control={control} name="packageList" render={({field: {value}}) => <PackageList value={value} />} />

      <SectionGroup style={[{paddingVertical: 10, backgroundColor: '#fff'}]}>
        <PlusButton
          style={[globalStyles.containerCenter]}
          onPress={() => {
            setIsShowPackageModal(true);
            packListForm.reset({skus: []});
          }}
          title="??????????????????"
        />
      </SectionGroup>

      <Modal
        title="????????????"
        visible={isShowPackageModal}
        onOk={packListForm.handleSubmit(onSubmitPackage)}
        onClose={() => {
          setIsShowPackageModal(false);
          packListForm.reset();
        }}>
        <Controller
          control={packListForm.control}
          name="packageName"
          rules={{required: '???????????????????????????'}}
          render={({field: {value, onChange}}) => (
            <>
              <Text style={[globalStyles.fontPrimary, {marginBottom: globalStyleVariables.MODULE_SPACE, marginTop: globalStyleVariables.MODULE_SPACE}]}>??????????????????</Text>
              <View style={{backgroundColor: '#f4f4f4'}}>
                <Input textAlign="left" value={value} onChange={onChange} placeholder="?????????" />
              </View>
              <Text style={[globalStyles.error, {marginTop: 5}]}>
                <ErrorMessage name={'packageName'} errors={packListForm.formState.errors} />
              </Text>
            </>
          )}
        />

        <View>
          <View style={[globalStyles.borderBottom]}>
            <Text style={[globalStyles.fontPrimary, {marginBottom: globalStyleVariables.MODULE_SPACE, marginTop: globalStyleVariables.MODULE_SPACE}]}>????????????</Text>
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
                        packListForm.setError('packageNums', {type: 'value', message: '?????????????????????'});
                        return '?????????????????????';
                      }
                      packListForm.clearErrors(`skus[${fields.length - 1}]._selected`);
                      return true;
                    },
                  }}
                  control={packListForm.control}
                  render={({field: {value, onChange}}) => (
                    <View style={[globalStyles.moduleMarginTop]}>
                      <Checkbox style={{alignItems: 'flex-start', borderColor: 'gray', flex: 1}} checked={value} onChange={e => onChange(e.target.checked)}>
                        <Controller
                          control={packListForm.control}
                          name={`sku.${index}.skuName`}
                          render={({field: {value}}) => (
                            <View style={{flex: 1}}>
                              <Text>??????{convertNumber2Han(index + 1)}</Text>
                              <SelfText style={globalStyles.fontSecondary} value={value} />
                              {checked && (
                                <View style={[globalStyles.containerLR, globalStyles.borderTop, {flex: 1, paddingTop: 5, marginTop: 5}]}>
                                  <Text style={[globalStyles.fontTertiary]}>????????????</Text>
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
                                          packListForm.setError('packageList', {type: 'value', message: '??????????????????????????????????????????????????????1'});
                                          return '??????????????????????????????????????????????????????1';
                                        }
                                        packListForm.clearErrors(`skus.${index}.nums`);
                                        return true;
                                      },
                                    }}
                                    render={({field: {value, onChange}}) => <Stepper value={value} onChange={onChange} styles={stepperStyle} step={1} min={1} />}
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
