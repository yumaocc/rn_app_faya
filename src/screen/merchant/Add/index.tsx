import {Button, Icon as AntdIcon} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, ScrollView, useWindowDimensions, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createMerchant, updateMerchant} from '../../../apis/merchant';
import {Modal, NavigationBar, Tabs} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useParams, useRefCallback, useCommonDispatcher, useMerchantDispatcher, useSummaryDispatcher} from '../../../helper/hooks';
import {MerchantCreateType, MerchantAction, FormMerchant, MerchantFormEnum, MerchantForm, RequestAction} from '../../../models'; // FormMerchant
import EditBase from '../Form/EditBase';
import {useForm, Controller} from 'react-hook-form';
import Certification from '../Form/Certification';
import {formattingMerchantRequest} from '../../../helper/util';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import Loading from '../../../component/Loading';
import * as api from '../../../apis';
import {PAGE_SIZE} from '../../../constants';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from '../../../component/Form/Icon';
// add 新增  edit 编辑 view 查看
// 当id === MerchantCreateType.PRIVATE_SEA, 并且 action === view的时候不能编辑
// 当id === MerchantCreateType.PRIVATE_SEA, 并且 action === edit 或者add的时候可以编辑

const AddMerchant: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [summaryDispatcher] = useSummaryDispatcher();

  const {identity, publicId, privateId, action, locationCompanyId, status} = useParams<{
    identity: MerchantCreateType;
    action: MerchantAction;
    publicId: number;
    privateId: number;
    locationCompanyId: number;
    status: number;
  }>();
  const [commonDispatcher] = useCommonDispatcher();
  const [currentKey, setCurrentKey] = React.useState('base');
  const {width: windowWidth} = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback<ScrollView>();
  const [merchantDispatcher] = useMerchantDispatcher();
  const merchantDetail = useSelector<RootState, FormMerchant>(state => state.merchant.currentMerchant);

  const navigation = useNavigation();
  const {
    control,
    getValues,
    setValue,
    watch,
    formState: {errors},
    reset,
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
    if (!publicId) {
      return [
        {title: '资质信息', key: 'qualification'},
        {title: '基础信息', key: 'base'},
      ];
    }
    return [];
  }, [publicId]);

  useEffect(() => {
    if (privateId) {
      //获取私海数据
      merchantDispatcher.loadCurrentMerchantPrivate(privateId);
    } else if (publicId) {
      //获取公海数据
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

  //刷新公私海数据
  const update = () => {
    merchantDispatcher.loadPrivateMerchantList({pageIndex: 1, pageSize: PAGE_SIZE, action: RequestAction.other});
    merchantDispatcher.loadPublicMerchantList({pageIndex: 1, pageSize: PAGE_SIZE, action: RequestAction.other});
    summaryDispatcher.loadHome();
  };

  //新建商家
  const onSubmit = async () => {
    try {
      const formData = getValues();
      const newFormData = formattingMerchantRequest(formData, identity) as MerchantForm;

      if (action === MerchantAction.EDIT) {
        await updateMerchant(newFormData);
        update();
        commonDispatcher.success('修改成功');
        navigation.canGoBack() && navigation.goBack();
        return;
      }
      if (action === MerchantAction.ADD) {
        await createMerchant(newFormData);
      }
      update();
      setIsShowModal(true);
    } catch (error) {
      commonDispatcher.error(error || '添加失败');
    }
  };

  //加入我的私海
  const addMyPrivateSeas = async (id: number) => {
    try {
      await api.merchant.drawMerchant(id);
      commonDispatcher.success('添加成功');
      update();
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
      commonDispatcher.success('已发送邀请');
      update();
    } catch (error) {
      commonDispatcher.error((error as string) || '邀请失败');
    }
    setLoading(false);
  };

  const getTitle = (status: number) => {
    if (merchantDetail) {
      return (
        <View style={globalStyles.containerCenter}>
          <Text>{merchantDetail?.name}</Text>

          {identity === MerchantCreateType.PUBLIC_SEA && (
            <Text style={globalStyles.fontSize12}>{status ? <Text style={{color: '#4AB87D'}}>已认证</Text> : <Text style={{color: '#999999'}}>未认证</Text>}</Text>
          )}
        </View>
      );
    } else {
      return identity === MerchantCreateType.PUBLIC_SEA ? '新建公海商家' : '新建私海商家';
    }
  };

  //归还公海
  const handleEdit = async () => {
    setLoading(true);
    try {
      await api.merchant.returnPublic(merchantDetail.id);
      setLoading(false);
      update();
      commonDispatcher.success('归还成功');
      navigation.goBack();
    } catch (error) {
      commonDispatcher.error(error || '归还失败');
    }
  };
  const header = (
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
      <AntdIcon name="ellipsis" size={26} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
    </ModalDropdown>
  );

  return (
    <>
      <Loading active={loading} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <NavigationBar title={getTitle(status)} headerRight={identity === MerchantCreateType.PRIVATE_SEA && action === MerchantAction.EDIT && header} />

        <View style={styles.container}>
          {!!tabs?.length && <Tabs tabs={tabs} currentKey={currentKey} onChange={setCurrentKey} style={{backgroundColor: '#fff'}} />}
          <ScrollView style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}} ref={setRef} horizontal snapToInterval={windowWidth} scrollEnabled={false}>
            <View style={{width: windowWidth}}>
              <ScrollView>
                <EditBase
                  status={status}
                  getValues={getValues}
                  locationCompanyId={locationCompanyId}
                  isHidden={isHidden}
                  errors={errors}
                  control={control}
                  Controller={Controller}
                  type={identity}
                  setValue={setValue}
                />
              </ScrollView>
            </View>
            <View style={{width: windowWidth}}>
              <ScrollView>
                <Certification errors={errors} type={1} control={control} watch={watch} Controller={Controller} />
              </ScrollView>
            </View>
          </ScrollView>
          {/* 这是私海过来的按钮 */}
          <View style={styles.sectionGroup}>
            {identity === MerchantCreateType.PRIVATE_SEA && action === MerchantAction.EDIT && (
              <View style={styles.privateView}>
                <Button style={{margin: 10, borderColor: globalStyleVariables.COLOR_PRIMARY}} type="ghost" onPress={() => inviteAuth(privateId)}>
                  <Text style={{color: globalStyleVariables.COLOR_PRIMARY}}>邀请认证</Text>
                </Button>
                <Button style={{margin: 10, flex: 1}} type="primary" onPress={handleSubmit(onSubmit)}>
                  保存
                </Button>
              </View>
            )}
            {identity === MerchantCreateType.PRIVATE_SEA && action === MerchantAction.VIEW && (
              <Button style={[{margin: 10}]} type="primary" onPress={() => inviteAuth(privateId)}>
                <Text style={globalStyles.primaryColor}>邀请认证</Text>
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
        </View>
        <Modal
          visible={isShowModal}
          showCancel
          onOk={() => navigation.canGoBack() && navigation.goBack()}
          onClose={() => {
            reset({shopList: []});
            setIsShowModal(false);
          }}
          okText="确定"
          cancelText="继续新增">
          <View style={{justifyContent: 'space-around', alignItems: 'center'}}>
            <View>
              <Icon name="FYLM_all_feedback_true" style={{marginBottom: globalStyleVariables.MODULE_SPACE}} color="#546DAD" size={85} />
              <Text style={globalStyles.fontPrimary}>商家添加成功</Text>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default AddMerchant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
