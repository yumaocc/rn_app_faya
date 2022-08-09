import {Icon} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, ScrollView, useWindowDimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationBar, Tabs} from '../../../component';
import {globalStyleVariables} from '../../../constants/styles';
import {useContractDetail, useMerchantDetail, useParams, useRefCallback, useSPUDetail} from '../../../helper/hooks';
import {FakeNavigation} from '../../../models';
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
  const navigation = useNavigation<FakeNavigation>();

  const [spuDetail] = useSPUDetail(params.id);
  const [merchantDetail] = useMerchantDetail(spuDetail?.bizUserId);
  const [contractDetail] = useContractDetail(spuDetail?.contractId);

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

  function handleEdit() {
    navigation.navigate('EditSPU', {id: params.id});
  }

  return (
    <>
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <NavigationBar
          title="商品详情"
          headerRight={
            <TouchableOpacity activeOpacity={0.5} onPress={handleEdit}>
              <View style={{height: '100%', justifyContent: 'center', paddingHorizontal: 10}}>
                <Icon name="ellipsis" size={26} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
              </View>
            </TouchableOpacity>
          }
        />
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
