import {Button} from '@ant-design/react-native';
import React, {FC} from 'react';
import {StyleSheet, Text} from 'react-native';
import {globalStyles} from '../constants/styles';

interface LinkButtonProps {
  title: string;
  onPress?: () => void;
}
const LinkButton: FC<LinkButtonProps> = ({title, onPress}) => {
  return (
    <Button style={[styles.button]} onPress={onPress} type="ghost">
      <Text style={[globalStyles.fontSize12, globalStyles.primaryColor]}> {title}</Text>
    </Button>
  );
};
export default LinkButton;

const styles = StyleSheet.create({
  button: {
    borderColor: 'none',
    borderWidth: 0,
  },
});
