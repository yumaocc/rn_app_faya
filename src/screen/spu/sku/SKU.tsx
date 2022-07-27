import {InputItem} from '@ant-design/react-native';
import React from 'react';
import {ScrollView} from 'react-native';
import {Form} from '../../../component';
import {defaultInputProps} from '../../../constants';

// interface SKUProps {
//   title?: string;
// }

const SKU: React.FC = () => {
  return (
    <ScrollView style={{flex: 1}}>
      <Form.Item name="bizName" label="sku名称">
        <InputItem {...defaultInputProps} placeholder="请输入sku名称" />
      </Form.Item>
    </ScrollView>
  );
};
// SKU.defaultProps = {
//   title: 'SKU',
// };
export default SKU;
