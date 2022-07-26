import React from 'react';
import {View, Text} from 'react-native';
import {Steps, DatePicker} from '../../component';
import {useParams} from '../../helper/hooks';
import moment from 'moment';
import {DATE_TIME_FORMAT} from '../../constants';

const EditSPU: React.FC = () => {
  const params = useParams<{id: number}>();
  const isEdit = params.id !== undefined;
  const [currentKey, setCurrentKey] = React.useState('base');
  const [date, setDate] = React.useState(moment('2017-05-17 11:11:11'));

  const steps = [
    {title: '基本信息', key: 'base'},
    {title: '套餐设置', key: 'sku'},
    {title: '预约与购买', key: 'booking'},
    {title: '图文详情', key: 'detail'},
  ];

  return (
    <View style={{flex: 1}}>
      <Steps steps={steps} currentKey={currentKey} onChange={setCurrentKey} />
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
  );
};
export default EditSPU;
