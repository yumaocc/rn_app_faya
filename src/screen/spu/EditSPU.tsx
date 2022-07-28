import React, {useEffect, useMemo} from 'react';
import {View, ScrollView, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Steps, Form} from '../../component';
import {useCommonDispatcher, useContractDispatcher, useMerchantDispatcher, useParams, useRefCallback, useSKUDispatcher} from '../../helper/hooks';
import {globalStyleVariables} from '../../constants/styles';

import Base from './base/Base';
import SKU from './sku/SKU';
import Booking from './booking/Booking';
import ImageTextDetail from './detail/ImageTextDetail';
import {useSelector} from 'react-redux';
import {getInitSPUForm, generateSPUForm, cleanSPUForm} from '../../helper';
import {RootState} from '../../redux/reducers';
import * as api from '../../apis';
import {useNavigation} from '@react-navigation/native';
import {SPUForm} from '../../models';

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
  // const [form, setField] = useSearch();
  const initForm = getInitSPUForm(); // 表单的初始数据
  const [form] = Form.useForm(initForm);
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
    merchantDispatcher.loadCurrentMerchant(spuDetail.bizUserId);
    merchantDispatcher.loadMerchantSearchList({});
    contractDispatcher.loadCurrentContract(spuDetail.contractId);
    contractDispatcher.loadContractSearchList({id: spuDetail.bizUserId});

    // skuDispatcher.loadEditingContractList(); // 加载合同列表
    // skuDispatcher.loadEditingMerchantList({}); // id搜索
    // skuDispatcher.loadEditingCurrentContract(spuDetail.contractId);
    // skuDispatcher.loadEditingCurrentMerchant(spuDetail.bizUserId);
  }, [spuDetail, merchantDispatcher, contractDispatcher]);

  // spu详情有了或者更换了合同，需要重新生成表单
  useEffect(() => {
    if (!contractDetail) {
      return;
    }
    // 从后端数据生成前端要的表单数据
    const patchFormData = generateSPUForm(contractDetail, spuDetail);
    form.setFieldsValue({...spuDetail, ...patchFormData});
  }, [spuDetail, contractDetail]); // eslint-disable-line react-hooks/exhaustive-deps
  // 这里不要依赖form，否则会爆栈

  if (isEdit) {
    if (!isEdit) {
      console.log(1);
    }
  }

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

  async function handleSubmit() {
    //todo: 校验表单
    const formData = form.getFieldsValue() as SPUForm;
    const cleanData = cleanSPUForm(formData);
    console.log(cleanData);
    try {
      // if (isEdit) {
      //   await api.sku.updateSPU(cleanData);
      // } else {
      //   await api.sku.createSPU(cleanData);
      // }
      commonDispatcher.success('保存成功！');
      if (!isEdit) {
        // 新增完成立即返回
        // navigation.canGoBack() && navigation.goBack();
      }
    } catch (error) {
      commonDispatcher.error(error);
    }
  }

  function handleChangeStep(currentKey: string, nextKey: string) {
    if (nextKey !== 'base') {
      const merchantId = form.getFieldValue('bizUserId');
      const contractId = form.getFieldValue('contractId');
      const valid = merchantId && contractId;
      if (!valid) {
        commonDispatcher.info('请先选择商家和合同！');
      }
      return valid;
    }
    return true;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f4f4f4'}} edges={['bottom']}>
      <Form form={form}>
        <Steps steps={steps} currentKey={currentKey} onChange={setCurrentKey} onBeforeChangeKey={handleChangeStep} />
        <ScrollView style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}} ref={setRef} horizontal snapToInterval={windowWidth} scrollEnabled={false}>
          <View style={{width: windowWidth}}>
            <Base onNext={() => setCurrentKey('booking')} />
          </View>
          <View style={{width: windowWidth}}>
            <SKU />
          </View>
          <View style={{width: windowWidth}}>
            <Booking onNext={() => setCurrentKey('detail')} />
          </View>
          <View style={{width: windowWidth}}>
            <ImageTextDetail onNext={handleSubmit} />
          </View>
        </ScrollView>
      </Form>
    </SafeAreaView>
  );
};
export default EditSPU;
