import React, {useEffect, useMemo, useState} from 'react';
import {View, ScrollView, useWindowDimensions, KeyboardAvoidingView, Platform, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import {Steps, NavigationBar, Modal} from '../../../component';
import {useCommonDispatcher, useContractDispatcher, useSummaryDispatcher, useMerchantDispatcher, useParams, useRefCallback, useSKUDispatcher} from '../../../helper/hooks';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useForm} from 'react-hook-form';
import Base from './base/Base';
import SKU from './sku/SKU';
import Booking from './booking/Booking';
import ImageTextDetail from './detail/ImageTextDetail';

import {cleanSPUForm, momentFromDateTime} from '../../../helper/util';
import {RootState} from '../../../redux/reducers';
import * as api from '../../../apis';
import _ from 'lodash';

const steps = [
  {title: '基本信息', key: 'base'},
  {title: '套餐设置', key: 'sku'},
  {title: '预约与购买', key: 'booking'},
  {title: '图文详情', key: 'detail'},
];

const EditSPU: React.FC = () => {
  const params = useParams<{id: number; action: string}>();
  const {bottom} = useSafeAreaInsets();
  const [isShowModal, setIsShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const spuID = useMemo(() => Number(params.id), [params.id]); // 路由读取到商品ID
  const isEdit = useMemo(() => !!spuID, [spuID]); // 是否是编辑模式
  const [summaryDispatcher] = useSummaryDispatcher();
  const [currentKey, setCurrentKey] = React.useState('base');
  const {
    control,
    setValue,
    getValues,
    watch,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<any>({
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const {width: windowWidth} = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback<ScrollView>();
  const navigation = useNavigation();

  const spuDetail = useSelector((state: RootState) => state.sku.currentSPU);
  const contractDetail = useSelector((state: RootState) => state.contract.currentContract);

  const [commonDispatcher] = useCommonDispatcher();
  const [merchantDispatcher] = useMerchantDispatcher();
  const [contractDispatcher] = useContractDispatcher();
  const [skuDispatcher] = useSKUDispatcher();
  // 如果有链接上的id，就查询spu详情
  useEffect(() => {
    if (params.id && !spuID) {
      return;
    }
    if (spuID) {
      skuDispatcher.loadCurrentSPU(spuID);
    }
  }, [spuID, skuDispatcher, params.id]);

  // 加载了商品详情后，去请求各种反显要用到的数据
  useEffect(() => {
    if (!spuDetail) {
      return;
    }
    merchantDispatcher.loadCurrentMerchantPrivate(spuDetail.bizUserId);
    merchantDispatcher.loadMerchantSearchList({});
    contractDispatcher.loadCurrentContract(spuDetail.contractId);
    contractDispatcher.loadContractSearchList({id: spuDetail.bizUserId});
  }, [spuDetail, merchantDispatcher, contractDispatcher]);

  useEffect(() => {
    if (!contractDetail) {
      return;
    } else if (spuDetail && contractDetail) {
      setValue('skuList', spuDetail?.skuList);
      setValue('baseSaleAmount', spuDetail?.baseSaleAmount);
      setValue('baseShareCount', spuDetail?.baseShareCount);
      setValue('id', spuDetail?.id);
      setValue('saleBeginTime', momentFromDateTime(spuDetail?.saleBeginTime));
      setValue('saleEndTime', momentFromDateTime(spuDetail?.saleEndTime));
      setValue('stockAmount', spuDetail?.stockAmount);
      setValue('spuName', spuDetail?.spuName);
      setValue('showBeginTime', momentFromDateTime(spuDetail?.showBeginTime));
      setValue('bizUserId', spuDetail?.bizUserId);
      setValue('needIdCard', spuDetail?.needIdCard);
      setValue('subName', spuDetail?.subName);
      setValue('canUseShopIds', spuDetail?.canUseShopIds);
      setValue('poster', [{url: spuDetail?.poster, id: 1}]);
      setValue('bannerPhotos', spuDetail?.bannerPhotos);
      setValue('contractId', spuDetail?.contractId);
      setValue('modelList', spuDetail?.modelList);
      setValue('packageList', spuDetail?.packageList);
      setValue('stockAmount', spuDetail?.stockAmount);
      setValue('locationIds', spuDetail?.locationIds);
      setValue('purchaseNoticeEntities', spuDetail?.purchaseNoticeEntities);
      contractDetail?.skuInfoReq?.skuInfo?.forEach((item, index) => {
        setValue(`skuList.${index}.skuDetails`, item?.skuDetails);
      });
    }
  }, [spuDetail, contractDetail, setValue]);

  // 自动切换到指定step
  useEffect(() => {
    if (!isReady) {
      return;
    }
    const index = steps.findIndex(item => item.key === currentKey);
    setTimeout(() => {
      ref.current?.scrollTo({
        x: windowWidth * index,
        y: 0,
        animated: true,
      });
    }, 0);
  }, [currentKey, isReady, ref, windowWidth]);

  // 退出页面时，清理所有redux数据
  useEffect(() => {
    return () => {
      skuDispatcher.endEditing();
    };
  }, [skuDispatcher]);

  const getError = (value: any) => {
    const res = _.flatMap(value, e =>
      e?.message ? e : _.flatMap(e, item => (item?.message ? item : _.flatMap(item, element => (element?.message ? element : _.flatMap(element, e => e))))),
    );
    commonDispatcher.info(res[0]?.message);
  };

  async function onHandleSubmit() {
    const func = handleSubmit(submit, getError);
    try {
      await func();
    } catch (error) {
      commonDispatcher.error(errors || '哎呀，出错了~');
    }
  }

  async function submit() {
    try {
      setLoading(true);
      const res = getValues();
      const formData = cleanSPUForm(res, contractDetail);
      if (isEdit) {
        await api.sku.updateSPU(formData);
        skuDispatcher.loadCurrentSPU(spuID);
      } else {
        await api.sku.createSPU(formData);
      }
      summaryDispatcher.loadHome();
      commonDispatcher.success(isEdit ? '修改成功' : '创建成功');
      navigation.canGoBack() && navigation.goBack();
    } catch (error) {
      commonDispatcher.error(error || '哎呀，出错了~');
    }
    setLoading(false);
  }

  function handleChangeStep(currentKey: string, nextKey: string) {
    if (nextKey !== 'base') {
      const {bizUserId, contractId} = getValues();
      const valid = bizUserId && contractId;
      if (!bizUserId) {
        commonDispatcher.info('请先填写基本信息');
        setError('bizUserId', {type: 'required', message: '请选择商家'});
      }
      if (!contractId) {
        commonDispatcher.info('请先填写基本信息');
        setError('contractId', {type: 'required', message: '请选择合同'});
      }
      return valid;
    }
    return true;
  }
  const handleGoBack = () => {
    if (params?.action === 'edit') {
      onOk();
      return;
    }
    const formData = getValues(['bizUserId', 'contractId']);
    for (let i = 0; i < formData?.length; i++) {
      if (formData[i]) {
        setIsShowModal(true);
        return;
      }
    }
    onOk();
  };
  const onOk = () => {
    navigation.canGoBack() && navigation.goBack();
  };
  return (
    <>
      <NavigationBar handleClick={handleGoBack} title={isEdit ? '编辑商品' : '新增商品'} />
      <Steps steps={steps} currentKey={currentKey} onChange={setCurrentKey} onBeforeChangeKey={handleChangeStep} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}} keyboardVerticalOffset={-bottom + 30}>
        <ScrollView keyboardShouldPersistTaps="always" ref={setRef} horizontal snapToInterval={windowWidth} scrollEnabled={false}>
          <View style={[{width: windowWidth, paddingBottom: globalStyleVariables.MODULE_SPACE}]}>
            <Base
              control={control}
              setValue={setValue}
              setError={setError}
              getValues={getValues}
              watch={watch}
              handleSubmit={handleSubmit}
              onNext={() => setCurrentKey('sku')}
              errors={errors}
            />
          </View>
          <View style={[{width: windowWidth, paddingBottom: globalStyleVariables.MODULE_SPACE}]}>
            <SKU
              handleSubmit={handleSubmit}
              setError={setError}
              control={control}
              setValue={setValue}
              getValues={getValues}
              watch={watch}
              onNext={() => setCurrentKey('booking')}
              errors={errors}
            />
          </View>
          <View style={[{width: windowWidth, paddingBottom: globalStyleVariables.MODULE_SPACE}]}>
            <Booking control={control} setValue={setValue} getValues={getValues} watch={watch} onNext={() => setCurrentKey('detail')} errors={errors} />
          </View>
          <View style={[{width: windowWidth, paddingBottom: globalStyleVariables.MODULE_SPACE}]}>
            <ImageTextDetail loading={loading} control={control} setValue={setValue} getValues={getValues} watch={watch} onNext={onHandleSubmit} error={errors} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal visible={isShowModal} cancelText="取消" showCancel onCancel={() => setIsShowModal(false)} onClose={() => setIsShowModal(false)} onOk={onOk} title="提示">
        <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
          <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_ERROR}]}>您还未提交商品，退出编辑将清空，确定退出吗？</Text>
        </View>
      </Modal>
    </>
  );
};
export default EditSPU;
