import {globalStyles, globalStyleVariables} from '../constants/styles';
import React from 'react';
import {Text, View} from 'react-native';
interface LabelProps {
  label?: string;
  children?: React.ReactNode;
}
const Label: React.FC<LabelProps> = ({label, children}) => {
  return (
    <View style={globalStyles.borderTop}>
      <View
        style={[
          globalStyles.containerLR,
          {
            paddingTop: globalStyleVariables.MODULE_SPACE,
            paddingBottom: globalStyleVariables.MODULE_SPACE,
            marginBottom: globalStyleVariables.MODULE_SPACE,
            marginTop: globalStyleVariables.MODULE_SPACE,
          },
        ]}>
        <Text style={globalStyles.fontPrimary}>{label}</Text>
        {children}
      </View>
    </View>
  );
};

export default Label;
