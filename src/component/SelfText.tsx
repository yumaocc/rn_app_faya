import React from 'react';
import {FC} from 'react';
import {Text as HyperText} from 'react-native';

interface TextProps {
  value?: string | number;
  style?: any;
}
const Text: FC<TextProps> = ({value, style}) => {
  return <HyperText style={style}>{value}</HyperText>;
};
export default Text;
