// 基础信息
import {useRequest} from 'ahooks';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BoolEnum, FormSetValue} from '../../../models/common';
import {SectionGroup, FormTitle, Form, Input, Select, PlusButton, Cascader, SelfText} from '../../../component';
import * as api from '../../../apis';
import {MerchantCreateType, MerchantType, FormControlC, FormErrors, FormMerchant} from '../../../models';
import Upload from '../../../component/Form/Upload';
import {useLoadCity} from '../../../helper/hooks';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import EditShop from './EditShop';
import {Control, useFieldArray} from 'react-hook-form';
interface EditBaseProps {
  type: MerchantCreateType; //用户的身份，公海还是私海
  control: Control<FormMerchant, any>;
  Controller: FormControlC;
  errors: FormErrors;
  setValue: FormSetValue;
}

const EditBase: React.FC<EditBaseProps> = ({Controller, control, errors}) => {
  const {cityList} = useLoadCity();
  const [modalIsShow, setModalIsShow] = useState(false);
  const {fields, append} = useFieldArray({
    control,
    name: 'shopList',
  });
  const {data} = useRequest(async () => {
    const res = await api.merchant.getMerchantCategories();

    const category = res.map(item => ({
      value: item.id,
      label: item.name,
    }));
    return Promise.resolve(category);
  });
  return (
    <>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="基本信息" />

        <Controller
          control={control}
          name="avatar"
          rules={{required: true}}
          render={({field}) => (
            <Form.Item label="商家LOGO" horizontal desc="大于300px*300px jpg/png/gif">
              <Upload maxCount={1} value={field.value} onChange={field.onChange} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="name"
          rules={{required: true}}
          render={({field}) => (
            <Form.Item label="商家名称">
              <Input placeholder="请输入商家名称" value={field.value} onChange={field.onChange} />
            </Form.Item>
          )}
        />

        <Controller
          control={control}
          name="categoryId"
          defaultValue={BoolEnum.FALSE}
          render={({field}) => (
            <Form.Item label="商家行业" name="categoryId">
              <Select options={data || []} value={field.value} onChange={field.onChange} />
            </Form.Item>
          )}
        />

        <Controller
          control={control}
          name="multiStore"
          defaultValue={BoolEnum.FALSE}
          render={({field}) => (
            <Form.Item label="商家模式" name="multiStore">
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

        <Controller
          control={control}
          name="areaInfo"
          rules={{required: true}}
          render={({field}) => (
            <Form.Item label="商家城市">
              <Cascader value={field.value} onChange={field.onChange} options={cityList || []} placeholder="请输入" />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="locationWithCompanyId"
          rules={{required: true}}
          render={({field}) => (
            <Form.Item label="站点">
              <Cascader options={cityList || []} placeholder="请输入" value={field.value} onChange={field.onChange} />
            </Form.Item>
          )}
        />

        <Controller
          control={control}
          name="address"
          rules={{required: true, maxLength: 100}}
          render={({field}) => (
            <Form.Item label="商家地址">
              <Input placeholder="请输入商家地址" onChange={field.onChange} value={field.value} onBlur={field.onBlur} />
              {errors.address && <Text style={globalStyles.error}>请输入商家地址</Text>}
            </Form.Item>
          )}
        />
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
              <Controller
                control={control}
                name={`shopList.${index}.shopName`}
                render={({field: {value}}) => <SelfText value={value} style={[globalStyles.fontPrimary, globalStyles.borderBottom]} />}
              />
              <Controller control={control} name={`shopList.${index}.addressDetail`} render={({field: {value}}) => <SelfText value={value} style={globalStyles.fontTertiary} />} />
              <Controller control={control} name={`shopList.${index}.contactPhone`} render={({field: {value}}) => <SelfText value={value} style={globalStyles.fontTertiary} />} />
            </View>
          );
        })}
        <EditShop open={modalIsShow} setOpen={setModalIsShow} setValue={append} />
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
});
