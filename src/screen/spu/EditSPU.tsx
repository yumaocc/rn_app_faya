import React, {useEffect} from 'react';
import {View, ScrollView, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Steps, Form} from '../../component';
import {useParams, useRefCallback} from '../../helper/hooks';
import {globalStyleVariables} from '../../constants/styles';

import Base from './base/Base';
import SKU from './sku/SKU';
import Booking from './booking/Booking';
import ImageTextDetail from './detail/ImageTextDetail';

const steps = [
  {title: '基本信息', key: 'base'},
  {title: '套餐设置', key: 'sku'},
  {title: '预约与购买', key: 'booking'},
  {title: '图文详情', key: 'detail'},
];

const EditSPU: React.FC = () => {
  const params = useParams<{id: number}>();
  const isEdit = params.id !== undefined;
  if (isEdit) {
    if (!isEdit) {
      console.log(1);
    }
  }
  const [currentKey, setCurrentKey] = React.useState('base');
  // const [form, setField] = useSearch();
  const [form] = Form.useForm();
  const {width: windowWidth} = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback<ScrollView>();

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

  // useLog(form);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f4f4f4'}} edges={['bottom']}>
      <Form form={form}>
        <Steps steps={steps} currentKey={currentKey} onChange={setCurrentKey} />
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
            <ImageTextDetail
              onNext={() => {
                console.log(form.getFieldsValue());
              }}
            />
          </View>
        </ScrollView>
      </Form>
    </SafeAreaView>
  );
};
export default EditSPU;
