import React, {useEffect, useMemo} from 'react';
import {View, ScrollView, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import {Steps, NavigationBar} from '../../../component';
import {useCommonDispatcher, useContractDispatcher, useMerchantDispatcher, useParams, useRefCallback, useSKUDispatcher} from '../../../helper/hooks';
import {globalStyleVariables} from '../../../constants/styles';
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
  const params = useParams<{id: number}>();
  const spuID = useMemo(() => Number(params.id), [params.id]); // 路由读取到商品ID
  const isEdit = useMemo(() => !!spuID, [spuID]); // 是否是编辑模式
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
      setValue('skuList', spuDetail.skuList);
      setValue('baseSaleAmount', spuDetail.baseSaleAmount);
      setValue('baseShareCount', spuDetail.baseShareCount);
      setValue('id', spuDetail.id);
      setValue('saleBeginTime', momentFromDateTime(spuDetail.saleBeginTime));
      setValue('saleEndTime', momentFromDateTime(spuDetail.saleEndTime));
      setValue('stockAmount', spuDetail.stockAmount);
      setValue('spuName', spuDetail.spuName);
      setValue('showBeginTime', momentFromDateTime(spuDetail.showBeginTime));
      setValue('bizUserId', spuDetail.bizUserId);
      setValue('needIdCard', spuDetail.needIdCard);
      setValue('subName', spuDetail.subName);
      setValue('canUseShopIds', spuDetail.canUseShopIds);
      setValue('poster', [{url: spuDetail.poster, id: 1}]);
      setValue('bannerPhotos', spuDetail.bannerPhotos);
      setValue('contractId', spuDetail.contractId);
      setValue('modelList', spuDetail.modelList);
      setValue('packageList', spuDetail.packageList);
      setValue('stockAmount', spuDetail.stockAmount);
      setValue('purchaseNoticeEntities', spuDetail.purchaseNoticeEntities);
      contractDetail.skuInfoReq.skuInfo.forEach((item, index) => {
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
    commonDispatcher.info(res[0]);
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
      const res = getValues();
      const formData = cleanSPUForm(res, contractDetail);
      if (isEdit) {
        await api.sku.updateSPU(formData);
        skuDispatcher.loadCurrentSPU(spuID);
      } else {
        await api.sku.createSPU(formData);
      }
      commonDispatcher.success(isEdit ? '修改成功' : '创建成功');
      navigation.canGoBack() && navigation.goBack();
    } catch (error) {
      commonDispatcher.error(error || '哎呀，出错了~');
    }
  }

  function handleChangeStep(currentKey: string, nextKey: string) {
    if (nextKey !== 'base') {
      const {bizUserId, contractId} = getValues();
      const valid = bizUserId && contractId;
      if (!valid) {
        commonDispatcher.info('请先选择商家和合同！');
      }
      return valid;
    }
    return true;
  }

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#f4f4f4'}} edges={['bottom']}>
        <NavigationBar title={isEdit ? '编辑商品' : '新增商品'} />

        <Steps steps={steps} currentKey={currentKey} onChange={setCurrentKey} onBeforeChangeKey={handleChangeStep} />
        <ScrollView style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}} ref={setRef} horizontal snapToInterval={windowWidth} scrollEnabled={false}>
          <View style={{width: windowWidth}}>
            <Base control={control} setValue={setValue} getValues={getValues} watch={watch} handleSubmit={handleSubmit} onNext={() => setCurrentKey('sku')} errors={errors} />
          </View>
          <View style={{width: windowWidth}}>
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
          <View style={{width: windowWidth}}>
            <Booking control={control} setValue={setValue} getValues={getValues} watch={watch} onNext={() => setCurrentKey('detail')} errors={errors} />
          </View>
          <View style={{width: windowWidth}}>
            <ImageTextDetail control={control} setValue={setValue} getValues={getValues} watch={watch} onNext={onHandleSubmit} error={errors} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default EditSPU;
