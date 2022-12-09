import {Button} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, StyleSheet, ScrollView, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createMerchant, getMerchantDetail, getPublicMerchantDetail} from '../../../apis/merchant';
import {Form, NavigationBar, Tabs} from '../../../component';
import {globalStyleVariables} from '../../../constants/styles';
import {useParams, useRefCallback, useCommonDispatcher} from '../../../helper/hooks';
import {MerchantCreateType, MerchantAction, FakeNavigation, FormMerchant, MerchantFormMenu} from '../../../models'; // FormMerchant
import EditBase from '../Form/EditBase';
import {useForm, Controller} from 'react-hook-form';
import Certification from '../Form/Certification';
import {formattingMerchantRequest, formattingMerchantEdit} from '../../../helper/util';
const tabs = [
  {title: '基础信息', key: 'base'},
  {title: '资质信息', key: 'qualification'},
];

// add 新增  edit 编辑 view 查看
// 当id === MerchantCreateType.PRIVATE_SEA, 并且 action === view的时候不能编辑
// 当id === MerchantCreateType.PRIVATE_SEA, 并且 action === edit 或者add的时候可以编辑

const AddMerchant: React.FC = () => {
  const {identity, publicId, privateId} = useParams<{identity: MerchantCreateType; action: MerchantAction; publicId: number; privateId: number}>();
  const [commonDispatcher] = useCommonDispatcher();
  const [currentKey, setCurrentKey] = React.useState('base');
  const {width: windowWidth} = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback<ScrollView>();
  const [form] = Form.useForm();
  const {
    control,
    getValues,
    setValue,
    watch,
    formState: {errors},
    handleSubmit,
  } = useForm<FormMerchant>({
    mode: 'onBlur',
  });
  const navigation = useNavigation() as FakeNavigation;
  useEffect(() => {
    if (privateId) {
      getMerchantDetail(privateId)
        .then(res => {
          const formData = formattingMerchantEdit(res);
          const keys = Object.keys(formData);
          keys.forEach(item => {
            const key = item as MerchantFormMenu;
            setValue(key, res[key]);
          });
        })
        .catch(err => commonDispatcher.error(err));
    } else if (publicId) {
      getPublicMerchantDetail(publicId)
        .then(res => {
          const formData = formattingMerchantEdit(res);
          const keys = Object.keys(formData);
          keys.forEach(item => {
            const key = item as MerchantFormMenu;
            setValue(key, res[key]);
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [commonDispatcher, privateId, publicId, setValue]);

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

  //新建商家
  const onSubmit = async () => {
    try {
      const formData = getValues();
      const newFormData = formattingMerchantRequest(formData, identity);
      await createMerchant(newFormData);
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
                <EditBase errors={errors} control={control} Controller={Controller} type={identity} setValue={setValue} />
              </ScrollView>
            </View>
            <View style={{width: windowWidth}}>
              <ScrollView>
                <Certification errors={errors} type={1} control={control} watch={watch} Controller={Controller} />
              </ScrollView>
            </View>
          </ScrollView>
          <Button style={{margin: 10}} type="primary" onPress={handleSubmit(onSubmit)}>
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
