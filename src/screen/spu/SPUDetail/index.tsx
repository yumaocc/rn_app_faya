import React, {useEffect, useState} from 'react';
import {View, ScrollView, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationBar, Tabs} from '../../../component';
import {globalStyleVariables} from '../../../constants/styles';
import {useContractDetail, useLog, useMerchantDetail, useParams, useRefCallback, useSPUDetail} from '../../../helper/hooks';
import Base from './Base';
import Booking from './Booking';
import ImageDetail from './ImageDetail';
import SKU from './SKU';
const steps = [
  {title: '基本信息', key: 'base'},
  {title: '套餐信息', key: 'sku'},
  {title: '预约与购买', key: 'booking'},
  {title: '图文详情', key: 'detail'},
];

const SPUDetail: React.FC = () => {
  const params = useParams<{id: number}>();
  const [currentKey, setCurrentKey] = useState('base');
  const {width: windowWidth} = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback<ScrollView>();

  const [spuDetail] = useSPUDetail(params.id);
  const [merchantDetail] = useMerchantDetail(spuDetail?.bizUserId);
  const [contractDetail] = useContractDetail(spuDetail?.contractId);
  useLog(spuDetail, 'spuDetail');

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

  return (
    <>
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <NavigationBar title="商品详情" />
        <View style={{flex: 1}}>
          <Tabs style={{backgroundColor: '#fff'}} tabs={steps} currentKey={currentKey} onChange={setCurrentKey} />
          <ScrollView style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}} ref={setRef} horizontal snapToInterval={windowWidth} scrollEnabled={false}>
            <View style={{width: windowWidth}}>
              <Base spuDetail={spuDetail} merchantDetail={merchantDetail} contractDetail={contractDetail} />
            </View>
            <View style={{width: windowWidth}}>
              <SKU spuDetail={spuDetail} merchantDetail={merchantDetail} contractDetail={contractDetail} />
            </View>
            <View style={{width: windowWidth}}>
              <Booking spuDetail={spuDetail} merchantDetail={merchantDetail} contractDetail={contractDetail} />
            </View>
            <View style={{width: windowWidth}}>
              <ImageDetail spuDetail={spuDetail} merchantDetail={merchantDetail} contractDetail={contractDetail} />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};
export default SPUDetail;
