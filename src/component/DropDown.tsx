import React, {ReactNode} from 'react';
import {FC} from 'react';
import {Icon as AntdIcon} from '@ant-design/react-native';
import {View, Text} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {globalStyles, globalStyleVariables} from '../constants/styles';
import {Options} from '../models';
import {IconNames} from '@ant-design/react-native/lib/icon';

interface DorpDownProps {
  value?: Options;
  onChange?: (value: Options) => void;
  options: Options[];
  defaultValue?: string;
  icon?: ReactNode;
  iconName?: IconNames;
  showText?: boolean;
}
const DropDown: FC<DorpDownProps> = props => {
  const {onChange, options, defaultValue, value, icon, iconName, showText} = props;
  return (
    <ModalDropdown
      dropdownStyle={[globalStyles.dropDownItem, {height: 40, width: 90}]}
      renderRow={item => (
        <View style={[globalStyles.dropDownText, {width: '100%'}]}>
          <Text>{item?.label}</Text>
        </View>
      )}
      defaultValue={defaultValue}
      options={options}
      onSelect={(_, value) => onChange(value)}>
      {showText && <Text>{value?.label}</Text>}
      {icon ? icon : <AntdIcon name={iconName} size={26} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />}
    </ModalDropdown>
  );
};
export default DropDown;
