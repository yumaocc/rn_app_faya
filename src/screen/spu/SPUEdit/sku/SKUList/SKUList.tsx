import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {Stepper, SwipeAction} from '@ant-design/react-native';

import {Checkbox, Form, FormTitle, Input, Modal, PlusButton, SectionGroup, SelfText} from '../../../../../component';
import {globalStyles, globalStyleVariables} from '../../../../../constants/styles';
import {findItem, getBuyLimitStr, getDirectCommissionRange, getEarnCommissionRange} from '../../../../../helper';
import {PackagedSKU} from '../../../../../models';
import {RootState} from '../../../../../redux/reducers';
import {ErrorMessage} from '@hookform/error-message';
import {styles} from '../../style';
import {useCommonDispatcher} from '../../../../../helper/hooks';
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
  const [commonDispatcher] = useCommonDispatcher();
  const spuDetail = useSelector((state: RootState) => state.sku.currentSPU);
  const skuInfo = useSelector((state: RootState) => state.contract.currentContract?.skuInfoReq?.skuInfo);
  const contractDetail = useSelector((state: RootState) => state.contract.currentContract);
  const packListForm = useForm();

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

  function deletePack(index: number) {
    const {packageList = []} = getValues();
    const newPackageList = packageList.filter((_: any, idx: number) => index !== idx);
    setValue('packageList', newPackageList);
  }

  async function onSubmitPack() {
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

    const {packageList = []} = getValues();
    setValue('packageList', [...packageList, formData]);
    setIsShowPackageModal(false);
  }

  const editPackList = (index: number, item: PackagedSKU) => {
    setIsShowPackageModal(true);
    const sku = item.skus.map(item => ({...item, _selected: true}));
    packListForm.setValue('packageName', item.packageName);
    sku.map((item, index) => {
      packListForm.setValue(`sku.${index}`, item);
    });
  };

  const PackList: React.FC<PackListProps> = props => {
    const {value} = props;
    return (
      <>
        {value?.map((item, index) => (
          <SectionGroup key={index} style={styles.sectionGroupStyle}>
            <FormTitle title={`组合套餐${index + 1}`} />
            <SwipeAction
              right={[
                {
                  text: '编辑',
                  color: 'white',
                  backgroundColor: globalStyleVariables.COLOR_PRIMARY,
                  onPress: () => editPackList(index, item),
                },
                {
                  text: '删除',
                  color: 'white',
                  backgroundColor: globalStyleVariables.COLOR_DANGER,
                  onPress: () => deletePack(index),
                },
              ]}>
              <View style={{margin: globalStyleVariables.MODULE_SPACE}} key={item.id}>
                <View>
                  <Text style={globalStyles.fontSecondary}>名称：{item.packageName}</Text>
                </View>
                <View style={{margin: globalStyleVariables.MODULE_SPACE}}>
                  {item?.skus?.map(sku => {
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
                      <View key={sku.skuId}>
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
            <FormTitle title={`套餐${index + 1}设置`} />
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
                <Form.Item label="套餐门市价（元）">
                  <Input placeholder="请输入套餐原价" type="number" value={value} onChange={onChange} />
                  <Text style={globalStyles.error}>
                    <ErrorMessage name={`skuList.[${index}].originPrice`} errors={errors} />
                  </Text>
                </Form.Item>
              )}
            />
            <Controller
              name={`skuList.${index}.salePrice`}
              control={control}
              rules={{
                required: '请输入套餐售价',
                validate: async (value = 0) => {
                  try {
                    const settlePrice = contractDetail?.skuInfoReq?.skuInfo[index]?.skuSettlementPrice;
                    const res = await apis.sku.getSalePrice({settlePrice, salePrice: value});
                    if (value < Number(res?.minSalePriceYuan)) {
                      const message = `套餐价格不能低于${res?.minSalePriceYuan} `;
                      setError(`skuList.${index}.salePrice`, {type: 'validate', message: message});
                      return Promise.reject({message: message});
                    }
                  } catch (error) {
                    commonDispatcher.info((error as string) || '哎呀，出错了~');
                    setError(`skuList.${index}.salePrice`, {type: 'validate', message: error as string});
                    return Promise.reject({message: '套餐价格过低'});
                  }
                  return true;
                },
              }}
              render={({field: {value, onChange}}) => (
                <Form.Item label="套餐售价（元）">
                  <Input placeholder="请输入套餐售价" type="number" value={value} onChange={onChange} />
                  <Text style={globalStyles.error}>
                    <ErrorMessage name={`skuList.${index}.salePrice`} errors={errors} />
                  </Text>
                </Form.Item>
              )}
            />

            <Controller
              name={`skuList.${index}.directSalesCommission`}
              control={control}
              rules={{
                required: '请输入直售佣金',
                validate: async value => {
                  try {
                    const {skuList} = getValues();
                    const {earnCommission = 0, salePrice = 0} = skuList[index];
                    const settlementPrice = contractDetail?.skuInfoReq?.skuInfo[index]?.skuSettlementPrice;
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
                  } catch (error) {
                    commonDispatcher.info((error as string) || '哎呀，出错了~');
                    setError(`skuList.${index}.directSalesCommission`, {type: 'validate', message: error as string});
                    return Promise.reject({message: '套餐价格过低'});
                  }
                },
              }}
              render={({field: {value, onChange}}) => (
                <Form.Item label="直售佣金（元）">
                  <Input placeholder="请输入直售佣金" type="number" value={value} onChange={onChange} />
                  <Text style={globalStyles.error}>
                    <ErrorMessage name={`skuList.${index}.directSalesCommission`} errors={errors} />
                  </Text>
                </Form.Item>
              )}
            />

            <Controller
              name={`skuList.[${index}].earnCommission`}
              control={control}
              rules={{
                required: '请输入躺赚佣金',
                validate: async value => {
                  try {
                    const {skuList} = getValues();
                    const {directSalesCommission = 0, salePrice = 0} = skuList[index];
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
                  } catch (error) {
                    commonDispatcher.info((error as string) || '哎呀，出错了~');
                    setError(`skuList.${index}.earnCommission`, {type: 'validate', message: error as string});
                    return Promise.reject({message: error as string});
                  }
                },
              }}
              render={({field: {value, onChange}}) => (
                <Form.Item label="躺赚佣金（元）">
                  <Input placeholder="请输入躺赚佣金" type="number" value={value} onChange={onChange} />
                  <Text style={globalStyles.error}>
                    <ErrorMessage name={`skuList.${index}.earnCommission`} errors={errors} />
                  </Text>
                </Form.Item>
              )}
            />
            {!!contractDetail?.skuInfoReq?.openSkuStock ? (
              <Controller
                name={`skuList.[${index}].skuStock`}
                control={control}
                render={({field: {value, onChange}}) => (
                  <Form.Item label="套餐库存">
                    <Input placeholder="请输入套餐库存" type="number" value={value} onChange={onChange} />
                  </Form.Item>
                )}
              />
            ) : (
              <Form.Item label="套餐库存">
                <Text>共享库存</Text>
              </Form.Item>
            )}
            <Form.Item label="购买上限">
              <SelfText value={getBuyLimitStr(contractDetail?.skuInfoReq?.skuInfo[index]?.buyLimitType, contractDetail?.skuInfoReq?.skuInfo[index]?.buyLimitType)} />
            </Form.Item>

            <List control={control} next={index} />
          </SectionGroup>
        );
      })}
      {/* 组合套餐 */}
      <Controller control={control} name="packageList" render={({field: {value}}) => <PackList value={value} />} />

      <SectionGroup style={[{paddingVertical: 10, backgroundColor: '#fff'}]}>
        <PlusButton style={[globalStyles.containerCenter]} onPress={() => setIsShowPackageModal(true)} title="组合现有套餐" />
      </SectionGroup>

      <Modal title="组合套餐" visible={isShowPackageModal} onOk={packListForm.handleSubmit(onSubmitPack)} onClose={() => setIsShowPackageModal(false)}>
        <Controller
          control={packListForm.control}
          name="packageName"
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Form.Item label="组合套餐名称" vertical>
              <Input
                textAlign="left"
                value={value}
                onChange={onChange}
                styles={{container: {height: 40, paddingHorizontal: 15, margin: 0, borderRadius: 5, backgroundColor: '#0000000D'}}}
                placeholder="请输入组合套餐名称"
              />
              {packListForm.formState.errors.packageName && (
                <Text style={[globalStyles.error, globalStyles.moduleMarginLeft, globalStyles.moduleMarginTop]}>请输入组合套餐名称</Text>
              )}
            </Form.Item>
          )}
        />

        <Form.Item label="选择套餐" vertical>
          {packArray.fields.map((item, index) => {
            const checked = packListForm.watch(`skus[${index}]._selected`);
            return (
              <>
                <View key={item.id} style={[{marginBottom: 10}]}>
                  <Controller
                    name={`skus[${index}]._selected`}
                    rules={{required: true}}
                    control={packListForm.control}
                    render={({field: {value, onChange}}) => (
                      <Form.Item noStyle>
                        <Checkbox checked={value} onChange={onChange}>
                          <Controller control={packListForm.control} name={`sku.${index}.skuName`} render={({field: {value}}) => <SelfText value={value} />} />
                        </Checkbox>
                      </Form.Item>
                    )}
                  />
                  {checked && (
                    <View style={[globalStyles.containerLR, {paddingLeft: 20}]}>
                      <Text>数量</Text>
                      <Controller
                        name={`skus.${index}.nums`}
                        defaultValue={2}
                        control={packListForm.control}
                        render={({field: {value, onChange}}) => (
                          <Form.Item noStyle>
                            <Stepper value={value} onChange={onChange} styles={stepperStyle} step={1} min={2} />
                          </Form.Item>
                        )}
                      />
                    </View>
                  )}
                </View>
              </>
            );
          })}
        </Form.Item>
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
