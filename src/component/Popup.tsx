import React from 'react';
import {View, Text} from 'react-native';

interface PopupProps {
  title?: string;
}

const Popup: React.FC<PopupProps> = props => {
  const {title} = props;
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{title}</Text>
    </View>
  );
};
Popup.defaultProps = {
  title: 'Popup',
};
export default Popup;
