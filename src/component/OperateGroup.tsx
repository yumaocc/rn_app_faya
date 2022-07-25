import React from 'react';
import {View} from 'react-native';
import {globalStyleVariables} from '../constants/styles';

interface OperateGroupProps {
  children?: React.ReactNode;
}

const OperateGroup: React.FC<OperateGroupProps> = props => {
  return (
    <View style={{marginTop: globalStyleVariables.MODULE_SPACE}}>
      {props.children}
    </View>
  );
};
export default OperateGroup;
