import React, {useCallback, useMemo, FC} from 'react';
import {InputItem} from '@ant-design/react-native';
import {InputItemProps} from '@ant-design/react-native/lib/input-item';
import {globalStyleVariables} from '../../../constants/styles';
import isNil from 'lodash/isNil';
interface InputProps extends InputItemProps {
  onBlur?: () => void;
  name?: string;
}

const Input: FC<InputProps> = props => {
  const {value, type = 'text', onChange, styles = {}, clear = true, textAlign = 'right', last = true, placeholder = '请输入', labelNumber = 2, ...restProps} = props;
  const shouldWrap = useMemo(() => type === 'number', [type]);
  const wrappedValue = useMemo(() => {
    if (shouldWrap) {
      return isNil(value) ? '' : String(value);
    } else {
      return value;
    }
  }, [value, shouldWrap]);

  const wrappedOnChange = useCallback(
    (value: string) => {
      if (shouldWrap) {
        if (!value) {
          onChange('');
          return;
        }
        const number = Number(value) as unknown as string;
        onChange(number);
      } else {
        onChange(value);
      }
    },
    [shouldWrap, onChange],
  );

  return (
    <InputItem
      textAlign={textAlign}
      clear={clear}
      last={last}
      placeholder={placeholder}
      labelNumber={labelNumber}
      placeholderTextColor={globalStyleVariables.TEXT_COLOR_TERTIARY}
      value={wrappedValue}
      {...restProps}
      onChange={wrappedOnChange}
      styles={{
        container: {height: 40, margin: 0},
        ...styles,
      }}
    />
  );
};

export default Input;

Input.defaultProps = {
  clear: true,
  textAlign: 'right',
  last: true,
  type: 'text',
  placeholder: '请输入',
  labelNumber: 2,
  styles: {},
};
