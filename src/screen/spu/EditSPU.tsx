import React, {useEffect} from 'react';
import {View, Text, ScrollView, useWindowDimensions} from 'react-native';
import {Steps, DatePicker, Form} from '../../component';
import {useParams, useRefCallback} from '../../helper/hooks';
import moment from 'moment';
import {DATE_TIME_FORMAT} from '../../constants';
import {globalStyleVariables} from '../../constants/styles';

import Base from './base/Base';
import SKU from './sku/SKU';

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

  const [date, setDate] = React.useState(moment('2017-05-17 11:11:11'));

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
    <View style={{flex: 1}}>
      <Form form={form}>
        <Steps steps={steps} currentKey={currentKey} onChange={setCurrentKey} />
        <ScrollView
          style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}}
          ref={setRef}
          horizontal
          snapToInterval={windowWidth}
          scrollEnabled={false}>
          <View style={{width: windowWidth}}>
            <Base />
          </View>
          <View style={{width: windowWidth}}>
            <SKU />
          </View>
          <View style={{width: windowWidth}}>
            <DatePicker value={date} onChange={setDate} mode="datetime">
              <Text style={{textAlign: 'center'}}>
                当前时间:{date.format(DATE_TIME_FORMAT)}
              </Text>
            </DatePicker>
          </View>
          <View style={{width: windowWidth}}>
            <DatePicker value={date} onChange={setDate} mode="datetime">
              <Text style={{textAlign: 'center'}}>
                当前时间:{date.format(DATE_TIME_FORMAT)}
              </Text>
            </DatePicker>
          </View>
        </ScrollView>
      </Form>
    </View>
  );
};
export default EditSPU;
