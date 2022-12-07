import {Button} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createMerchant} from '../../../apis/merchant';
import {Form, FormTitle, Input, NavigationBar, SectionGroup, Tabs, Select} from '../../../component';
import Upload from '../../../component/Form/Upload';
import {globalStyleVariables} from '../../../constants/styles';
import {useParams, useRefCallback, useCommonDispatcher} from '../../../helper/hooks';
import {MerchantCreateType, MerchantAgentType, MerchantAction, FormMerchant, FakeNavigation} from '../../../models';
import EditBase from '../Form/EditBase';

const tabs = [
  {title: '基础信息', key: 'base'},
  {title: '资质信息', key: 'qualification'},
];

// add 新增  edit 编辑 view 查看
// 当id === MerchantCreateType.PRIVATE_SEA, 并且 action === view的时候不能编辑
// 当id === MerchantCreateType.PRIVATE_SEA, 并且 action === edit 或者add的时候可以编辑

const AddMerchant: React.FC = () => {
  const {identity, action, id = 0} = useParams<{identity: MerchantCreateType; action: MerchantAction; id: number}>();
  console.log(action, id);
  const [commonDispatcher] = useCommonDispatcher();
  const [legalAuthType, setLegalAuthType] = useState<MerchantAgentType>(MerchantAgentType.LEGAL);
  const [currentKey, setCurrentKey] = React.useState('base');
  const {width: windowWidth} = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback<ScrollView>();
  const [form] = Form.useForm();
  const navigation = useNavigation() as FakeNavigation;
  // 自动切换到指定step
  useEffect(() => {
    if (!isReady) {
      return;
    }
    const index = tabs.findIndex(item => item.key === currentKey);
    setTimeout(() => {
      ref.current?.scrollTo({
        x: windowWidth * index,
        y: 0,
        animated: true,
      });
    }, 0);
  }, [currentKey, isReady, ref, windowWidth]);
  useEffect(() => {
    if (!isReady) {
      return;
    }
    form.setFieldsValue({
      legalAuthType: MerchantAgentType.LEGAL,
    });
  }, [form, isReady]);
  const onSubmit = async () => {
    try {
      const formData = form.getFieldsValue() as FormMerchant;
      const {avatar, businessLicense, locationWithCompanyId} = formData;
      await createMerchant({...formData, avatar: avatar[0].url, businessLicense: businessLicense[0].url, locationWithCompanyId: locationWithCompanyId[2], type: 0});
      commonDispatcher.success('添加成功');
      navigation.navigate('Tab');
    } catch (error) {
      commonDispatcher.success((JSON.stringify(error) as string) || '添加失败');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <NavigationBar title={identity === MerchantCreateType.PUBLIC_SEA ? '新建公海商家' : '新建私海商家'} />
      <Form form={form}>
        <View style={styles.container}>
          <Tabs tabs={tabs} currentKey={currentKey} onChange={setCurrentKey} style={{backgroundColor: '#fff'}} />
          <ScrollView style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}} ref={setRef} horizontal snapToInterval={windowWidth} scrollEnabled={false}>
            <View style={{width: windowWidth}}>
              <ScrollView>
                <EditBase type={identity} />
              </ScrollView>
            </View>
            <View style={{width: windowWidth}}>
              <ScrollView>
                <SectionGroup style={styles.sectionGroup}>
                  <FormTitle title="基本信息" />
                  <Form.Item label="商家主体名称" name="businessName">
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item label="统一社会信用代码" name="enterpriseUsci">
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item label="认证方式" name="legalAuthType">
                    <Select
                      value={currentKey}
                      options={[
                        {label: '法人', value: MerchantAgentType.LEGAL},
                        {label: ' 经办人', value: MerchantAgentType.AGENT},
                      ]}
                      onChange={e => {
                        setLegalAuthType(e);
                      }}
                    />
                  </Form.Item>
                  <Form.Item name="legalPhone" label={`${legalAuthType === MerchantAgentType.LEGAL ? '法人' : '经办人'}手机号`}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="legalName" label={`${legalAuthType === MerchantAgentType.LEGAL ? '法人' : '经办人'}姓名`}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="legalNumber" label={`${legalAuthType === MerchantAgentType.LEGAL ? '法人' : '经办人'}身份证号`}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="营业执照" horizontal name="businessLicense">
                    <Upload maxCount={1} />
                  </Form.Item>
                </SectionGroup>
              </ScrollView>
            </View>
          </ScrollView>
          <Button style={{margin: 10}} type="primary" onPress={onSubmit}>
            保存
          </Button>
        </View>
      </Form>
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
});
