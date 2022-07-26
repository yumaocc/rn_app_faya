import React from 'react';
import {View, Text} from 'react-native';
import {Steps} from '../../component';
import {useParams} from '../../helper/hooks';

const EditSPU: React.FC = () => {
  const params = useParams<{id: number}>();
  const isEdit = params.id !== undefined;

  const [currentKey, setCurrentKey] = React.useState('base');

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
    </View>
  );
};
export default EditSPU;
