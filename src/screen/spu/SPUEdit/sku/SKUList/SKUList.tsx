import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {Stepper, SwipeAction} from '@ant-design/react-native';

import {Checkbox, Form, FormTitle, Input, Modal, PlusButton, SectionGroup, SelfText} from '../../../../../component';
import {globalStyles, globalStyleVariables} from '../../../../../constants/styles';
import {findItem, getBuyLimitStr} from '../../../../../helper';
import {PackagedSKU, SKU} from '../../../../../models';
import {RootState} from '../../../../../redux/reducers';
import {styles} from '../../style';
import List from './List';
import {Control, UseFormGetValues, UseFormSetValue, UseFormWatch, Controller, useFieldArray, useForm} from 'react-hook-form';

interface SKUListProps {
  control?: Control<any, any>;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  watch?: UseFormWatch<any>;
}
const SKUList: React.FC<SKUListProps> = ({control, setValue, getValues}) => {
  const {fields} = useFieldArray({
    control: control,
    name: 'skuList',
  });
  const packListForm = useForm();
  const packArray = useFieldArray({
    control: packListForm.control,
    name: 'sku',
  });
  const skuInfo = useSelector((state: RootState) => state.contract.currentContract?.skuInfoReq?.skuInfo);
  const [isShowPackageModal, setIsShowPackageModal] = useState(false);
  // const [editIndex, setEditIndex] = useState<number>(-1); // 用索引标识当前正在编辑的组合套餐

  const contractDetail = useSelector((state: RootState) => state.contract.currentContract);

  const form = Form.useFormInstance();
  // const [packForm] = Form.useForm();

  // const packFormSkuList = useMemo<PackagedSKUItem[]>(() => packForm.getFieldValue('skus') || [], [packForm]);

  const skuList = useMemo<SKU[]>(() => form.getFieldValue('skuList') || [], [form]);

  useEffect(() => {
    if (isShowPackageModal) {
      packListForm.setValue('sku', skuInfo);
    }
  }, [isShowPackageModal, packListForm, skuInfo]);

  function deletePack(index: number) {
    const {packageList = []} = getValues();
    const newPackageList = packageList.filter((_, idx) => index !== idx);
    setValue('packageList', newPackageList);
  }

  //编辑或者新增组合套餐
  // function packSKU(index?: number) {
  //   setEditIndex(-1);
  //   let initValue: PackagedSKUForm;
  //   const skuList = contractDetail?.skuInfoReq?.skuInfo || [];
  //   if (index !== undefined) {
  //     setEditIndex(index);
  //     const pack: PackagedSKU = getItemByIndex(form.getFieldValue('packageList'), index);
  //     if (pack) {
  //       const packSKUs = pack.skus || [];
  //       initValue = {
  //         ...pack,
  //         skus: skuList.map(sku => {
  //           const originPack = packSKUs.find(e => e.contractSkuId === sku.contractSkuId);
  //           return {
  //             _skuName: sku.skuName,
  //             _selected: !!originPack,
  //             nums: originPack?.nums || 1,
  //             contractSkuId: sku.contractSkuId,
  //           };
  //         }),
  //       };
  //     }
  //   }
  //   if (!initValue) {
  //     // 新增，从skuList构造初始值
  //     initValue = {
  //       packageName: '',
  //       show: BoolEnum.TRUE,
  //       skus: skuList.map(sku => ({
  //         _skuName: sku.skuName,
  //         _selected: false,
  //         nums: 1,
  //         contractSkuId: sku.contractSkuId,
  //       })),
  //     };
  //   }

  //   packForm.setFieldsValue(initValue);
  //   setIsShowPackageModal(true);
  // }

  async function onSubmitPack() {
    const res = packListForm.getValues();
    const skus: any = [];
    res.skus.forEach((item, index) => {
      if (item._selected) {
        skus.push({sku: res.sku[index].contractSkuId, nums: item.nums});
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

  interface PackListProps {
    value: PackagedSKU[];
  }
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
                  onPress: () => packSKU(index),
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
                  {item?.skus?.map((sku, index) => {
                    const foundSKU = findItem(skuList, item => item.skuId === sku.skuId);
                    return (
                      <View key={index}>
                        <Text style={globalStyles.fontTertiary}>{`${foundSKU?.skuName} * ${sku.nums}`}</Text>
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
            <Controller
              name={`skuList.${index}.skuSettlementPrice`}
              control={control}
              render={({field: {value}}) => (
                <Form.Item label="套餐结算价（元）">
                  <SelfText value={value + '元'} />
                </Form.Item>
              )}
            />
            <Controller
              name={`skuList.[${index}].originPrice`}
              control={control}
              render={({field: {value, onChange}}) => (
                <Form.Item label="套餐门市价（元）">
                  <Input placeholder="请输入套餐原价" type="number" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            <Controller
              name={`skuList.[${index}].salePrice`}
              control={control}
              render={({field: {value, onChange}}) => (
                <Form.Item label="套餐售价（元）">
                  <Input placeholder="请输入套餐售价" type="number" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />

            <Controller
              name={`skuList.[${index}].directSalesCommission`}
              control={control}
              render={({field: {value, onChange}}) => (
                <Form.Item label="直售佣金（元）">
                  <Input placeholder="请输入直售佣金" type="number" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />

            <Controller
              name={`skuList.[${index}].earnCommission`}
              control={control}
              render={({field: {value, onChange}}) => (
                <Form.Item label="躺赚佣金（元）">
                  <Input placeholder="请输入躺赚佣金" type="number" value={value} onChange={onChange} />
                </Form.Item>
              )}
            />
            {!!contractDetail?.skuInfoReq?.openSkuStock && (
              <Controller
                name={`skuList.[${index}].skuStock`}
                control={control}
                render={({field: {value, onChange}}) => (
                  <Form.Item label="套餐库存">
                    <Input placeholder="请输入套餐库存" type="number" value={value} onChange={onChange} />
                  </Form.Item>
                )}
              />
            )}
            <Form.Item label="购买上限">
              <SelfText value={getBuyLimitStr(contractDetail?.skuInfoReq?.skuInfo[index].buyLimitType, contractDetail?.skuInfoReq?.skuInfo[index].buyLimitType)} />
            </Form.Item>

            <List control={control} next={index} />
          </SectionGroup>
        );
      })}
      {/* 组合套餐 */}
      <Controller control={control} name="packageList" render={({field: {value}}) => <PackList value={value} />} />
      {/* {packList.map((pack, index) => {
        return (
          <SectionGroup key={index} style={styles.sectionGroupStyle}>
            <FormTitle title={`组合套餐${index + 1}`} />

            <SwipeAction
              right={[
                {
                  text: '编辑',
                  color: 'white',
                  backgroundColor: globalStyleVariables.COLOR_PRIMARY,
                  onPress: () => packSKU(index),
                },
                {
                  text: '删除',
                  color: 'white',
                  backgroundColor: globalStyleVariables.COLOR_DANGER,
                  onPress: () => deletePack(index),
                },
              ]}>
              <View style={{padding: 10}}>
                <View>
                  <Text style={globalStyles.fontSecondary}>名称：{pack.packageName}</Text>
                </View>
                <View style={{paddingLeft: 20}}>
                  {pack.skus.map((sku, index) => {
                    const foundSKU = findItem(skuList, item => item.skuId === sku.skuId);
                    return (
                      <View key={index}>
                        <Text style={globalStyles.fontTertiary}>{`${foundSKU?.skuName || sku._skuName} * ${sku.nums}`}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </SwipeAction>
          </SectionGroup>
        );
      })} */}

      <SectionGroup style={[{paddingVertical: 10, backgroundColor: '#fff'}]}>
        <PlusButton style={[globalStyles.containerCenter]} onPress={() => setIsShowPackageModal(true)} title="组合现有套餐" />
      </SectionGroup>

      <Modal title="组合套餐" visible={isShowPackageModal} onOk={onSubmitPack} onClose={() => setIsShowPackageModal(false)}>
        <Controller
          control={packListForm.control}
          name="packageName"
          render={({field: {value, onChange}}) => (
            <Form.Item label="组合套餐名称" vertical>
              <Input
                textAlign="left"
                value={value}
                onChange={onChange}
                styles={{container: {height: 40, paddingHorizontal: 15, margin: 0, borderRadius: 5, backgroundColor: '#0000000D'}}}
                placeholder="请输入组合套餐名称"
              />
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
                    control={packListForm.control}
                    render={({field: {value, onChange}}) => (
                      <Form.Item noStyle valueKey="checked">
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
          {/* {skuInfo.map((sku, index) => {
            return (
              <View key={index} style={[{marginBottom: 10}]}>
                <Controller
                  name={`skus[${index}].selected`}
                  control={packListForm.control}
                  render={({field: {value, onChange}}) => (
                    <Form.Item noStyle valueKey="checked">
                      <Checkbox checked={value} onChange={onChange}>
                        {sku.skuName}
                      </Checkbox>
                    </Form.Item>
                  )}
                />
                <View style={[globalStyles.containerLR, {paddingLeft: 20}]}>
                  <Controller
                    name={`skus[${index}].nums`}
                    control={packListForm.control}
                    render={({field: {value, onChange}}) => (
                      <Form.Item noStyle name={`skus[${index}].nums`} label="数量">
                        <Stepper value={value} onChange={onChange} styles={stepperStyle} step={1} min={2} />
                      </Form.Item>
                    )}
                  />
                </View>
              </View>
            );
          })} */}
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
