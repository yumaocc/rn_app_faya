import React from 'react';
import {InputItem} from '@ant-design/react-native';
import {InputItemProps} from '@ant-design/react-native/lib/input-item';
import {globalStyleVariables} from '../../../constants/styles';

const Input: React.FC<InputItemProps> = props => {
  return (
    <InputItem
      placeholderTextColor={globalStyleVariables.TEXT_COLOR_TERTIARY}
      {...props}
      styles={{
        container: {height: '100%'},
      }}
    />
  );
};
Input.defaultProps = {
  clear: true,
  textAlign: 'right',
  last: true,
  type: 'text',
  placeholder: '请输入',
  labelNumber: 2,
};
export default Input;
