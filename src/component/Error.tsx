import React, {FC, ReactNode} from 'react';
import {View, Text} from 'react-native';
import {globalStyles} from '../constants/styles';

interface ErrorProps {
  children: ReactNode;
  top?: number;
  left?: number;
}

const Error: FC<ErrorProps> = ({children, top, left}) => {
  return (
    <View style={{position: 'relative'}}>
      <Text style={[globalStyles.error, {position: 'absolute', top: top ? top : 0, left: left ? left : -85}]}>{children}</Text>
    </View>
  );
};
export default Error;
