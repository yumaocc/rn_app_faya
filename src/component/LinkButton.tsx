import {Button} from '@ant-design/react-native';
import React, {FC} from 'react';
import {StyleSheet} from 'react-native';

interface LinkButtonProps {
  title: string;
  onPress?: () => void;
}
const LinkButton: FC<LinkButtonProps> = ({title, onPress}) => {
  return (
    <Button style={styles.button} onPress={onPress} type="ghost">
      {title}
    </Button>
  );
};
export default LinkButton;

const styles = StyleSheet.create({
  button: {
    borderColor: 'none',
    borderWidth: 0,
    color: '#546DAD',
  },
});
