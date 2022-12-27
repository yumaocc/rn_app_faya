import {Button} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, ScrollView, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createMerchant, updateMerchant} from '../../../apis/merchant';
import {Form, NavigationBar, Tabs} from '../../../component';
import {globalStyleVariables} from '../../../constants/styles';
import {useParams, useRefCallback, useCommonDispatcher, useMerchantDispatcher} from '../../../helper/hooks';
import {MerchantCreateType, MerchantAction, FormMerchant, MerchantFormEnum} from '../../../models'; // FormMerchant
import EditBase from '../Form/EditBase';
import {useForm, Controller} from 'react-hook-form';
import Certification from '../Form/Certification';
import {formattingMerchantRequest} from '../../../helper/util';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import Loading from '../../../component/Loading';
import * as api from '../../../apis';
// add 新增  edit 编辑 view 查看
// 当id === MerchantCreateType.PRIVATE_SEA, 并且 action === view的时候不能编辑
// 当id === MerchantCreateType.PRIVATE_SEA, 并且 action === edit 或者add的时候可以编辑

const AddMerchant: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const {identity, publicId, privateId, action} = useParams<{identity: MerchantCreateType; action: MerchantAction; publicId: number; privateId: number}>();
  const [commonDispatcher] = useCommonDispatcher();
  const [merchantDispatcher] = useMerchantDispatcher();
  const [currentKey, setCurrentKey] = React.useState('base');
  const {width: windowWidth} = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback<ScrollView>();
  const [form] = Form.useForm();
  const merchantDetail = useSelector<RootState, FormMerchant>(state => state.merchant.currentMerchant);

  const navigation = useNavigation();
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

  //根据action 判断用户的行为
  const isHidden = useMemo(() => {
    if (action === MerchantAction.VIEW) {
      return false;
    }
    return true;
  }, [action]);

  const tabs = useMemo(() => {
    if (publicId) {
      return [{title: '基础信息', key: 'base'}];
    }
    return [
      {title: '基础信息', key: 'base'},
      {title: '资质信息', key: 'qualification'},
    ];
  }, [publicId]);

  useEffect(() => {
    if (privateId) {
      //获取私海数据
      merchantDispatcher.loadCurrentMerchantPrivate(privateId);
    } else if (publicId) {
      merchantDispatcher.loadCurrentMerchantPublic(publicId);
    }
    return () => {
      merchantDispatcher.exitMerchantPage();
    };
  }, [merchantDispatcher, privateId, publicId]);

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
  }, [currentKey, isReady, ref, tabs, windowWidth]);

  useEffect(() => {
    if (merchantDetail) {
      const keys = Object.keys(merchantDetail) as MerchantFormEnum[];
      keys.forEach(key => {
        setValue(key, merchantDetail[key]);
      });
    }
  }, [merchantDetail, setValue]);
  //新建商家
  const onSubmit = async () => {
    try {
      const formData = getValues();
      const newFormData = formattingMerchantRequest(formData, identity);

      if (action === MerchantAction.EDIT) {
        await updateMerchant(newFormData);
      }
      if (action === MerchantAction.ADD) {
        await createMerchant(newFormData);
      }
      commonDispatcher.success(action === MerchantAction.ADD ? '添加成功' : '修改成功');
      navigation.goBack();
    } catch (error) {
      commonDispatcher.success((JSON.stringify(error) as string) || '添加失败');
    }
  };

  //加入我的私海
  const addMyPrivateSeas = async (id: number) => {
    try {
      await api.merchant.drawMerchant(id);
      commonDispatcher.success('添加成功');
      navigation.goBack();
    } catch (error) {
      commonDispatcher.error((error as string) || '添加失败');
    }
  };
  //邀请认证
  const inviteAuth = async (id: number) => {
    try {
      setLoading(true);
      await api.merchant.inviteAuth(id);
      navigation.goBack();
    } catch (error) {
      commonDispatcher.error((error as string) || '邀请失败');
    }
    setLoading(false);
  };
  return (
    <>
      <Loading active={loading} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <NavigationBar title={identity === MerchantCreateType.PUBLIC_SEA ? '新建公海商家' : '新建私海商家'} />
        <Form form={form}>
          <View style={styles.container}>
            <Tabs tabs={tabs} currentKey={currentKey} onChange={setCurrentKey} style={{backgroundColor: '#fff'}} />
            <ScrollView style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}} ref={setRef} horizontal snapToInterval={windowWidth} scrollEnabled={false}>
              <View style={{width: windowWidth}}>
                <ScrollView>
                  <EditBase isHidden={isHidden} errors={errors} control={control} Controller={Controller} type={identity} setValue={setValue} />
                </ScrollView>
              </View>
              <View style={{width: windowWidth}}>
                <ScrollView>
                  <Certification errors={errors} type={1} control={control} watch={watch} Controller={Controller} />
                </ScrollView>
              </View>
            </ScrollView>
            {/* 这是私海过来的按钮 */}
            {identity === MerchantCreateType.PRIVATE_SEA && action === MerchantAction.EDIT && (
              <View style={styles.privateView}>
                <Button style={{margin: 10}} type="ghost" onPress={() => inviteAuth(privateId)}>
                  邀请认证
                </Button>
                <Button style={{margin: 10, flex: 1}} type="primary" onPress={handleSubmit(onSubmit)}>
                  保存
                </Button>
              </View>
            )}
            {identity === MerchantCreateType.PRIVATE_SEA && action === MerchantAction.VIEW && (
              <Button style={{margin: 10}} type="primary" onPress={() => inviteAuth(privateId)}>
                邀请认证
              </Button>
            )}
            {/* 这是公海过来的按钮 */}
            {identity === MerchantCreateType.PUBLIC_SEA && action !== MerchantAction.ADD && (
              <Button
                style={{margin: 10}}
                type="primary"
                onPress={() => {
                  addMyPrivateSeas(publicId);
                }}>
                加入我的私海
              </Button>
            )}
            {action === MerchantAction.ADD && (
              <Button style={{margin: 10}} type="primary" onPress={handleSubmit(onSubmit)}>
                保存
              </Button>
            )}
          </View>
        </Form>
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
});
