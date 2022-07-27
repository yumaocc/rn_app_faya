import React from 'react';
import {ScrollView} from 'react-native';
import {Form, Input} from '../../../component';

// interface SKUProps {
//   title?: string;
// }

const SKU: React.FC = () => {
  return (
    <ScrollView style={{flex: 1}}>
      <Form.Item name="bizName" label="sku名称">
        <Input placeholder="请输入sku名称" />
      </Form.Item>
    </ScrollView>
  );
};
// SKU.defaultProps = {
//   title: 'SKU',
// };
export default SKU;
