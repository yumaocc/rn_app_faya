import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {Stepper, SwipeAction} from '@ant-design/react-native';

import {Checkbox, Form, FormTitle, Input, Modal, PlusButton, SectionGroup} from '../../../../component';
import {globalStyles, globalStyleVariables} from '../../../../constants/styles';
import {convertNumber2Han, getBuyLimitStr, getItemByIndex} from '../../../../helper';
import {BoolEnum, PackagedSKU, PackagedSKUForm, PackagedSKUItem, SKU} from '../../../../models';
import {RootState} from '../../../../redux/reducers';
import {styles} from '../style';

const SKUList: React.FC = () => {
  const [isShowPackageModal, setIsShowPackageModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number>(-1); // 用索引标识当前正在编辑的组合套餐

  const contractDetail = useSelector((state: RootState) => state.contract.currentContract);

  const form = Form.useFormInstance();
  const [packForm] = Form.useForm();

  const packFormSkuList = useMemo<PackagedSKUItem[]>(() => packForm.getFieldValue('skus') || [], [packForm]);

  const skuList = useMemo<SKU[]>(() => form.getFieldValue('skuList') || [], [form]);
  const packList = useMemo<PackagedSKU[]>(() => form.getFieldValue('packageList') || [], [form]);

  function deletePack(index: number) {
    const newPackList = [...packList];
    newPackList.splice(index, 1);
    form.setFieldsValue({packageList: newPackList});
  }

  // 编辑或者新增组合套餐
  function packSKU(index?: number) {
    setEditIndex(-1);
    let initValue: PackagedSKUForm;
    const skuList = contractDetail?.skuInfoReq?.skuInfo || [];
    if (index !== undefined) {
      setEditIndex(index);
      const pack: PackagedSKU = getItemByIndex(form.getFieldValue('packageList'), index);
      if (pack) {
        const packSKUs = pack.skus || [];
        initValue = {
          ...pack,
          skus: skuList.map(sku => {
            const originPack = packSKUs.find(e => e.contractSkuId === sku.contractSkuId);
            return {
              _skuName: sku.skuName,
              _selected: !!originPack,
              nums: originPack?.nums || 1,
              contractSkuId: sku.contractSkuId,
            };
          }),
        };
      }
    }
    if (!initValue) {
      // 新增，从skuList构造初始值
      initValue = {
        packageName: '',
        show: BoolEnum.TRUE,
        skus: skuList.map(sku => ({
          _skuName: sku.skuName,
          _selected: false,
          nums: 1,
          contractSkuId: sku.contractSkuId,
        })),
      };
    }
    packForm.setFieldsValue(initValue);
    setIsShowPackageModal(true);
  }

  async function onSubmitPack() {
    // let valid = false;
    // todo: 校验表单有效性

    const packageFormData: PackagedSKU = packForm.getFieldsValue() as PackagedSKU;
    const packageItem: PackagedSKU = {
      ...packageFormData,
      skus: packageFormData.skus.filter(sku => sku._selected),
    };
    const originPackageList: PackagedSKU[] = form.getFieldValue('packageList');
    let newPackageList: PackagedSKU[] = [];
    if (editIndex === -1) {
      newPackageList = [...originPackageList, packageItem];
    } else {
      newPackageList = originPackageList.map((originPack, index) => {
        if (index === editIndex) {
          return packageItem;
        }
        return originPack;
      });
    }
    form.setFieldsValue({
      packageList: newPackageList,
    });
    console.log('onSubmitPack', newPackageList);
    // console.log(form.getFieldsValue());
    setIsShowPackageModal(false);
  }

  return (
    <View>
      {skuList.map((sku, index) => {
        return (
          <SectionGroup key={index} style={styles.sectionGroupStyle}>
            <FormTitle title={`套餐${convertNumber2Han(index + 1)}设置`} />
            <Form.Item label="套餐名称">
              <Text>{sku.skuName}</Text>
            </Form.Item>
            <Form.Item label="套餐结算价（元）">
              <Text>{sku._settlementPrice}</Text>
            </Form.Item>
            <Form.Item label="套餐原价（元）" name={`skuList.[${index}].originPrice`}>
              <Input placeholder="请输入套餐原价" type="number" />
            </Form.Item>
            <Form.Item label="套餐售价（元）" name={`skuList.[${index}].salePrice`}>
              <Input placeholder="请输入套餐售价" type="number" />
            </Form.Item>
            <Form.Item label="购买上限">
              <Text>{getBuyLimitStr(sku._buyLimitType, sku._buyLimitNum)}</Text>
            </Form.Item>
            <Form.Item
              label="套餐库存"
              name={`skuList.[${index}].skuStock`}
              desc={contractDetail?.skuInfoReq?.openSkuStock === BoolEnum.TRUE ? '' : `${sku._stock}份`}
              extra={
                <View style={[{borderRadius: 5, backgroundColor: '#00000008', padding: 10}]}>
                  <FormTitle style={{backgroundColor: 'transparent'}} title={`套餐${convertNumber2Han(index + 1)}内容`} />
                  {sku.list?.map((detail, index) => {
                    return (
                      <View style={[globalStyles.containerLR, {paddingVertical: 4}]} key={index}>
                        <Text>
                          {detail.nums}份{detail.name}
                        </Text>
                        <Text>{detail.price}元</Text>
                      </View>
                    );
                  })}
                </View>
              }>
              {contractDetail?.skuInfoReq?.openSkuStock === BoolEnum.TRUE ? <Text>共享套餐库存</Text> : <Input placeholder="请输入套餐库存" type="number" />}
            </Form.Item>
          </SectionGroup>
        );
      })}
      {packList.map((pack, index) => {
        return (
          <SectionGroup key={index} style={styles.sectionGroupStyle}>
            <FormTitle title={`组合套餐${convertNumber2Han(index + 1)}`} />

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
                    return (
                      <View key={index}>
                        <Text style={globalStyles.fontTertiary}>{`${sku._skuName} * ${sku.nums}`}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </SwipeAction>
          </SectionGroup>
        );
      })}

      <SectionGroup style={[{paddingVertical: 10, backgroundColor: '#fff'}]}>
        <PlusButton style={[globalStyles.containerCenter]} onPress={() => packSKU()} title="组合现有套餐" />
      </SectionGroup>

      <Modal title="组合套餐" visible={isShowPackageModal} onOk={onSubmitPack} onClose={() => setIsShowPackageModal(false)}>
        <Form form={packForm}>
          <Form.Item name="packageName" label="组合套餐名称" vertical>
            <Input
              textAlign="left"
              style={{}}
              styles={{container: {height: 40, paddingHorizontal: 15, margin: 0, borderRadius: 5, backgroundColor: '#0000000D'}}}
              placeholder="请输入组合套餐名称"
            />
          </Form.Item>
          <Form.Item label="选择套餐" vertical>
            {packFormSkuList.map((sku, index) => {
              return (
                <View key={index} style={[{marginBottom: 10}]}>
                  <Form.Item noStyle name={`skus[${index}]._selected`} valueKey="checked">
                    <Checkbox>{sku._skuName}</Checkbox>
                  </Form.Item>
                  {sku._selected && (
                    <View style={[globalStyles.containerLR, {paddingLeft: 20}]}>
                      <Text>数量</Text>
                      <Form.Item noStyle name={`skus[${index}].nums`}>
                        <Stepper styles={stepperStyle} step={1} min={1} />
                      </Form.Item>
                    </View>
                  )}
                </View>
              );
            })}
          </Form.Item>
        </Form>
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
