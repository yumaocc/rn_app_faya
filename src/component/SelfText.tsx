import React from 'react';
import {FC} from 'react';
import {Text as RNText} from 'react-native';

interface TextProps {
  value?: string | number;
  style?: any;
}
const Text: FC<TextProps> = props => {
  const {value, style} = props;
  return <RNText style={style}>{value}</RNText>;
};
export default Text;
