import React, {useEffect} from 'react';
import {View, StyleSheet, ScrollView, useWindowDimensions, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Cascader, Form, FormTitle, SectionGroup, Select, SelfText} from '../../../../../component';
import {globalStyles, globalStyleVariables} from '../../../../../constants/styles';
import {useMerchantDispatcher, useLoadCity} from '../../../../../helper/hooks';
import {FormMerchant, MerchantFormEnum, MerchantType, BoolEnum, FakeNavigation} from '../../../../../models'; // FormMerchant
import {useForm, Controller, useFieldArray} from 'react-hook-form';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../redux/reducers';
import Upload from '../../../../../component/Form/Upload';
import {useRequest} from 'ahooks';
import * as api from '../../../../../apis';
import LinkButton from '../../../../../component/LinkButton';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useLoadAllSite} from '../../../../../helper/hooks/common';

interface ShopInfoProps {
  id: number;
  locationCompanyId?: number;
}
const AddMerchant: React.FC<ShopInfoProps> = ({id, locationCompanyId}) => {
  const {cityList} = useLoadCity();
  const [sites] = useLoadAllSite();
  const {control, setValue} = useForm<FormMerchant>({
    mode: 'onBlur',
  });
  const [merchantDispatcher] = useMerchantDispatcher();
  const navigation = useNavigation() as FakeNavigation;
  const {width: windowWidth} = useWindowDimensions();

  const merchantDetail = useSelector<RootState, FormMerchant>(state => state.merchant.currentMerchant);
  const {fields} = useFieldArray({
    control,
    name: 'shopList',
  });
  const {data} = useRequest(async () => {
    const res = await api.merchant.getMerchantCategories();

    const category = res.map(item => ({
      value: item.id,
      label: item.name,
    }));
    return category;
  });

  useEffect(() => {
    if (sites?.length > 0 && cityList?.length) {
      if (locationCompanyId > 0) {
        for (let i = 0; i < sites.length; i++) {
          for (let j = 0; j < sites[i].children.length; j++) {
            for (let k = 0; k < sites[i].children[j].children.length; k++) {
              if (sites[i].children[j].children[k].id === locationCompanyId) {
                setValue('areaInfo', [sites[i].id, sites[i].children[j].id, locationCompanyId]);
                break;
              }
            }
          }
        }
      }
    }
  }, [sites, locationCompanyId, setValue, cityList?.length]);

  useEffect(() => {
    if (id) {
      //获取私海数据
      merchantDispatcher.loadCurrentMerchantPrivate(id);
    }
    return () => {
      merchantDispatcher.exitMerchantPage();
    };
  }, [merchantDispatcher, id]);

  useEffect(() => {
    if (merchantDetail) {
      const keys = Object.keys(merchantDetail) as MerchantFormEnum[];
      keys.forEach(key => {
        setValue(key, merchantDetail[key]);
      });
    }
  }, [merchantDetail, setValue]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        <View style={styles.container}>
          <ScrollView style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}} horizontal snapToInterval={windowWidth} scrollEnabled={false}>
            <View style={{width: windowWidth}}>
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
                  render={({field: {value}}) => (
                    <Form.Item label="商家名称">
                      <SelfText value={value} />
                    </Form.Item>
                  )}
                />

                {data?.length && (
                  <Controller
                    control={control}
                    name="categoryId"
                    render={({field}) => (
                      <Form.Item label="商家行业">
                        <Select disabled options={data} value={field.value} onChange={field.onChange} />
                      </Form.Item>
                    )}
                  />
                )}

                <Controller
                  control={control}
                  name="multiStore"
                  defaultValue={BoolEnum.FALSE}
                  render={({field}) => (
                    <Form.Item label="商家模式">
                      <Select
                        disabled
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
                        disabled
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
                    rules={{required: true}}
                    render={({field}) => (
                      <Form.Item label="商家城市">
                        <Cascader disabled value={field.value} onChange={field.onChange} options={cityList} placeholder="请输入" />
                      </Form.Item>
                    )}
                  />
                )}
                <Controller
                  control={control}
                  name="address"
                  rules={{required: true, maxLength: 100}}
                  render={({field}) => (
                    <Form.Item label="商家地址">
                      <SelfText value={field.value} />
                    </Form.Item>
                  )}
                />
              </SectionGroup>

              <SectionGroup style={styles.sectionGroup}>
                <FormTitle title="基本信息" />
                <Controller
                  name="businessName"
                  control={control}
                  render={({field: {value}}) => (
                    <Form.Item label="商家主体名称">
                      <SelfText value={value} />
                    </Form.Item>
                  )}
                />
                <Controller
                  name="enterpriseUsci"
                  control={control}
                  render={({field}) => (
                    <Form.Item label="统一社会信用代码">
                      <SelfText value={field.value} />
                    </Form.Item>
                  )}
                />

                <Controller
                  name="legalPhone"
                  control={control}
                  render={({field: {value}}) => (
                    <Form.Item label="法人">
                      <SelfText value={value} />
                    </Form.Item>
                  )}
                />
                <Controller
                  name="legalName"
                  control={control}
                  render={({field: {value}}) => (
                    <Form.Item label={'法人'}>
                      <SelfText value={value} />
                    </Form.Item>
                  )}
                />

                <Controller
                  name="legalNumber"
                  control={control}
                  render={({field: {value}}) => (
                    <Form.Item label={'法人'}>
                      <SelfText value={value} />
                    </Form.Item>
                  )}
                />
                <Controller
                  name="businessLicense"
                  control={control}
                  render={({field}) => (
                    <Form.Item label="营业执照" horizontal>
                      <Upload maxCount={1} value={field.value} onChange={field.onChange} />
                    </Form.Item>
                  )}
                />
              </SectionGroup>
            </View>
          </ScrollView>
          <SectionGroup style={styles.sectionGroup}>
            <FormTitle title="店铺信息" style={{height: 40, alignItems: 'center'}} />
            {fields.map((item, index) => {
              if (index > 2) {
                return null;
              }
              return (
                <View key={item.id}>
                  <View style={styles.shop}>
                    <Controller
                      control={control}
                      name={`shopList.${index}.shopName`}
                      render={({field: {value}}) => (
                        <View style={[globalStyles.borderBottom, {paddingBottom: 10}]}>
                          <SelfText value={value} style={[globalStyles.fontPrimary, globalStyles.borderBottom]} />
                        </View>
                      )}
                    />
                    <Controller
                      control={control}
                      name={`shopList.${index}.addressDetail`}
                      render={({field: {value}}) => <SelfText value={value} style={[globalStyles.fontTertiary, globalStyles.moduleMarginTop]} />}
                    />
                    <Controller
                      control={control}
                      name={`shopList.${index}.contactPhone`}
                      render={({field: {value}}) => <SelfText value={value} style={globalStyles.fontTertiary} />}
                    />
                  </View>
                  {index === 2 && (
                    <View style={[globalStyles.borderTop]}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() =>
                          navigation.navigate({
                            name: 'ShopList',
                            params: {
                              id: id,
                            },
                          })
                        }>
                        <LinkButton title="查看更多" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </SectionGroup>
        </View>

        <View style={[globalStyles.containerCenter, {margin: globalStyleVariables.MODULE_SPACE}]}>
          <Text style={globalStyles.fontTertiary}>已经到底了</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default AddMerchant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionGroup: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingTop: 13,
  },
  privateView: {
    margin: 10,
    flexDirection: 'row',
  },
  shop: {
    margin: globalStyleVariables.MODULE_SPACE,
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
