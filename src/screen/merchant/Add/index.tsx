import {Button} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Form, FormTitle, Input, NavigationBar, SectionGroup, Tabs, Select} from '../../../component';
import Upload from '../../../component/Form/Upload';
import {globalStyleVariables} from '../../../constants/styles';
import {useParams, useRefCallback} from '../../../helper/hooks';
import {MerchantCreateType, MerchantAgentType} from '../../../models';
import EditBase from '../Form/EditBase';

const tabs = [
  {title: '基础信息', key: 'base'},
  {title: '资质信息', key: 'qualification'},
];

const AddMerchant: React.FC = () => {
  const {type} = useParams<{type: MerchantCreateType}>();
  console.log(type);
  const [legalAuthType, setLegalAuthType] = useState('法人');
  const [currentKey, setCurrentKey] = React.useState('base');
  const {width: windowWidth} = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback<ScrollView>();
  const [form] = Form.useForm();

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
    const res = form.getFieldValue('legalAuthType');
    if (res?.legalAuthType === MerchantAgentType.AGENT) {
      setLegalAuthType('经办人');
    } else {
      setLegalAuthType('法人');
    }
  }, [form]);
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <NavigationBar title={type === MerchantCreateType.PUBLIC_SEA ? '新建公海商家' : '新建私海商家'} />
      <Form form={form}>
        <View style={styles.container}>
          <Tabs tabs={tabs} currentKey={currentKey} onChange={setCurrentKey} style={{backgroundColor: '#fff'}} />
          <ScrollView style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}} ref={setRef} horizontal snapToInterval={windowWidth} scrollEnabled={false}>
            <View style={{width: windowWidth}}>
              <ScrollView>
                <EditBase type={type} />
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
                      options={[
                        {label: '法人', value: MerchantAgentType.LEGAL},
                        {label: ' 经办人', value: MerchantAgentType.AGENT},
                      ]}
                    />
                  </Form.Item>
                  <Form.Item name="legalPhone" label={`请输入${legalAuthType}手机号`}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="legalName" label={`${legalAuthType}姓名`}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="legalNumber" label={`${legalAuthType}身份证号`}>
                    <Input />
                  </Form.Item>
                  {/* <Form.Item name="businessLicense" label="营业执照">
                    <Upload maxCount={1} />
                  </Form.Item> */}
                  <Form.Item label="营业执照" vertical desc="大于300px*300px jpg/png/gif" name="businessLicense">
                    <Upload maxCount={1} />
                  </Form.Item>
                </SectionGroup>
              </ScrollView>
            </View>
          </ScrollView>
          <Button
            type="warning"
            onPress={() => {
              console.log(form.getFieldsValue());
            }}>
            检查
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
