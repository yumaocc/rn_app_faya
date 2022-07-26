import React from 'react';
import {View, Text} from 'react-native';

interface BaseProps {
  title?: string;
}

const Base: React.FC<BaseProps> = props => {
  const {title} = props;
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{title}</Text>
    </View>
  );
};
Base.defaultProps = {
  title: 'Base',
};
export default Base;
