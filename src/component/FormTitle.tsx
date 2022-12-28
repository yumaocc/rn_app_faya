import React, {ReactNode} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {globalStyleVariables} from '../constants/styles';
import {StylePropView} from '../models';

interface FormTitleProps {
  title?: string;
  style?: StylePropView;
  headerRight?: ReactNode;
}

const FormTitle: React.FC<FormTitleProps> = props => {
  const {title, headerRight} = props;
  return (
    <View style={[styles.wrapper, props.style]}>
      <View style={[styles.container]}>
        <View style={styles.bar} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View>{headerRight}</View>
    </View>
  );
};
FormTitle.defaultProps = {
  title: 'FormTitle',
};
export default FormTitle;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 30,
  },
  bar: {
    width: 2,
    height: 12,
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
    paddingLeft: 5,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
