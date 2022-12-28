import React, {FC} from 'react';
import {View, Text} from 'react-native';
import {globalStyles} from '../constants/styles';

interface ErrorProps {
  value: string;
}

const Error: FC<ErrorProps> = ({value}) => {
  return (
    <View style={globalStyles.moduleMarginTop}>
      <Text style={globalStyles.error}>{value}</Text>
    </View>
  );
};
export default Error;
