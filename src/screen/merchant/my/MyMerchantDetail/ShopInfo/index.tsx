import React, {useEffect} from 'react';
import {View, StyleSheet, ScrollView, useWindowDimensions, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Cascader, Form, FormTitle, Input, SectionGroup, Select, SelfText} from '../../../../../component';
import {globalStyles, globalStyleVariables} from '../../../../../constants/styles';
import {useMerchantDispatcher} from '../../../../../helper/hooks';
import {FormMerchant, MerchantFormEnum, MerchantType, BoolEnum, FakeNavigation, MerchantAgentType} from '../../../../../models'; // FormMerchant
import {useForm, Controller, useFieldArray} from 'react-hook-form';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../redux/reducers';
import Upload from '../../../../../component/Form/Upload';
import {useRequest} from 'ahooks';
import * as api from '../../../../../apis';
import LinkButton from '../../../../../component/LinkButton';
import {useNavigation} from '@react-navigation/native';
import {useLoadAllSite, useLoadCity} from '../../../../../helper/hooks/common';
import {getSitesIndex} from '../../../../../helper/util';
import {FormDisabledContext} from '../../../../../component/Form/Context';

interface ShopInfoProps {
  id: number;
  locationCompanyId?: number;
}
const AddMerchant: React.FC<ShopInfoProps> = ({id, locationCompanyId}) => {
  const [cityList] = useLoadCity();
  const [sites] = useLoadAllSite();
  const {control, setValue, watch, getValues} = useForm<FormMerchant>({
    mode: 'onBlur',
  });
  const legalAuthType = watch('legalAuthType');
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
        const res = getSitesIndex(sites, locationCompanyId);
        setValue('areaInfo', res as any);
      }
    }
  }, [sites, locationCompanyId, setValue, cityList?.length]);

  useEffect(() => {
    if (id) {
      //??????????????????
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
  //????????????
  const handleClickShop = (index: number) => {
    const {shopList} = getValues();
    const item = shopList.find((item, idx) => idx === index);
    navigation.navigate({
      name: 'ShopDetail',
      params: {shopDetail: item, id: id},
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FormDisabledContext.Provider value={{disabled: true}}>
        <ScrollView>
          <View style={styles.container}>
            <ScrollView style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}} horizontal snapToInterval={windowWidth} scrollEnabled={false}>
              <View style={{width: windowWidth}}>
                <SectionGroup style={styles.sectionGroup}>
                  <FormTitle title="????????????" />
                  <Controller
                    control={control}
                    name="avatar"
                    rules={{required: true}}
                    render={({field}) => (
                      <Form.Item label="??????LOGO" horizontal desc="??????300px*300px jpg/png/gif">
                        <Upload maxCount={1} value={field.value} onChange={field.onChange} />
                      </Form.Item>
                    )}
                  />
                  <Controller
                    control={control}
                    name="name"
                    rules={{required: true}}
                    render={({field: {value}}) => (
                      <Form.Item label="????????????">
                        <SelfText value={value} />
                      </Form.Item>
                    )}
                  />

                  {data?.length && (
                    <Controller
                      control={control}
                      name="categoryId"
                      render={({field}) => (
                        <Form.Item label="????????????">
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
                      <Form.Item label="????????????">
                        <Select
                          disabled
                          value={field.value}
                          onChange={field.onChange}
                          options={[
                            {value: BoolEnum.FALSE, label: '??????'},
                            {value: BoolEnum.TRUE, label: '??????'},
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
                      <Form.Item label="????????????">
                        <Select
                          disabled
                          value={field.value}
                          onChange={field.onChange}
                          options={[
                            {value: MerchantType.ENTERPRISE, label: '??????'},
                            {value: MerchantType.INDIVIDUAL, label: '???????????????'},
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
                        <Form.Item label="????????????">
                          <Cascader disabled value={field.value} onChange={field.onChange} options={cityList} placeholder="?????????" />
                        </Form.Item>
                      )}
                    />
                  )}
                  <Controller
                    control={control}
                    name="address"
                    rules={{required: true, maxLength: 100}}
                    render={({field}) => (
                      <Form.Item label="????????????">
                        <SelfText value={field.value} />
                      </Form.Item>
                    )}
                  />
                </SectionGroup>

                <SectionGroup style={styles.sectionGroup}>
                  <FormTitle title="????????????" />
                  <Controller
                    name="businessName"
                    control={control}
                    render={({field: {value}}) => (
                      <Form.Item label="??????????????????">
                        <SelfText value={value} />
                      </Form.Item>
                    )}
                  />
                  <Controller
                    name="enterpriseUsci"
                    control={control}
                    render={({field}) => (
                      <Form.Item label="????????????????????????">
                        <SelfText value={field.value} />
                      </Form.Item>
                    )}
                  />
                  <Controller
                    name="legalAuthType"
                    control={control}
                    defaultValue={MerchantAgentType.LEGAL}
                    render={({field}) => (
                      <Form.Item label="????????????">
                        <Select
                          value={field.value}
                          options={[
                            {label: '??????', value: MerchantAgentType.LEGAL},
                            {label: ' ?????????', value: MerchantAgentType.AGENT},
                          ]}
                          onChange={field.onChange}
                        />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="legalPhone"
                    control={control}
                    rules={{
                      validate: e => {
                        if (e?.length < 11) {
                          return '???????????????????????????';
                        }
                      },
                    }}
                    render={({field}) => (
                      <Form.Item label={`${legalAuthType === MerchantAgentType.LEGAL ? '??????' : '?????????'}?????????`}>
                        <Input value={field.value} onChange={field.onChange} />
                      </Form.Item>
                    )}
                  />
                  <Controller
                    name="legalName"
                    control={control}
                    render={({field}) => (
                      <Form.Item label={`${legalAuthType === MerchantAgentType.LEGAL ? '??????' : '?????????'}??????`}>
                        <Input value={field.value} onChange={field.onChange} />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="legalNumber"
                    control={control}
                    rules={{
                      validate: e => {
                        if (e?.length < 18) {
                          return '?????????????????????????????????';
                        }
                        return true;
                      },
                    }}
                    render={({field}) => (
                      <Form.Item label={`${legalAuthType === MerchantAgentType.LEGAL ? '??????' : '?????????'}?????????`}>
                        <Input value={field.value} onChange={field.onChange} />
                      </Form.Item>
                    )}
                  />
                  <Controller
                    name="businessLicense"
                    control={control}
                    render={({field}) => (
                      <Form.Item label="????????????" horizontal>
                        <Upload maxCount={1} value={field.value} onChange={field.onChange} />
                      </Form.Item>
                    )}
                  />
                </SectionGroup>
              </View>
            </ScrollView>
            <SectionGroup style={styles.sectionGroup}>
              <FormTitle title="????????????" style={{height: 40, alignItems: 'center'}} />
              {fields.map((item, index) => {
                if (index > 2) {
                  return null;
                }
                return (
                  <View key={item.id}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => handleClickShop(index)}>
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
                    </TouchableOpacity>
                    {index >= 2 && (
                      <View style={[globalStyles.borderTop]}>
                        <LinkButton
                          title="????????????"
                          onPress={() => {
                            navigation.navigate({
                              name: 'ShopList',
                              params: {
                                id: id,
                              },
                            });
                          }}
                        />
                      </View>
                    )}
                  </View>
                );
              })}
            </SectionGroup>
          </View>

          <View style={[globalStyles.containerCenter, {margin: globalStyleVariables.MODULE_SPACE}]}>
            <Text style={globalStyles.fontTertiary}>???????????????</Text>
          </View>
        </ScrollView>
      </FormDisabledContext.Provider>
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
