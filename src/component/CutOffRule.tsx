//分割线
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

const CutOffRule: FC = () => {
  return <View style={styles.content} />;
};

export default CutOffRule;

export const styles = StyleSheet.create({
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
  },
});
