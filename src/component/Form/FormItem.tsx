import React, {useContext} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {StylePropView} from '../../models';
import {FormDisabledContext} from './Context';
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
  vertical?: boolean;
  noStyle?: boolean;
  style?: StylePropView;
  showAsterisk?: boolean; //是否显示红色星号
  horizontal?: boolean; //图片和label 上下居中， 两端对齐
  errorElement?: React.ReactNode;
}

const FormItem: React.FC<FormItemProps> = props => {
  const {label, hiddenBorderBottom, valueKey, onChangeKey, showAsterisk, errorElement} = props;
  const formInstance = useFormInstance();
  const formDisabled = useContext(FormDisabledContext);
  function childrenWithDisabled(): React.ReactElement {
    const children = React.Children.map(props.children as React.ReactElement, (child: React.ReactElement) => {
      const childProps = child.props || {};
      const newProps = {
        ...childProps,
      };
      if (formDisabled?.disabled) {
        newProps.disabled = formDisabled?.disabled;
      }
      return React.cloneElement(child, newProps);
    });
    return <>{children}</>;
  }
  function renderChildren(): React.ReactElement {
    const name = props.name;
    if (name) {
      try {
        const child = React.Children.only(props.children) as React.ReactElement;
        const childProps = child.props || {};
        const oldOnChange = childProps[onChangeKey];
        const newProps = {
          ...childProps,
          disabled: formDisabled?.disabled,
          [valueKey]: formInstance.getFieldValue(name),
          [onChangeKey]: (value: any) => {
            formInstance.setFieldValue(name, value);
            oldOnChange && oldOnChange(value);
          },
        };
        return React.cloneElement(child, newProps);
      } catch (error) {
        return childrenWithDisabled();
      }
    }
    return childrenWithDisabled();
  }

  if (props.noStyle) {
    return renderChildren();
  }

  if (props.vertical) {
    return (
      <View
        style={[
          hiddenBorderBottom ? {} : globalStyles.borderBottom,
          // hiddenBorderTop ? {} : globalStyles.borderTop,
          styles.container,
          {paddingBottom: errorElement ? 0 : 10},
          props.style,
        ]}>
        <View style={[styles.item]}>
          <View style={[styles.labelLeft, {maxWidth: '100%'}]}>
            <View style={styles.labelWrapper}>
              <Text style={[globalStyles.fontPrimary, styles.label]}>{label}</Text>
            </View>
            {props.desc && (
              <View style={{marginTop: 3}}>
                <Text numberOfLines={1} style={styles.desc}>
                  {props.desc}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.extra}>{renderChildren()}</View>
        {errorElement && <Text style={[{color: 'red', marginBottom: 2}, globalStyles.fontSize12]}>{errorElement}</Text>}
      </View>
    );
  }
  if (props.horizontal) {
    return (
      <View style={[hiddenBorderBottom ? {} : globalStyles.borderBottom, {flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16, paddingBottom: 16}]}>
        <View style={[styles.item]}>
          <View style={[styles.labelLeft, {maxWidth: '100%'}]}>
            <View style={styles.labelWrapper}>
              <Text style={[globalStyles.fontPrimary, styles.label, {marginBottom: 0}]}>{label}</Text>
              {props.desc && (
                <View style={{marginTop: 5}}>
                  <Text numberOfLines={1} style={styles.desc}>
                    {props.desc}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.extra}>{renderChildren()}</View>
      </View>
    );
  }

  return (
    <View
      style={[
        hiddenBorderBottom ? {} : globalStyles.borderBottom,
        // hiddenBorderTop ? {} : globalStyles.borderTop,
        styles.container,
        {paddingBottom: errorElement ? 0 : 14},
        props.style,
      ]}>
      <View style={[styles.item]}>
        <View style={[styles.labelLeft, {maxWidth: '100%'}]}>
          <View style={styles.labelWrapper}>
            {showAsterisk && (
              <View>
                <Text style={{color: 'red', marginTop: 5}}>*</Text>
              </View>
            )}
            <Text style={[globalStyles.fontPrimary, styles.label]}>{label}</Text>
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
      {errorElement && (
        <View style={styles.error}>
          <Text style={[{color: 'red'}, globalStyles.fontSize12]}>{errorElement}</Text>
        </View>
      )}

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
  vertical: false,
  noStyle: false,
  style: {},
};
export default FormItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 14,
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
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
  },
  children: {
    flex: 1,
    height: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  extra: {
    marginTop: globalStyleVariables.MODULE_SPACE,
  },
  horizontal: {
    marginTop: 0,
    alignItems: 'flex-end',
  },
  error: {
    height: 14,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 2,
    marginRight: 15,
  },
});
