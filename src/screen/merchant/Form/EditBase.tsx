// 基础信息
import {useRequest} from 'ahooks';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BoolEnum, FormSetValue} from '../../../models/common';
import {SectionGroup, FormTitle, Form, Input, Select, PlusButton, Cascader, SelfText} from '../../../component';
import * as api from '../../../apis';
import {MerchantCreateType, MerchantType, FormControlC, FormErrors, FormMerchant, ShopForm} from '../../../models';
import Upload from '../../../component/Form/Upload';
import {useLoadCity} from '../../../helper/hooks';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import EditShop from './EditShop';
import {Control, useFieldArray, useForm, UseFormGetValues} from 'react-hook-form';
import {useSelector} from 'react-redux';
import {ErrorMessage} from '@hookform/error-message';
import {RootState} from '../../../redux/reducers';
import {Icon, SwipeAction} from '@ant-design/react-native';
import {useLoadAllSite} from '../../../helper/hooks/common';
import {getSitesIndex} from '../../../helper/util';

interface EditBaseProps {
  type: MerchantCreateType; //用户的身份，公海还是私海
  control: Control<FormMerchant, any>;
  Controller: FormControlC;
  errors: FormErrors;
  setValue: FormSetValue;
  isHidden: boolean;
  locationCompanyId?: number;
  getValues?: UseFormGetValues<FormMerchant>;
}

