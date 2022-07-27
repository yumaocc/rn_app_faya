import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {globalStyles, globalStyleVariables} from '../constants/styles';

interface FormListProps {
  children: React.ReactNode;
  label?: string;
  desc?: string;
  extra?: React.ReactNode;
  hiddenBorderTop?: boolean;
  hiddenBorderBottom?: boolean;
}

const FormList: React.FC<FormListProps> = props => {
  const {label, hiddenBorderBottom, hiddenBorderTop} = props;
  return (
    <View
      style={[
        hiddenBorderBottom ? {} : globalStyles.borderBottom,
        hiddenBorderTop ? {} : globalStyles.borderTop,
        styles.container,
      ]}>
      <View style={[styles.item]}>
        <View style={styles.labelLeft}>
          <View style={styles.labelWrapper}>
            <Text style={[globalStyles.fontPrimary, styles.label]}>
              {label}
            </Text>
          </View>
          {props.desc && (
            <View>
              <Text numberOfLines={1} style={styles.desc}>
                {props.desc}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.children}>{props.children}</View>
      </View>
      {props.extra && <View style={styles.extra}>{props.extra}</View>}
    </View>
  );
};
FormList.defaultProps = {
  label: '',
  hiddenBorderBottom: false,
  hiddenBorderTop: false,
};
export default FormList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 18,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelLeft: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    maxWidth: '80%',
  },
  desc: {
    fontSize: 12,
    color: globalStyleVariables.TEXT_COLOR_TERTIARY,
  },
  labelWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    lineHeight: 16,
    fontSize: 16,
  },
  children: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extra: {
    marginTop: globalStyleVariables.MODULE_SPACE,
  },
});
