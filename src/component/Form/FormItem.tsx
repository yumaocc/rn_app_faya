import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useFormInstance} from './hooks';

export interface FormItemProps {
  children: React.ReactNode;
  label?: string;
  desc?: string;
  extra?: React.ReactNode;
  hiddenBorderTop?: boolean;
  hiddenBorderBottom?: boolean;
  name?: string;
  valueKey?: string;
  onChangeKey?: string;
}

const FormItem: React.FC<FormItemProps> = props => {
  const {label, hiddenBorderBottom, hiddenBorderTop, valueKey, onChangeKey} =
    props;
  const formInstance = useFormInstance();

  function renderChildren() {
    const name = props.name;
    if (name) {
      try {
        const child = React.Children.only(props.children) as React.ReactElement;
        const childProps = child.props || {};
        const oldOnChange = childProps[onChangeKey];
        const newProps = {
          ...childProps,
          [valueKey]: formInstance.getFieldValue(name),
          [onChangeKey]: (value: any) => {
            formInstance.setFieldValue(name, value);
            oldOnChange && oldOnChange(value);
          },
        };
        return React.cloneElement(child, newProps);
      } catch (error) {
        return props.children;
      }
    }
    return props.children;
  }

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
        <View style={styles.children}>{renderChildren()}</View>
      </View>
      {props.extra && <View style={styles.extra}>{props.extra}</View>}
    </View>
  );
};
FormItem.defaultProps = {
  label: '',
  hiddenBorderBottom: false,
  hiddenBorderTop: false,
  valueKey: 'value',
  onChangeKey: 'onChange',
};
export default FormItem;

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
    fontSize: 16,
  },
  children: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  extra: {
    marginTop: globalStyleVariables.MODULE_SPACE,
  },
});