const EditBase: React.FC<EditBaseProps> = ({Controller, control, setValue, getValues, isHidden, errors, locationCompanyId}) => {
  const {cityList} = useLoadCity();
  const [modalIsShow, setModalIsShow] = useState(false);
  const [editShopIndex, setEditShopIndex] = useState(-1);
  const [sites] = useLoadAllSite();
  const categoryId = useSelector<RootState, number>(state => state.merchant.currentMerchant?.categoryId);
  const shopListForm = useForm({
    mode: 'onBlur',
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'shopList',
  });

  useEffect(() => {
    if (sites?.length > 0 && cityList?.length) {
      if (locationCompanyId > 0) {
        const res = getSitesIndex(sites, locationCompanyId);
        setValue('areaInfo', res);
      }
    }
  }, [sites, locationCompanyId, setValue, cityList?.length]);

  //商家类型
  const {data} = useRequest(async () => {
    const res = await api.merchant.getMerchantCategories();

    const category = res.map(item => ({
      value: item.id,
      label: item.name,
    }));
    return category;
  });

  useEffect(() => {
    if (data?.length > 0) {
      setValue('categoryId', categoryId);
    }
  }, [categoryId, data, setValue]);

  //编辑店铺
  const editShopList = (index: number) => {
    setEditShopIndex(index);
    const {shopList} = getValues();
    const item = shopList.find((item, idx) => idx === index);
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const index = key as keyof ShopForm;
        const element = item[index];
        shopListForm.setValue(index, element);
      }
    }
    setModalIsShow(true);
  };

  return (
    <>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="基本信息" />
        <Controller
          control={control}
          name="avatar"
          render={({field}) => (
            <Form.Item label="商家LOGO" horizontal desc="大于300px*300px jpg/png/gif">
              <Upload maxCount={1} value={field.value} onChange={field.onChange} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="name"
          rules={{required: '请输入商家名称'}}
          render={({field}) => (
            <Form.Item label="商家名称">
              <Input placeholder="请输入商家名称" value={field.value} onChange={field.onChange} />
              <Text style={globalStyles.error}>
                <ErrorMessage name={'name'} errors={errors} />
              </Text>
            </Form.Item>
          )}
        />

        <Controller
          control={control}
          name="categoryId"
          rules={{required: '请选择商家行业'}}
          render={({field}) => (
            <Form.Item label="商家行业">
              <Select options={data || []} value={field.value} onChange={field.onChange} />
              <Text style={globalStyles.error}>
                <ErrorMessage name={'categoryId'} errors={errors} />
              </Text>
            </Form.Item>
          )}
        />

        <Controller
          control={control}
          name="multiStore"
          defaultValue={BoolEnum.FALSE}
          render={({field}) => (
            <Form.Item label="商家模式">
              <Select
                value={field.value}
                onChange={field.onChange}
                options={[
                  {value: BoolEnum.FALSE, label: '单店'},
                  {value: BoolEnum.TRUE, label: '多店'},
                ]}
              />
            </Form.Item>
          )}
        />

        <Controller
          control={control}
          name="businessType"
          defaultValue={MerchantType.ENTERPRISE}
          render={({field}) => (
            <Form.Item label="商家类型">
              <Select
                value={field.value}
                onChange={field.onChange}
                options={[
                  {value: MerchantType.ENTERPRISE, label: '企业'},
                  {value: MerchantType.INDIVIDUAL, label: '个体工商户'},
                ]}
              />
            </Form.Item>
          )}
        />
        {cityList?.length && (
          <Controller
            control={control}
            name="areaInfo"
            rules={{required: '请输入商家城市'}}
            render={({field}) => (
              <Form.Item label="商家城市">
                <Cascader value={field.value} onChange={field.onChange} options={cityList} placeholder="请输入" />
                <Text style={globalStyles.error}>
                  <ErrorMessage name={'areaInfo'} errors={errors} />
                </Text>
              </Form.Item>
            )}
          />
        )}

        <Controller
          control={control}
          name="address"
          rules={{required: '请输入商家地址'}}
          render={({field}) => (
            <Form.Item label="商家地址">
              <Input placeholder="请输入商家地址" onChange={field.onChange} value={field.value} />
              <Text style={globalStyles.error}>
                <ErrorMessage name={'address'} errors={errors} />
              </Text>
            </Form.Item>
          )}
        />

        {isHidden ? (
          <>
            <FormTitle
              title="店铺信息"
              style={{height: 40, alignItems: 'center'}}
              headerRight={
                <PlusButton
                  title="新增店铺"
                  onPress={() => {
                    setModalIsShow(true);
                  }}
                />
              }
            />
            {fields.map((item, index) => {
              return (
                <View key={item.id} style={styles.shop}>
                  <SwipeAction
                    right={[
                      {
                        text: '修改',
                        color: 'white',

                        backgroundColor: globalStyleVariables.COLOR_PRIMARY,
                        onPress: () => {
                          editShopList(index);
                        },
                      },
                      {
                        text: '删除',
                        color: 'white',

                        backgroundColor: globalStyleVariables.COLOR_ERROR,
                        onPress: () => remove(index),
                      },
                    ]}>
                    <Controller
                      control={control}
                      name={`shopList.${index}.shopName`}
                      render={({field: {value}}) => <SelfText value={value} style={[globalStyles.fontPrimary, globalStyles.borderBottom]} />}
                    />
                    <Controller
                      control={control}
                      name={`shopList.${index}.addressDetail`}
                      render={({field: {value}}) => <SelfText value={value} style={globalStyles.fontTertiary} />}
                    />
                    <Controller
                      control={control}
                      name={`shopList.${index}.contactPhone`}
                      render={({field: {value}}) => <SelfText value={value} style={globalStyles.fontTertiary} />}
                    />
                  </SwipeAction>
                </View>
              );
            })}
          </>
        ) : (
          <SectionGroup style={[styles.sectionGroup, styles.tabs]}>
            <Icon style={{color: globalStyleVariables.COLOR_PRIMARY}} name="lock" />
            <Text style={{color: globalStyleVariables.COLOR_PRIMARY}}>认领后可见</Text>
          </SectionGroup>
        )}

        <EditShop
          shopListForm={shopListForm}
          setEditShopIndex={setEditShopIndex}
          setValue={setValue}
          getValues={getValues}
          editShopIndex={editShopIndex}
          open={modalIsShow}
          setOpen={setModalIsShow}
          append={append}
        />
      </SectionGroup>
    </>
  );
};

export default EditBase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionGroup: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingTop: 13,
  },
  shop: {
    margin: globalStyleVariables.MODULE_SPACE,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: globalStyleVariables.MODULE_SPACE,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: globalStyleVariables.MODULE_SPACE,
  },
});
