import {Icon} from '@ant-design/react-native';
import React from 'react';
import {OutlineGlyphMapType} from '@ant-design/icons-react-native';
import {View, Text, StyleSheet} from 'react-native';
import {globalStyles} from '../constants/styles';
import {StylePropView} from '../models';
interface EmptyProps {
  icon?: OutlineGlyphMapType;
  text?: string;
  size?: number;
  style?: StylePropView;
  color?: string;
}

const Empty: React.FC<EmptyProps> = props => {
  return (
    <View style={[styles.container, props.style]}>
      {props.icon && (
        <View style={[styles.iconWrap, globalStyles.containerCenter]}>
          <Icon name={props?.icon} color={props.color} size={24} />
        </View>
      )}
      <View style={{marginTop: 10}}>
        <Text style={globalStyles.fontTertiary}>{props.text}</Text>
      </View>
    </View>
  );
};

export default Empty;
Empty.defaultProps = {
  style: {},
  size: 24,
  text: '空空如也',
  color: 'black',
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 300,
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#0000000d',
  },
});
