import React from 'react';
import {InputItem} from '@ant-design/react-native';
import {InputItemProps} from '@ant-design/react-native/lib/input-item';
import {globalStyleVariables} from '../../../constants/styles';

const Input: React.FC<InputItemProps> = props => {
  const {value, type, onChange, styles, ...restProps} = props;
  let wrappedValue = value;
  let wrappedOnChange = onChange;
  if (type === 'number') {
    wrappedValue = String(value);
    wrappedOnChange = (value: string) => {
      const number = Number(value) as unknown as string;
      onChange(number);
      onChange(number);
    };
  }
  return (
    <InputItem
      placeholderTextColor={globalStyleVariables.TEXT_COLOR_TERTIARY}
      value={wrappedValue}
      {...restProps}
      onChange={wrappedOnChange}
      styles={{
        ...styles,
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
  styles: {},
};
export default Input;
