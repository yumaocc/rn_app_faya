import {Button} from '@ant-design/react-native';
import React from 'react';
import {ScrollView} from 'react-native';
import {Footer, Form, Input} from '../../../component';

interface SKUProps {
  onNext?: () => void;
}

const SKU: React.FC<SKUProps> = ({onNext}) => {
  return (
    <ScrollView style={{flex: 1}}>
      <Form.Item name="bizName" label="sku名称">
        <Input placeholder="请输入sku名称" />
      </Form.Item>
      <Footer />
      <Button onPress={onNext}>下一步</Button>
    </ScrollView>
  );
};
// SKU.defaultProps = {
//   title: 'SKU',
// };
export default SKU;
