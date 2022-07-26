import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {globalStyles, globalStyleVariables} from '../constants/styles';

interface FormListProps {
  children: React.ReactNode;
  label?: string;
  desc?: string;
  extra?: React.ReactNode;
}

const FormList: React.FC<FormListProps> = props => {
  const {label} = props;
  return (
    <View style={styles.formListWrapper}>
      <View style={[styles.formListLabel]}>
        <View>
          <Text style={[globalStyles.fontPrimary, styles.formListTitle]}>
            {label}
          </Text>
          <Text>{props.desc}</Text>
        </View>
        <View style={{flex: 1}}>{props.children}</View>
      </View>
      {props.extra && <View style={styles.formListExtra}>{props.extra}</View>}
    </View>
  );
};
FormList.defaultProps = {
  label: '请填写操作名字',
};
export default FormList;

const styles = StyleSheet.create({
  SectionGroup: {
    marginTop: globalStyleVariables.MODULE_SPACE,
  },
  formListWrapper: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 15,
  },
  formListLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formListTitle: {
    flex: 1,
    marginHorizontal: globalStyleVariables.MODULE_SPACE,
  },
  formListExtra: {
    marginTop: globalStyleVariables.MODULE_SPACE,
  },
});
