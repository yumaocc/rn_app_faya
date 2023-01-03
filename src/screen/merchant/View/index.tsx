import {Button, Icon} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, useWindowDimensions, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Cascader, Form, FormTitle, Input, NavigationBar, SectionGroup, Select, SelfText} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useParams, useCommonDispatcher, useMerchantDispatcher, useLoadCity} from '../../../helper/hooks';
import {MerchantCreateType, MerchantAction, FormMerchant, MerchantFormEnum, MerchantType, BoolEnum, RequestAction} from '../../../models'; // FormMerchant
import {useForm, Controller, useFieldArray} from 'react-hook-form';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import Loading from '../../../component/Loading';
import Upload from '../../../component/Form/Upload';
import {useRequest} from 'ahooks';
import * as api from '../../../apis';
import ModalDropdown from 'react-native-modal-dropdown';
import {PAGE_SIZE} from '../../../constants';
// add 新增  edit 编辑 view 查看
// 当id === MerchantCreateType.PRIVATE_SEA, 并且 action === view的时候不能编辑
// 当id === MerchantCreateType.PRIVATE_SEA, 并且 action === edit 或者add的时候可以编辑

const AddMerchant: React.FC = () => {
  const {cityList} = useLoadCity();
  const {control, setValue} = useForm<FormMerchant>({
    mode: 'onBlur',
  });
  const [loading, setLoading] = useState(false);
  const {privateId} = useParams<{identity: MerchantCreateType; action: MerchantAction; publicId: number; privateId: number}>();
  const [commonDispatcher] = useCommonDispatcher();
  const [merchantDispatcher] = useMerchantDispatcher();

  const {width: windowWidth} = useWindowDimensions();

  const merchantDetail = useSelector<RootState, FormMerchant>(state => state.merchant.currentMerchant);
  const {fields} = useFieldArray({
    control,
    name: 'shopList',
  });

  const navigation = useNavigation();
  const {data} = useRequest(async () => {
    const res = await api.merchant.getMerchantCategories();

    const category = res.map(item => ({
      value: item.id,
      label: item.name,
    }));
    return category;
  });

  useEffect(() => {
    if (privateId) {
      //获取私海数据
      merchantDispatcher.loadCurrentMerchantPrivate(privateId);
    }
    return () => {
      merchantDispatcher.exitMerchantPage();
    };
  }, [merchantDispatcher, privateId]);

  useEffect(() => {
    if (merchantDetail) {
      const keys = Object.keys(merchantDetail) as MerchantFormEnum[];
      keys.forEach(key => {
        setValue(key, merchantDetail[key]);
      });
    }
  }, [merchantDetail, setValue]);

  const handleEdit = async () => {
    setLoading(true);
    try {
      await api.merchant.returnPublic(merchantDetail.id);
      setLoading(false);
      merchantDispatcher.loadPrivateMerchantList({pageIndex: 1, pageSize: PAGE_SIZE, action: RequestAction.other});
      merchantDispatcher.loadPublicMerchantList({pageIndex: 1, pageSize: PAGE_SIZE, action: RequestAction.other});
      commonDispatcher.success('归还成功');
      navigation.goBack();
    } catch (error) {
      commonDispatcher.error(error || '归还失败');
    }
  };

  return (
    <>
      <Loading active={loading} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView>
          <NavigationBar
            title={merchantDetail?.name}
            headerRight={
              <ModalDropdown
                dropdownStyle={[globalStyles.dropDownItem, {height: 40, width: 90}]}
                renderRow={item => (
                  <View style={[globalStyles.dropDownText, {width: '100%'}]}>
                    <Text>{item.label}</Text>
                  </View>
                )}
                options={[{label: '归还公海', value: 1}]}
                onSelect={() => {
                  handleEdit();
                }}>
                <Icon name="ellipsis" size={26} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
              </ModalDropdown>
            }
          />
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
                    render={({field}) => (
                      <Form.Item label="商家名称">
                        <Input placeholder="请输入商家名称" value={field.value} onChange={field.onChange} />
                      </Form.Item>
                    )}
                  />

                  {data?.length && (
                    <Controller
                      control={control}
                      name="categoryId"
                      render={({field}) => (
                        <Form.Item label="商家行业">
                          <Select options={data} value={field.value} onChange={field.onChange} />
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
                      rules={{required: true}}
                      render={({field}) => (
                        <Form.Item label="商家城市">
                          <Cascader value={field.value} onChange={field.onChange} options={cityList} placeholder="请输入" />
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
                  <FormTitle title="店铺信息" style={{height: 40, alignItems: 'center'}} />
                  {fields.map((item, index) => {
                    return (
                      <View key={item.id} style={styles.shop}>
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
                      </View>
                    );
                  })}
                </SectionGroup>
                <SectionGroup style={styles.sectionGroup}>
                  <FormTitle title="基本信息" />
                  <Controller
                    name="businessName"
                    control={control}
                    render={({field}) => (
                      <Form.Item label="商家主体名称">
                        <Input placeholder="请输入" {...field} />
                      </Form.Item>
                    )}
                  />
                  <Controller
                    name="enterpriseUsci"
                    control={control}
                    render={({field}) => (
                      <Form.Item label="统一社会信用代码">
                        <Input placeholder="请输入" value={field.value} onChange={field.onChange} />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="legalPhone"
                    control={control}
                    render={({field}) => (
                      <Form.Item label="法人">
                        <Input {...field} />
                      </Form.Item>
                    )}
                  />
                  <Controller
                    name="legalName"
                    control={control}
                    render={({field}) => (
                      <Form.Item label={'法人'}>
                        <Input {...field} />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="legalNumber"
                    control={control}
                    render={({field}) => (
                      <Form.Item label={'法人'}>
                        <Input {...field} />
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
                <Button
                  style={{margin: 10}}
                  type="primary"
                  onPress={() =>
                    navigation.navigate({
                      name: 'AddContract',
                      params: {
                        id: merchantDetail.id,
                      },
                    })
                  }>
                  邀请结算
                </Button>
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
