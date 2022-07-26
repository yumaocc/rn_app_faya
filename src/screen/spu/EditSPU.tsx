import React, {useEffect} from 'react';
import {View, Text, ScrollView, useWindowDimensions} from 'react-native';
import {Steps, DatePicker} from '../../component';
import {useParams, useRefCallback} from '../../helper/hooks';
import moment from 'moment';
import {DATE_TIME_FORMAT} from '../../constants';
import {globalStyleVariables} from '../../constants/styles';

const steps = [
  {title: '基本信息', key: 'base'},
  {title: '套餐设置', key: 'sku'},
  {title: '预约与购买', key: 'booking'},
  {title: '图文详情', key: 'detail'},
];

const EditSPU: React.FC = () => {
  const params = useParams<{id: number}>();
  const isEdit = params.id !== undefined;
  const [currentKey, setCurrentKey] = React.useState('base');
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

  return (
    <View style={{flex: 1}}>
      <Steps steps={steps} currentKey={currentKey} onChange={setCurrentKey} />
      <ScrollView
        style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}}
        ref={setRef}
        horizontal
        snapToInterval={windowWidth}
        scrollEnabled={false}>
        <View style={{width: windowWidth}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            {isEdit && <Text>编辑SPU, SPU ID： {params.id}</Text>}
            {!isEdit && <Text>新增SPU</Text>}
          </View>
          <DatePicker value={date} onChange={setDate} mode="datetime">
            <Text style={{textAlign: 'center'}}>
              当前时间:{date.format(DATE_TIME_FORMAT)}
            </Text>
          </DatePicker>
        </View>
        <View style={{width: windowWidth}}>
          <Text>套餐设置</Text>
        </View>
        <View style={{width: windowWidth}}>
          <Text>预约与购买</Text>
          <DatePicker value={date} onChange={setDate} mode="datetime">
            <Text style={{textAlign: 'center'}}>
              当前时间:{date.format(DATE_TIME_FORMAT)}
            </Text>
          </DatePicker>
        </View>
        <View style={{width: windowWidth}}>
          <Text>图文详情</Text>
        </View>
      </ScrollView>
    </View>
  );
};
export default EditSPU;
