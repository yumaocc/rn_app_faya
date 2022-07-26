import React from 'react';
import {View, Text} from 'react-native';

interface SKUProps {
  title?: string;
}

const SKU: React.FC<SKUProps> = props => {
  const {title} = props;
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{title}</Text>
    </View>
  );
};
SKU.defaultProps = {
  title: 'SKU',
};
export default SKU;
