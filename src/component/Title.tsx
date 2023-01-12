// 带有眼镜的那种title组件
import {Icon as AntdIcon} from '@ant-design/react-native';
import React, {FC, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {hitSlop} from '../constants';
import {globalStyles} from '../constants/styles';
import Icon from './Form/Icon';
import UnitNumber from './UnitNumber';
interface TitleProps {
  title: string;
  arrow?: boolean;
  value: string | number;
  unit?: string;
  handleClick?: () => void;
  type?: 'money' | 'number';
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
            <TouchableOpacity onPress={clickEye} hitSlop={hitSlop}>
              <Icon name={eyeIsShow ? 'closeEye' : 'eye'} color="#999999" size={16} style={globalStyles.moduleMarginLeft} />
            </TouchableOpacity>
          </View>
          <View>{arrow && <AntdIcon name="right" />}</View>
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
  fontSize: {
    fontSize: 12,
  },
});
