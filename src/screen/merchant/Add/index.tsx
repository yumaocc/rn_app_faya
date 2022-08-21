import {Button} from '@ant-design/react-native';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Form, FormTitle, NavigationBar, SectionGroup, Tabs} from '../../../component';
import {globalStyleVariables} from '../../../constants/styles';
import {useParams, useRefCallback} from '../../../helper/hooks';
import {MerchantCreateType} from '../../../models';
import EditBase from '../Form/EditBase';

const tabs = [
  {title: '基础信息', key: 'base'},
  {title: '资质信息', key: 'qualification'},
];

const AddMerchant: React.FC = () => {
  const params = useParams<{type: MerchantCreateType}>();
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

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <NavigationBar title="新建商户" />
      <Form form={form}>
        <View style={styles.container}>
          <Tabs tabs={tabs} currentKey={currentKey} onChange={setCurrentKey} style={{backgroundColor: '#fff'}} />
          <ScrollView style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}} ref={setRef} horizontal snapToInterval={windowWidth} scrollEnabled={false}>
            <View style={{width: windowWidth}}>
              <ScrollView>
                <EditBase />
              </ScrollView>
            </View>
            <View style={{width: windowWidth}}>
              <ScrollView>
                <Text>aa</Text>
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
      {/* <Text>{params.type === MerchantCreateType.PRIVATE_SEA ? '新建私海' : '新建公海'}</Text> */}
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
