import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Icon} from '@ant-design/react-native';
import {noop} from '../constants';
import {globalStyles, globalStyleVariables} from '../constants/styles';
import {StylePropView} from '../models';

interface PlusButtonProps {
  title: string;
  style?: StylePropView;
  onPress?: () => void;
  iconIsShow?: boolean;
  color?: string;
}

const PlusButton: React.FC<PlusButtonProps> = props => {
  const {title} = props;
  return (
    <TouchableOpacity onPress={props.onPress} activeOpacity={0.6}>
      <View style={[styles.container, props.style]}>
        <Icon name="plus-circle" style={[globalStyles.primaryColor, styles.icon]} />
        <Text style={[styles.title, {color: globalStyleVariables.COLOR_PRIMARY}]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
PlusButton.defaultProps = {
  onPress: noop,
  iconIsShow: true,
};
export default PlusButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 0,
  },
  icon: {
    fontSize: 18,
  },
  title: {
    paddingLeft: 5,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 'bold',
  },
});
