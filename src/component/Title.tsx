// 带有眼镜的那种title组件
import {Icon} from '@ant-design/react-native';
import React, {FC, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import UnitNumber from './UnitNumber';
interface TitleProps {
  title: string;
  arrow?: boolean;
  value: string | number;
  unit?: string;
  handleClick?: () => void;
  type?: 'money' | 'number' | string;
}
const Title: FC<TitleProps> = ({title, value, arrow, unit, handleClick, type}) => {
  const [eyeIsShow, setEyeIsShow] = useState(false);
  const clickEye = () => {
    setEyeIsShow(!eyeIsShow);
  };
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={handleClick}>
        <View style={styles.content}>
          <View style={styles.left}>
            <Text style={{fontSize: 15}}>{title}</Text>
            <TouchableOpacity onPress={clickEye}>
              <Icon name="eye" style={{marginLeft: 17}} />
            </TouchableOpacity>
          </View>

          <View>{arrow && <Icon name="right" />}</View>
        </View>
        <UnitNumber value={value} unit={unit} type={type} desensitization={eyeIsShow} />
      </TouchableOpacity>
    </View>
  );
};

export default Title;

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
