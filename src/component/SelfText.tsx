import React from 'react';
import {FC} from 'react';
import {Text as RNText} from 'react-native';
import {globalStyles} from '../constants/styles';

interface TextProps {
  value?: string | number;
  style?: any;
}
const Text: FC<TextProps> = props => {
  const {value, style} = props;
  return <RNText style={[globalStyles.fontPrimary, style]}>{value}</RNText>;
};
export default Text;
